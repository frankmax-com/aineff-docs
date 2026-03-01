---
sidebar_position: 2
title: "Jurisdiction Adapter Layer"
description: "Multi-jurisdiction compliance API mapping geography to executable constraints"
---

# Jurisdiction Adapter Layer (JAL)

| Field | Value |
|-------|-------|
| System ID | `aineff-jal` |
| Package | `@aineff/jal` |
| Cluster | Cluster 3 -- Policy & Semantics |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

JAL translates geographic and political jurisdictions into concrete operational
constraints. When an AINE operates across multiple jurisdictions (EU GDPR, US CCPA,
Singapore PDPA), JAL resolves which regulations apply, identifies conflicting
requirements, computes the most restrictive common denominator, and outputs executable
constraint sets that other systems can enforce. It maintains a continuously updated
database of jurisdiction-specific rules.

## Standalone Revenue

**Multi-jurisdiction compliance API** -- per-query and subscription pricing for
organizations operating across regulatory boundaries.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Geographic scope declarations | ISO country/region codes |
| IN | Jurisdiction rule updates | Structured regulatory feeds |
| OUT | Compiled constraint sets | JSON constraint objects |
| OUT | Jurisdiction change alerts | Event stream |

## Events Emitted

- `jal.jurisdiction.updated` -- jurisdiction rules changed
- `jal.jurisdiction.cleared` -- entity cleared for jurisdiction
- `jal.conflict.resolved` -- cross-jurisdiction conflict resolved
- `jal.initialized` -- system startup complete
- `jal.heartbeat` -- periodic health signal

## Events Consumed

- `gaagr.entity.registered` -- determines jurisdiction for new entities
- `ems.enterprise.created` -- resolves jurisdiction for new AINE
- `sei.override.activated` -- sovereign emergency changes jurisdiction rules

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| GAAGR | <-- | Entity registration triggers jurisdiction lookup |
| SEI | <-- | Sovereign overrides modify jurisdictions |
| PIES | --> | Jurisdiction context for policy selection |
| GCS | --> | Jurisdiction constraints for genome validation |
| GBL | --> | Jurisdiction rules feed governance boundaries |
| NDAR | --> | Jurisdiction-specific non-delegable items |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-jal
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: jal
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: policy-semantics
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-jal
  template:
    spec:
      containers:
        - name: jal
          image: ghcr.io/frankmax-com/aineff-jal:latest
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
