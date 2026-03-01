---
sidebar_position: 2
title: "ORF Protocol"
description: "Obligation & Responsibility Finality --- the atomic constraint enforcement protocol that binds who is obligated, who is responsible, and where reversal becomes impossible."
---

# ORF Protocol

**Obligation & Responsibility Finality** is the foundational protocol layer of AINEFF. Every action in the system binds three things: who is **obligated**, who is **responsible**, and the point at which **reversal becomes impossible**. ORF is not a governance layer that can be overridden --- it is an atomic constraint enforcement protocol.

## System Identity

| Field | Value |
|-------|-------|
| System ID | `aineff-orf` |
| Package | `@aineff/orf` |
| Cluster | Platform |
| Protocol Layer | Layer 3 (ORF) |
| Revenue | Protocol licensing per enterprise |
| Repository | `aineff-orf` |

## Core Concepts

### The ORF Triple

Every action in an AINEFF-governed system produces an ORF binding:

```
ORF Binding = (Obligor, Responsible Party, Finality Point)
```

| Component | Definition | Example |
|-----------|-----------|---------|
| **Obligor** | The entity that must perform | Agent pod executing a venture cell task |
| **Responsible Party** | The entity accountable for outcomes | Human operator who authorized the action |
| **Finality Point** | The moment reversal is no longer possible | Transaction committed, contract signed, deployment live |

### Finality States

```
  Proposed → Accepted → Executing → Final
     │          │           │          │
     │          │           │          └── Irreversible. Audit locked.
     │          │           └── Can be halted. Rollback possible.
     │          └── Can be rejected. No obligation created.
     └── Draft. No binding exists.
```

Once an action reaches the **Final** state, no system --- including AINEG, AINE Runtime, or any human operator --- can reverse it. The obligation is permanently bound and the audit trail is immutable.

### Constraint Types

ORF enforces four categories of constraints:

| Constraint | Enforcement | Example |
|-----------|-------------|---------|
| **Authority** | Who is permitted to initiate | Only Level 3+ operators can approve >$10K |
| **Obligation** | What must happen as a result | If venture cell is created, billing must be initialized |
| **Temporal** | When actions must complete | SLA: governance check must complete within 500ms |
| **Finality** | When reversal becomes impossible | After 3 confirmations, deployment cannot be rolled back |

## Architecture

### Protocol Stack Position

```
Layer 5: Telemetry
Layer 4: Enterprise Logic (AINE Runtime, WGE, AINEG)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layer 3: ORF Protocol  ◄── THIS LAYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layer 2: Governance & Audit
Layer 1: Infrastructure
```

ORF sits between governance infrastructure and enterprise logic. Every Layer 4 operation **must** pass through ORF constraint evaluation before execution.

### Policy Enforcement Points (PEP)

ORF deploys PEPs as sidecar containers in Kubernetes. Every request between systems passes through a PEP:

```
  ┌─────────┐     ┌─────┐     ┌─────────────┐
  │  AINE   │────>│ PEP │────>│  Target      │
  │ Runtime │     │(ORF)│     │  System      │
  └─────────┘     └──┬──┘     └─────────────┘
                     │
               ┌─────v─────┐
               │  Audit     │
               │  Logger    │
               └───────────┘
```

### Obligation Lifecycle

```typescript
interface ObligationBinding {
  id: string;
  obligorId: string;          // Who must perform
  responsiblePartyId: string; // Who is accountable
  constraint: ORFConstraint;
  state: 'proposed' | 'accepted' | 'executing' | 'final' | 'violated';
  finalityConditions: FinalityCondition[];
  createdAt: Date;
  finalizedAt: Date | null;
  auditTrailId: string;
}

interface FinalityCondition {
  type: 'confirmation-count' | 'time-elapsed' | 'external-signal';
  threshold: number | string;
  met: boolean;
}
```

## Configuration

