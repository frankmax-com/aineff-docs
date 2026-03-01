---
sidebar_position: 4
title: "AINEG Coordinator"
description: "Portfolio coordination for enterprise groups --- cross-AINE revenue optimization, resource allocation, and strategic oversight."
---

# AINEG Coordinator

The **AINEG Coordinator** (AI-Native Enterprise Group) provides portfolio-level coordination across multiple AINE Runtime instances. Where an AINE manages a single enterprise, AINEG manages a **group of enterprises** --- optimizing revenue across the portfolio, allocating shared resources, and providing strategic oversight that no individual AINE can achieve alone.

## System Identity

| Field | Value |
|-------|-------|
| System ID | `aineff-aineg` |
| Package | `@aineff/aineg` |
| Cluster | Platform |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |
| Revenue | Portfolio coordination SaaS subscription |
| Repository | `aineff-aineg` |

## Core Concepts

### Portfolio Coordination

AINEG sits above individual AINEs and provides capabilities that require cross-enterprise visibility:

```
                    ┌─────────────────────────┐
                    │    AINEG Coordinator     │
                    │  (Portfolio Dashboard)   │
                    └─────────┬───────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
    ┌───────v───────┐ ┌──────v────────┐ ┌──────v────────┐
    │   AINE #1     │ │   AINE #2     │ │   AINE #3     │
    │ Manufacturing │ │ Logistics     │ │ Finance       │
    │ 12 agents     │ │ 8 agents      │ │ 5 agents      │
    │ 3 cells       │ │ 2 cells       │ │ 1 cell        │
    └───────────────┘ └───────────────┘ └───────────────┘
```

### Cross-AINE Functions

| Function | Description |
|----------|-------------|
| **Revenue Optimization** | Identify cross-enterprise revenue opportunities that individual AINEs cannot see |
| **Resource Sharing** | Share underutilized agent capacity between AINEs |
| **Risk Aggregation** | Aggregate risk signals across the portfolio for systemic risk detection |
| **Authority Escalation** | Handle authority decisions that span multiple enterprises |
| **Compliance Rollup** | Aggregate audit and compliance data across all AINEs |
| **Strategic Analytics** | Portfolio-level dashboards, trends, and forecasting |

### Revenue Optimization Engine

AINEG identifies compound revenue opportunities:

```
Revenue Signal Flow:
  AINE #1 (Manufacturing) → "Customer X needs supply chain AI"
  AINE #2 (Logistics)     → "Supply chain AI available, capacity idle"
  AINEG Coordinator        → "Connect AINE #1 customer to AINE #2 capability"
                           → New venture cell created across both AINEs
                           → Revenue shared according to contribution matrix
```

## Architecture

### Component Structure

```
AINEG Coordinator
├── Portfolio Manager
│   ├── AINE Registry          — Tracks all AINE instances
│   ├── Health Aggregator      — Portfolio-level health scoring
│   └── Capacity Planner       — Cross-AINE resource allocation
├── Revenue Engine
│   ├── Opportunity Detector   — Cross-AINE revenue pattern matching
│   ├── Contribution Matrix    — Revenue attribution across AINEs
│   └── Forecast Model         — Portfolio revenue projections
├── Risk Aggregator
│   ├── Systemic Risk Monitor  — Cross-AINE risk correlation
│   ├── Compliance Rollup      — Aggregated audit reporting
│   └── Decay Correlator       — Multi-AINE decay detection
├── Authority Escalation
│   ├── Cross-AINE Authority   — Decisions spanning multiple AINEs
│   └── Portfolio Governance   — Group-level policy enforcement
└── Analytics Dashboard
    ├── Portfolio Overview      — Real-time portfolio health
    ├── Revenue Trends          — Historical and projected revenue
    └── Comparative Analysis    — AINE-vs-AINE performance
```

### Configuration

```typescript
interface AINEGConfig {
  systemId: string;
  version: string;
  enabled: boolean;

  // Portfolio settings
  portfolio: {
    groupId: string;
    groupName: string;
    maxAines: number;           // Default: 100
    revenueShareModel: 'contribution' | 'equal' | 'custom';
  };

  // Optimization
  optimization: {
    opportunityDetectionIntervalMs: number;  // Default: 300000 (5 min)
    capacityRebalanceIntervalMs: number;     // Default: 600000 (10 min)
    riskAggregationIntervalMs: number;       // Default: 60000 (1 min)
  };

  // Authority
  authority: {
    escalationThreshold: number;   // Default: 4 (Level 4+)
    crossAineApprovalRequired: boolean;  // Default: true
  };
}
```

### AINE Registry

AINEG maintains a live registry of all managed AINEs:

