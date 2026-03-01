---
sidebar_label: "BPMN: Venture Cell Creation"
sidebar_position: 7
---

# BPMN: Venture Cell Creation (WGE)

**Version:** v1.0.0 | **Date:** 2026-03-01 | **Process ID:** BPMN-WGE-VC-001

## Summary

This document defines the BPMN process for creating, operating, and retiring revenue-generating venture cells within an AINE. Venture cells are the atomic revenue units managed by the Work Generation Engine (WGE), each consisting of a Jarvis CEO agent and 2-4 specialist agents.

## Process Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   VENTURE CELL LIFECYCLE — TOP LEVEL                     │
│                                                                          │
│  ○ ──▶ [Identify     ──▶ [Evaluate     ──▶ ◇ Feasible?                  │
│  Start  Opportunity]      Feasibility]      │                            │
│                                         Yes─┤── No ──▶ [Archive] ──▶ ◉  │
│                                             │                            │
│                                             ▼                            │
│                                     [Generate Cell Spec]                 │
│                                             │                            │
│                                             ▼                            │
│                                     [Assemble Agent Team]                │
│                                             │                            │
│                                             ▼                            │
│                                     [Assign Roles (RAMS)]                │
│                                             │                            │
│                                             ▼                            │
│                                     [Load BPMN Workflow]                 │
│                                             │                            │
│                                             ▼                            │
│                                      ╔════════════╗                      │
│                                      ║   ACTIVE   ║◀──────────┐         │
│                                      ╚═════╤══════╝           │         │
│                                            │                  │         │
│                                      ◇ Review Due?            │         │
│                                      │          │             │         │
│                                  Yes─┘      No──┘             │         │
│                                      │                        │         │
│                                      ▼                        │         │
│                                [Periodic Review]              │         │
│                                      │                        │         │
│                                 ◇ Decision                    │         │
│                                 │         │                   │         │
│                            Renew─┘    Retire                  │         │
│                                 │         │                   │         │
│                                 └─────────┼───────────────────┘         │
│                                           ▼                             │
│                                    [Retire Cell]                        │
│                                           │                             │
│                                           ▼                             │
│                                       ◉ End                             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Swim Lane Diagram

```
┌──────────┬──────────────────────────────────────────────────────────────────┐
│          │                                                                  │
│  AINEG   │  [Cross-sell Signal]──┐                                          │
│          │                       │                                          │
├──────────┤───────────────────────┼──────────────────────────────────────────┤
│          │                       │                                          │
│  WGE     │  [Manual Trigger]─────┼──▶[Opportunity    ──▶◇──▶[Cell Spec     │
│  Scanner │                       │    Scanner]        │     Generator]      │
│          │                       │                    │         │           │
│          │                       │               Feasible   Not Feasible    │
│          │                       │                    │         │           │
│          │                       │                    │    [Archive ──▶ ◉]  │
├──────────┤────────────────────────────────────────────┼─────────────────────┤
│          │                                            │                     │
│  Skill   │                               [Assemble Team◀──┘                │
│  Registry│                                from Registry]                    │
│          │                                     │                           │
├──────────┤─────────────────────────────────────┼───────────────────────────┤
│          │                                     │                           │
│  RAMS    │                              [Assign Roles  ]                   │
│          │                              [Configure RBAC]                   │
│          │                                     │                           │
├──────────┤─────────────────────────────────────┼───────────────────────────┤
│          │                                     │                           │
│  BPMN    │                              [Load Industry ]                   │
│          │                              [Workflow       ]                   │
│          │                                     │                           │
├──────────┤─────────────────────────────────────┼───────────────────────────┤
│          │                                     ▼                           │
│  Cell    │                              ╔════════════╗                     │
│  Runtime │                              ║   ACTIVE   ║──▶[Execute Work]    │
│          │                              ╚════════════╝     │               │
│          │                                     ▲           │               │
│          │                                     └───────────┘               │
│          │                                                                 │
├──────────┤─────────────────────────────────────────────────────────────────┤
│          │                                                                 │
│  Review  │  [Periodic Health Check]──▶[Revenue Check]──▶◇ Decision         │
│          │                                               │        │        │
│          │                                          Renew     Retire        │
│          │                                                        │        │
├──────────┤────────────────────────────────────────────────────────┼────────┤
│          │                                                        │        │
│  ACTS    │  [Log Cell Birth]  [Log Review]  [Log Work]     [Log Death]     │
│          │                                                                 │
└──────────┴─────────────────────────────────────────────────────────────────┘
```

