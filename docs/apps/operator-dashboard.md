---
sidebar_position: 3
title: "Operator Dashboard"
description: "LevelupMax operator portal --- real-time AINE monitoring, agent management, venture cell oversight, and authority decision interface for trained operators."
---

# Operator Dashboard

The **Operator Dashboard** is the primary interface for [LevelupMax](/docs/platforms/levelupmax)-certified operators to monitor and manage their AINE instances. It provides real-time visibility into agent health, venture cell performance, ORF obligation status, and telemetry data --- with actions gated by the operator's certification level and authority.

## Application Identity

| Field | Value |
|-------|-------|
| App ID | `operator-dashboard` |
| Type | Web Application |
| Framework | React / Next.js |
| Language | TypeScript |
| Repository | `operator-dashboard` |
| Access | LevelupMax-certified operators only |

## Access by Certification Level

The dashboard adapts its interface based on the operator's LevelupMax certification level:

| Level | Dashboard Access |
|-------|-----------------|
| **Level 1 (Observer)** | Read-only dashboards, health metrics, alert history |
| **Level 2 (Operator)** | Level 1 + approve/deny agent actions, manage individual agents |
| **Level 3 (Manager)** | Level 2 + venture cell management, authority configuration, WGE controls |
| **Level 4 (Director)** | Level 3 + cross-AINE views (AINEG), portfolio dashboards |
| **Level 5 (Architect)** | Level 4 + ORF constraint editor, system configuration, override controls |

## Dashboard Views

### Home View

Real-time overview of the operator's AINE instance:

```
┌─────────────────────────────────────────────────────────────┐
│  AINE: Manufacturing-Alpha          Operator: Jane Doe (L3) │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Health Score: 96/100        Agents: 14 active              │
│  Venture Cells: 4 active    Revenue: $47.2K MTD             │
│  ORF Bindings: 23 active    Pending Approvals: 3            │
│                                                             │
│  ┌──────────────── Agent Status ────────────────────────┐   │
│  │  ■■■■■■■■■■■■■■ 14/14 healthy (100%)                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──── Venture Cell Performance ────┐  ┌── Alerts ───────┐  │
│  │  VC-0042 Supply Chain    $12.1K  │  │  ! Agent-07     │  │
│  │  VC-0043 Invoice Auto    $8.4K   │  │    Memory 87%   │  │
│  │  VC-0044 Quality Pred    $15.2K  │  │                 │  │
│  │  VC-0045 Scheduling      $11.5K  │  │  ! VC-0044      │  │
│  │                                  │  │    Below target  │  │
│  └──────────────────────────────────┘  └─────────────────┘  │
│                                                             │
│  ┌──── Pending Approvals (3) ───────────────────────────┐   │
│  │  1. Agent-12 requests $3,200 expenditure  [Approve]  │   │
│  │  2. VC-0043 renewal review                [Review]   │   │
│  │  3. New agent pod request (data-analyst)  [Approve]  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Agent Management View

Detailed view of all agent pods within the AINE:

```
┌──────────────────────────────────────────────────────────────┐
│  Agent Management                    Filter: [All Types ▾]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┬──────────┬─────────┬────────┬────────┬──────┐ │
│  │ Agent    │ Type     │ Cell    │ Health │ CPU    │ Mem  │ │
│  ├──────────┼──────────┼─────────┼────────┼────────┼──────┤ │
│  │ Agent-01 │ Jarvis   │ VC-0042 │ ●  98  │ 45%    │ 62%  │ │
│  │ Agent-02 │ Analyst  │ VC-0042 │ ●  95  │ 72%    │ 58%  │ │
│  │ Agent-03 │ Engineer │ VC-0042 │ ●  97  │ 38%    │ 44%  │ │
│  │ Agent-04 │ Writer   │ VC-0042 │ ●  92  │ 55%    │ 71%  │ │
│  │ Agent-05 │ Jarvis   │ VC-0043 │ ●  96  │ 41%    │ 55%  │ │
│  │ Agent-06 │ Extractor│ VC-0043 │ ●  94  │ 68%    │ 63%  │ │
│  │ Agent-07 │ Validator│ VC-0043 │ ▲  78  │ 82%    │ 87%  │ │
│  │ ...      │ ...      │ ...     │ ...    │ ...    │ ...  │ │
│  └──────────┴──────────┴─────────┴────────┴────────┴──────┘ │
│                                                              │
│  Selected: Agent-07                                          │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Status: Warning (Memory pressure)                   │    │
│  │  Uptime: 14d 6h 23m                                  │    │
│  │  Tasks Completed: 342                                 │    │
│  │  Error Rate: 2.1%                                     │    │
│  │  Last Action: Invoice validation (2 min ago)          │    │
│  │                                                       │    │
│  │  Actions: [Restart] [Scale Memory] [Replace] [Logs]   │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Venture Cell View

Performance tracking for each venture cell:

