---
sidebar_position: 1
title: "Role, Authority & Mandate System"
description: "Manages role assignments, authority delegation, and mandate enforcement across AINE instances"
---

# Role, Authority & Mandate System (RAMS)

| Field | Value |
|-------|-------|
| System ID | `aineff-rams` |
| Package | `@aineff/rams` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

RAMS is the authoritative system for defining who can do what within an AINE. It manages
the complete lifecycle of roles (creation, assignment, revocation), authority grants
(scope, duration, conditions), and mandates (required actions with deadlines). Every
action in an AINE is checked against RAMS before execution. It is the runtime backbone
of the ORF (Obligation & Responsibility Framework).

## Standalone Revenue

**$50-150K license** -- role governance SaaS sold to enterprises needing structured
authority management for AI-augmented operations.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Role definition payloads | JSON role descriptors |
| IN | Authority check requests | REST/gRPC queries |
| OUT | Authorization decisions | Boolean + scope metadata |
| OUT | Mandate assignments | Event stream |

## Events Emitted

- `rams.role.assigned` -- role granted to agent or human
- `rams.role.revoked` -- role removed
- `rams.authority.confirmed` -- authority check passed
- `rams.authority.denied` -- authority check failed
- `rams.mandate.created` -- new mandate issued
- `rams.initialized` -- system startup complete
- `rams.heartbeat` -- periodic health signal

## Events Consumed

- `ems.enterprise.created` -- seeds initial role graph for new AINE
- `ads.authority.decayed` -- adjusts grants on decay triggers
- `ndar.delegation.blocked` -- prevents delegation of non-delegable authorities
- `role-engine.roles.derived` -- receives AI-derived role suggestions

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EMS | <-- | Initial role seeding |
| ADS | <-- | Authority decay triggers |
| NDAR | <-- | Non-delegable authority constraints |
| Role Engine | <-- | AI-derived role recommendations |
| GBL | --> | Feeds role changes to governance boundary |
| HOES | --> | Escalates mandate violations |
| ACTS | --> | Logs all authority decisions |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-rams
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: rams
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aineff-rams
  template:
    spec:
      containers:
        - name: rams
          image: ghcr.io/frankmax-com/aineff-rams:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: "2"
              memory: 1Gi
```
