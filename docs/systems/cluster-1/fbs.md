---
sidebar_position: 7
title: "Factory Boundary System"
description: "Enforcement of operational boundaries between AINE instances and external systems"
---

# Factory Boundary System (FBS)

| Field | Value |
|-------|-------|
| System ID | `aineff-fbs` |
| Package | `@aineff/fbs` |
| Cluster | Cluster 1 -- Enterprise Birth |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The Factory Boundary System enforces hard operational boundaries between AINE instances,
between AINEs and external systems, and between AINEFF infrastructure and customer
workloads. It manages network policies, API gateway rules, data isolation guarantees,
and cross-boundary communication protocols. FBS ensures that enterprise isolation is
never accidentally violated.

## Standalone Revenue

**Boundary enforcement consulting** -- advisory and implementation services for
organizations that need verifiable isolation between autonomous systems or tenants.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Boundary policy definitions | JSON policy documents |
| IN | Cross-boundary requests | Proxied API calls |
| OUT | NetworkPolicy objects | Kubernetes CRDs |
| OUT | Boundary violation alerts | Event stream |

## Events Emitted

- `fbs.boundary.enforced` -- boundary policy applied successfully
- `fbs.violation.detected` -- unauthorized cross-boundary access attempted
- `fbs.policy.updated` -- boundary rules changed
- `fbs.initialized` -- system startup complete
- `fbs.heartbeat` -- periodic health signal

## Events Consumed

- `ems.namespace.ready` -- configures boundaries for new AINE
- `egms.portfolio.created` -- sets up inter-AINE boundaries within group
- `gbl.policy.updated` -- governance changes affect boundary rules

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EMS | <-- | New namespace triggers boundary setup |
| EGMS | <-- | Group creation defines inter-AINE rules |
| GBL | <-- | Governance policy constrains boundaries |
| ACTS | --> | Logs boundary violations to audit trail |
| HOES | --> | Escalates critical violations to humans |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-fbs
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: fbs
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: enterprise-birth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-fbs
  template:
    spec:
      containers:
        - name: fbs
          image: ghcr.io/frankmax-com/aineff-fbs:latest
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
