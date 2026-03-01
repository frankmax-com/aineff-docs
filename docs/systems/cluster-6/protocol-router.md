---
sidebar_position: 4
title: "Protocol Router"
description: "Inter-AINE mesh routing for governed communication between enterprise instances"
---

# Protocol Router

| Field | Value |
|-------|-------|
| System ID | `aineff-protocol-router` |
| Package | `@aineff/protocol-router` |
| Cluster | Cluster 6 -- Intelligence |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The Protocol Router manages communication between AINE instances, between AINEs and
external systems, and between agents within an AINE. It enforces communication
governance -- ensuring that messages are authorized, audited, and routed through
appropriate policy enforcement points. The router implements the AINEFF mesh protocol
that enables multi-enterprise collaboration while maintaining isolation guarantees.

## Standalone Revenue

**PEP licensing** -- Policy Enforcement Point licensing for organizations that need
governed inter-service communication infrastructure.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Routable messages | Protocol buffer payloads |
| IN | Routing rules | JSON route definitions |
| OUT | Routed messages | Delivered to target systems |
| OUT | Routing analytics | Throughput + latency metrics |

## Events Emitted

- `protocol-router.message.routed` -- message delivered successfully
- `protocol-router.message.blocked` -- message blocked by policy
- `protocol-router.route.updated` -- routing rules changed
- `protocol-router.initialized` -- system startup complete
- `protocol-router.heartbeat` -- periodic health signal

## Events Consumed

- `fbs.boundary.enforced` -- boundary rules affect routing
- `gbl.policy.updated` -- governance policies constrain routing
- `gaagr.entity.registered` -- new entities added to routing mesh

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| FBS | <-- | Boundary enforcement rules |
| GBL | <-- | Governance policies for routing decisions |
| GAAGR | <-- | Entity registry for route resolution |
| Telemetry | --> | Routing metrics and throughput data |
| ACTS | --> | Logs all inter-AINE communications |
| ACOS | <--> | Agent orchestration uses router for messaging |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-protocol-router
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: protocol-router
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: intelligence
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aineff-protocol-router
  template:
    spec:
      containers:
        - name: protocol-router
          image: ghcr.io/frankmax-com/aineff-protocol-router:latest
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
