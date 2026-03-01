---
sidebar_position: 6
title: "Template Integrity System"
description: "Continuous drift detection between live AINEs and their source templates"
---

# Template Integrity System (TIS)

| Field | Value |
|-------|-------|
| System ID | `aineff-tis` |
| Package | `@aineff/tis` |
| Cluster | Cluster 1 -- Enterprise Birth |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The Template Integrity System continuously monitors live AINE instances for drift from
their source genome templates. It compares running configurations against the original
template, detects unauthorized mutations, measures divergence severity, and triggers
remediation workflows. TIS ensures that deployed enterprises remain consistent with
their approved blueprints.

## Standalone Revenue

**Drift detection SaaS** -- subscription-based configuration drift detection for
enterprise customers managing fleets of services or infrastructure.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Live AINE configuration snapshots | K8s API reads |
| IN | Source template references | PDES template IDs |
| OUT | Drift reports | Structured diff objects |
| OUT | Remediation triggers | Event to HOES |

## Events Emitted

- `tis.drift.detected` -- live config diverges from template
- `tis.drift.resolved` -- drift corrected, config re-aligned
- `tis.scan.completed` -- periodic integrity scan finished
- `tis.initialized` -- system startup complete
- `tis.heartbeat` -- periodic health signal

## Events Consumed

- `ems.enterprise.created` -- registers new AINE for monitoring
- `pdes.template.published` -- updates reference template baseline
- `hoes.remediation.completed` -- confirms drift fix applied

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EMS | <-- | New AINEs registered for monitoring |
| PDES | <-- | Template baselines for comparison |
| HOES | --> | Escalates drift for human remediation |
| ACTS | --> | Logs all drift events to audit trail |
| Telemetry | --> | Emits drift frequency metrics |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-tis
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: tis
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: enterprise-birth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-tis
  template:
    spec:
      containers:
        - name: tis
          image: ghcr.io/frankmax-com/aineff-tis:latest
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
