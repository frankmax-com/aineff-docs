---
sidebar_position: 5
title: "Instantiation Gate System"
description: "Go/no-go gate controlling enterprise instantiation with multi-factor approval"
---

# Instantiation Gate System (IGS)

| Field | Value |
|-------|-------|
| System ID | `aineff-igs` |
| Package | `@aineff/igs` |
| Cluster | Cluster 1 -- Enterprise Birth |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The Instantiation Gate System is the final go/no-go checkpoint before an enterprise
genome is instantiated into a live AINE. It aggregates signals from genome validation,
governance approval, payment confirmation, jurisdiction clearance, and resource
availability into a single gate decision. IGS prevents premature or unauthorized
enterprise creation.

## Standalone Revenue

**Gate-as-a-service** -- licensable decision-gate infrastructure for organizations
that need multi-factor approval workflows beyond AINEFF enterprise creation.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Gate check requests | JSON with signal references |
| IN | Approval signals | Signed attestations |
| OUT | Gate decision (pass/block) | Event + REST response |
| OUT | Gate audit record | Immutable log entry |

## Events Emitted

- `igs.gate.passed` -- all signals green, enterprise creation authorized
- `igs.gate.blocked` -- one or more signals failed, creation denied
- `igs.signal.received` -- individual approval signal logged
- `igs.initialized` -- system startup complete
- `igs.heartbeat` -- periodic health signal

## Events Consumed

- `gcs.genome.validated` -- genome validation signal
- `rams.authority.confirmed` -- authority check signal
- `jal.jurisdiction.cleared` -- jurisdiction clearance signal
- `rrls.rate.approved` -- expansion rate-limit check

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| GCS | <-- | Genome validation signal |
| RAMS | <-- | Authority approval signal |
| JAL | <-- | Jurisdiction clearance |
| RRLS | <-- | Rate-limit approval |
| EMS | --> | Authorizes enterprise creation |
| ACTS | --> | Logs gate decision for audit |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-igs
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: igs
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: enterprise-birth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-igs
  template:
    spec:
      containers:
        - name: igs
          image: ghcr.io/frankmax-com/aineff-igs:latest
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
