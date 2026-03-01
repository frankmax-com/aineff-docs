---
sidebar_position: 3
title: "Audit Logger"
description: "Append-only, hash-chained audit trail library used by all AINEFF systems"
---

# Audit Logger (`@aineff/audit-logger`)

| Field | Value |
|-------|-------|
| Package | `@aineff/audit-logger` |
| Type | Shared runtime library |
| Consumers | All 43 systems |

## Purpose

`@aineff/audit-logger` provides an append-only, hash-chained audit trail that every
AINEFF system uses to record its operations. Each log entry includes a cryptographic
hash of the previous entry, creating a tamper-evident chain. If any entry is modified
after the fact, the chain breaks and the tampering is detectable. This library is the
foundation of AINEFF's court-grade auditability guarantee.

## Key Exports

```typescript
// Core logging
export function createAuditEntry(entry: AuditEntry): Promise<AuditEntryId>;
export function createAuditBatch(entries: AuditEntry[]): Promise<AuditEntryId[]>;

// Chain verification
export function verifyChain(from: AuditEntryId, to: AuditEntryId): Promise<ChainVerification>;
export function getChainHead(): Promise<AuditEntryId>;

// Query
export function queryEntries(filter: AuditFilter): AsyncIterable<AuditEntry>;

// Types
export interface AuditEntry {
  entryId: string;
  previousHash: string;
  timestamp: Date;
  systemId: string;
  action: string;
  actor: ActorRef;
  payload: Record<string, unknown>;
  hash: string;
}
```

## Installation

```bash
pnpm add @aineff/audit-logger
```

## Usage

```typescript
import { createAuditEntry, verifyChain } from '@aineff/audit-logger';

await createAuditEntry({
  systemId: 'aineff-ems',
  action: 'enterprise.created',
  actor: { type: 'system', id: 'aineff-ems' },
  payload: { aineId, genomeVersion },
});
```

## Hash Chain Mechanics

Each entry's `hash` is computed as `SHA-256(previousHash + timestamp + systemId + action + payload)`. The chain is verified by recomputing hashes from any starting point and comparing against stored values.

## Integration with ACTS

The audit logger writes to a local buffer that is asynchronously flushed to ACTS.
In the event of network partition, entries are durably stored locally and replayed
when connectivity is restored.

## K8s Deployment

Not applicable -- `@aineff/audit-logger` is a shared library bundled into each
system's container image. It writes to ACTS via gRPC with local buffering.
