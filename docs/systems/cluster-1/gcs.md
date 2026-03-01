---
sidebar_position: 4
title: "Genome Compiler System"
description: "Enterprise genome validation API ensuring structural and semantic correctness"
---

# Genome Compiler System (GCS)

| Field | Value |
|-------|-------|
| System ID | `aineff-gcs` |
| Package | `@aineff/gcs` |
| Cluster | Cluster 1 -- Enterprise Birth |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The Genome Compiler System validates enterprise genomes before they can be instantiated.
It performs structural validation (schema conformance, required fields, type correctness),
semantic validation (role graph acyclicity, authority consistency, jurisdiction
compatibility), and governance validation (ORF obligation coverage, audit completeness).
No AINE can be created without GCS approval.

## Standalone Revenue

**Genome validation API** -- per-validation pricing for external consumers. Enterprise
customers can subscribe for unlimited validations during genome development cycles.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Raw enterprise genome | JSON document |
| IN | Validation rule updates | Rule definition DSL |
| OUT | Validation result | Pass/fail with diagnostics |
| OUT | Compiled genome artifact | Signed, validated bundle |

## Events Emitted

- `gcs.genome.validated` -- genome passes all checks
- `gcs.genome.rejected` -- genome fails validation with error list
- `gcs.rules.updated` -- validation rules changed
- `gcs.initialized` -- system startup complete
- `gcs.heartbeat` -- periodic health signal

## Events Consumed

- `pdes.template.published` -- validates new marketplace templates
- `jal.jurisdiction.updated` -- refreshes jurisdiction validation rules
- `cvss.vocabulary.changed` -- updates semantic validation dictionaries

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| PDES | <-- | Receives templates for validation |
| EMS | --> | Provides validated genomes for instantiation |
| IGS | --> | Feeds validation result to instantiation gate |
| JAL | <-- | Jurisdiction rules constrain validation |
| CVSS | <-- | Vocabulary updates affect semantic checks |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-gcs
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: gcs
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: enterprise-birth
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aineff-gcs
  template:
    spec:
      containers:
        - name: gcs
          image: ghcr.io/frankmax-com/aineff-gcs:latest
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
