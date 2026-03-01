---
sidebar_position: 2
title: "Role Derivation Engine"
description: "AI-powered role intelligence that derives optimal role structures from enterprise context"
---

# Role Derivation Engine

| Field | Value |
|-------|-------|
| System ID | `aineff-role-engine` |
| Package | `@aineff/role-engine` |
| Cluster | Cluster 6 -- Intelligence |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The Role Derivation Engine uses AI to analyze enterprise context -- industry, scale,
regulatory environment, operational patterns -- and derives optimal role structures.
Rather than manually defining every role, the engine suggests role hierarchies, authority
scopes, and mandate assignments that match the enterprise's actual needs. It continuously
refines recommendations as the enterprise operates and evolves.

## Standalone Revenue

**Role Intelligence API** -- per-query and subscription pricing for organizations
needing AI-assisted organizational role design and optimization.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Enterprise context | Genome + operational data |
| IN | Role optimization queries | REST API |
| OUT | Derived role structures | JSON role graphs |
| OUT | Role recommendations | Suggested changes |

## Events Emitted

- `role-engine.roles.derived` -- new role structure recommended
- `role-engine.optimization.completed` -- role graph optimized
- `role-engine.anomaly.detected` -- unusual role pattern identified
- `role-engine.initialized` -- system startup complete
- `role-engine.heartbeat` -- periodic health signal

## Events Consumed

- `rams.role.assigned` -- current role state for optimization
- `industry-intel.benchmark.updated` -- industry role benchmarks
- `telemetry.metrics.collected` -- operational patterns inform role design
- `hcdi.accountability.scored` -- accountability data refines role structures

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| RAMS | <--> | Reads current roles, recommends changes |
| Industry Intel | <-- | Industry benchmarks for role design |
| Telemetry | <-- | Operational patterns inform optimization |
| HCDI | <-- | Accountability data refines structures |
| HOES | --> | Recommends role changes for human approval |
| ACTS | --> | Logs all role derivation decisions |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-role-engine
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: role-engine
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: intelligence
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-role-engine
  template:
    spec:
      containers:
        - name: role-engine
          image: ghcr.io/frankmax-com/aineff-role-engine:latest
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
