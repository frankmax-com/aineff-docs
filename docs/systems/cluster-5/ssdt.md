---
sidebar_position: 3
title: "Semantic Snapshot at Decision Time"
description: "Captures the complete semantic context at the moment governance decisions are made"
---

# Semantic Snapshot at Decision Time (SSDT)

| Field | Value |
|-------|-------|
| System ID | `aineff-ssdt` |
| Package | `@aineff/ssdt` |
| Cluster | Cluster 5 -- Safeguards |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

SSDT captures a complete semantic snapshot of the context in which a governance decision
is made. This includes the exact definitions of all terms used, the state of all
referenced policies, the authority graph at that moment, and the data that informed the
decision. SSDT prevents retroactive reinterpretation -- no one can later claim a word
meant something different when the decision was made.

## Standalone Revenue

**Decision context capture** -- tooling for organizations needing point-in-time semantic
records for regulatory compliance, legal defense, or AI audit requirements.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Snapshot trigger events | From HOES/GBL on decisions |
| IN | Semantic context | From CVSS, PIES, RAMS |
| OUT | Frozen semantic snapshots | Signed, immutable bundles |
| OUT | Snapshot retrieval | REST API by decision ID |

## Events Emitted

- `ssdt.snapshot.captured` -- semantic context frozen for decision
- `ssdt.snapshot.verified` -- integrity of snapshot confirmed
- `ssdt.snapshot.requested` -- downstream system needs historical context
- `ssdt.initialized` -- system startup complete
- `ssdt.heartbeat` -- periodic health signal

## Events Consumed

- `hoes.escalation.resolved` -- decision resolution triggers snapshot
- `gbl.policy.enforced` -- governance enforcement captures context
- `cvss.vocabulary.changed` -- current vocabulary for snapshot
- `pies.policy.activated` -- current policies for snapshot

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| HOES | <-- | Decision events trigger snapshots |
| GBL | <-- | Governance decisions trigger snapshots |
| CVSS | <-- | Current vocabulary included in snapshot |
| PIES | <-- | Current policies included in snapshot |
| ECS | --> | Snapshots preserved as evidence |
| SCS | --> | Provides context for semantic closure |
| ACTS | --> | Logs snapshot creation |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-ssdt
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: ssdt
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: safeguards
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-ssdt
  template:
    spec:
      containers:
        - name: ssdt
          image: ghcr.io/frankmax-com/aineff-ssdt:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: "1"
              memory: 1Gi
```
