---
sidebar_position: 3
title: "Closed-Loop Feedback"
description: "The 7 closed feedback loops that drive compounding intelligence across the AINEFF ecosystem, with inter-system event contracts."
---

# Closed-Loop Feedback

The AINEFF ecosystem is not a collection of independent services -- it is a network of **closed feedback loops**. Each loop takes output from one phase of operation and feeds it back as input to an earlier phase, creating continuous improvement cycles that compound over time.

There are 7 primary feedback loops. Each loop crosses multiple system clusters, and the loops themselves interlock to form a self-reinforcing system of systems.

```
         Loop 1                    Loop 2                   Loop 3
    ┌─► Execution ──┐         ┌─► Audit ──────┐       ┌─► Role Intel ──┐
    │   Telemetry   │         │   Failure      │       │   Agent Comp.  │
    │   Revenue     │         │   Harm         │       │   Execution    │
    └── Pattern ◄───┘         └── Rate Limit ◄─┘       └── Feedback ◄──┘

         Loop 4                    Loop 5                   Loop 6
    ┌─► BPMN ───────┐         ┌─► Governance ──┐       ┌─► Lifecycle ──┐
    │   Agent Exec.  │         │   Authority    │       │   Death       │
    │   Process Opt. │         │   Decay        │       │   Prevention  │
    └── Workflow ◄───┘         └── Renewal ◄────┘       └── Registry ◄─┘

         Loop 7
    ┌─► Evidence ───┐
    │   Compliance   │
    │   Jurisdiction │
    └── Policy ◄────┘
```

---

## Loop 1: Execution -- Telemetry -- Revenue Intel -- Pattern Improvement

**Systems involved**: BPMN, ACOS, Telemetry, Revenue Intel, Role Engine

This is the primary value-creation loop. As agents execute business processes, telemetry data reveals which patterns generate the most revenue. Those patterns are reinforced in future agent compositions.

```
┌──────────────────────────────────────────────────────────┐
│  LOOP 1: Revenue Compounding                              │
│                                                           │
│  ┌──────────┐    metrics     ┌─────────────┐             │
│  │  BPMN +  │ ─────────────► │  Telemetry  │             │
│  │  ACOS    │    execution    │  Service    │             │
│  │ (execute)│    traces       └──────┬──────┘             │
│  └────▲─────┘                        │                    │
│       │                              ▼                    │
│       │                      ┌─────────────┐             │
│       │    improved          │  Revenue    │             │
│       │    patterns          │  Intel      │             │
│       │                      └──────┬──────┘             │
│       │                             │                    │
│       │                             ▼                    │
│       │                      ┌─────────────┐             │
│       └──────────────────────│  Role       │             │
│           agent composition  │  Engine     │             │
│           recommendations    └─────────────┘             │
└──────────────────────────────────────────────────────────┘
```

**Feedback cycle**: Agent execution produces telemetry. Telemetry feeds revenue intelligence. Revenue intelligence identifies high-performing patterns. The Role Engine uses those patterns to improve future agent compositions. Better compositions produce better execution. The loop compounds.

---

## Loop 2: Audit -- Failure -- Harm -- Rate Limiting

**Systems involved**: ACTS, FMS, SHFS, RRLS, SEI

This is the primary safety loop. When failures occur, they are audited, assessed for harm, and used to adjust rate limits and safeguards.

```
┌──────────────────────────────────────────────────────────┐
│  LOOP 2: Safety Compounding                               │
│                                                           │
│  ┌──────────┐    failure     ┌─────────────┐             │
│  │  ACTS    │ ─────────────► │  FMS        │             │
│  │ (audit)  │    events      │ (failure    │             │
│  └────▲─────┘                │  mgmt)      │             │
│       │                      └──────┬──────┘             │
│       │                             │                    │
│       │                             ▼                    │
│       │                      ┌─────────────┐             │
│       │    adjusted          │  SHFS + SEI │             │
│       │    limits            │ (harm       │             │
│       │                      │  assessment)│             │
│       │                      └──────┬──────┘             │
│       │                             │                    │
│       │                             ▼                    │
│       │                      ┌─────────────┐             │
│       └──────────────────────│  RRLS       │             │
│           new audit records  │ (rate       │             │
│           for limit changes  │  limiting)  │             │
│                              └─────────────┘             │
└──────────────────────────────────────────────────────────┘
```

**Feedback cycle**: Audit records reveal failures. Failure management classifies severity. Harm assessment determines impact. Rate limiting adjusts thresholds. New rate limits are themselves audited. The system gets safer with each failure.

---

## Loop 3: Role Intelligence -- Agent Composition -- Execution -- Feedback

**Systems involved**: Industry Intel, Role Engine, RAMS, ACOS, AgentCoders, Telemetry

