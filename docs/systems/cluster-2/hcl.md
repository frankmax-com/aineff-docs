---
sidebar_position: 6
title: "Human Coordination Ledger"
description: "Immutable record of all human coordination actions within AINE governance"
---

# Human Coordination Ledger (HCL)

| Field | Value |
|-------|-------|
| System ID | `aineff-hcl` |
| Package | `@aineff/hcl` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

HCL maintains an immutable, append-only ledger of all human coordination actions within
AINE governance. It records who communicated with whom, what decisions were jointly made,
which approvals were given, and how authority was exercised in multi-party scenarios. HCL
provides the evidentiary basis for proving that governance was genuinely collaborative
rather than rubber-stamped.

## Standalone Revenue

**Coordination audit SaaS** -- subscription product for organizations that need
auditable records of multi-party decision-making for regulatory compliance.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Coordination events | JSON action records |
| IN | Ledger queries | REST API with time-range filters |
| OUT | Coordination records | Immutable ledger entries |
| OUT | Coordination analytics | Aggregated reports |

## Events Emitted

- `hcl.entry.recorded` -- new coordination action logged
- `hcl.coordination.completed` -- multi-party action finalized
- `hcl.pattern.detected` -- recurring coordination pattern identified
- `hcl.initialized` -- system startup complete
- `hcl.heartbeat` -- periodic health signal

## Events Consumed

- `hoes.escalation.resolved` -- records human resolution actions
- `rams.role.assigned` -- tracks role changes as coordination events
- `ogcrs.ownership.declared` -- ownership changes as coordination events

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| HOES | <-- | Human escalation resolutions |
| RAMS | <-- | Role change coordination records |
| OGCRS | <-- | Ownership change records |
| HCDI | --> | Coordination data for accountability scoring |
| ACTS | --> | Feeds coordination records into audit trail |
| COIE | --> | Coordination patterns for conflict detection |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-hcl
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: hcl
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-hcl
  template:
    spec:
      containers:
        - name: hcl
          image: ghcr.io/frankmax-com/aineff-hcl:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: "1"
              memory: 1Gi
```
