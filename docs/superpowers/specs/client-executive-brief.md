2026-04-25

Status: #baby

Tags: [[Goose Helper]] [[WGC Bird]] [[client-brief]]

# Goose Helper — Client Executive Brief
## For WGC Bird Mitigation

Written by CEO Agent, 2026-04-25. This is a one-page send-alongside document to accompany the data intake questions (`client-data-onboarding.md`). It explains the dashboard in business terms, shows what you'll see on day one, and makes the data-sharing ask concrete and low-risk.

---

## What Is Goose Helper?

Goose Helper is your labor utilization dashboard — a single view showing exactly how your team's hours are being spent, broken out by team, person, and billing status.

Right now, you're looking at your hours through ADP and Zoho separately. Goose Helper connects those sources and gives you one screen that answers:

- **What percentage of company hours are confirmed billable this week?**
- **Which team is carrying the highest unmapped (probable-billable-but-uncoded) load?**
- **Who on the team has the lowest utilization — and is that a capacity issue or a coding issue?**
- **How does this week compare to last month and last quarter?**

---

## What You'll See on Day One

The dashboard has three views:

**Company View**
Total labor utilization across both teams (Core Services + Structural). A single percentage for the week, month, or quarter — confirmed billable, unmapped probable, and non-billable broken out.

**Team View**
Each team as a card. Click to expand. Same breakdown per team — which lets you see if Core Services and Structural are running at different utilization rates and why.

**Person View**
Click any team card to see each person's individual utilization, hours worked, and unmapped hours. This is where you spot the person whose hours aren't being coded and get ahead of it before month-end.

The dashboard is web-based. It runs in any browser. No software to install.

---

## The Data Flow

Your data already exists in ADP and Zoho. We're not asking you to change how your team works — just to create a read-only connection to those systems so the dashboard stays current.

**Option 1 — API connection (automated, updates daily)**
ADP Workforce Now has an open API. Zoho Books/Projects has an API. We connect both and the dashboard refreshes nightly without anyone touching it. Setup takes ~2 hours once credentials are shared.

**Option 2 — CSV export (manual, works immediately)**
If API access requires IT approval and you want to start now: a single ADP "Time & Attendance Detail" export covers everything we need. You export it, drop it into a shared folder, and we have the dashboard live within a week. Most clients start here while API access is being arranged.

**What we need to get started:**
- ADP Workforce Now product tier (to confirm API availability)
- List of team members + their team assignment (Core Services vs. Structural)
- Your definition of "billable" vs. "non-billable" job codes in your system
- Preferred deployment (you access via URL we host, or we hand off the code)

The full intake guide with specific questions is in the attached doc: `client-data-onboarding.md`.

---

## What This Is Not

- Not a time-tracking tool (you keep ADP)
- Not a replacement for Zoho (you keep Zoho)
- Not a payroll or HR system
- Not a black box — the code is readable and you own it

This is a read-only intelligence layer on top of systems you already use.

---

## Next Step

Send your responses to the intake questions and we'll have a prototype with your real data within one week of receiving an ADP export. The current prototype runs on mock data — your team's names and hours replace the placeholder data, nothing else changes.

Questions? Reply to this message or call directly.

---

## Prototype Reference

The current prototype is live at the repo. To see it running:
- Clone `semiagenticRob/goose-helper`
- `npm install && npm run dev` inside the `app/` folder
- Opens at localhost:5173

What you'll see: the full dashboard UI with mock data matching your team structure (Core Services + Structural, ~8-9 people per team). Replace `app/src/data/mockDashboard.ts` with real data to go live.

