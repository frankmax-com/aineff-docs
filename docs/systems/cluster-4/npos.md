---
sidebar_position: 4
title: "Non-Participation & Opt-Out System"
description: "Manages clean exit protocols for entities choosing to leave the AINEFF ecosystem"
---

# Non-Participation & Opt-Out System (NPOS)

| Field | Value |
|-------|-------|
| System ID | `aineff-npos` |
| Package | `@aineff/npos` |
| Cluster | Cluster 4 -- Audit & Death |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

NPOS guarantees the right to leave. It manages clean exit protocols for any entity --
human, organization, or AINE -- that chooses to withdraw from the AINEFF ecosystem. It
ensures data portability, obligation settlement, dependency notification, and verifiable
proof that all traces have been properly handled. NPOS prevents vendor lock-in at the
protocol level.

## Standalone Revenue

**Clean exit protocol SaaS** -- tooling for organizations that need structured
de-provisioning and data portability when leaving AI platforms or service providers.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Opt-out requests | REST API with entity ID |
| IN | Obligation settlement confirmations | Event stream |
| OUT | Exit checklists | Structured task lists |
| OUT | Departure certificates | Signed attestation |

## Events Emitted

- `npos.optout.requested` -- entity initiated withdrawal
- `npos.obligations.settled` -- all obligations fulfilled or transferred
- `npos.data.exported` -- portable data package delivered
- `npos.exit.certified` -- clean exit verified and certified
- `npos.initialized` -- system startup complete
- `npos.heartbeat` -- periodic health signal

## Events Consumed

- `tdes.exit.initiated` -- lifecycle-triggered exits feed into NPOS
- `cefp.export.completed` -- data export confirmation
- `ecs.evidence.released` -- evidence custody transfer complete

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| TDES | <-- | Exit triggers from lifecycle management |
| CEFP | <--> | Coordinates data export |
| ECS | <-- | Evidence release confirmations |
| GAAGR | --> | Deregisters entity from global registry |
| MES | --> | Coordinates with mortality enforcement |
| ACTS | --> | Logs complete exit audit trail |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-npos
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: npos
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: audit-death
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-npos
  template:
    spec:
      containers:
        - name: npos
          image: ghcr.io/frankmax-com/aineff-npos:latest
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
