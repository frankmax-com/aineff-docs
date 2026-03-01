---
sidebar_position: 7
title: "Mortality Enforcement System"
description: "Executes enterprise termination ensuring complete and irreversible shutdown"
---

# Mortality Enforcement System (MES)

| Field | Value |
|-------|-------|
| System ID | `aineff-mes` |
| Package | `@aineff/mes` |
| Cluster | Cluster 4 -- Audit & Death |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

MES is the executioner of the AINEFF lifecycle. When TDES determines that an AINE has
reached end-of-life and NPOS has completed exit procedures, MES executes the actual
termination: revoking all credentials, tearing down K8s namespaces, zeroing secrets,
archiving final state, and issuing the death certificate. MES ensures that enterprise
death is complete, irreversible, and auditable. Every AINE is born knowing it will die.

## Standalone Revenue

**Enterprise termination services** -- managed termination procedures for organizations
decommissioning AI systems in compliance with regulatory requirements.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Termination orders | Signed authorization from TDES |
| IN | Pre-termination checklists | From NPOS |
| OUT | Termination execution | K8s namespace deletion |
| OUT | Death certificates | Signed, timestamped attestations |

## Events Emitted

- `mes.enterprise.terminated` -- AINE permanently shut down
- `mes.credentials.revoked` -- all access credentials destroyed
- `mes.namespace.deleted` -- K8s namespace removed
- `mes.certificate.issued` -- death certificate generated
- `mes.initialized` -- system startup complete
- `mes.heartbeat` -- periodic health signal

## Events Consumed

- `tdes.exit.completed` -- authorization to proceed with termination
- `npos.exit.certified` -- confirmation exit procedures are complete
- `ecs.evidence.sealed` -- final evidence preserved before termination

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| TDES | <-- | Exit completion triggers termination |
| NPOS | <-- | Exit certification required before kill |
| ECS | <-- | Evidence sealed before destruction |
| RPS | --> | Triggers tombstone creation |
| GAAGR | --> | Deregisters terminated entity |
| ACTS | --> | Logs terminal audit entries |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-mes
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: mes
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: audit-death
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-mes
  template:
    spec:
      containers:
        - name: mes
          image: ghcr.io/frankmax-com/aineff-mes:latest
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