## Detailed Process Steps

### Step 1: Opportunity Identified

**Actor:** WGE Opportunity Scanner or AINEG cross-sell signal
**Trigger:** One of two sources:

- **Manual:** Human operator identifies a business opportunity and submits to WGE
- **Automated:** AINEG (AI-Native Enterprise Group) detects cross-sell/upsell signal from another AINE

```json
{
  "event": "wge.opportunity.identified",
  "source": "aineg-cross-sell",
  "aineId": "aine-a1b2c3d4",
  "industry": "manufacturing",
  "opportunityType": "supply-chain-optimization",
  "estimatedRevenue": 150000,
  "confidence": 0.78,
  "timestamp": "2026-03-01T10:00:00Z"
}
```

### Step 2: WGE Opportunity Scanner Evaluates Feasibility

**Actor:** WGE Opportunity Scanner (automated)
**Systems:** WGE, Industry Intelligence, Revenue Intelligence

Feasibility evaluation criteria:

| Criterion | Weight | Threshold |
|-----------|--------|-----------|
| Market demand signal strength | 25% | > 0.6 confidence |
| Available agent skills match | 25% | > 80% skill coverage |
| Revenue potential vs. cost | 20% | > 2x ROI projection |
| Risk assessment | 15% | < "high" risk tier |
| AINE resource availability | 15% | Sufficient compute/authority headroom |

**Decision Point:** If composite feasibility score >= 0.65, proceed. Otherwise, archive the opportunity for future re-evaluation.

```
Feasibility Assessment — Opportunity opp-2026-0301-001
──────────────────────────────────────────────────────
Market Demand:          0.78 (Strong)       ✓ Pass
Skill Coverage:         92%                 ✓ Pass
ROI Projection:         3.2x               ✓ Pass
Risk Tier:              Medium              ✓ Pass
Resource Availability:  Available           ✓ Pass
──────────────────────────────────────────────────────
Composite Score:        0.81                FEASIBLE
──────────────────────────────────────────────────────
```

### Step 3: Cell Specification Generated

**Actor:** WGE Cell Spec Generator (automated)
**Systems:** WGE, Skill Registry

The cell spec defines:

