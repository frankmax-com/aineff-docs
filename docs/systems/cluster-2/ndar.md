---
sidebar_position: 9
title: "Non-Delegable Authority Registry"
description: "Maintains the registry of authorities that cannot be delegated to AI agents"
---

# Non-Delegable Authority Registry (NDAR)

| Field | Value |
|-------|-------|
| System ID | `aineff-ndar` |
| Package | `@aineff/ndar` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

NDAR maintains the definitive list of authorities that must remain with human actors
and cannot be delegated to AI agents under any circumstances. These include legally
mandated responsibilities (fiduciary duties, regulatory sign-offs), ethically critical
decisions (termination, safety overrides), and organizationally reserved powers. NDAR
enforces these constraints at the RAMS level, preventing even well-intentioned
delegation attempts.

## Standalone Revenue

**Compliance authority tracking** -- regulatory compliance product for organizations
that need to prove certain decisions are always made by qualified humans.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Authority classification rules | JSON rule definitions |
| IN | Delegation attempt checks | gRPC from RAMS |
| OUT | Delegation decisions | Allow/block + legal basis |
| OUT | Non-delegable authority catalog | REST API |

## Events Emitted

- `ndar.delegation.blocked` -- attempted delegation of non-delegable authority
- `ndar.registry.updated` -- non-delegable list changed
- `ndar.compliance.verified` -- periodic check confirms no violations
- `ndar.initialized` -- system startup complete
- `ndar.heartbeat` -- periodic health signal

## Events Consumed

- `rams.role.assigned` -- checks if role includes non-delegable authorities
- `jal.jurisdiction.updated` -- jurisdiction changes may add new non-delegable items
- `pies.policy.ingested` -- new policies may define non-delegable authorities

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| RAMS | <--> | Checks delegation, blocks when non-delegable |
| JAL | <-- | Jurisdiction-specific non-delegable rules |
| PIES | <-- | Policy-defined non-delegable authorities |
| HOES | --> | Escalates blocked delegation attempts |
| ACTS | --> | Logs all delegation decisions |
| NLO-R | --> | Maps non-delegable authorities to liable officers |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-ndar
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: ndar
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-ndar
  template:
    spec:
      containers:
        - name: ndar
          image: ghcr.io/frankmax-com/aineff-ndar:latest
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
