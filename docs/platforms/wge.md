---
sidebar_position: 5
title: "Work Genesis Engine"
description: "Creates autonomous venture cells --- small 3-5 agent teams that function as independent revenue generation units within an AINE."
---

# Work Genesis Engine (WGE)

The **Work Genesis Engine** creates **venture cells** --- small, autonomous teams of 3-5 AI agents that operate as independent revenue generation units. Each venture cell has a Jarvis CEO agent, specialist agents, defined skills, and a revenue target. WGE is the mechanism by which AINEs generate new work and new revenue.

## System Identity

| Field | Value |
|-------|-------|
| System ID | `aineff-wge` |
| Package | `@aineff/wge` |
| Cluster | Platform |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |
| Revenue | Per venture cell created |
| Repository | `aineff-wge` |

## Core Concepts

### What is a Venture Cell?

A venture cell is the **atomic unit of revenue generation** in AINEFF. It is a small team of agents, led by a Jarvis CEO agent, with a specific mission, a defined skill set, and a revenue target.

```
┌──────────────────────────────────────────────────┐
│              Venture Cell: VC-0042               │
│         Mission: "Supply chain optimization"     │
│         Revenue Target: $8,500/month             │
│                                                  │
│  ┌───────────────────────────────────────────┐   │
│  │           Jarvis CEO Agent                │   │
│  │   (Strategy, delegation, reporting)       │   │
│  └────────────┬──────────────┬───────────────┘   │
│               │              │                   │
│  ┌────────────v──┐  ┌───────v────────┐           │
│  │ Specialist #1 │  │ Specialist #2  │           │
│  │ Data Analyst  │  │ Process Eng    │           │
│  └────────────┬──┘  └───────┬────────┘           │
│               │              │                   │
│  ┌────────────v──┐  ┌───────v────────┐           │
│  │ Specialist #3 │  │ Specialist #4  │           │
│  │ Report Writer │  │ Integration    │           │
│  └───────────────┘  └───────────────┘            │
│                                                  │
│  Skills: [data-analysis, bpmn-modeling,          │
│           report-generation, api-integration]    │
│  ORF Bindings: 12 active                         │
│  Created: 2026-01-15 | Status: Active            │
└──────────────────────────────────────────────────┘
```

### Venture Cell Lifecycle

```
  Genesis → Assembly → Calibration → Active → Review → Renewal/Death
     │          │           │          │         │         │
     │          │           │          │         │         ├── Renewed: new target, continue
     │          │           │          │         │         └── Death: TDES termination
     │          │           │          │         └── Monthly performance review
     │          │           │          └── Generating revenue, executing tasks
     │          │           └── Test run, skill validation, ORF binding
     │          └── Agents selected from skill registry, pods provisioned
     └── Opportunity identified, cell spec created
```

### Agent Team Composition

| Role | Count | Responsibility |
|------|-------|---------------|
| **Jarvis CEO** | 1 | Strategy, task delegation, stakeholder reporting, revenue tracking |
| **Specialists** | 2-4 | Domain-specific task execution (analysis, engineering, writing, integration) |

Agents are selected from the AgentCoders skill registry based on the mission requirements.

## Architecture

### WGE Components

```
Work Genesis Engine
├── Opportunity Scanner
│   ├── Revenue Pattern Matcher    — Identifies revenue opportunities
│   ├── Capability Assessor        — Maps required skills to available agents
│   └── Feasibility Evaluator      — Cost/benefit analysis for proposed cells
├── Cell Factory
│   ├── Spec Generator             — Creates venture cell specifications
│   ├── Agent Selector             — Picks agents from skill registry
│   ├── Pod Provisioner            — Requests AINE Runtime to create pods
│   └── ORF Binder                 — Creates obligation bindings for the cell
├── Cell Manager
│   ├── Performance Tracker        — Revenue vs. target monitoring
│   ├── Health Monitor             — Agent health and collaboration metrics
│   ├── Skill Gap Detector         — Identifies missing capabilities
│   └── Recomposition Engine       — Replaces underperforming agents
└── Cell Reviewer
    ├── Revenue Auditor            — Monthly revenue verification
    ├── Renewal Evaluator          — Continue/terminate decision
    └── Death Initiator            — Triggers TDES for terminated cells
```

### Venture Cell Spec

```typescript
interface VentureCellSpec {
  cellId: string;
  mission: string;
  revenueTarget: {
    monthly: number;
    currency: 'USD' | 'EUR' | 'GBP';
  };
  agents: {
    jarvisCeo: AgentSpec;
    specialists: AgentSpec[];
  };
  skills: string[];
  constraints: ORFConstraint[];
  kpis: KPI[];
  reviewSchedule: 'weekly' | 'biweekly' | 'monthly';
  maxLifespanMonths: number;
}

interface AgentSpec {
  agentType: string;
  requiredSkills: string[];
  modelPreference?: string;
  authorityLevel: number;
}

interface KPI {
  name: string;
  target: number;
  unit: string;
  measurementFrequency: 'daily' | 'weekly' | 'monthly';
}
```

### Cell Creation Flow

