---
sidebar_position: 3
title: "Time, Decay & Exit System"
description: "Manages enterprise lifecycle including time-based decay and graceful exit procedures"
---

# Time, Decay & Exit System (TDES)

| Field | Value |
|-------|-------|
| System ID | `aineff-tdes` |
| Package | `@aineff/tdes` |
| Cluster | Cluster 4 -- Audit & Death |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

TDES manages the temporal dimension of AINE lifecycle. It enforces time-based
constraints (license expiration, contract end-dates, regulatory sunset clauses),
orchestrates graceful degradation when an AINE approaches end-of-life, and coordinates
the exit procedure that ensures data is exported, obligations are settled, and
resources are released. TDES ensures that enterprises die cleanly when their time comes.

## Standalone Revenue

**Enterprise lifecycle management** -- tooling and consulting for organizations that
need structured wind-down procedures for AI-driven operations.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Lifecycle milestones | Timestamp + condition triggers |
| IN | Exit initiation requests | REST API |
| OUT | Decay notifications | Event stream |
| OUT | Exit orchestration commands | Multi-system coordination |

## Events Emitted

- `tdes.decay.triggered` -- time-based decay milestone reached
- `tdes.exit.initiated` -- graceful exit procedure started
- `tdes.exit.completed` -- enterprise fully wound down
- `tdes.deadline.approaching` -- upcoming lifecycle deadline warning
- `tdes.initialized` -- system startup complete
- `tdes.heartbeat` -- periodic health signal

## Events Consumed

- `fms.failure.classified` -- terminal failures trigger exit consideration
- `gaagr.entity.registered` -- registers lifecycle timers for new entities
- `ads.authority.decayed` -- authority decay may trigger exit

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| FMS | <-- | Terminal failures trigger decay |
| GAAGR | <--> | Registers timers, updates lifecycle state |
| ADS | <-- | Authority decay signals |
| CEFP | --> | Triggers data export before exit |
| NPOS | --> | Coordinates opt-out procedures |
| MES | --> | Hands off to mortality enforcement |
| ACTS | --> | Logs all lifecycle events |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-tdes
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: tdes
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: audit-death
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-tdes
  template:
    spec:
      containers:
        - name: tdes
          image: ghcr.io/frankmax-com/aineff-tdes:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
```