```typescript
interface AINERegistryEntry {
  aineId: string;
  enterpriseName: string;
  status: 'active' | 'degraded' | 'maintenance' | 'terminated';
  tier: 'development' | 'staging' | 'production';
  metrics: {
    agentCount: number;
    ventureCellCount: number;
    monthlyRevenue: number;
    healthScore: number;         // 0-100
    decayScore: number;          // 0-100 (lower is better)
  };
  capabilities: string[];         // Available skills/services
  joinedAt: Date;
  lastHeartbeat: Date;
}
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `aineff-aineg.initialized` | `{ groupId, aineCount }` | Coordinator startup |
| `aineff-aineg.heartbeat` | `{ groupId, portfolioHealth }` | Every 30s |
| `aineff-aineg.aine.registered` | `{ aineId, config }` | New AINE joined portfolio |
| `aineff-aineg.aine.deregistered` | `{ aineId, reason }` | AINE removed from portfolio |
| `aineff-aineg.opportunity.detected` | `{ opportunity, aineIds }` | Cross-AINE revenue opportunity found |
| `aineff-aineg.rebalance.executed` | `{ moves, savings }` | Resource rebalancing completed |
| `aineff-aineg.risk.systemic` | `{ riskLevel, correlatedSignals }` | Systemic risk detected across portfolio |
| `aineff-aineg.authority.escalated` | `{ decision, aineIds }` | Cross-AINE authority decision required |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `aineff-aine-runtime.heartbeat` | All AINEs | Update registry health metrics |
| `aineff-aine-runtime.decay.detected` | Any AINE | Correlate with portfolio decay signals |
| `aineff-wge.cell.created` | WGE | Track venture cell revenue attribution |
| `aineff-revenue-intel.signal` | Revenue Intel | Feed into opportunity detection |
| `aineff-orf.obligation.violated` | ORF | Aggregate violations for portfolio risk |

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| AINE Runtime (all) | Bidirectional | Health metrics, rebalancing commands |
| ORF Protocol | Inbound | Portfolio-level constraint evaluation |
| WGE | Bidirectional | Cross-AINE venture cell coordination |
| Revenue Intel | Inbound | Revenue signals for opportunity detection |
| Telemetry | Outbound | Portfolio-level metrics |
| Audit Logger | Outbound | Cross-AINE decisions audit trail |

## Portfolio Dashboard

AINEG provides a real-time portfolio dashboard:

```
┌─────────────────────────────────────────────────────────┐
│  AINEG Portfolio: Frankmax Enterprise Group              │
│  AINEs: 12 active | Health: 94/100 | Revenue: $847K/mo  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  AINE Performance Matrix                                │
│  ┌──────────────┬────────┬────────┬────────┬─────────┐  │
│  │ AINE         │ Agents │ Cells  │ Health │ Rev/mo  │  │
│  ├──────────────┼────────┼────────┼────────┼─────────┤  │
│  │ Mfg-Alpha    │ 12     │ 3      │ 98     │ $120K   │  │
│  │ Logistics-01 │ 8      │ 2      │ 95     │ $85K    │  │
│  │ Finance-HQ   │ 5      │ 1      │ 91     │ $65K    │  │
│  │ R&D-Labs     │ 15     │ 4      │ 87     │ $142K   │  │
│  │ ...          │ ...    │ ...    │ ...    │ ...     │  │
│  └──────────────┴────────┴────────┴────────┴─────────┘  │
│                                                         │
│  Active Opportunities: 3                                │
│  ■ Cross-sell logistics AI to Mfg-Alpha customer ($45K) │
│  ■ Share R&D-Labs NLP capacity with Finance-HQ ($12K)   │
│  ■ Joint venture cell: supply chain optimization ($80K) │
│                                                         │
│  Risk Alerts: 1                                         │
│  ▲ R&D-Labs decay score rising (87→82 over 7 days)      │
└─────────────────────────────────────────────────────────┘
```

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | Portfolio coordination SaaS subscription. Enterprises with multiple AINEs pay a monthly subscription based on AINE count and portfolio complexity. |
| **Composed** | AINEG multiplies the revenue of every AINE it coordinates. Cross-AINE opportunities that AINEG detects generate new WGE venture cells, new Frankmax engagements, and new LevelupMax training needs --- each feeding back into the revenue loop. |

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineg-coordinator
  namespace: aineff-platform
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: aineg-coordinator
          image: aineff/aineg-coordinator:latest
          ports:
            - containerPort: 8080
              name: api
            - containerPort: 9090
              name: metrics
            - containerPort: 8443
              name: dashboard
          env:
            - name: AINEG_GROUP_ID
              value: "frankmax-enterprise-group"
            - name: AINEG_MAX_AINES
              value: "100"
            - name: AINEG_OPPORTUNITY_INTERVAL_MS
              value: "300000"
          resources:
            requests:
              cpu: 500m
              memory: 1Gi
            limits:
              cpu: 2000m
              memory: 4Gi
```
