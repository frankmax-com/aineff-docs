---
sidebar_position: 2
title: "Enterprise Group Manufacturing System"
description: "AINEG portfolio creation for multi-enterprise group orchestration"
---

# Enterprise Group Manufacturing System (EGMS)

| Field | Value |
|-------|-------|
| System ID | `aineff-egms` |
| Package | `@aineff/egms` |
| Cluster | Cluster 1 -- Enterprise Birth |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

EGMS creates and manages AINEG (AI-Native Enterprise Group) portfolios -- parent
structures that orchestrate multiple AINE instances under unified governance. It handles
group-level genome composition, cross-enterprise authority delegation, and portfolio-wide
policy propagation. An AINEG is to AINEs what a holding company is to subsidiaries.

## Standalone Revenue

**Portfolio creation fees** -- charged per AINEG instantiation. Scales with the number
of child AINEs, cross-entity governance complexity, and shared resource pools.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Portfolio definition | JSON (AINEG genome) |
| IN | Child AINE references | GAAGR entity IDs |
| OUT | AINEG namespace + governance mesh | Kubernetes API |
| OUT | Portfolio registry entry | GAAGR group event |

## Events Emitted

- `egms.portfolio.created` -- new AINEG instantiated
- `egms.member.added` -- child AINE linked to portfolio
- `egms.governance.propagated` -- group policy pushed to children
- `egms.initialized` -- system startup complete
- `egms.heartbeat` -- periodic health signal

## Events Consumed

- `ems.enterprise.created` -- potential child AINE available
- `gaagr.group.reserved` -- global group ID reserved
- `gbl.policy.updated` -- governance changes to propagate

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EMS | <-- | Receives child AINE creation events |
| GAAGR | <--> | Registers group, resolves membership |
| GBL | --> | Propagates group governance boundaries |
| RAMS | --> | Seeds group-level authority hierarchy |
| OGCRS | --> | Establishes ownership graph |
| Revenue Intel | --> | Reports portfolio revenue metrics |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-egms
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: egms
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: enterprise-birth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-egms
  template:
    spec:
      containers:
        - name: egms
          image: ghcr.io/frankmax-com/aineff-egms:latest
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
