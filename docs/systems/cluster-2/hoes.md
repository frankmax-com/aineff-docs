---
sidebar_position: 4
title: "Human Oversight & Escalation System"
description: "Routes critical decisions and violations to designated human reviewers"
---

# Human Oversight & Escalation System (HOES)

| Field | Value |
|-------|-------|
| System ID | `aineff-hoes` |
| Package | `@aineff/hoes` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

HOES ensures that human oversight remains meaningful in AI-driven enterprises. It
manages escalation workflows that route decisions, violations, and anomalies to the
appropriate human reviewers based on severity, domain, and authority. HOES enforces
response SLAs, tracks acknowledgment, and prevents escalation fatigue through
intelligent routing and batching.

## Standalone Revenue

**Escalation workflow SaaS** -- standalone product for organizations needing structured
human-in-the-loop workflows for AI agent oversight.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Escalation requests | JSON with severity + context |
| IN | Human responses | REST API / UI submission |
| OUT | Routing decisions | Notification events |
| OUT | SLA breach alerts | Event stream |

## Events Emitted

- `hoes.escalation.created` -- new item requiring human review
- `hoes.escalation.acknowledged` -- human has seen the item
- `hoes.escalation.resolved` -- human decision recorded
- `hoes.sla.breached` -- response deadline exceeded
- `hoes.initialized` -- system startup complete
- `hoes.heartbeat` -- periodic health signal

## Events Consumed

- `gbl.policy.violated` -- governance violations needing human review
- `tis.drift.detected` -- template drift requiring remediation approval
- `fbs.violation.detected` -- boundary violations for investigation
- `shfs.harm.forecasted` -- predicted harm requiring human judgment

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| GBL | <-- | Policy violations escalated |
| TIS | <-- | Drift alerts escalated |
| FBS | <-- | Boundary violations escalated |
| SHFS | <-- | Harm forecasts escalated |
| RAMS | --> | Human decisions update authority graph |
| HCDI | --> | Tracks human accountability for decisions |
| ACTS | --> | Logs all escalation outcomes |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-hoes
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: hoes
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-hoes
  template:
    spec:
      containers:
        - name: hoes
          image: ghcr.io/frankmax-com/aineff-hoes:latest
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