```
1. Opportunity Identified
   └── Source: AINEG cross-sell, Frankmax engagement, manual request

2. Feasibility Check
   ├── Required skills available in registry?
   ├── AINE has capacity (pod quota not exceeded)?
   ├── Revenue target realistic (historical benchmarks)?
   └── ORF constraints satisfiable?

3. Cell Assembly
   ├── Select Jarvis CEO agent (highest authority match)
   ├── Select 2-4 specialist agents (skill coverage optimization)
   ├── Request AINE Runtime to provision pods
   └── Create ORF obligation bindings

4. Calibration (48h)
   ├── Agents run test tasks
   ├── Collaboration patterns established
   ├── Revenue pipeline validated
   └── Human operator approval (ORF finality)

5. Activation
   └── Cell moves to Active state, begins generating revenue
```

## Configuration

```typescript
interface WGEConfig {
  systemId: string;
  version: string;
  enabled: boolean;

  // Cell creation limits
  limits: {
    maxCellsPerAine: number;        // Default: 10
    maxAgentsPerCell: number;        // Default: 5
    minAgentsPerCell: number;        // Default: 3
    calibrationPeriodHours: number;  // Default: 48
  };

  // Revenue settings
  revenue: {
    minRevenueTargetUsd: number;    // Default: 1000
    reviewScheduleDefault: string;  // Default: 'monthly'
    autoRenewThreshold: number;     // Default: 0.8 (80% of target)
    autoTerminateThreshold: number; // Default: 0.3 (30% of target)
  };

  // Agent selection
  agents: {
    skillMatchMinScore: number;     // Default: 0.7 (70% skill coverage)
    preferLocalAgents: boolean;     // Default: true
    crossAineAgents: boolean;       // Default: false (requires AINEG)
  };
}
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `aineff-wge.initialized` | `{ config }` | WGE startup |
| `aineff-wge.heartbeat` | `{ activeCells, totalRevenue }` | Every 30s |
| `aineff-wge.cell.proposed` | `{ cellSpec, feasibility }` | New cell proposed |
| `aineff-wge.cell.created` | `{ cellId, agents, mission }` | Cell assembled and calibrated |
| `aineff-wge.cell.activated` | `{ cellId, revenueTarget }` | Cell moved to Active |
| `aineff-wge.cell.reviewed` | `{ cellId, performance, decision }` | Periodic review completed |
| `aineff-wge.cell.renewed` | `{ cellId, newTarget }` | Cell renewed for another period |
| `aineff-wge.cell.terminated` | `{ cellId, reason, finalRevenue }` | Cell terminated |
| `aineff-wge.agent.replaced` | `{ cellId, oldAgentId, newAgentId }` | Underperforming agent swapped |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `aineff-aineg.opportunity.detected` | AINEG | Evaluate cross-AINE venture cell creation |
| `aineff-aine-runtime.agent.spawned` | AINE Runtime | Confirm agent pod availability |
| `aineff-orf.obligation.violated` | ORF | Flag cell for review if obligations breached |
| `skill-registry.skill.registered` | Skill Registry | Update available skill pool |

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| AINE Runtime | Outbound | Pod provisioning requests |
| AINEG Coordinator | Inbound | Cross-AINE opportunity signals |
| ORF Protocol | Outbound | Obligation binding for cells |
| Skill Registry | Inbound | Available agent skills |
| Revenue Intel | Outbound | Cell revenue data |
| TDES | Outbound | Cell termination requests |
| Billing Service | Outbound | Cell creation billing events |

## Example: Creating a Venture Cell

```typescript
import { WGEClient } from '@aineff/wge';

const wge = new WGEClient({ aineId: 'enterprise-abc' });

// Propose a new venture cell
const proposal = await wge.proposeCell({
  mission: 'Automate invoice processing for Client XYZ',
  revenueTarget: { monthly: 5000, currency: 'USD' },
  requiredSkills: [
    'document-extraction',
    'data-validation',
    'api-integration',
    'report-generation',
  ],
  kpis: [
    { name: 'invoices-processed', target: 500, unit: 'per-month', measurementFrequency: 'daily' },
    { name: 'accuracy-rate', target: 99.5, unit: 'percent', measurementFrequency: 'weekly' },
  ],
});

// Check feasibility
console.log(proposal.feasibility);
// {
//   viable: true,
//   skillCoverage: 0.95,
//   estimatedCostPerMonth: 1200,
//   estimatedMargin: 0.76,
//   suggestedAgents: ['jarvis-ceo-12', 'doc-specialist-7', 'data-validator-3', 'api-agent-19']
// }

// Approve and create
const cell = await wge.createCell(proposal.proposalId, {
  approvedBy: 'operator-jane-doe',
  reviewSchedule: 'biweekly',
});
```

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | Per venture cell creation fee plus ongoing per-cell-per-month hosting. Enterprises pay for each revenue-generating unit WGE creates. |
| **Composed** | Every Frankmax engagement can spawn venture cells. Every AINEG cross-sell opportunity becomes a cell. LevelupMax trains operators to manage cells. Revenue compounds as cells generate their own revenue, which feeds back into AINEG portfolio metrics, which identifies more opportunities. |

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wge
  namespace: aineff-platform
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: wge
          image: aineff/wge:latest
          ports:
            - containerPort: 8080
              name: api
            - containerPort: 9090
              name: metrics
          env:
            - name: WGE_MAX_CELLS_PER_AINE
              value: "10"
            - name: WGE_CALIBRATION_HOURS
              value: "48"
            - name: WGE_MIN_SKILL_MATCH
              value: "0.7"
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1Gi
```