This loop continuously improves the quality of AI agents by learning from execution feedback.

```
┌──────────────────────────────────────────────────────────┐
│  LOOP 3: Agent Quality Compounding                        │
│                                                           │
│  ┌──────────────┐   roles    ┌──────────────┐            │
│  │  Industry    │ ─────────► │  Role Engine │            │
│  │  Intel       │            └──────┬───────┘            │
│  └──────▲───────┘                   │                    │
│         │                           ▼                    │
│         │                    ┌──────────────┐            │
│         │                    │  RAMS + ACOS │            │
│         │                    │  (compose    │            │
│         │                    │   agents)    │            │
│         │                    └──────┬───────┘            │
│         │                           │                    │
│         │                           ▼                    │
│         │                    ┌──────────────┐            │
│         │  performance       │  AgentCoders │            │
│         │  signals           │  (execute)   │            │
│         │                    └──────┬───────┘            │
│         │                           │                    │
│         │                           ▼                    │
│         │                    ┌──────────────┐            │
│         └────────────────────│  Telemetry   │            │
│           industry patterns  │  (feedback)  │            │
│                              └──────────────┘            │
└──────────────────────────────────────────────────────────┘
```

**Feedback cycle**: Industry intelligence provides role definitions. The Role Engine derives automatable tasks. RAMS assigns authority and ACOS composes agent teams. AgentCoders execute tasks. Telemetry captures performance. Performance signals update industry intelligence. Better roles produce better agents.

---

## Loop 4: BPMN -- Agent Execution -- Process Optimization

**Systems involved**: BPMN, ACOS, Telemetry, Revenue Intel

This loop optimizes business processes themselves based on execution data.

