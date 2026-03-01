---
sidebar_position: 1
title: "Revenue Model"
description: "AINEFF revenue model --- standalone revenue per system, compound revenue when composed, specific price points, and revenue multiplication mechanics."
---

# Revenue Model

AINEFF generates revenue at every layer of the stack. Each system, platform, and application produces **standalone revenue** independently. When composed together, they create **compound revenue** through feedback loops that multiply the value of each component. This document details every revenue stream and how they interact.

## Revenue Summary

### Platform Revenue

| Platform | Revenue Model | Price Point | Billing |
|----------|--------------|-------------|---------|
| **ORF Protocol** | Protocol licensing | Per enterprise license | Annual |
| **AINE Runtime** | Hosting fees | Per instance + resource usage | Monthly |
| **AINEG Coordinator** | SaaS subscription | Per enterprise group | Monthly |
| **Work Genesis Engine** | Per venture cell | Creation fee + monthly hosting | Monthly |
| **LevelupMax** | Training fees | $800-1,500 per participant | Per session |
| **Frankmax** | PIAR engagement | $15,000-30,000 per engagement | Per engagement |
| **LPI** | Network licensing | Per deployment + GPU nodes | Annual |

### Application Revenue

| Application | Revenue Model | Price Point | Billing |
|-------------|--------------|-------------|---------|
| **Chokepoint Intelligence** | Assessment tool | Included in Frankmax engagement | Per engagement |
| **DocuFlow** | Document workflow SaaS | Per user/month or per document | Monthly |
| **Operator Dashboard** | Included with AINE | No separate charge | -- |
| **Frankmax Portal** | Included with Frankmax | No separate charge | -- |

### Agent Revenue

| Component | Revenue Model | Price Point | Billing |
|-----------|--------------|-------------|---------|
| **AgentCoders Runtime** | Agent hosting | Per agent pod + inference | Monthly |
| **Skill Registry** | Skill marketplace | Per skill usage | Usage-based |
| **Model Router** | Inference routing | Per million tokens | Usage-based |
| **Billing Service** | Revenue tracking | Percentage of tracked revenue | Monthly |

### Factory Revenue

| Factory | Revenue Model | Price Point | Billing |
|---------|--------------|-------------|---------|
| **AI Provider** | AI gateway service | Per million tokens + routing fee | Usage-based |
| **GitHub Governance** | Governance service | Per repository/month | Monthly |
| **Database Governance** | Data governance | Per database instance/month | Monthly |
| **RiskOps Pipeline** | Risk assessment | Per AINE instance/month | Monthly |

## Standalone Revenue Detail

### Frankmax ($15,000-30,000/engagement)

The primary customer acquisition channel:

```
Discovery Engagement:   $15,000
├── Chokepoint Intelligence assessment
├── Opportunity map
├── Executive report
└── Engagement duration: 2-3 weeks

Foundation Engagement:  $22,000
├── Everything in Discovery
├── Authority matrix design
├── AINE architecture spec
├── Governance framework
└── Engagement duration: 4-6 weeks

Deployment Engagement:  $30,000
├── Everything in Foundation
├── AINE Runtime deployment
├── Operator training (LevelupMax Level 2)
├── First venture cell creation
└── Engagement duration: 6-8 weeks
```

### LevelupMax ($800-1,500/participant)

Recurring training revenue:

```
Level 1 (Observer):    $800   — 2-day program
Level 2 (Operator):    $1,000 — 3-day program
Level 3 (Manager):     $1,200 — 4-day program
Level 4 (Director):    $1,500 — 5-day program
Level 5 (Architect):   Custom — Custom program

Certification validity: 12 months (annual renewal revenue)

Enterprise packages:
├── 5 participants:    10% discount
├── 10 participants:   15% discount
└── 20+ participants:  20% discount
```

### AINE Runtime (Hosting)

Per-instance hosting fees scaled by resource consumption:

```
Tier: Development
├── Max 5 agents, 2 cells
├── Shared infrastructure
└── $500/month

Tier: Staging
├── Max 20 agents, 5 cells
├── Dedicated namespace
└── $2,000/month

Tier: Production
├── Max 50 agents, 10 cells
├── Dedicated namespace + HA
├── SLA: 99.9% uptime
└── $5,000-15,000/month (based on usage)

Resource add-ons:
├── Additional agent pod:     $50/month
├── Additional venture cell:  $200/month
├── GPU inference (LPI):      $0.50/GPU-hour
└── Storage (above 100GB):    $0.10/GB/month
```

### WGE (Venture Cell Fees)

```
Cell creation fee:  $500 (one-time)
Cell hosting fee:   $200/month (includes Jarvis CEO + up to 4 specialists)
Cell revenue share: 5% of cell-generated revenue (optional)
```

### ORF Protocol (Licensing)

```
Standard License:    $2,000/year per enterprise
├── Up to 100 obligation bindings/day
├── Standard PEP configuration
└── Community support

Professional License: $8,000/year per enterprise
├── Unlimited obligation bindings
├── Custom constraint rules
├── Priority support
└── Compliance reporting

Enterprise License:  $20,000+/year per enterprise
├── Everything in Professional
├── Custom PEP development
├── On-premises deployment option
├── Dedicated support engineer
└── SLA guarantees
```

### AINEG Coordinator (SaaS)

```
Starter:     $1,000/month (up to 5 AINEs)
Professional: $3,000/month (up to 20 AINEs)
Enterprise:  $8,000/month (up to 100 AINEs)
Custom:      Contact sales (100+ AINEs)
```

### LPI (Network Licensing)

```
Starter:       Contact sales (1-2 GPU nodes, 5 models)
Professional:  Contact sales (3-8 GPU nodes, 20 models + fine-tuning)
Enterprise:    Contact sales (8+ GPU nodes, unlimited)
```

