---
sidebar_position: 2
title: "Governance SDK"
description: "Authority check, escalation trigger, and audit log primitives for all AINEFF systems"
---

# Governance SDK (`@aineff/governance-sdk`)

| Field | Value |
|-------|-------|
| Package | `@aineff/governance-sdk` |
| Type | Shared runtime library |
| Consumers | All 43 systems |

## Purpose

`@aineff/governance-sdk` provides the runtime primitives that every AINEFF system uses
to participate in governance. It wraps authority checks (calling RAMS), escalation
triggers (calling HOES), audit logging (calling ACTS), and obligation verification
(calling ORF). Rather than each system implementing these integrations independently,
the SDK provides a consistent, tested interface that guarantees governance compliance.

## Key Exports

```typescript
// Authority checking
export function checkAuthority(actor: ActorRef, action: string, scope: Scope): Promise<AuthResult>;
export function requireAuthority(actor: ActorRef, action: string, scope: Scope): Promise<void>;

// Escalation
export function escalate(severity: Severity, context: EscalationContext): Promise<EscalationId>;
export function awaitHumanDecision(escalationId: EscalationId): Promise<Decision>;

// Audit logging
export function logAction(action: AuditAction): Promise<AuditEntryId>;
export function logDecision(decision: AuditDecision): Promise<AuditEntryId>;

// Governance decorator
export function governed(options: GovernanceOptions): MethodDecorator;
```

## Installation

```bash
pnpm add @aineff/governance-sdk
```

## Usage

```typescript
import { checkAuthority, logAction, governed } from '@aineff/governance-sdk';

// Decorator pattern -- wraps method with authority check + audit log
class MyService {
  @governed({ action: 'create-entity', severity: 'high' })
  async createEntity(payload: EntityPayload) {
    // Implementation runs only if authority check passes
    // Audit entry created automatically on success/failure
  }
}
```

## Integration Points

| System | Integration |
|--------|------------|
| RAMS | Authority check calls |
| HOES | Escalation trigger calls |
| ACTS | Audit log entry creation |
| GBL | Policy enforcement hooks |

## K8s Deployment

Not applicable -- `@aineff/governance-sdk` is a shared library bundled into each
system's container image. It communicates with governance systems via gRPC/REST.
