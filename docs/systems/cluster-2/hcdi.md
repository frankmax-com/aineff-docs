---
sidebar_position: 5
title: "Human Collective Discipline Infrastructure"
description: "Tracks and enforces human accountability across AINE governance decisions"
---

# Human Collective Discipline Infrastructure (HCDI)

| Field | Value |
|-------|-------|
| System ID | `aineff-hcdi` |
| Package | `@aineff/hcdi` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

HCDI ensures that humans involved in AINE governance are held accountable for their
decisions and actions. It tracks decision history, measures response quality, identifies
patterns of negligence or bias, and enforces consequences for governance failures. HCDI
prevents the diffusion of responsibility that occurs when humans delegate to AI systems
without maintaining genuine oversight.

## Standalone Revenue

**Accountability platform** -- SaaS product for organizations needing structured
accountability tracking for human participants in AI-augmented decision-making.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Decision records | JSON from HOES resolution |
| IN | Accountability queries | REST API |
| OUT | Accountability scores | Numeric + breakdown |
| OUT | Discipline triggers | Event stream |

## Events Emitted

- `hcdi.accountability.scored` -- human decision quality assessed
- `hcdi.negligence.detected` -- pattern of poor oversight identified
- `hcdi.discipline.triggered` -- accountability action initiated
- `hcdi.initialized` -- system startup complete
- `hcdi.heartbeat` -- periodic health signal

## Events Consumed

- `hoes.escalation.resolved` -- human decisions to score
- `hoes.sla.breached` -- missed deadlines affect accountability
- `rams.role.assigned` -- tracks who holds which governance roles
- `acts.trace.completed` -- causal traces inform accountability

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| HOES | <-- | Human decision records |
| RAMS | <-- | Role context for accountability |
| ACTS | <-- | Causal traces for decision impact |
| ADS | --> | Poor scores accelerate authority decay |
| NLO-R | --> | Accountability data for liability records |
| ACTS | --> | Logs discipline actions |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-hcdi
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: hcdi
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-hcdi
  template:
    spec:
      containers:
        - name: hcdi
          image: ghcr.io/frankmax-com/aineff-hcdi:latest
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
