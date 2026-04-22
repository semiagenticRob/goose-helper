# Labor Utilization Dashboard — Design Spec

**Date:** 2026-04-22
**Status:** Design approved, ready for implementation plan
**Scope:** Front-end-only rapid prototype

## Purpose

A forward-facing executive dashboard that communicates labor utilization across two structurally different teams:

- **Team A — External-facing:** long-term engagements, tight mapping of hours to billable projects.
- **Team B — Project-based:** one-off work, looser mapping; a meaningful share of worked hours cannot be cleanly attributed to a billable project.

The dashboard is built for an executive who needs to monitor utilization at a glance and drill down by person when a number looks off. The eventual production system will pull from an internal proprietary app that brokers data between Zoho and payroll; this prototype is intentionally decoupled from that pipeline so the UI can be validated independently.

## Stance and scope

- **Static prototype.** No backend, no real data connections. Mock data shaped like the eventual API payload.
- **Pull-only.** No alerts, no emails, no push notifications. The exec opens the page when they want to look.
- **Desktop-first.** Single viewport; no responsive mobile layout in the prototype.
- **One page.** No routing, no auth, no settings screens.

## Core decisions (from brainstorming)

| Decision | Choice | Reason |
|---|---|---|
| Hero metric | Utilization rate (billable ÷ total available hours) | Classic exec KPI; what the user explicitly asked for. |
| Time window | Toggle: week / month / quarter | Exec wants to flex between operational and strategic views. |
| Team B ambiguity | Show honestly — visible "unmapped" slice on the composition bar, plus a mapping-confidence badge | Hiding the mess is what makes dashboards lie. The gap between Team A and Team B is the story, not a bug to conceal. |
| Primary drill-down | By person | The exec's 80% follow-up question is "who"; it's also the right entry point for Team B mapping conversations. |
| Alerts | None | Keeps the prototype scoped to the UI. |
| Layout | Summary + expandable team cards (Option C) | Blended company KPI provides a single glance-number; team cards keep Team A and Team B separable rather than falsely peer. |
| Expanded view | Composition bar + person table (Variant 1) | The stacked composition bar makes Team B's unmapped hours viscerally visible; the person table answers the "who" question inline. |

## Layout

```
┌─────────────────────────────────────────────────┐
│ Utilization Dashboard            [ W | M | Q ]  │
├─────────────────────────────────────────────────┤
│ Company · Blended                               │
│ 74%   ▲ 2.1 vs prev         [ sparkline ]       │
├──────────────────────┬──────────────────────────┤
│ Team A · External    │ Team B · Project         │
│ 82%                  │ 67%   [conf 72%]         │
│ ▓▓▓▓▓▓▓▓▓▓░          │ ▓▓▓░░░░░░                │
│   (click to expand)  │   (click to expand)      │
└──────────────────────┴──────────────────────────┘
```

### Header
- Title
- Time-period toggle (segmented control): **W** / **M** / **Q**. Defaults to **M**. Changing the period re-renders all three cards using that period's data slice.

### Company blended card
- Always visible, never collapsed.
- Displays: blended utilization %, delta vs previous comparable period (▲/▼ with pts), trend sparkline.
- **Blending rule:** person-weighted average of each team's *total* utilization (confirmedBillable + unmappedProbable) for the selected period. Documented explicitly in the tooltip so the exec knows what the number means.

### Team cards (collapsed state)
- Team A and Team B shown side-by-side in a two-column grid.
- Each card shows: team name, type tag, utilization %, composition bar, and (Team B only) a mapping-confidence badge.
- Entire card is a click target. Only one team card is expanded at a time; clicking an expanded card collapses it, clicking the other team's card swaps the expansion.

### Team cards (expanded state — Variant 1)
- **Header row:** team name, person count ("9 people"), mapping-confidence badge (Team B only).
- **Hero:** utilization %, with a caption. Team A: "82% billable". Team B: "67% utilization (55% confirmed + 12% probable)".
- **Composition bar:** horizontal stacked bar, three segments:
  - Green — confirmed billable
  - Gray — unmapped / probable (Team B only; zero-width on Team A)
  - Dark — non-billable (PTO, internal, training, etc.)
- **Legend** under the bar.
- **Person table** below:
  - Columns: Name · Utilization % · mini-bar · Unmapped hours flag
  - Rows sorted by utilization descending.
  - Rows with >5 unmapped hours get an orange flag pill; rows with ≤5 get a neutral/green pill.
  - Mini-bar color: green ≥75%, amber 60–75%, red <60% (thresholds configurable via a constants file).

## Data shape

Prototype mock data lives in a single TypeScript module. Shape is intended to resemble what the real API will return so that swapping mock → live later is mechanical.

```ts
type Period = 'week' | 'month' | 'quarter';

type PersonRow = {
  name: string;
  utilization: number;    // 0-1
  unmappedHours: number;  // Team B can be >0; Team A should be 0
};

type PeriodSlice = {
  confirmedBillable: number;   // 0-1
  unmappedProbable: number;    // 0-1; always 0 for Team A
  nonBillable: number;         // 0-1
  mappingConfidence: number;   // 0-1; used for Team B badge
  trend: number[];             // 8-12 sparkline points, oldest → newest
  people: PersonRow[];
};

type Team = {
  id: 'a' | 'b';
  name: string;
  type: 'external' | 'project';
  target: number;              // 0-1, e.g., 0.78
  periods: Record<Period, PeriodSlice>;
};

type DashboardData = {
  teams: [Team, Team];
};
```

**Invariants** (enforced in the mock, documented for the real pipeline):
- `confirmedBillable + unmappedProbable + nonBillable` should equal total utilization for display purposes; the remainder is implicit idle time.
- Team A `unmappedProbable` is always 0 and `mappingConfidence` is always 1.
- `trend` is most-recent-last so sparklines render left-to-right chronologically.

## Technical approach

- **Stack:** Vite + React + TypeScript.
- **Charting:** Recharts for sparklines; the composition bar is a hand-rolled flex-based component (three colored divs in a row) — no chart library needed.
- **State:** A single `useState` for the selected period and another for the expanded team id. No global store, no data fetching library.
- **Mock data:** Static export from `src/data/mockDashboard.ts`. Values are plausible but invented.
- **Component structure:**
  - `<Dashboard>` — top-level; owns period + expanded state
  - `<TimeToggle>` — W/M/Q segmented control
  - `<CompanyCard>` — blended KPI + sparkline
  - `<TeamCard>` — handles both collapsed and expanded render
  - `<CompositionBar>` — shared between collapsed and expanded renders
  - `<PersonTable>` — expanded-only
- **Styling:** Plain CSS modules or vanilla CSS with CSS variables for the theme colors. No Tailwind, no component library — scope is prototype-only and the visual vocabulary is small.

## Out of scope (for this prototype)

- Real data integration (Zoho, payroll, internal app)
- Authentication and access control
- Mobile / responsive layout
- Alerts, thresholds, notifications
- Historical data beyond the single embedded trend array
- Multi-tenant / multi-company support
- Export, print, share
- Admin controls for targets, thresholds, team composition

These are called out so the eventual production design can plan for them without being constrained by prototype decisions.

## Success criteria

1. Executive can open the URL, pick a period, and see the three utilization numbers (company, Team A, Team B) without any explanation.
2. The Team A vs Team B data-quality difference is visually obvious on first glance, not something you have to read to discover.
3. Clicking a team card surfaces per-person detail and makes "who to talk to about unmapped hours" a one-glance answer.
4. Mock-data shape is close enough to the eventual API contract that swapping data sources is a mechanical change, not a rewrite.
