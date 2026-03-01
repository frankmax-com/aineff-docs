---
sidebar_position: 8
title: "Global AINE & AINEG Registry"
description: "Centralized registry of all AINE and AINEG instances with global ID management"
---

# Global AINE & AINEG Registry (GAAGR)

| Field | Value |
|-------|-------|
| System ID | `aineff-gaagr` |
| Package | `@aineff/gaagr` |
| Cluster | Cluster 1 -- Enterprise Birth |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

GAAGR is the single source of truth for all AINE and AINEG instances across the entire
AINEFF ecosystem. It manages globally unique identifiers, tracks entity lifecycle states
(active, suspended, terminated), maintains metadata indexes, and provides discovery APIs.
Every system that needs to reference an enterprise resolves through GAAGR.

## Standalone Revenue

**Registry subscription** -- per-seat and per-query pricing for registry access.
Premium tiers include real-time change notifications and bulk export capabilities.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Entity registration requests | JSON entity descriptors |
| IN | Lookup/search queries | REST + GraphQL API |
| OUT | Entity records | Structured registry entries |
| OUT | Change notifications | Event stream (SSE/WebSocket) |

## Events Emitted

- `gaagr.entity.registered` -- new AINE or AINEG added to registry
- `gaagr.entity.updated` -- metadata or status changed
- `gaagr.entity.deregistered` -- entity removed (after death protocol)
- `gaagr.id.reserved` -- global ID pre-allocated
- `gaagr.initialized` -- system startup complete
- `gaagr.heartbeat` -- periodic health signal

## Events Consumed

- `ems.enterprise.created` -- registers new AINE
- `egms.portfolio.created` -- registers new AINEG
- `mes.enterprise.terminated` -- marks entity as dead
- `tdes.decay.triggered` -- updates lifecycle state

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EMS | <-- | New AINE registration |
| EGMS | <-- | New AINEG registration |
| MES | <-- | Termination status update |
| TDES | <-- | Decay/exit lifecycle events |
| All systems | --> | Entity resolution lookups |
| ACTS | --> | Registry change audit trail |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-gaagr
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: gaagr
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: enterprise-birth
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aineff-gaagr
  template:
    spec:
      containers:
        - name: gaagr
          image: ghcr.io/frankmax-com/aineff-gaagr:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 500m
              memory: 1Gi
            limits:
              cpu: "2"
              memory: 2Gi
```