- **Jarvis CEO agent** (mandatory — every cell has exactly one)
- **2-4 specialist agents** based on opportunity type
- **Revenue targets** (monthly/quarterly/annual)
- **KPIs** (key performance indicators specific to the cell's work)
- **Authority requirements** (what authority levels the agents need)
- **Duration** (expected cell lifetime: fixed-term or indefinite)

```yaml
apiVersion: aineff.io/v1
kind: VentureCellSpec
metadata:
  name: supply-chain-opt-cell-001
  aineId: aine-a1b2c3d4
spec:
  agents:
    ceo: jarvis-ceo-v3
    specialists:
      - supply-chain-analyst-v2
      - logistics-optimizer-v1
      - vendor-negotiator-v1
  targets:
    monthlyRevenue: 12500
    quarterlyReview: true
  kpis:
    - metric: cost-reduction-pct
      target: 15
    - metric: lead-time-reduction-days
      target: 5
  authority:
    requiredLevel: 5
    decayRate: 0.03
  duration: indefinite
```

### Step 4: Agent Team Assembled from Skill Registry

**Actor:** WGE (automated)
**Systems:** WGE, Skill Registry, EMS

1. Query skill registry for agents matching the spec
2. Check agent availability (not already at capacity)
3. Deploy agent instances into the cell's sub-namespace
4. Configure inter-agent communication channels
5. Verify all agents are healthy (pod readiness checks)

### Step 5: Roles Assigned via RAMS

**Actor:** RAMS (automated)
**Systems:** RAMS, ADS

1. Assign authority levels per cell spec
2. Configure K8s RBAC for the cell's sub-namespace
3. Set decay rates and expiry dates
4. Register authority grants in ADS for decay monitoring
5. Log role assignments to ACTS

### Step 6: BPMN Workflow Loaded for Cell's Industry

**Actor:** BPMN Engine (automated)
**Systems:** BPMN, Industry Intelligence

1. Select industry-specific workflow template
2. Parameterize workflow with cell-specific variables
3. Activate workflow instance
4. Configure monitoring and alerting

### Step 7: Cell Enters Active State

**Actor:** WGE (automated)
**Systems:** WGE, ACTS

1. Set cell state: `ACTIVE`
2. Log cell birth event to ACTS
3. Enable revenue tracking
4. Enable telemetry dashboards
5. Jarvis CEO begins executing the cell's mission

```json
{
  "event": "wge.cell.birth",
  "cellId": "cell-sc-opt-001",
  "aineId": "aine-a1b2c3d4",
  "agentCount": 4,
  "revenueTarget": 12500,
  "state": "ACTIVE",
  "timestamp": "2026-03-01T10:45:00Z"
}
```

### Step 8: Periodic Review (Revenue Targets, Health Checks)

**Actor:** WGE Review Engine (automated) + Human Operator (if escalated)
**Schedule:** Configurable (default: quarterly)

Review criteria:

```
Venture Cell Quarterly Review — cell-sc-opt-001
──────────────────────────────────────────────────
Period:         Q1 2026

Revenue:
  Target:       $37,500 (3 months × $12,500)
  Actual:       $41,200 (109.9% of target)
  Status:       ✓ EXCEEDING

KPIs:
  Cost Reduction:     18.2% (target: 15%)     ✓ EXCEEDING
  Lead Time Reduce:   3.8 days (target: 5)    ✗ BELOW TARGET

Agent Health:
  jarvis-ceo-v3:            Healthy
  supply-chain-analyst-v2:  Healthy
  logistics-optimizer-v1:   Authority at 42%
  vendor-negotiator-v1:     Healthy

Recommendation:  RENEW with authority renewal for logistics-optimizer-v1
──────────────────────────────────────────────────
```

### Step 9: Renewal or Death Decision

**Decision Point:** Based on periodic review, the cell is either renewed or retired.

#### Renewal Path

- Revenue targets met or exceeded
- Agent health is acceptable
- Market demand still exists
- Renew authority grants for all agents
- Update revenue targets for next period

#### Retirement Path

- Revenue consistently below target (2+ consecutive periods)
- Market demand has evaporated
- AINE-level resource reallocation required
- Execute cell retirement:

```
Cell Retirement Process:
1. Stop accepting new work assignments
2. Drain in-progress tasks (max 48 hours)
3. Archive cell performance data
4. Release agent instances back to skill registry
5. Remove cell sub-namespace
6. Log cell death event to ACTS
7. Update AINE revenue projections
```

## Error Handling

| Error | Detection | Recovery |
|-------|-----------|----------|
| Agent deployment failure | Pod crash loop | Retry with different agent version; escalate to operator |
| Skill registry empty | No matching agents | Queue opportunity; alert when agents become available |
| Revenue target miss (1 period) | Review engine | Adjust targets or agent composition |
| Revenue target miss (2+ periods) | Review engine | Trigger retirement review |
| BPMN workflow failure | Workflow engine error | Restart workflow instance; escalate if persistent |
| Authority expiry mid-cell | ADS detection | Trigger re-authorization per [SOP: Authority Decay](./sop-authority-decay.md) |

## Metrics and Monitoring

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| Cell count per AINE | WGE | > 50 cells (capacity warning) |
| Revenue per cell | Revenue Intelligence | < 50% of target |
| Agent utilization | Telemetry | > 90% (scale up) / < 20% (scale down) |
| Cell birth rate | WGE | Anomaly detection (sudden spike/drop) |
| Cell death rate | WGE | > 30% quarterly churn |

## Related Documents

- [BPMN: AINE Lifecycle](./bpmn-aine-lifecycle.md)
- [BPMN: ORF Obligation Lifecycle](./bpmn-orf-obligation.md)
- [SOP: Authority Decay](./sop-authority-decay.md)
- [Platform: WGE](/docs/platforms/wge)
- [Platform: AINEG](/docs/platforms/aineg)
