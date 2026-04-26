2026-04-26

Status: #baby

Tags: [[Goose Helper]] [[WGC Bird]] [[data-mapping]]

# Goose Helper — Client Data Mapping Template
## For WGC Bird Mitigation

Written by CEO Agent, 2026-04-26. This is the template the client fills in to map their ADP/Zoho data to the Goose Helper dashboard schema. Send alongside `client-data-onboarding.md` and `client-executive-brief.md`.

---

## How to Use This Template

1. Fill in each table below with your company's real data
2. Return the completed document (or a CSV export per the instructions below)
3. We replace the mock data in the dashboard within 1 business day

You do not need to provide hours for every person right now — a current roster (names + team assignment) is enough to get started. We'll pull the actual hours from ADP once we have access.

---

## Section 1: Team Roster

List every person who appears in your utilization data. For each person, we need:

| Field | Description | Example |
|---|---|---|
| **Name** | Full name as it appears in ADP | Jamie Chen |
| **Team** | Core Services or Structural | Core Services |
| **Role** (optional) | Job title or function | Wildlife Technician |
| **ADP ID** (optional) | ADP employee ID if available | EMP-0042 |

**Your roster:**

| Name | Team | Role | ADP ID |
|---|---|---|---|
| [fill in] | [Core Services / Structural] | [optional] | [optional] |
| [fill in] | | | |
| [fill in] | | | |
| [fill in] | | | |
| [fill in] | | | |
| [fill in] | | | |
| [fill in] | | | |
| [fill in] | | | |
| [fill in] | | | |
| [fill in] | | | |

---

## Section 2: Job Code Mapping

The dashboard needs to know which job codes in your ADP system map to which utilization category. List your job codes below and mark each as Billable, Non-Billable, or Unmapped (codes that represent billable work but aren't consistently tagged that way).

| Job Code / Activity Code | Description | Utilization Category |
|---|---|---|
| [e.g., GOOSE-REMOVAL] | [Goose removal service call] | Billable |
| [e.g., ADMIN] | [Administrative/office time] | Non-Billable |
| [e.g., DRIVE-TIME] | [Travel between job sites] | Unmapped (probably billable) |
| [fill in] | | |
| [fill in] | | |
| [fill in] | | |
| [fill in] | | |

**If you're not sure:** Send us a raw ADP "Time & Attendance Detail" export and we'll build this mapping together.

---

## Section 3: Hours Target (for utilization threshold display)

The dashboard shows a green/yellow/red threshold for each person. What counts as "good" utilization for your team?

| | Your Answer |
|---|---|
| **Billable hours target per week (per person)** | e.g., 32 hours |
| **Total hours available per week (per person)** | e.g., 40 hours |
| **Implied target utilization %** | e.g., 80% |
| **"Warning" threshold (yellow)** | e.g., below 70% |
| **"Low" threshold (red)** | e.g., below 55% |

*The current mock dashboard uses 75% as the green threshold, 60% as yellow, and below 60% as red. Change any of these to match your expectations.*

---

## Section 4: ADP Export Instructions (CSV path)

If API access isn't ready yet, a single ADP export covers everything we need.

**How to pull the export:**

1. Log into ADP Workforce Now
2. Navigate to **Reports → Time & Attendance → Time Detail Report** (exact path may vary by your ADP product tier)
3. Set date range to the last **90 days** (so we can show week/month/quarter views)
4. Select **all employees**
5. Export as CSV
6. Drop the file in the shared folder Rob provides, or attach to an email reply

**What we're looking for in the export:**
- Employee name
- Date
- Hours worked
- Job/activity code
- Department or team assignment (if available)

If your ADP export looks different from this, just send it anyway — we'll parse whatever format it comes in.

---

## Section 5: Deployment Preference

| Question | Your Answer |
|---|---|
| **Who should have access to the dashboard?** | e.g., "Me + my operations manager" |
| **Deployment preference** | Hosted URL (we manage it) / Hand off the code / Both |
| **Refresh frequency** | Daily automated / Manual (you drop a CSV) / Real-time |
| **Any data that should NOT appear in the dashboard?** | e.g., payroll figures, specific individuals |

---

## What Happens After You Return This

1. We replace mock names with your roster — same dashboard, your team
2. We apply your job code mapping to the utilization categories
3. We set your thresholds (green/yellow/red)
4. You get a URL to the live dashboard within 1 business day of receiving the roster
5. For real hours data: we use your ADP export or API connection (your choice)

Questions? Reply to the message that came with this document.
