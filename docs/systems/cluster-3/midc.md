---
sidebar_position: 4
title: "Misinterpretation Index & Drift Control"
description: "Detects and quantifies semantic drift across system communications over time"
---

# Misinterpretation Index & Drift Control (MIDC)

| Field | Value |
|-------|-------|
| System ID | `aineff-midc` |
| Package | `@aineff/midc` |
| Cluster | Cluster 3 -- Policy & Semantics |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

MIDC monitors how terms and concepts are actually used across AINEFF systems and
compares usage patterns against canonical definitions in CVSS. Over time, meaning drifts
-- a word starts being used differently by different agents or teams. MIDC quantifies
this drift with a misinterpretation index, identifies the highest-risk divergences, and
triggers vocabulary corrections before miscommunication causes operational failures.

## Standalone Revenue

**Semantic drift detection** -- analytics product for organizations that need to
monitor and control how terminology evolves across large AI agent networks.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | System communication samples | Event payloads to analyze |
| IN | Canonical definitions | From CVSS |
| OUT | Misinterpretation index scores | Numeric per-term scores |
| OUT | Drift alerts | Event stream |

## Events Emitted

- `midc.drift.detected` -- term usage diverges from canonical meaning
- `midc.index.updated` -- misinterpretation scores recalculated
- `midc.correction.recommended` -- vocabulary update suggested
- `midc.initialized` -- system startup complete
- `midc.heartbeat` -- periodic health signal

## Events Consumed

- `cvss.vocabulary.changed` -- recalibrates drift baselines
- `acts.action.logged` -- samples communications for analysis
- `telemetry.metrics.collected` -- usage patterns across systems

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| CVSS | <--> | Reads canonical definitions, suggests updates |
| ACTS | <-- | Samples audit trail for usage analysis |
| Telemetry | <-- | System communication metrics |
| SCS | --> | High-drift terms trigger closure review |
| HOES | --> | Escalates critical misinterpretations |
| ACTS | --> | Logs drift detection events |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-midc
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: midc
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: policy-semantics
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-midc
  template:
    spec:
      containers:
        - name: midc
          image: ghcr.io/frankmax-com/aineff-midc:latest
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
