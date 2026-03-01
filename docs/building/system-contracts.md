---
sidebar_label: System Contracts
sidebar_position: 4
title: "System Contracts — Interface Definitions Between Systems"
---

# System Contracts

**Version:** v1.0.0
**Date:** 2026-03-01

Every system in AINEFF communicates through typed contracts. This page defines the canonical interfaces that all systems implement. When an AgentCoders agent builds a system, it implements these contracts exactly.

## Universal Event Contract

Every inter-system message uses this structure:

```typescript
interface AINEFFEvent {
  // Identity
  eventId: string;              // UUIDv7 (time-ordered)
  eventType: string;            // dot-notation: "cluster.system.action"
  version: string;              // semver: "1.0.0"

  // Causation
  correlationId: string;        // groups related events across systems
  causationId: string;          // the eventId that caused this event

  // Context
  source: string;               // system that emitted: "@aineff/ems"
  timestamp: string;            // ISO 8601 UTC
  aineId?: string;              // which AINE this relates to
  agentId?: string;             // which agent emitted this

  // Feedback loops
  loops: string[];              // which loops this participates in
                                // e.g. ["execution-telemetry-pattern", "audit-failure-harm"]

  // Payload
  data: Record<string, unknown>;

  // Governance
  orf?: ORFEnvelope;            // obligation binding (if action requires accountability)

  // Metadata
  metadata: {
    schemaVersion: string;
    protocolLayer: 0 | 1 | 2 | 3 | 4;
    priority: "low" | "normal" | "high" | "critical";
    ttl?: number;               // seconds until event expires
    tags?: string[];
  };
}
```

## ORF Envelope Contract

Every action that binds accountability wraps in this envelope:

```typescript
interface ORFEnvelope {
  envelopeId: string;           // UUIDv7
  state: "proposed" | "accepted" | "executing" | "final" | "failed";

  // The triple
  obligor: {
    id: string;                 // who must act
    type: "agent" | "human" | "system";
    name: string;
  };
  responsibleParty: {
    id: string;                 // who is accountable
    type: "agent" | "human" | "system";
    name: string;
  };
  finality: {
    reversible: boolean;
    reversalWindow?: number;    // seconds, if reversible
    finalityHash?: string;      // SHA-256, if irreversible
    finalizedAt?: string;       // ISO 8601 UTC
  };

  // Constraints
  constraints: ORFConstraint[];

  // Audit
  createdAt: string;
  updatedAt: string;
  auditEntryId?: string;       // link to ACTS record
}

interface ORFConstraint {
  type: "authority" | "obligation" | "temporal" | "finality" | "jurisdiction";
  rule: string;                 // human-readable constraint description
  evaluator: string;            // system that evaluates: "@aineff/rams", "@aineff/jal"
  result?: "pass" | "fail" | "pending";
  evaluatedAt?: string;
}
```

## Authority Contract

How RAMS grants and evaluates authority:

```typescript
interface AuthorityGrant {
  grantId: string;
  agentId: string;
  role: string;
  scope: {
    resources: string[];        // what can be accessed
    actions: string[];          // what can be done
    namespaces: string[];       // where (K8s namespaces)
  };
  level: number;                // 0-100 authority level
  decayRate: number;            // percentage decay per day (0-100)
  grantedAt: string;
  expiresAt: string;
  grantedBy: string;           // human or system that granted
  orfEnvelopeId: string;       // ORF binding for this grant
}

interface AuthorityDecision {
  granted: boolean;
  reason: string;
  remainingAuthority: number;   // current level after decay (0-100)
  grant?: AuthorityGrant;
  evaluatedAt: string;
}
```

## Enterprise Genome Contract

The declarative specification for an AINE:

