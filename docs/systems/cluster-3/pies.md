---
sidebar_position: 1
title: "Policy Ingestion & Enforcement System"
description: "Compliance-as-a-Service ingesting regulatory policies and enforcing them at runtime"
---

# Policy Ingestion & Enforcement System (PIES)

| Field | Value |
|-------|-------|
| System ID | `aineff-pies` |
| Package | `@aineff/pies` |
| Cluster | Cluster 3 -- Policy & Semantics |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

PIES ingests regulatory policies, organizational rules, and contractual obligations from
external sources, translates them into machine-enforceable constraints, and distributes
them to the Governance Boundary Layer for runtime enforcement. It handles policy
versioning, conflict resolution between overlapping policies, and maintains a complete
history of policy changes for regulatory audit.

## Standalone Revenue

**Compliance-as-a-Service** -- subscription product for organizations needing automated
policy ingestion and enforcement across their AI operations stack.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Raw policy documents | PDF, HTML, structured JSON |
| IN | Policy update feeds | Webhook / RSS from regulators |
| OUT | Compiled enforcement rules | OPA Rego / JSON constraints |
| OUT | Policy change notifications | Event stream |

## Events Emitted

- `pies.policy.ingested` -- new policy parsed and compiled
- `pies.policy.activated` -- policy deployed to enforcement layer
- `pies.conflict.detected` -- overlapping policies conflict
- `pies.initialized` -- system startup complete
- `pies.heartbeat` -- periodic health signal

## Events Consumed

- `jal.jurisdiction.updated` -- jurisdiction changes trigger policy refresh
- `cvss.vocabulary.changed` -- vocabulary updates affect policy interpretation
- `sei.override.activated` -- sovereign override suspends certain policies

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| JAL | <-- | Jurisdiction context for policy selection |
| CVSS | <-- | Canonical vocabulary for policy terms |
| SEI | <-- | Sovereign overrides suspend policies |
| GBL | --> | Distributes compiled policies for enforcement |
| NDAR | --> | Identifies non-delegable authorities in policies |
| ACTS | --> | Logs policy lifecycle for audit |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-pies
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: pies
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: policy-semantics
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-pies
  template:
    spec:
      containers:
        - name: pies
          image: ghcr.io/frankmax-com/aineff-pies:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: "1"
              memory: 1Gi
```