| Metric | VC-0042 | VC-0043 | VC-0044 | VC-0045 |
|--------|---------|---------|---------|---------|
| Mission | Supply Chain | Invoice Auto | Quality Pred | Scheduling |
| Agents | 4 | 3 | 4 | 3 |
| Revenue Target | $10K/mo | $8K/mo | $18K/mo | $12K/mo |
| Actual Revenue | $12.1K | $8.4K | $15.2K | $11.5K |
| Target Achievement | 121% | 105% | 84% | 96% |
| Health Score | 95 | 89 | 82 | 91 |
| Active KPIs | 5/5 met | 4/5 met | 3/5 met | 5/5 met |

### Telemetry View

Real-time and historical telemetry data:

```
┌──────────────────────────────────────────────────────────────┐
│  Telemetry                          Range: [Last 24h ▾]      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  System Metrics                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  CPU Usage (avg)      ████████░░░░░░░░  52%          │    │
│  │  Memory Usage (avg)   ██████████░░░░░░  64%          │    │
│  │  Network I/O          ████░░░░░░░░░░░░  28%          │    │
│  │  ORF Eval Latency     ███░░░░░░░░░░░░░  23ms (avg)  │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Agent Activity (24h)                                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Tasks Completed:     1,247                          │    │
│  │  ORF Bindings Created: 89                            │    │
│  │  Approvals Requested:  12                            │    │
│  │  Errors:               7 (0.56% error rate)          │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Revenue Trend (30d)                                         │
│  ┌──────────────────────────────────────────────────────┐    │
│  │     ___                                              │    │
│  │    /   \      ____                                   │    │
│  │   /     \    /    \___                               │    │
│  │  /       \__/         \____/‾‾‾‾‾‾                   │    │
│  │ /                                                    │    │
│  │ $38K  $42K  $39K  $44K  $47K  (MTD)                  │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Authority Decision View

Where operators make ORF-governed decisions:

```typescript
interface AuthorityDecision {
  decisionId: string;
  requestedBy: string;         // Agent or system requesting
  action: string;              // What action needs approval
  context: Record<string, unknown>;
  requiredLevel: number;       // Minimum authority level
  orfBindingId: string;        // Associated obligation
  deadline: Date;              // SLA for decision
  options: ('approve' | 'deny' | 'escalate' | 'defer')[];
}
```

## Architecture

### Component Structure

```
Operator Dashboard
├── Authentication
│   ├── LevelupMax SSO         — Certificate-based authentication
│   ├── Authority Resolver     — Load operator's authority level
│   └── Session Manager        — Secure session handling
├── Dashboard Core
│   ├── Home View              — AINE overview
│   ├── Agent View             — Agent pod management
│   ├── Venture Cell View      — Cell performance tracking
│   ├── Telemetry View         — Real-time metrics
│   └── Authority View         — Decision queue
├── Real-Time Engine
│   ├── WebSocket Connector    — Live data streaming
│   ├── Event Processor        — Event → UI state mapping
│   └── Alert Manager          — Notification routing
├── Action Handlers
│   ├── Agent Actions          — Restart, scale, replace
│   ├── Cell Actions           — Create, review, renew, terminate
│   ├── Authority Actions      — Approve, deny, escalate
│   └── Configuration Actions  — Settings, policies, matrix
└── Governance Layer
    ├── ORF Client             — Obligation binding for decisions
    ├── Authority Checker      — Pre-action authority validation
    └── Audit Trail            — All operator actions logged
```

### Real-Time Data Flow

```
AINE Runtime ──→ Telemetry Collector ──→ WebSocket Server
                                              │
                                              v
                                     Operator Dashboard
                                              │
                                              v
                                     UI State Update
                                     (< 500ms latency)
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `operator-dashboard.session.started` | `{ operatorId, level }` | Operator logged in |
| `operator-dashboard.decision.made` | `{ decisionId, action, reasoning }` | Authority decision submitted |
| `operator-dashboard.agent.action` | `{ agentId, action }` | Operator acted on agent |
| `operator-dashboard.cell.action` | `{ cellId, action }` | Operator acted on venture cell |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `aineff-aine-runtime.heartbeat` | AINE Runtime | Update dashboard health metrics |
| `aineff-aine-runtime.agent.spawned` | AINE Runtime | Add agent to management view |
| `aineff-aine-runtime.decay.detected` | AINE Runtime | Trigger alert notification |
| `aineff-orf.obligation.created` | ORF | Add to pending decisions queue |
| `aineff-wge.cell.reviewed` | WGE | Update venture cell performance |

## Integration Points

| System | Integration | Purpose |
|--------|-------------|---------|
| **AINE Runtime** | WebSocket, REST API | All AINE state and control |
| **ORF Protocol** | REST API | Obligation bindings for decisions |
| **LevelupMax** | SSO, API | Authentication, authority level |
| **WGE** | REST API | Venture cell management |
| **Telemetry** | WebSocket | Real-time metrics streaming |
| **AINEG** | REST API | Cross-AINE views (Level 4+) |

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | Included with AINE Runtime hosting. The dashboard is a core operational tool, not separately priced. |
| **Composed** | Drives LevelupMax demand (operators need certification to use it). Enables efficient AINE management which increases WGE venture cell throughput. Better operator decisions improve AINE health and revenue. |
