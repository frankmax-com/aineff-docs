---
sidebar_position: 8
title: "Authority Decay System"
description: "Automatically degrades authority grants that are not actively exercised or renewed"
---

# Authority Decay System (ADS)

| Field | Value |
|-------|-------|
| System ID | `aineff-ads` |
| Package | `@aineff/ads` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

ADS prevents authority accumulation by enforcing time-based decay on all authority
grants. Every authority has a half-life: if not actively exercised, renewed, or
explicitly extended, it degrades and eventually expires. This ensures that stale
permissions do not persist, that departed personnel lose access naturally, and that
the principle of least privilege is maintained over time without manual cleanup.

## Standalone Revenue

**Authority lifecycle management** -- SaaS product for enterprises needing automatic
permission hygiene, especially in regulated industries where stale access is a compliance
risk.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Authority grant records | From RAMS |
| IN | Activity signals | Usage events from audit trail |
| OUT | Decay notifications | Warning before expiration |
| OUT | Revocation triggers | Events to RAMS |

## Events Emitted

- `ads.authority.decaying` -- authority nearing expiration threshold
- `ads.authority.decayed` -- authority dropped below minimum level
- `ads.authority.renewed` -- decay timer reset by active use
- `ads.initialized` -- system startup complete
- `ads.heartbeat` -- periodic health signal

## Events Consumed

- `rams.role.assigned` -- starts decay timer on new grants
- `acts.action.logged` -- activity resets decay counters
- `hcdi.negligence.detected` -- accelerates decay for negligent actors

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| RAMS | <-- | Authority grants to track |
| ACTS | <-- | Activity signals for renewal |
| HCDI | <-- | Negligence accelerates decay |
| RAMS | --> | Revocation triggers |
| HOES | --> | Warns humans before authority expires |
| ACTS | --> | Logs all decay events |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-ads
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: ads
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-ads
  template:
    spec:
      containers:
        - name: ads
          image: ghcr.io/frankmax-com/aineff-ads:latest
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
