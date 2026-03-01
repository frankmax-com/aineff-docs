---
sidebar_position: 2
title: "Named Liable Officer Registry"
description: "Tracks which human officer is personally liable for each AINE operation"
---

# Named Liable Officer Registry (NLO-R)

| Field | Value |
|-------|-------|
| System ID | `aineff-nlo-r` |
| Package | `@aineff/nlo-r` |
| Cluster | Cluster 5 -- Safeguards |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

NLO-R maintains a real-time registry mapping every AINE operation to a named human
officer who bears personal liability. It ensures that AI-driven decisions always have a
human who can be held accountable in legal proceedings, regulatory investigations, or
public inquiries. NLO-R prevents the liability gap where "the algorithm did it" is used
to evade responsibility.

## Standalone Revenue

**Liability tracking SaaS** -- subscription product for organizations that need to
maintain auditable liability chains for AI-augmented decision-making.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Officer registration | JSON with identity + scope |
| IN | Liability queries | REST API (who is liable for X?) |
| OUT | Liability assignments | Officer + scope + duration |
| OUT | Coverage gap alerts | Event stream |

## Events Emitted

- `nlo-r.officer.registered` -- new liable officer assigned
- `nlo-r.officer.rotated` -- liability transferred to new officer
- `nlo-r.gap.detected` -- operation without assigned liable officer
- `nlo-r.coverage.verified` -- all operations have assigned officers
- `nlo-r.initialized` -- system startup complete
- `nlo-r.heartbeat` -- periodic health signal

## Events Consumed

- `rams.role.assigned` -- role changes may affect liability assignments
- `ogcrs.ownership.declared` -- ownership changes affect officer mapping
- `hcdi.negligence.detected` -- negligent officers flagged for review

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| RAMS | <-- | Role context for liability mapping |
| OGCRS | <-- | Ownership graph for officer resolution |
| HCDI | <-- | Negligence data affects officer status |
| NDAR | <-- | Non-delegable authorities map to officers |
| HOES | --> | Escalates liability coverage gaps |
| ACTS | --> | Logs all liability assignments |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-nlo-r
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: nlo-r
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: safeguards
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-nlo-r
  template:
    spec:
      containers:
        - name: nlo-r
          image: ghcr.io/frankmax-com/aineff-nlo-r:latest
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
