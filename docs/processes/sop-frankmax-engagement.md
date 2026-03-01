---
sidebar_label: "SOP: Frankmax Engagement"
sidebar_position: 4
---

# SOP: Running a Frankmax PIAR Engagement ($15-30K)

**Version:** v1.0.0 | **Date:** 2026-03-01 | **SOP ID:** SOP-FMX-001

## Summary

This Standard Operating Procedure defines the end-to-end process for conducting a Frankmax Pre-Investment Assessment Report (PIAR) engagement. The PIAR uses Chokepoint Intelligence technology to assess 12 manufacturing chokepoints, generate a branded report, and potentially convert to an AINE deployment.

## Revenue Tiers

| Tier | Deliverable | Price |
|------|------------|-------|
| Assessment | PIAR report with chokepoint scores and recommendations | $15,000 |
| Foundation | PIAR + AINE architecture design | $22,000 |
| Deployment | PIAR + AINE architecture + live deployment | $30,000 |

## Prerequisites

| Prerequisite | Description | Verified By |
|-------------|-------------|-------------|
| Client Agreement | Signed engagement letter with scope and pricing | Sales |
| Industry Fit | Client operates in a supported industry vertical | Intake |
| Data Availability | Client can provide operational data or answer questionnaire | Intake |
| Frankmax Portal Access | Client has been provisioned in the Frankmax portal | IT |

## Roles Involved

| Role | Responsibility |
|------|---------------|
| Client Relationship Manager | Primary client contact, manages engagement |
| Chokepoint Analyst | Conducts assessment, interprets results |
| Solutions Architect | Designs AINE architecture (Foundation/Deployment tiers) |
| Report Author | Reviews and finalizes the PDF report |
| Client Leadership | Receives findings presentation |

## Estimated Timeline

| Phase | Duration |
|-------|----------|
| Client Intake | 1-3 days |
| Assessment Execution | 1-2 days |
| Scoring and Analysis | 1-2 hours (automated) |
| Report Generation | 30 minutes (automated) + 1-2 hours (review) |
| Client Presentation | 1-2 hours |
| Architecture Design (Foundation tier) | 1-2 weeks |
| AINE Deployment (Deployment tier) | 1-2 weeks |
| **Total (Assessment only)** | **~1-2 weeks** |
| **Total (Full Deployment)** | **~4-6 weeks** |

## Procedure

### Step 1: Client Intake

**Actor:** Client Relationship Manager
**Tools:** Frankmax Portal

Gather client information:

1. **Company profile** — Industry, size (revenue, employees), locations
2. **Pain points** — What manufacturing challenges are they experiencing?
3. **Current systems** — ERP, MES, quality systems, automation level
4. **Goals** — What does success look like? Cost reduction? Throughput? Quality?
5. **Data availability** — Can they answer a questionnaire, or do they have documents to upload?
6. **Stakeholders** — Who will receive the report? Who makes deployment decisions?

**Output:** Completed client intake form in Frankmax Portal.

### Step 2: Deploy Chokepoint Intelligence Assessment

**Actor:** Chokepoint Analyst
**Tools:** Chokepoint Intelligence Web App

Two assessment modes are available:

#### Mode A: 26-Question Guided Questionnaire

The analyst walks the client through 26 structured questions across 5 sections:

| Section | Questions | Focus Area |
|---------|-----------|------------|
| 1. Production Flow | Q1-Q5 | Throughput, bottlenecks, WIP |
| 2. Quality Systems | Q6-Q10 | Defect rates, inspection, rework |
| 3. Supply Chain | Q11-Q16 | Inventory, lead times, suppliers |
| 4. Workforce & Safety | Q17-Q21 | Training, turnover, incidents |
| 5. Technology & Data | Q22-Q26 | Automation, data quality, integration |

Each question maps to one or more of the 12 chokepoints via the scoring engine.

#### Mode B: AI Document Upload

The client uploads operational documents (reports, dashboards, process maps) and the AI provider (Claude or OpenAI) extracts chokepoint scores directly:

1. Client uploads PDF/CSV/XLSX documents via the web app
2. AI processes documents using SSE streaming
3. AI generates direct chokepoint scores using `ai-{chokepointId}` response keys
4. Analyst reviews AI-generated scores for accuracy

**Output:** Raw chokepoint responses (questionnaire answers or AI-extracted scores).

### Step 3: Score 12 Manufacturing Chokepoints

**Actor:** Scoring Engine (automated)
**System:** Chokepoint Intelligence

The scoring engine processes responses through the scoring pipeline:

```
Raw Responses → Weighted Severity → Tier Assignment → Financial Impact → Composite Score
```

**12 Chokepoints Scored:**

| # | Chokepoint | Scoring Range |
|---|-----------|---------------|
| 1 | Production Scheduling | 0-100 |
| 2 | Quality Control | 0-100 |
| 3 | Inventory Management | 0-100 |
| 4 | Equipment Maintenance | 0-100 |
| 5 | Supply Chain Visibility | 0-100 |
| 6 | Workforce Planning | 0-100 |
| 7 | Energy Management | 0-100 |
| 8 | Compliance & Reporting | 0-100 |
| 9 | Demand Forecasting | 0-100 |
| 10 | Process Automation | 0-100 |
| 11 | Data Integration | 0-100 |
| 12 | Safety Management | 0-100 |