## Compound Revenue Mechanics

### The Multiplier Effect

Each Frankmax engagement creates a **revenue cascade**:

```
Frankmax Engagement ($20K)
    │
    ├──→ AINE Runtime deployed ($5K/month = $60K/year)
    │
    ├──→ ORF License ($8K/year)
    │
    ├──→ LevelupMax training
    │    5 operators x $1,000 = $5K (+ $5K annual renewals)
    │
    ├──→ WGE venture cells created
    │    3 cells x $200/month = $7.2K/year
    │
    ├──→ Agent inference costs
    │    14 agents x ~$200/month = $33.6K/year
    │
    ├──→ AINEG (if multi-AINE)
    │    $3K/month = $36K/year
    │
    └──→ DocuFlow ($10/user/month x 50 users = $6K/year)

Year 1 Total from single $20K engagement:
  Engagement:    $20,000
  Recurring:     $155,800/year
  Multiplier:    7.8x
```

### Revenue Loop Diagram

```
                    ┌─── Frankmax ───┐
                    │   $15-30K      │
                    │   engagement   │
                    └───────┬────────┘
                            │
                            v
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────v──────┐ ┌──────v──────┐ ┌─────v───────┐
    │  LevelupMax  │ │    AINE     │ │     WGE     │
    │  $5K/cohort  │ │  $5-15K/mo  │ │  $200/cell  │
    └───────┬──────┘ └──────┬──────┘ └─────┬───────┘
            │               │               │
            └───────────────┼───────────────┘
                            │
                            v
                    ┌───────────────┐
                    │    AINEG      │
                    │  $1-8K/mo    │
                    │  (identifies  │
                    │   new opps)   │
                    └───────┬───────┘
                            │
                            v
                    ┌───────────────┐
                    │  More Frankmax│──→ Loop repeats
                    │  engagements  │
                    └───────────────┘
```

### Cross-Platform Revenue Triggers

| When This Happens... | ...This Revenue is Triggered |
|---------------------|----------------------------|
| Frankmax engagement starts | Chokepoint Intelligence assessment (included) |
| Frankmax recommends AINE | AINE Runtime hosting (monthly) |
| AINE deployed | ORF licensing (annual) |
| AINE deployed | Agent inference costs (usage-based) |
| AINE needs operators | LevelupMax training ($800-1500 per person) |
| Operators certified | Annual renewal fees |
| WGE creates venture cell | Cell creation + monthly hosting |
| Cell generates revenue | Cell revenue share (5%) |
| Multiple AINEs deployed | AINEG coordination SaaS (monthly) |
| AINEG finds cross-sell | New Frankmax engagement (loop) |
| Privacy required | LPI deployment (annual license) |
| Documents processed | DocuFlow SaaS (per-user monthly) |

## Revenue Projections

### Conservative (Year 1)

| Revenue Stream | Unit Count | Unit Price | Annual Revenue |
|---------------|-----------|-----------|---------------|
| Frankmax engagements | 10 | $20,000 | $200,000 |
| AINE Runtime | 5 instances | $5,000/mo | $300,000 |
| LevelupMax | 100 participants | $1,000 | $100,000 |
| ORF licensing | 5 enterprises | $8,000 | $40,000 |
| WGE cells | 15 cells | $200/mo | $36,000 |
| AINEG | 1 group | $3,000/mo | $36,000 |
| Agent inference | 25 agents | $200/mo | $60,000 |
| **Total** | | | **$772,000** |

### Moderate (Year 2)

| Revenue Stream | Unit Count | Unit Price | Annual Revenue |
|---------------|-----------|-----------|---------------|
| Frankmax engagements | 40 | $22,000 | $880,000 |
| AINE Runtime | 20 instances | $8,000/mo | $1,920,000 |
| LevelupMax | 500 participants | $1,050 | $525,000 |
| ORF licensing | 20 enterprises | $8,000 | $160,000 |
| WGE cells | 60 cells | $200/mo | $144,000 |
| AINEG | 4 groups | $5,000/mo | $240,000 |
| Agent inference | 100 agents | $200/mo | $240,000 |
| LPI | 3 deployments | Custom | $300,000 |
| DocuFlow | 200 users | $10/mo | $24,000 |
| **Total** | | | **$4,433,000** |

### Aggressive (Year 3)

| Revenue Stream | Unit Count | Unit Price | Annual Revenue |
|---------------|-----------|-----------|---------------|
| Frankmax engagements | 100 | $25,000 | $2,500,000 |
| AINE Runtime | 80 instances | $10,000/mo | $9,600,000 |
| LevelupMax | 2,000 participants | $1,100 | $2,200,000 |
| ORF licensing | 80 enterprises | $10,000 | $800,000 |
| WGE cells | 240 cells | $200/mo | $576,000 |
| AINEG | 16 groups | $6,000/mo | $1,152,000 |
| Agent inference | 400 agents | $200/mo | $960,000 |
| LPI | 10 deployments | Custom | $1,500,000 |
| DocuFlow | 1,000 users | $10/mo | $120,000 |
| **Total** | | | **$19,408,000** |

## Key Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **ARR** | Annual Recurring Revenue | Track monthly |
| **Engagement Multiplier** | Downstream ARR / Engagement Revenue | >5x |
| **AINE ARPU** | Average Revenue Per AINE instance | >$8K/mo |
| **Training Renewal Rate** | % of certifications renewed annually | >70% |
| **Cell Revenue Achievement** | Actual / Target revenue per cell | >80% |
| **Portfolio Compound Rate** | Additional revenue from AINEG cross-sell | >15% |
