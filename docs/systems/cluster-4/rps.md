---
sidebar_position: 6
title: "Resurrection Prevention System"
description: "Prevents terminated AINE instances from being reactivated outside proper channels"
---

# Resurrection Prevention System (RPS)

| Field | Value |
|-------|-------|
| System ID | `aineff-rps` |
| Package | `@aineff/rps` |
| Cluster | Cluster 4 -- Audit & Death |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

RPS ensures that terminated AINE instances cannot be resurrected, cloned, or
reconstituted outside of proper creation channels. When an enterprise is terminated by
MES, RPS cryptographically tombstones its genome, revokes all credentials, poisons
cached configurations, and monitors for resurrection attempts. It prevents the dangerous
scenario where a terminated enterprise's state is used to bootstrap an uncontrolled copy.

## Standalone Revenue

**Anti-revival enforcement** -- compliance product for regulated industries that need
to prove terminated AI systems cannot be covertly restored.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Termination records from MES | Signed termination certificates |
| IN | Resurrection detection signals | Pattern-match alerts |
| OUT | Tombstone records | Cryptographic revocation entries |
| OUT | Resurrection alerts | High-priority event stream |

## Events Emitted

- `rps.tombstone.applied` -- terminated entity cryptographically sealed
- `rps.resurrection.detected` -- attempted revival of terminated entity
- `rps.resurrection.blocked` -- revival attempt successfully prevented
- `rps.initialized` -- system startup complete
- `rps.heartbeat` -- periodic health signal

## Events Consumed

- `mes.enterprise.terminated` -- triggers tombstone creation
- `gaagr.entity.deregistered` -- confirms entity removed from registry
- `ems.enterprise.created` -- checks new AINEs against tombstone list

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| MES | <-- | Termination triggers tombstoning |
| GAAGR | <-- | Deregistration confirmation |
| EMS | <--> | Checks new creations against tombstones |
| HOES | --> | Escalates resurrection attempts |
| ACTS | --> | Logs all tombstone and detection events |
| SEI | --> | Reports resurrection attempts to authorities |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-rps
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: rps
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: audit-death
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-rps
  template:
    spec:
      containers:
        - name: rps
          image: ghcr.io/frankmax-com/aineff-rps:latest
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
