---
sidebar_position: 3
title: "Canonical Vocabulary & Semantics System"
description: "Enterprise taxonomy SaaS ensuring consistent meaning across all AINEFF systems"
---

# Canonical Vocabulary & Semantics System (CVSS)

| Field | Value |
|-------|-------|
| System ID | `aineff-cvss` |
| Package | `@aineff/cvss` |
| Cluster | Cluster 3 -- Policy & Semantics |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

CVSS maintains the canonical vocabulary that all AINEFF systems use to communicate. It
defines the authoritative meaning of every term, role name, policy keyword, and domain
concept. When two systems exchange events, CVSS ensures they agree on what words mean.
It manages vocabulary versioning, synonym resolution, industry-specific extensions, and
translation between domain languages.

## Standalone Revenue

**Enterprise taxonomy SaaS** -- subscription product for organizations needing a managed
vocabulary service for consistent terminology across AI systems and teams.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Term definition submissions | JSON term descriptors |
| IN | Vocabulary queries | REST/GraphQL API |
| OUT | Canonical term records | Versioned definitions |
| OUT | Vocabulary change notifications | Event stream |

## Events Emitted

- `cvss.vocabulary.changed` -- term definition added or modified
- `cvss.term.deprecated` -- term marked for removal
- `cvss.synonym.resolved` -- ambiguous term mapped to canonical form
- `cvss.initialized` -- system startup complete
- `cvss.heartbeat` -- periodic health signal

## Events Consumed

- `industry-intel.taxonomy.updated` -- industry terms feed vocabulary
- `jal.jurisdiction.updated` -- jurisdiction-specific terminology
- `midc.drift.detected` -- semantic drift triggers vocabulary review

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| Industry Intel | <-- | Industry-specific vocabulary |
| JAL | <-- | Jurisdiction-specific terms |
| MIDC | <-- | Drift alerts trigger vocabulary updates |
| GCS | --> | Vocabulary for genome semantic validation |
| PIES | --> | Canonical terms for policy interpretation |
| SCS | --> | Feeds semantic closure checks |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-cvss
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: cvss
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: policy-semantics
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-cvss
  template:
    spec:
      containers:
        - name: cvss
          image: ghcr.io/frankmax-com/aineff-cvss:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: "1"
              memory: 1Gi
```
