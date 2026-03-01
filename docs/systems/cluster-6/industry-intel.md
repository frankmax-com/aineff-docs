---
sidebar_position: 3
title: "Industry Intelligence"
description: "Industry data product providing sector analysis, benchmarks, and risk signals"
---

# Industry Intelligence

| Field | Value |
|-------|-------|
| System ID | `aineff-industry-intel` |
| Package | `@aineff/industry-intel` |
| Cluster | Cluster 6 -- Intelligence |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

Industry Intelligence aggregates, analyzes, and distributes sector-specific knowledge
across the AINEFF ecosystem. It maintains industry taxonomies, competitive benchmarks,
regulatory landscapes, and risk profiles for every sector in which AINEs operate. This
intelligence enriches genome templates, informs role derivation, feeds risk forecasting,
and enables AINEs to operate with sector-aware context.

## Standalone Revenue

**Industry data product** -- subscription pricing for sector analysis reports,
benchmark APIs, and risk intelligence feeds.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | External data feeds | APIs, RSS, structured data |
| IN | AINE operational telemetry | Aggregated metrics |
| OUT | Sector analysis reports | JSON/PDF |
| OUT | Risk signals and benchmarks | Event stream + REST API |

## Events Emitted

- `industry-intel.benchmark.updated` -- new benchmark data available
- `industry-intel.risk.updated` -- sector risk profile changed
- `industry-intel.taxonomy.updated` -- industry vocabulary updated
- `industry-intel.initialized` -- system startup complete
- `industry-intel.heartbeat` -- periodic health signal

## Events Consumed

- `telemetry.metrics.collected` -- operational data from AINEs
- `gaagr.entity.registered` -- new AINEs expand sector coverage
- `fms.failure.classified` -- sector-specific failure patterns

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| Telemetry | <-- | Operational data across sectors |
| GAAGR | <-- | Entity registry for sector mapping |
| FMS | <-- | Failure data enriches risk profiles |
| PDES | --> | Enriches templates with sector intelligence |
| Role Engine | --> | Industry benchmarks for role design |
| SHFS | --> | Sector risk signals for harm forecasting |
| CVSS | --> | Industry taxonomy feeds vocabulary |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-industry-intel
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: industry-intel
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: intelligence
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-industry-intel
  template:
    spec:
      containers:
        - name: industry-intel
          image: ghcr.io/frankmax-com/aineff-industry-intel:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 500m
              memory: 1Gi
            limits:
              cpu: "2"
              memory: 2Gi
```
