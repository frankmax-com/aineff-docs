---
sidebar_position: 2
title: "Failure Management System"
description: "Classifies, prices, and manages failures across AINE operations"
---

# Failure Management System (FMS)

| Field | Value |
|-------|-------|
| System ID | `aineff-fms` |
| Package | `@aineff/fms` |
| Cluster | Cluster 4 -- Audit & Death |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

FMS provides a structured approach to failure in AI-driven enterprises. Rather than
treating failures as exceptional events, FMS classifies them (recoverable, degraded,
terminal), quantifies their impact (financial, operational, reputational), prices the
cost of remediation, and routes them to appropriate handlers. It maintains a failure
taxonomy that improves over time as new failure modes are observed.

## Standalone Revenue

**Failure classification API** -- per-query pricing for organizations needing structured
failure analysis and cost quantification for their AI operations.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Failure reports from systems | Structured error payloads |
| IN | Classification queries | REST API |
| OUT | Classified failure records | Severity + impact + cost |
| OUT | Remediation routing events | Event stream |

## Events Emitted

- `fms.failure.classified` -- failure analyzed and categorized
- `fms.remediation.routed` -- failure sent to appropriate handler
- `fms.failure.resolved` -- failure remediated successfully
- `fms.cascade.detected` -- failure cascading across systems
- `fms.initialized` -- system startup complete
- `fms.heartbeat` -- periodic health signal

## Events Consumed

- Error events from all systems -- FMS monitors for failure signals
- `shfs.harm.forecasted` -- predicted failures for proactive handling
- `telemetry.anomaly.detected` -- operational anomalies as failure precursors

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| All systems | <-- | Error and failure signals |
| SHFS | <-- | Forecasted failures for proactive response |
| Telemetry | <-- | Anomaly signals as failure precursors |
| HOES | --> | Escalates critical failures to humans |
| TDES | --> | Terminal failures trigger decay/exit |
| ACTS | --> | Logs all failure events |
| Revenue Intel | --> | Financial impact of failures |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-fms
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: fms
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: audit-death
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-fms
  template:
    spec:
      containers:
        - name: fms
          image: ghcr.io/frankmax-com/aineff-fms:latest
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
