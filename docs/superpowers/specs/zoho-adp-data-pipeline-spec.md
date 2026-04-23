2026-04-23

Status: #baby

Tags: [[goose-helper]] [[zoho]] [[adp]] [[data-pipeline]] [[integration]]

# Goose Helper — Zoho/ADP Data Pipeline Spec

CEO Agent, 2026-04-23.

The prototype runs on mock data (`src/data/mockDashboard.ts`). This spec defines what real data looks like, where to get it, and how to wire the pipeline from the proprietary scheduling app → Zoho → ADP into the dashboard.

---

## Current Architecture

```
Proprietary App (scheduling + billing) → Zoho CRM/Books → ADP Payroll
                                                    ↓
                                            Goose Helper (reads here)
```

The dashboard needs labor hours in two categories:
- **Billable** — hours mapped to a confirmed client project
- **Probable billable** — worked hours that haven't been mapped yet (Team B / Structural)
- **Non-billable** — admin, training, travel, bench time

---

## What Data to Pull (Minimum Viable Pipeline)

### From ADP (Payroll Source of Truth)

ADP is authoritative for:
- Total hours worked per employee per pay period
- Employee names, IDs, employment status
- Division/team classification (if configured)

**API:** ADP Workforce Now API — requires OAuth 2.0, employer-granted API access
- Docs: developer.adp.com
- Endpoint: `/hr/v2/workers` (employee list) + `/payroll/v1/payroll-outputs` (hours by period)
- Rate limit: 25 req/s
- Auth: Client credentials flow, certificate-based

**What to extract:**
```json
{
  "employeeId": "WGC-001",
  "name": "John Smith",
  "team": "Core Services",
  "location": "IL",
  "periodStart": "2026-04-14",
  "periodEnd": "2026-04-20",
  "hoursWorked": 42.5
}
```

### From Zoho (Project/Billing Source of Truth)

Zoho is authoritative for:
- Which hours are mapped to which client project
- Project billing status (confirmed billable vs. pending)
- Client and location data

**API:** Zoho Books API or Zoho CRM API — REST, OAuth 2.0
- Docs: www.zoho.com/books/api/v3/
- Key endpoint: `/books/v3/timeentries` — time entries by employee and project
- Auth: Standard OAuth, access + refresh token

**What to extract:**
```json
{
  "employeeId": "WGC-001",
  "projectId": "P-4521",
  "clientName": "O'Hare Airport",
  "billingStatus": "confirmed",
  "hoursLogged": 38.0,
  "week": "2026-W16"
}
```

---

## Data Join (The Key Step)

Match ADP hours (total worked) to Zoho time entries (mapped hours) by employee + week:

```
total_hours (ADP) = confirmed_billable (Zoho mapped) + probable_billable (unmapped) + non_billable
```

Where:
- `confirmed_billable` = Zoho hours with `billingStatus: "confirmed"`
- `probable_billable` = `total_hours - confirmed_billable - non_billable` (the gap — this is Team B's story)
- `non_billable` = hours logged to internal categories in Zoho (admin, training, etc.)

The "mapping confidence" badge shown on Team B's card = `confirmed_billable / total_hours`.

---

## Questions to Ask the Client (WGC Bird)

Before building the pipeline, Rob needs answers to these. Bring this list to the next call:

### ADP Questions
1. Do you have API access enabled on your ADP account, or is data only available via payroll reports?
2. Are employees tagged with their team (Core Services vs. Structural) in ADP, or is that only in Zoho?
3. How often does payroll run? Weekly or bi-weekly? (Affects the "week" aggregation logic.)
4. Who is the ADP admin who can grant API credentials?

### Zoho Questions
5. Is time tracking done in Zoho Books (Time Entries) or Zoho CRM (Activities)? Or the proprietary scheduling app?
6. Are all billable hours logged in Zoho, or do some flow only through the proprietary app?
7. What's the standard for "confirmed billable" — is there a status field or does it happen at invoice time?
8. Are the Core Services and Structural teams tracked as separate Zoho projects, or just as employee attributes?

### General
9. Is the proprietary scheduling app exposing any API? If yes, that might be the cleanest source for hours — skip the Zoho middle layer.
10. Can you export a sample week of data from ADP and Zoho so we can validate the join logic before building the pipeline?

---

## Proposed Pipeline Architecture

Once the above questions are answered, here's the recommended approach:

### Option A — Direct API (Best for ongoing use)

```
ADP API (weekly poll) ──┐
                        ├──► Node.js Lambda / Cloudflare Worker ──► Supabase / SQLite DB ──► Dashboard
Zoho API (weekly poll) ──┘
```

- Poll both APIs weekly (Sunday night)
- Join in the Lambda, write to a simple DB table
- Dashboard fetches from DB (replaces `mockDashboard.ts`)

### Option B — CSV Export + Manual Upload (Fastest to ship)

If APIs are not available:
1. ADP: export "Time & Attendance by Employee" weekly report as CSV
2. Zoho: export "Time Entries by Project" weekly CSV
3. Drop both CSVs into a `data/` folder in the repo
4. A small Node script (`scripts/merge-csv.js`) joins them and regenerates `src/data/dashboard.json`
5. Dashboard reads from `dashboard.json` instead of `mockDashboard.ts`

**Option B can be live in 2-3 hours once we have sample CSV files.** This is the recommended first step — validate the join logic before building the API pipeline.

---

## Mock Data Shape (Current)

Reference: `src/data/mockDashboard.ts`

The mock data exports a `DashboardData` object. The real pipeline should produce the same shape. Key fields:

```typescript
interface DashboardData {
  company: {
    utilization: { week: number; month: number; quarter: number };
    trend: TrendPoint[];
  };
  teams: TeamData[];
}

interface TeamData {
  id: 'a' | 'b';
  name: string;
  utilization: { week: number; month: number; quarter: number };
  mappingConfidence?: number;  // Team B only
  members: MemberData[];
}

interface MemberData {
  name: string;
  billable: number;
  probable: number;
  nonBillable: number;
  total: number;
}
```

The real pipeline replaces the mock values with live data. No changes needed to the dashboard UI.

---

## Geography/Team View (Next Feature)

After the pipeline is wired, the next dashboard feature is the geography breakdown:

- **Core Services locations:** IL (Chicago), WI (Milwaukee/Madison), Detroit, Indianapolis
- **Structural:** Separate division, different project types

The geography view needs a `location` field on each employee (from ADP or Zoho). Ask the client at the next call whether locations are tracked in ADP by department code or in the scheduling app.

Proposed UI: a third card below the team grid — "Core Services by Location" — showing utilization % for each geography with a drilldown to individual employees.

---

## Next Steps

1. Rob shares this doc with the WGC Bird executive / ops team
2. Client answers the questions above (bring printed or shared link to next call)
3. If APIs available → scope Option A integration (3-5 days engineering)
4. If CSV only → build Option B in the next session (2-3 hours)
5. Once real data is flowing → remove `mockDashboard.ts` and point dashboard at real source
