---
sidebar_position: 3
title: "Ownership Graph & Control Resolution"
description: "Maps and resolves ownership hierarchies and control relationships across entities"
---

# Ownership Graph & Control Resolution (OGCRS)

| Field | Value |
|-------|-------|
| System ID | `aineff-ogcrs` |
| Package | `@aineff/ogcrs` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

OGCRS maintains a real-time directed graph of ownership and control relationships
between humans, organizations, AINEs, AINEGs, and agents. When a governance question
arises -- "who ultimately controls this agent?" or "which human is responsible for this
decision?" -- OGCRS resolves the answer by traversing the ownership graph. It detects
circular ownership, identifies beneficial controllers, and flags control gaps.

## Standalone Revenue

**Ownership mapping consulting** -- advisory services and API access for organizations
needing to map complex ownership structures for compliance or risk management.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Ownership declarations | JSON graph edges |
| IN | Control resolution queries | GraphQL API |
| OUT | Resolved controller identity | Entity reference + path |
| OUT | Ownership anomaly alerts | Event stream |

## Events Emitted

- `ogcrs.ownership.declared` -- new ownership edge added
- `ogcrs.control.resolved` -- controller identity determined
- `ogcrs.anomaly.detected` -- circular ownership or control gap found
- `ogcrs.initialized` -- system startup complete
- `ogcrs.heartbeat` -- periodic health signal

## Events Consumed

- `egms.portfolio.created` -- adds AINEG-to-AINE ownership edges
- `rams.role.assigned` -- control edges from role assignments
- `nlo-r.officer.registered` -- maps liable officers to entities

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EGMS | <-- | Portfolio membership edges |
| RAMS | <-- | Role-based control relationships |
| NLO-R | <-- | Liability officer assignments |
| COIE | --> | Ownership data for conflict detection |
| HOES | --> | Escalates unresolvable control gaps |
| ACTS | --> | Logs ownership changes |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-ogcrs
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: ogcrs
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-ogcrs
  template:
    spec:
      containers:
        - name: ogcrs
          image: ghcr.io/frankmax-com/aineff-ogcrs:latest
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