**Tier Assignment:**

| Tier | Color | Score Range | Interpretation |
|------|-------|-------------|---------------|
| Critical | Red | 0-20 | Severe operational risk |
| High | Orange | 21-40 | Significant improvement needed |
| Moderate | Yellow | 41-60 | Room for optimization |
| Good | Green | 61-80 | Performing well |
| Excellent | Blue | 81-100 | Best-in-class |

### Step 4: Generate Branded PDF Report

**Actor:** Report Engine (automated) + Report Author (review)
**System:** Chokepoint Intelligence (@react-pdf/renderer)

The PDF report includes:

1. **Executive Summary** — Overall composite score, top 3 chokepoints requiring attention
2. **Chokepoint Scorecard** — All 12 chokepoints with tier, score, and visual indicators
3. **Financial Impact Analysis** — Estimated annual cost of each chokepoint
4. **Detailed Findings** — Per-chokepoint narrative with evidence and recommendations
5. **Benchmark Comparison** — How the client compares to industry averages
6. **Recommendation Roadmap** — Prioritized improvement actions
7. **AINE Opportunity Assessment** — If applicable, how an AINE could address findings

**Output:** Branded PDF report (Frankmax branding, Space Grotesk headings, dark navy theme).

### Step 5: Present Findings to Client Leadership

**Actor:** Client Relationship Manager + Chokepoint Analyst
**Audience:** Client Leadership Team

Presentation structure:

1. Context and methodology recap (5 min)
2. Overall scorecard and composite score (10 min)
3. Deep dive on top 3 critical chokepoints (20 min)
4. Financial impact summary (10 min)
5. Recommendation roadmap (10 min)
6. Q&A (15 min)

**Decision Point:** Client decides whether to proceed to Foundation or Deployment tier.

### Step 6: Design AINE Architecture (Foundation Tier, $22K)

**Actor:** Solutions Architect
**Deliverable:** AINE Architecture Document

If the client proceeds to Foundation tier:

1. Map chokepoint findings to AINE agent capabilities
2. Define Enterprise Genome specification for client's industry/jurisdiction
3. Design agent team composition (Jarvis CEO + specialists)
4. Define governance model (authority levels, human oversight frequency)
5. Estimate resource requirements and ongoing costs
6. Produce architecture document with deployment plan

**Approval Gate:** Client signs off on architecture before deployment.

### Step 7: Execute AINE Deployment (Deployment Tier, $30K)

**Actor:** Solutions Architect + Platform Engineer
**System:** AINEFF Platform

If the client proceeds to Deployment tier:

1. Execute [SOP: AINE Creation](./sop-aine-creation.md) using the designed architecture
2. Configure client-specific BPMN workflows
3. Integrate with client's existing systems (ERP, MES, etc.)
4. Run acceptance tests with client stakeholders
5. Go-live with monitoring

### Step 8: Handoff to LevelupMax for Operator Training

**Actor:** LevelupMax Training System
**Audience:** Client's designated operators

1. Enroll client operators in LevelupMax certification program
2. Complete Level 1 (Observer) training — 2 days
3. Complete Level 2 (Operator) training — 3 days (if applicable)
4. Issue certifications
5. Grant appropriate access levels

See [SOP: LevelupMax Certification](./sop-levelupmax-certification.md) for details.

### Step 9: Ongoing — Telemetry Monitoring and Quarterly Reviews

**Actor:** Client Relationship Manager + AINE Telemetry
**Cadence:** Continuous monitoring + quarterly reviews

1. **Continuous:** AINE telemetry monitors chokepoint metrics in real-time
2. **Monthly:** Automated progress report comparing current vs. baseline scores
3. **Quarterly:** Formal review with client leadership
   - Score improvements vs. initial PIAR baseline
   - Financial impact realized
   - New chokepoints or emerging issues
   - AINE health and governance review
4. **Annual:** Full PIAR reassessment (discounted for existing clients)

## Rollback Procedures

| Phase | Rollback Action |
|-------|----------------|
| Assessment | Refund assessment fee if client dissatisfied before report delivery |
| Foundation | Refund differential ($22K - $15K = $7K) if architecture rejected |
| Deployment | Execute [SOP: AINE Death](./sop-aine-death.md) if deployment fails acceptance |

## Post-Procedure Verification

- [ ] Client intake form is complete in Frankmax Portal
- [ ] Assessment completed (questionnaire or AI upload)
- [ ] All 12 chokepoints scored with valid tiers
- [ ] PDF report generated and reviewed by Report Author
- [ ] Presentation delivered to client leadership
- [ ] Client decision documented (Assessment only / Foundation / Deployment)
- [ ] If Foundation: Architecture document delivered and signed off
- [ ] If Deployment: AINE operational and verified per creation SOP
- [ ] Operators enrolled in LevelupMax (if Deployment tier)

## Related Documents

- [SOP: AINE Creation](./sop-aine-creation.md)
- [SOP: LevelupMax Certification](./sop-levelupmax-certification.md)
- [Platform: Frankmax](/docs/platforms/frankmax)
- [App: Chokepoint Intelligence](/docs/apps/chokepoint-web)
- [Business: Revenue Model](/docs/business/revenue-model)
