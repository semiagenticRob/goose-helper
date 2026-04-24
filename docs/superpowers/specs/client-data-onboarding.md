2026-04-24

Status: #baby

Tags: [[goose-helper]] [[wgc-bird]] [[data-integration]]

# Goose Helper — Client Data Onboarding Guide

CEO Agent, 2026-04-24.

Use this to kick off the data pipeline conversation with the WGC Bird client. Send or walk through these questions before writing any integration code. The answers determine which of two paths the integration takes: API-first (Option A) or CSV/export bridge (Option B).

The Zoho/ADP pipeline architecture spec is in `docs/superpowers/specs/zoho-adp-data-pipeline-spec.md`. This document is the intake that feeds into that spec.

---

## Questions to Ask Before Building

### Section 1 — ADP Access

1. **Do you have ADP Workforce Now, or a different ADP product?**
   *(ADP has 8+ products — the API endpoints differ significantly. Workforce Now is the most common for your company size.)*

2. **Who is the ADP administrator for WGC?**
   *(We'll need their help to enable API access. This is typically the HR lead or payroll coordinator.)*

3. **Are employees already categorized in ADP by division (Core Services vs. Structural)?**
   *(If yes, we can filter by division automatically. If not, we'll need a team roster to map names → division.)*

4. **What pay period does WGC use — weekly, bi-weekly, semi-monthly, or monthly?**
   *(This determines the time resolution of the data — important for week/month/quarter views in the dashboard.)*

5. **Can you get ADP Workforce Now API credentials enabled?**
   *(ADP requires a formal API enablement request through your account rep. The process takes 1–5 business days. Here's the exact request: "We want to enable the Workforce Now API (OAuth 2.0) for a private BI dashboard. Please provide client credentials and guide us through certificate setup.")*
   
   **If ADP API is too difficult to enable:**
   ADP has a built-in report export (Workforce Now → Reports → Custom Report). We can build around a weekly CSV export instead. This is Option B — lower tech friction, but requires a manual export step each week. Ask: *"Can someone run a weekly hours report in ADP and email or upload it to a shared folder?"*

---

### Section 2 — Zoho Access

6. **Which Zoho products is WGC using — Zoho Books, Zoho CRM, Zoho Projects, or multiple?**
   *(The project/billing data we need may be in Books or Projects depending on how WGC tracks billable work.)*

7. **How does WGC track which hours are billable to which client?**
   *(Is there a time tracking module in Zoho? Do employees log hours against project codes? Or does someone manually reconcile hours at billing time?)*

8. **What does "unmapped probable" look like in your current data?**
   *(In the dashboard mock, "unmapped probable" = hours worked but not yet linked to a confirmed project code. Is this a real phenomenon in your system, and where does it live?)*

9. **Can you show me an example Zoho export with time entries?**
   *(A sample CSV or screenshot from Zoho Books/Projects time entries view — even with one week of data — tells us the exact field names and data format. This alone could replace 2 weeks of API exploration.)*

---

### Section 3 — Team Structure Confirmation

10. **Can you send a current team roster?**
    Format: Name | Division (Core Services or Structural) | Location (IL / WI / Detroit / Indy / other)
    *(Even a spreadsheet or org chart photo is fine. We need this to map ADP employee IDs to the correct team/location buckets in the dashboard.)*

11. **Are there any employees who work across both divisions?**
    *(How should shared employees be counted — split proportionally, or assigned to primary division?)*

12. **What are the target utilization rates for each division?**
    *(The dashboard shows thresholds. Current mock data uses 80% for Core Services and 75% for Structural. Are these close to your actual targets?)*

---

### Section 4 — Deployment

13. **Where should the dashboard be hosted?**
    Options:
    - **GitHub Pages** (free, public URL — secure if no sensitive data displayed)
    - **Vercel / Netlify** (free tier, slightly more control)
    - **Password-protected** (Netlify has basic auth; Vercel has SSO options)
    - **Internal only** (run locally or on an internal server)

14. **Who needs access?**
    *(Just you, or the whole leadership team? This affects whether we need authentication.)*

15. **Do you want the dashboard to refresh automatically, or is a manual "pull data" button acceptable?**
    *(Automatic refresh requires a scheduled job or webhook. Manual button is simpler and requires no server infrastructure.)*

---

## Fastest Path to Real Data

**If ADP API is available:**
1. WGC admin enables Workforce Now API (1–5 days)
2. We write a Node.js script that pulls hours by employee/period (2–4 hours)
3. Connect to the dashboard (2–4 hours)
4. Test with one pay period of real data

**If ADP API is NOT available (CSV export path):**
1. WGC admin runs a weekly "Hours by Employee" report in ADP Workforce Now
2. Exports CSV and drops it into a shared Google Drive folder (or emails it)
3. We write a parser that ingests the CSV and populates the dashboard (2–4 hours)
4. Dashboard refreshes each time a new CSV is dropped

**The CSV path is faster to implement and has no API dependency.** Recommend starting here to get real data into the dashboard within 1 week, then upgrading to API later.

---

## Sample Request to Send Client

> Hi [name],
>
> To wire up the live data pipeline for the Goose Helper dashboard, I need a few things from your end. Shortest path: can you pull a weekly "Hours by Employee" report from ADP Workforce Now and send it to me as a CSV? Just one week of data as a sample is all I need to start.
>
> I also need the current team roster (Name / Division / Location) so I can map everyone to the right team card in the dashboard.
>
> Once I have those two things I can have real data in the dashboard within a few days.
>
> [Google Drive folder link or email address]

This is the minimum viable request. Start here before asking about API credentials.
