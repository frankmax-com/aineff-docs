---
sidebar_position: 1
title: "Audit & Causal Trace System"
description: "Court-grade audit trail with causal tracing for every action across AINEFF"
---

# Audit & Causal Trace System (ACTS)

| Field | Value |
|-------|-------|
| System ID | `aineff-acts` |
| Package | `@aineff/acts` |
| Cluster | Cluster 4 -- Audit & Death |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

ACTS provides a court-grade, tamper-evident audit trail for every action taken across
AINEFF systems. Beyond simple event logging, it constructs causal traces -- directed
graphs that show exactly which events caused which outcomes, what authority was
exercised, and which humans or agents were involved. These traces are admissible as
evidence in legal proceedings and regulatory investigations.

## Standalone Revenue

**Court-grade audit trail SaaS** -- premium audit infrastructure for enterprises
needing legally admissible traceability for AI-driven operations.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Audit events from all 43 systems | Structured event payloads |
| IN | Causal trace queries | GraphQL API |
| OUT | Immutable audit records | Hash-chained entries |
| OUT | Causal trace graphs | DAG visualization data |

## Events Emitted

- `acts.entry.recorded` -- new audit entry committed
- `acts.trace.completed` -- causal trace graph constructed
- `acts.integrity.verified` -- hash chain validated
- `acts.action.logged` -- individual action recorded
- `acts.initialized` -- system startup complete
- `acts.heartbeat` -- periodic health signal

## Events Consumed

- Events from all 43 systems -- ACTS is a universal consumer
- `ecs.evidence.sealed` -- links evidence custody to audit entries
- `audit-chain.block.committed` -- blockchain anchor for audit entries

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| All 43 systems | <-- | Universal audit event consumer |
| ECS | <--> | Links evidence custody to audit entries |
| Audit Chain | --> | Anchors audit entries to blockchain |
| HCDI | --> | Causal traces feed accountability scoring |
| SSDT | --> | Provides historical context for snapshots |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-acts
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: acts
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: audit-death
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aineff-acts
  template:
    spec:
      containers:
        - name: acts
          image: ghcr.io/frankmax-com/aineff-acts:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "1"
              memory: 1Gi
            limits:
              cpu: "4"
              memory: 4Gi
```
