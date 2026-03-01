---
sidebar_position: 1
title: "Enterprise Manufacturing System"
description: "AINE setup fees, K8s namespace creation, and agent deployment for new enterprises"
---

# Enterprise Manufacturing System (EMS)

| Field | Value |
|-------|-------|
| System ID | `aineff-ems` |
| Package | `@aineff/ems` |
| Cluster | Cluster 1 -- Enterprise Birth |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The Enterprise Manufacturing System is the primary entry point for creating new AINE
(AI-Native Enterprise) instances. It receives a validated enterprise genome, provisions
a dedicated Kubernetes namespace, deploys the initial agent constellation, and wires up
the governance stack. EMS is the system that converts a purchase order into a running
enterprise.

## Standalone Revenue

**$5-50K per enterprise** -- setup fees charged at AINE instantiation time. Pricing
scales with genome complexity, number of initial agents, and jurisdiction requirements.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Enterprise genome payload | JSON (validated by GCS) |
| IN | Payment confirmation | Webhook from billing |
| OUT | K8s namespace + deployed agents | Kubernetes API |
| OUT | Registry entry | GAAGR registration event |

## Events Emitted

- `ems.enterprise.created` -- new AINE namespace provisioned
- `ems.agents.deployed` -- initial agent constellation live
- `ems.namespace.ready` -- K8s namespace passes health checks
- `ems.initialized` -- system startup complete
- `ems.heartbeat` -- periodic health signal

## Events Consumed

- `gcs.genome.validated` -- triggers enterprise creation pipeline
- `igs.gate.passed` -- go/no-go approval received
- `gaagr.id.reserved` -- global ID reserved for new AINE

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| GCS | <-- | Validated genome triggers build |
| IGS | <-- | Gate approval authorizes creation |
| GAAGR | --> | Registers new AINE in global registry |
| RAMS | --> | Seeds initial role/authority graph |
| GBL | --> | Activates governance boundary |
| TIS | --> | Registers template for drift monitoring |
| Telemetry | --> | Emits creation metrics |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-ems
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: ems
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: enterprise-birth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-ems
  template:
    spec:
      containers:
        - name: ems
          image: ghcr.io/frankmax-com/aineff-ems:latest
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