```typescript
interface EnterpriseGenome {
  genomeId: string;
  version: string;

  // Identity
  enterprise: {
    name: string;
    industry: {
      naicsCode: string;
      sicCode?: string;
      description: string;
    };
    jurisdiction: string[];     // ISO 3166-1 country codes
  };

  // Agent team
  agents: AgentSpec[];

  // Governance
  governance: {
    liableOfficer: {
      name: string;
      email: string;
      title: string;
    };
    authorityMatrix: AuthorityGrant[];
    complianceFrameworks: string[];  // "EU_AI_ACT", "ISO_42001", "NIST_AI_RMF"
  };

  // Lifecycle
  lifecycle: {
    maxLifespanDays: number;
    decayThreshold: number;     // authority level that triggers decay phase
    reviewIntervalDays: number;
  };

  // Resources
  resources: {
    cpu: string;                // K8s resource format: "500m", "2"
    memory: string;             // "512Mi", "2Gi"
    storage: string;            // "10Gi"
  };
}

interface AgentSpec {
  agentId: string;
  name: string;
  role: string;                 // "jarvis-ceo" | "specialist"
  skills: string[];             // skill IDs from skill-registry
  model: {
    provider: string;           // "anthropic" | "openai" | "local"
    modelId: string;            // "claude-sonnet-4-20250514" | "gpt-4o"
    fallback?: string;
  };
  resources: {
    cpu: string;
    memory: string;
  };
}
```

## System Health Contract

Every system exposes these endpoints:

```typescript
// GET /healthz — liveness probe
interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;               // seconds
}

// GET /readyz — readiness probe
interface ReadinessResponse {
  ready: boolean;
  checks: {
    name: string;               // "database", "orf-connection", "audit-logger"
    status: "pass" | "fail";
    message?: string;
  }[];
}
```

## Event Type Registry

Every system emits events using this naming convention: `{cluster}.{system}.{action}`

### Cluster 1 — Factory Events
```
factory.ems.enterprise-created
factory.ems.agents-deployed
factory.ems.namespace-ready
factory.egms.group-created
factory.gcs.genome-compiled
factory.gcs.genome-rejected
factory.igs.gate-approved
factory.igs.gate-denied
factory.tis.template-drift-detected
factory.gaagr.enterprise-registered
factory.gaagr.enterprise-deregistered
```

### Cluster 2 — Governance Events
```
governance.rams.role-assigned
governance.rams.role-revoked
governance.rams.authority-confirmed
governance.rams.authority-denied
governance.rams.mandate-created
governance.gbl.boundary-violation
governance.hoes.escalation-triggered
governance.hoes.escalation-resolved
governance.ads.authority-decayed
governance.ads.authority-expired
governance.ndar.delegation-blocked
```

### Cluster 3 — Policy Events
```
policy.pies.policy-ingested
policy.pies.policy-enforced
policy.pies.policy-violated
policy.jal.jurisdiction-evaluated
policy.cvss.term-resolved
policy.midc.drift-detected
```

### Cluster 4 — Audit & Lifecycle Events
```
audit.acts.record-created
audit.acts.trace-completed
audit.acts.integrity-verified
audit.fms.failure-classified
audit.fms.failure-priced
audit.tdes.decay-triggered
audit.tdes.exit-countdown-started
audit.npos.opt-out-requested
audit.ecs.evidence-sealed
audit.mes.death-executed
audit.rps.resurrection-blocked
```

### Cluster 5 — Safeguard Events
```
safeguard.shfs.harm-forecasted
safeguard.shfs.risk-level-changed
safeguard.nlo-r.officer-registered
safeguard.ssdt.snapshot-captured
safeguard.sei.emergency-triggered
safeguard.rrls.rate-limited
```

### Cluster 6 — Intelligence Events
```
intelligence.bpmn.process-started
intelligence.bpmn.task-assigned
intelligence.bpmn.process-completed
intelligence.role-engine.roles-derived
intelligence.acos.team-composed
intelligence.telemetry.metrics-collected
intelligence.revenue-intel.pattern-detected
intelligence.protocol-router.route-resolved
```

### Platform Events
```
platform.orf.constraint-evaluated
platform.orf.obligation-finalized
platform.aine-runtime.aine-started
platform.aine-runtime.aine-stopped
platform.aineg.portfolio-updated
platform.wge.cell-created
platform.wge.cell-reviewed
platform.levelupmax.certification-issued
platform.frankmax.engagement-started
platform.frankmax.assessment-completed
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-03-01 | Initial contracts for AINEFFEvent, ORFEnvelope, AuthorityGrant, EnterpriseGenome, health endpoints, event type registry |
