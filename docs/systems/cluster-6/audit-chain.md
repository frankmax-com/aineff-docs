---
sidebar_position: 5
title: "Audit Chain"
description: "Blockchain-anchored audit trail providing cryptographic proof of record integrity"
---

# Audit Chain

| Field | Value |
|-------|-------|
| System ID | `aineff-audit-chain` |
| Package | `@aineff/audit-chain` |
| Cluster | Cluster 6 -- Intelligence |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

Audit Chain provides blockchain-grade immutability for AINEFF audit records. It
periodically anchors batches of audit entries from ACTS into a blockchain (or
blockchain-equivalent distributed ledger), creating cryptographic proof that records
have not been tampered with after the fact. This makes AINEFF audit trails suitable
for legal proceedings, regulatory examinations, and third-party verification.

## Standalone Revenue

**Blockchain audit trail** -- compliance product for organizations that need
cryptographically verifiable audit records for their AI operations.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Audit entry batches | Hash digests from ACTS |
| IN | Verification requests | REST API with entry ID |
| OUT | Blockchain anchors | Transaction hashes + proofs |
| OUT | Integrity verification results | Valid/invalid + proof chain |

## Events Emitted

- `audit-chain.block.committed` -- batch anchored to blockchain
- `audit-chain.integrity.verified` -- verification request confirmed
- `audit-chain.integrity.failed` -- tampering detected
- `audit-chain.initialized` -- system startup complete
- `audit-chain.heartbeat` -- periodic health signal

## Events Consumed

- `acts.entry.recorded` -- audit entries to anchor
- `ecs.evidence.sealed` -- evidence hashes to anchor
- `ssdt.snapshot.captured` -- snapshot hashes to anchor

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| ACTS | <-- | Audit entries for blockchain anchoring |
| ECS | <-- | Evidence hashes for anchoring |
| SSDT | <-- | Snapshot hashes for anchoring |
| ACTS | --> | Anchor proofs stored in audit trail |
| SEI | --> | Integrity reports for sovereign authorities |
| HOES | --> | Escalates tampering detection |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-audit-chain
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: audit-chain
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: intelligence
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-audit-chain
  template:
    spec:
      containers:
        - name: audit-chain
          image: ghcr.io/frankmax-com/aineff-audit-chain:latest
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
