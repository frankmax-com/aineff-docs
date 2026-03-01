---
sidebar_position: 6
title: "ORF SDK"
description: "Obligation & Responsibility binding SDK for the AINEFF governance framework"
---

# ORF SDK (`@aineff/orf-sdk`)

| Field | Value |
|-------|-------|
| Package | `@aineff/orf-sdk` |
| Type | Shared runtime library |
| Consumers | All 43 systems |

## Purpose

`@aineff/orf-sdk` implements the Obligation & Responsibility Framework (ORF) binding
layer. ORF is the protocol that ensures every action in AINEFF has a defined obligation
(what must be done), a responsible party (who must do it), a verifier (who confirms it
was done), and consequences (what happens if it is not done). The SDK provides the
runtime API for creating, tracking, fulfilling, and verifying obligations.

## Key Exports

```typescript
// Obligation lifecycle
export function createObligation(spec: ObligationSpec): Promise<ObligationId>;
export function fulfillObligation(id: ObligationId, evidence: FulfillmentEvidence): Promise<void>;
export function verifyFulfillment(id: ObligationId): Promise<VerificationResult>;

// Responsibility binding
export function bindResponsibility(obligation: ObligationId, actor: ActorRef): Promise<BindingId>;
export function transferResponsibility(binding: BindingId, newActor: ActorRef): Promise<BindingId>;

// Queries
export function getObligations(filter: ObligationFilter): AsyncIterable<Obligation>;
export function getBindings(actor: ActorRef): Promise<Binding[]>;

// Types
export interface ObligationSpec {
  description: string;
  deadline: Date;
  responsibleParty: ActorRef;
  verifier: ActorRef;
  consequence: ConsequenceSpec;
  scope: Scope;
}
```

## Installation

```bash
pnpm add @aineff/orf-sdk
```

## Usage

```typescript
import { createObligation, bindResponsibility } from '@aineff/orf-sdk';

const obligationId = await createObligation({
  description: 'Review quarterly audit report',
  deadline: new Date('2026-04-01'),
  responsibleParty: { type: 'human', id: 'officer-123' },
  verifier: { type: 'system', id: 'aineff-hcdi' },
  consequence: { type: 'authority-decay', severity: 'medium' },
  scope: { aineId: 'aine-456' },
});
```

## ORF Protocol Layers

The SDK operates at Layer 3 of the AINEFF protocol stack:

1. **Layer 1** -- Infrastructure (K8s, networking)
2. **Layer 2** -- Audit & Telemetry (hash chains, metrics)
3. **Layer 3** -- ORF (obligations, responsibility, verification)
4. **Layer 4** -- Enterprise Logic (business operations)

## Integration Points

| System | Integration |
|--------|------------|
| RAMS | Obligations linked to role authority |
| HOES | Unfulfilled obligations trigger escalation |
| ADS | Obligation failures accelerate authority decay |
| ACTS | All obligation events logged to audit trail |
| HCDI | Obligation fulfillment feeds accountability scoring |

## K8s Deployment

Not applicable -- `@aineff/orf-sdk` is a shared library bundled into each system's
container image. It communicates with ORF infrastructure via gRPC/REST.