```
┌──────────────────────────────────────────────────────────┐
│  LOOP 4: Process Optimization                             │
│                                                           │
│  ┌──────────┐   tasks       ┌─────────────┐             │
│  │  BPMN    │ ─────────────►│  ACOS       │             │
│  │ (process │   to execute  │ (agent      │             │
│  │  defs)   │               │  execution) │             │
│  └────▲─────┘               └──────┬──────┘             │
│       │                            │                    │
│       │                            ▼                    │
│       │                     ┌─────────────┐             │
│       │  optimized          │  Telemetry  │             │
│       │  process            │  + Revenue  │             │
│       │  definitions        │  Intel      │             │
│       │                     └──────┬──────┘             │
│       │                            │                    │
│       │   bottleneck               │                    │
│       │   identification           │                    │
│       └────────────────────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

**Feedback cycle**: BPMN workflows define business processes. ACOS agents execute them. Telemetry reveals bottlenecks and inefficiencies. Revenue Intelligence identifies which process patterns generate the most value. BPMN definitions are updated to optimize the high-value paths. Processes get faster and more profitable each cycle.

---

## Loop 5: Governance -- Authority -- Decay -- Renewal

**Systems involved**: RAMS, GBL, ADS, TDES, HOES, HCL

This loop ensures governance authority stays fresh and relevant through time-based decay.

```
┌──────────────────────────────────────────────────────────┐
│  LOOP 5: Authority Freshness                              │
│                                                           │
│  ┌──────────┐   authority   ┌─────────────┐             │
│  │  RAMS    │ ─────────────►│  GBL        │             │
│  │ (assign  │   grants      │ (enforce    │             │
│  │  roles)  │               │  boundaries)│             │
│  └────▲─────┘               └──────┬──────┘             │
│       │                            │                    │
│       │                            ▼                    │
│       │                     ┌─────────────┐             │
│       │  renewal            │  ADS + TDES │             │
│       │  requests           │ (decay over │             │
│       │                     │  time)      │             │
│       │                     └──────┬──────┘             │
│       │                            │                    │
│       │                            ▼                    │
│       │                     ┌─────────────┐             │
│       └─────────────────────│  HOES + HCL │             │
│          re-grant or        │ (human      │             │
│          revoke decisions   │  review)    │             │
│                             └─────────────┘             │
└──────────────────────────────────────────────────────────┘
```

**Feedback cycle**: RAMS grants authority to agents. GBL enforces those grants. ADS and TDES decay authority over time. When authority expires, HOES escalates to humans. Humans review via HCL and either renew or revoke. RAMS records the decision. No authority is permanent; everything decays and must be re-justified.

---

## Loop 6: Enterprise Lifecycle -- Death -- Prevention -- Registry

**Systems involved**: EMS, MES, RPS, GAAGR, TDES, FBS

This loop manages the full lifecycle of an AI-native enterprise, including preventing unauthorized resurrection.

```
┌──────────────────────────────────────────────────────────┐
│  LOOP 6: Lifecycle Integrity                              │
│                                                           │
│  ┌──────────┐   birth      ┌─────────────┐              │
│  │  EMS     │ ─────────────►│  Operating  │              │
│  │ (birth)  │               │  AINE       │              │
│  └────▲─────┘               └──────┬──────┘              │
│       │                            │                     │
│       │                            ▼  decay triggers     │
│       │                     ┌─────────────┐              │
│       │  lessons for        │  TDES + MES │              │
│       │  future births      │ (death      │              │
│       │                     │  process)   │              │
│       │                     └──────┬──────┘              │
│       │                            │                     │
│       │                            ▼                     │
│       │                     ┌─────────────┐              │
│       │                     │  RPS + GAAGR│              │
│       └─────────────────────│ (prevention │              │
│          registry updates   │  + registry)│              │
│                             └─────────────┘              │
└──────────────────────────────────────────────────────────┘
```

**Feedback cycle**: EMS births a new AINE. The AINE operates until decay thresholds are met. TDES triggers death processes managed by MES. RPS prevents resurrection. GAAGR updates the registry. Lessons from deaths (causes, patterns, durations) feed back into EMS to improve future enterprise births.

---

## Loop 7: Evidence -- Compliance -- Jurisdiction -- Policy

**Systems involved**: Audit Chain, ACTS, ECS, JAL, PIES, OGCRS

This loop ensures compliance evidence continuously refines jurisdiction-specific policies.

```
┌──────────────────────────────────────────────────────────┐
│  LOOP 7: Compliance Intelligence                          │
│                                                           │
│  ┌──────────────┐  evidence  ┌─────────────┐            │
│  │  Audit Chain │ ──────────►│  ACTS + ECS │            │
│  │  (evidence)  │            │ (compliance │            │
│  └──────▲───────┘            │  tracking)  │            │
│         │                    └──────┬──────┘            │
│         │                           │                   │
│         │                           ▼                   │
│         │                    ┌─────────────┐            │
│         │  new evidence      │  JAL        │            │
│         │  from policy       │ (jurisdiction│            │
│         │  enforcement       │  resolution) │            │
│         │                    └──────┬──────┘            │
│         │                           │                   │
│         │                           ▼                   │
│         │                    ┌─────────────┐            │
│         └────────────────────│  PIES+OGCRS │            │
│           enforcement        │ (policy     │            │
│           evidence           │  update)    │            │
│                              └─────────────┘            │
└──────────────────────────────────────────────────────────┘
```

**Feedback cycle**: The Audit Chain stores tamper-evident evidence. ACTS and ECS analyze compliance status. JAL resolves jurisdiction-specific requirements. PIES updates policies based on compliance gaps. OGCRS generates compliance reports. Policy enforcement produces new evidence. Each compliance failure makes the policy set more complete.

---

## Inter-System Event Contract

All 7 feedback loops communicate through a unified event contract. Every inter-system event in the AINEFF ecosystem conforms to the `AINEFFEvent` interface.

### The AINEFFEvent Interface

```typescript
/**
 * Universal event contract for all inter-system communication
 * in the AINEFF ecosystem. Every feedback loop, every system
 * interaction, and every audit record uses this structure.
 */
interface AINEFFEvent<T = unknown> {
  /** Globally unique event identifier (UUIDv7 for time-ordering) */
  eventId: string;

  /** Event type using dot-notation namespace
   *  Format: <cluster>.<system>.<action>
   *  Examples:
   *    "audit.acts.record-created"
   *    "governance.rams.authority-granted"
   *    "intelligence.telemetry.metric-emitted"
   *    "lifecycle.ems.aine-born"
   *    "safety.rrls.rate-limit-applied"
   */
  eventType: string;

  /** ISO 8601 timestamp with microsecond precision */
  timestamp: string;

  /** GAAGR address of the emitting system */
  source: string;

  /** GAAGR address of the target AINE (if applicable) */
  aineAddress?: string;

  /** Correlation ID for tracing events across feedback loops */
  correlationId: string;

  /** Causation ID — the eventId that caused this event */
  causationId?: string;

  /** Which feedback loop(s) this event participates in */
  loops: (
    | "execution-revenue"
    | "audit-safety"
    | "role-agent"
    | "bpmn-optimization"
    | "governance-decay"
    | "lifecycle-death"
    | "evidence-compliance"
  )[];

  /** ORF obligation ID (if this event is part of an obligation) */
  obligationId?: string;

  /** Jurisdiction context */
  jurisdiction?: {
    primary: string;       // ISO 3166-1 alpha-2
    applicable: string[];  // All applicable jurisdictions
  };

  /** Typed payload — varies by eventType */
  payload: T;

