---
sidebar_position: 2
title: "Governance Boundary Layer"
description: "Governance-as-a-Service layer enforcing policy boundaries across enterprise operations"
---

# Governance Boundary Layer (GBL)

| Field | Value |
|-------|-------|
| System ID | `aineff-gbl` |
| Package | `@aineff/gbl` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

GBL is the policy enforcement point that wraps every operational action within an AINE.
It evaluates governance policies in real-time, enforces compliance boundaries, and
prevents operations that would violate organizational or regulatory constraints. GBL
acts as a mesh sidecar pattern -- intercepting and validating actions before they reach
target systems.

## Standalone Revenue

**$50-150K license** -- Governance-as-a-Service for enterprises that need real-time
policy enforcement across distributed AI agent operations.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Policy evaluation requests | gRPC/REST |
| IN | Policy definitions | JSON/OPA Rego rules |
| OUT | Enforcement decisions | Allow/deny + reasoning |
| OUT | Policy violation reports | Structured event |

## Events Emitted

- `gbl.policy.enforced` -- action passed governance check
- `gbl.policy.violated` -- action blocked by governance
- `gbl.policy.updated` -- governance rules changed
- `gbl.initialized` -- system startup complete
- `gbl.heartbeat` -- periodic health signal

## Events Consumed

- `rams.role.assigned` -- updates policy context with role changes
- `pies.policy.ingested` -- receives new compliance policies
- `jal.jurisdiction.updated` -- jurisdiction changes affect boundaries
- `egms.governance.propagated` -- group-level policies inherited

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| RAMS | <-- | Role context for policy evaluation |
| PIES | <-- | Compliance policies to enforce |
| JAL | <-- | Jurisdiction-specific constraints |
| EGMS | <-- | Group governance propagation |
| FBS | --> | Boundary enforcement directives |
| HOES | --> | Escalates governance violations |
| ACTS | --> | Logs all enforcement decisions |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-gbl
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: gbl
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aineff-gbl
  template:
    spec:
      containers:
        - name: gbl
          image: ghcr.io/frankmax-com/aineff-gbl:latest
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