```typescript
interface ORFConfig {
  systemId: string;
  version: string;
  enabled: boolean;

  // Constraint evaluation settings
  constraints: {
    maxEvaluationTimeMs: number;   // Default: 500
    failOpen: boolean;             // Default: false (fail closed)
    cachePolicy: 'none' | 'ttl';  // Default: 'ttl'
    cacheTtlMs: number;           // Default: 60000
  };

  // Finality settings
  finality: {
    confirmationCount: number;     // Default: 3
    graceWindowMs: number;         // Default: 30000
    auditRetentionDays: number;    // Default: 2555 (7 years)
  };

  // PEP network
  pep: {
    mode: 'sidecar' | 'gateway' | 'embedded';
    networkPolicy: 'strict' | 'permissive';
  };
}
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `aineff-orf.initialized` | `{ version, config }` | System startup complete |
| `aineff-orf.heartbeat` | `{ uptimeMs, obligationsActive }` | Every 30s health signal |
| `aineff-orf.obligation.created` | `{ binding }` | New obligation binding proposed |
| `aineff-orf.obligation.accepted` | `{ bindingId, obligorId }` | Obligation accepted by obligor |
| `aineff-orf.obligation.finalized` | `{ bindingId, auditTrailId }` | Obligation reached finality |
| `aineff-orf.obligation.violated` | `{ bindingId, violation }` | Obligation was violated |
| `aineff-orf.constraint.evaluated` | `{ constraintId, result, durationMs }` | Constraint check completed |
| `aineff-orf.pep.denied` | `{ requestId, reason }` | PEP denied a request |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `aineff-aine-runtime.agent.action` | AINE Runtime | Evaluate constraints for agent action |
| `aineff-wge.cell.created` | WGE | Create obligation bindings for new venture cell |
| `aineff-acts.audit.sealed` | ACTS | Confirm finality for audit-sealed operations |
| `aineff-rams.authority.changed` | RAMS | Update authority matrix for constraint evaluation |

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| AINE Runtime | Bidirectional | Constraint evaluation requests / enforcement results |
| AINEG Coordinator | Bidirectional | Portfolio-level constraint propagation |
| WGE | Inbound | Venture cell obligation creation |
| ACTS (Audit Chain) | Outbound | Finality confirmation signals |
| RAMS (Authority) | Inbound | Authority matrix updates |
| Telemetry | Outbound | Constraint evaluation metrics |

## SDK Usage

The `@aineff/orf-sdk` package provides client-side ORF integration:

```typescript
import { ORFClient, createObligationBinding } from '@aineff/orf-sdk';

// Initialize ORF client
const orf = new ORFClient({
  endpoint: 'https://orf.aine-runtime.local',
  systemId: 'my-service',
});

// Create an obligation binding
const binding = await orf.createBinding({
  obligor: 'agent-pod-7a3f',
  responsibleParty: 'operator-jane-doe',
  action: 'deploy-production-v2.3',
  constraints: [
    { type: 'authority', level: 3 },
    { type: 'temporal', maxDurationMs: 300000 },
  ],
  finalityConditions: [
    { type: 'confirmation-count', threshold: 3 },
  ],
});

// Check constraint before action
const result = await orf.evaluateConstraint({
  action: 'approve-expenditure',
  actor: 'operator-jane-doe',
  context: { amount: 15000, currency: 'USD' },
});

if (result.permitted) {
  // Proceed with action
} else {
  // result.denialReason contains the specific constraint that blocked
}
```

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | ORF protocol licensing per enterprise. Enterprises license the right to use ORF constraint enforcement in their own systems. |
| **Composed** | Every AINE Runtime instance requires ORF. Every WGE venture cell creates ORF bindings. Every AINEG portfolio coordination passes through ORF. Compound multiplier: each new platform deployment increases ORF licensing value. |

## Deployment

```yaml
# Helm values for ORF Protocol
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orf-protocol
  namespace: aineff-platform
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: orf-protocol
          image: aineff/orf-protocol:latest
          ports:
            - containerPort: 8080
              name: grpc
            - containerPort: 9090
              name: metrics
          env:
            - name: ORF_FINALITY_CONFIRMATIONS
              value: "3"
            - name: ORF_PEP_MODE
              value: "sidecar"
            - name: ORF_FAIL_OPEN
              value: "false"
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 1000m
              memory: 512Mi
```

## Key Design Principle

ORF is **fail-closed by default**. If the ORF system is unreachable, no actions proceed. This is intentional: in a system where obligations have legal and financial consequences, it is always safer to halt than to allow unaccountable actions.