  /** Metadata for routing, filtering, and observability */
  metadata: {
    /** Schema version for this event type */
    schemaVersion: string;
    /** Protocol layer this event was generated at */
    protocolLayer: 0 | 1 | 2 | 3 | 4;
    /** Priority for event processing */
    priority: "critical" | "high" | "normal" | "low";
    /** TTL in seconds — event expires after this duration */
    ttlSeconds: number;
    /** Tags for telemetry and filtering */
    tags: Record<string, string>;
  };
}
```

### Event Type Examples

```typescript
// Loop 1: Execution telemetry
const telemetryEvent: AINEFFEvent<{
  agentId: string;
  taskId: string;
  durationMs: number;
  revenueImpact: number;
}> = {
  eventId: "0192a4c0-7e8f-7000-8001-abcdef012345",
  eventType: "intelligence.telemetry.metric-emitted",
  timestamp: "2026-03-01T14:30:00.123456Z",
  source: "aine://acme-corp.us-east.aineff.mesh/telemetry/v1",
  aineAddress: "aine://acme-corp.us-east.aineff.mesh",
  correlationId: "corr-abc-123",
  loops: ["execution-revenue", "bpmn-optimization"],
  obligationId: "obl-789",
  payload: {
    agentId: "agent-invoice-processor",
    taskId: "task-inv-2024-001",
    durationMs: 1250,
    revenueImpact: 45.00,
  },
  metadata: {
    schemaVersion: "1.0.0",
    protocolLayer: 4,
    priority: "normal",
    ttlSeconds: 86400,
    tags: { cluster: "intelligence", system: "telemetry" },
  },
};

// Loop 2: Rate limit applied
const rateLimitEvent: AINEFFEvent<{
  targetSystem: string;
  previousLimit: number;
  newLimit: number;
  reason: string;
}> = {
  eventId: "0192a4c0-8a12-7000-8002-abcdef012346",
  eventType: "safety.rrls.rate-limit-applied",
  timestamp: "2026-03-01T14:31:00.456789Z",
  source: "aine://acme-corp.us-east.aineff.mesh/rrls/v1",
  aineAddress: "aine://acme-corp.us-east.aineff.mesh",
  correlationId: "corr-def-456",
  causationId: "0192a4c0-7e8f-7000-8001-abcdef012340",
  loops: ["audit-safety"],
  payload: {
    targetSystem: "acos",
    previousLimit: 100,
    newLimit: 50,
    reason: "Repeated harm detections in agent compositions",
  },
  metadata: {
    schemaVersion: "1.0.0",
    protocolLayer: 3,
    priority: "high",
    ttlSeconds: 604800,
    tags: { cluster: "safety", system: "rrls", severity: "high" },
  },
};

// Loop 5: Authority decay
const decayEvent: AINEFFEvent<{
  authorityId: string;
  role: string;
  decayPercentage: number;
  renewalRequired: boolean;
}> = {
  eventId: "0192a4c0-9b34-7000-8003-abcdef012347",
  eventType: "governance.ads.authority-decayed",
  timestamp: "2026-03-01T14:32:00.789012Z",
  source: "aine://acme-corp.us-east.aineff.mesh/ads/v1",
  correlationId: "corr-ghi-789",
  loops: ["governance-decay"],
  payload: {
    authorityId: "auth-cfo-approval",
    role: "financial-agent",
    decayPercentage: 75,
    renewalRequired: true,
  },
  metadata: {
    schemaVersion: "1.0.0",
    protocolLayer: 3,
    priority: "high",
    ttlSeconds: 3600,
    tags: { cluster: "governance", system: "ads" },
  },
};
```

### Event Flow Across Loops

Events frequently participate in multiple loops simultaneously. The `loops` field enables systems to understand which feedback cycles an event contributes to.

```
                        AINEFFEvent
                    (loops: ["execution-revenue",
                             "bpmn-optimization"])
                            │
              ┌─────────────┼─────────────┐
              ▼                           ▼
    Loop 1 Consumer               Loop 4 Consumer
    (Revenue Intel)               (BPMN Engine)
         │                              │
         ▼                              ▼
    Revenue pattern              Process optimization
    identification               recommendation
         │                              │
         ▼                              ▼
    AINEFFEvent                  AINEFFEvent
    (loops: ["execution-        (loops: ["bpmn-
     revenue","role-agent"])      optimization"])
```

:::info Event Ordering
Events use UUIDv7 identifiers, which are time-ordered. Combined with the `correlationId` and `causationId` fields, any sequence of events across any number of feedback loops can be reconstructed into a causal chain for debugging, auditing, or optimization.
:::

:::tip Subscribing to Loops
Systems subscribe to events by loop name, event type, or both. The Protocol Router handles event fan-out based on subscription filters. A system can subscribe to all events in `"audit-safety"` without knowing which specific systems emit them.
:::
