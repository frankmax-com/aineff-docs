---
sidebar_position: 4
title: "Canonical Export & Fork Protocol"
description: "Data portability API enabling full enterprise export and controlled forking"
---

# Canonical Export & Fork Protocol (CEFP)

| Field | Value |
|-------|-------|
| System ID | `aineff-cefp` |
| Package | `@aineff/cefp` |
| Cluster | Cluster 5 -- Safeguards |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

CEFP guarantees data portability and prevents vendor lock-in at the deepest level. It
provides a canonical export format for complete AINE state -- genome, configuration,
data, audit trail, and governance structures. CEFP also supports controlled forking,
where an AINE can be cloned into a new instance with proper governance, licensing, and
audit trail inheritance. It ensures customers always own their enterprise data.

## Standalone Revenue

**Data portability API** -- per-export pricing and subscription plans for organizations
needing regular data exports or migration support.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Export requests | REST API with scope + format |
| IN | Fork requests | JSON with source + modifications |
| OUT | Export packages | Canonical archive format |
| OUT | Fork instances | New AINE via EMS pipeline |

## Events Emitted

- `cefp.export.started` -- export process initiated
- `cefp.export.completed` -- export package ready for download
- `cefp.fork.created` -- new AINE forked from existing
- `cefp.portability.verified` -- export package validated for completeness
- `cefp.initialized` -- system startup complete
- `cefp.heartbeat` -- periodic health signal

## Events Consumed

- `npos.optout.requested` -- opt-out triggers mandatory export
- `tdes.exit.initiated` -- exit triggers final export
- `gaagr.entity.registered` -- registers exported/forked entities

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| NPOS | <-- | Opt-out triggers export |
| TDES | <-- | Exit triggers final export |
| EMS | --> | Forked AINEs go through creation pipeline |
| GCS | --> | Fork genomes validated before instantiation |
| ACTS | --> | Logs all export and fork events |
| GAAGR | --> | Registers forked entities |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-cefp
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: cefp
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: safeguards
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-cefp
  template:
    spec:
      containers:
        - name: cefp
          image: ghcr.io/frankmax-com/aineff-cefp:latest
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
