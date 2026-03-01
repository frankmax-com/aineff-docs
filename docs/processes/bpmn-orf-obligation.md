---
sidebar_label: "BPMN: ORF Obligation"
sidebar_position: 8
---

# BPMN: ORF Obligation Lifecycle

**Version:** v1.0.0 | **Date:** 2026-03-01 | **Process ID:** BPMN-ORF-OBL-001

## Summary

This document defines the BPMN process for the Obligation Resolution Framework (ORF) obligation lifecycle. Every action in AINEFF is wrapped in an ORF envelope that tracks the obligation from proposal through execution to finality, ensuring complete auditability and constraint enforcement.

## Core Principle

> **No action without an envelope.** Every agent action, every state change, every decision is wrapped in an ORF envelope that enforces constraints and creates an immutable audit trail.

## Process Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     ORF OBLIGATION LIFECYCLE — TOP LEVEL                     │
│                                                                              │
│  ○ ──▶ [Create      ──▶ [Evaluate      ──▶ ◇ All Constraints                │
│  Start  Envelope]        Constraints]       Pass?                            │
│         (PROPOSED)                          │                                │
│                                        Yes ─┤── No ──▶ [Reject] ──▶ ◉       │
│                                             │          (REJECTED)    End      │
│                                             ▼                                │
│                                      [Accept]                                │
│                                      (ACCEPTED)                              │
│                                             │                                │
│                                             ▼                                │
│                                      [Begin Execution]                       │
│                                      (EXECUTING)                             │
│                                             │                                │
│                                        ◇ Success?                            │
│                                        │         │                           │
│                                   Yes ─┘     No ─▶ [Log Failure] ──▶ ◉      │
│                                        │           (FAILED)          End     │
│                                        ▼                                     │
│                                   ◇ Irreversible?                            │
│                                   │           │                              │
│                              Yes ─┘       No ─▶ [Complete]                   │
│                                   │             (COMPLETED)                  │
│                                   ▼                  │                       │
│                            [Generate Finality Hash]  │                       │
│                            (FINAL)                   │                       │
│                                   │                  │                       │
│                                   ▼                  ▼                       │
│                               ◉ End              ◉ End                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## State Machine

```
                    ┌──────────┐
                    │ PROPOSED │
                    └────┬─────┘
                         │
                    ◇ Constraints?
                   ╱              ╲
              Pass                 Fail
                ╱                     ╲
    ┌──────────┐                ┌──────────┐
    │ ACCEPTED │                │ REJECTED │
    └────┬─────┘                └──────────┘
         │
    [Execute Action]
         │
    ◇ Outcome?
   ╱              ╲
Success            Failure
  ╱                     ╲
◇ Irreversible?    ┌──────────┐
 ╱       ╲         │  FAILED  │
Yes       No       └──────────┘
 │         │
 ▼         ▼
┌─────┐  ┌───────────┐
│FINAL│  │ COMPLETED │
└─────┘  └───────────┘
```

**Terminal States:** REJECTED, FAILED, COMPLETED, FINAL

## Swim Lane Diagram

```
┌──────────┬──────────────────────────────────────────────────────────────────┐
│          │                                                                  │
│ Request- │  [Request Action]──▶                                             │
│ ing      │                    │                                             │
│ Agent    │                    │                                             │
│          │                    │                                             │
├──────────┤────────────────────┼─────────────────────────────────────────────┤
│          │                    ▼                                             │
│ ORF      │            [Create Envelope]──▶[Evaluate]──▶◇──▶[Accept/Reject] │
│ Engine   │             (PROPOSED)          Constraints  │                   │
│          │                                              │                   │
│          │                                         Pass─┘──Fail──▶[REJECT] │
│          │                                              │                   │
│          │                                              ▼                   │
│          │                                       [Begin Execution]          │
│          │                                        (EXECUTING)               │
│          │                                              │                   │
├──────────┤──────────────────────────────────────────────┼───────────────────┤
│          │                                              │                   │
│ Constr-  │  [Authority Check]                           │                   │
│ aint     │  [Obligation Check]                          │                   │
│ Evalua-  │  [Temporal Check]                            │                   │
│ tors     │  [Jurisdiction Check]                        │                   │
│          │                                              │                   │
├──────────┤──────────────────────────────────────────────┼───────────────────┤
│          │                                              │                   │
│ Execu-   │                                       [Execute Action]           │
│ tion     │                                              │                   │
│ Engine   │                                         ◇ Success?               │
│          │                                         │        │               │
│          │                                    Yes──┘   No──▶[FAILED]        │
│          │                                         │                        │
│          │                                    ◇ Irreversible?               │
│          │                                    │          │                  │
│          │                               Yes──┘     No──▶[COMPLETED]       │
│          │                                    │                             │
│          │                             [Hash + FINAL]                       │
│          │                                                                  │
├──────────┤──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│ ACTS     │  [Log: PROPOSED] [Log: ACCEPTED] [Log: EXECUTING]               │
│          │  [Log: COMPLETED/FINAL/FAILED/REJECTED]                         │
│          │  (Every state transition logged)                                  │
│          │                                                                  │
├──────────┤──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│ FMS      │                                          [Log Failure Details]   │
│          │                                          [Classify Severity]     │
│          │                                                                  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

## Detailed Process Steps

### Step 1: Action Requested — ORF Envelope Created

**Actor:** Requesting Agent
**System:** ORF Engine
**State:** `PROPOSED`

When any agent needs to perform an action, it creates an ORF envelope:

```json
{
  "envelopeId": "orf-env-2026030110001",
  "state": "PROPOSED",
  "requestingAgent": "operations-v2",
  "aineId": "aine-a1b2c3d4",
  "action": {
    "type": "vendor.contract.negotiate",
    "target": "supplier-acme-parts",
    "parameters": {
      "maxDiscount": 15,
      "minQuantity": 10000,
      "currency": "USD"
    }
  },
  "constraints": {
    "authority": { "requiredLevel": 4 },
    "obligation": { "maxFinancialExposure": 50000 },
    "temporal": { "deadline": "2026-03-15T00:00:00Z" },
    "jurisdiction": { "required": "US-CA" }
  },
  "metadata": {
    "createdAt": "2026-03-01T10:00:00Z",
    "priority": "normal"
  }
}
```

**ACTS Log:** `orf.envelope.proposed` event recorded.

### Step 2: Constraint Evaluation

**Actor:** ORF Constraint Evaluators (automated)
**Systems:** ORF, RAMS, ADS, JAL

Four constraint dimensions are evaluated simultaneously:

```
╔═══════════════════╗
║ PARALLEL GATEWAY  ║  All four constraints evaluated simultaneously
╚═══════╤═══════════╝
   ┌────┼────┬────┐
   ▼    ▼    ▼    ▼
[Auth] [Obl] [Temp] [Jur]
   │    │     │     │
   └────┼────┬────┘
╔═══════╧═══════════╗
║ PARALLEL JOIN     ║  All must pass for acceptance
╚═══════════════════╝
```

#### 2a. Authority Constraint

Does the requesting agent have sufficient authority?

```
Agent: operations-v2
Required Level: 4
Current Level:  4.80 (initial: 6.0, decay: 0.03, days: 8)
Result: PASS (4.80 >= 4)
```

#### 2b. Obligation Constraint

Does the action comply with obligation limits?

```
Financial Exposure: $50,000 max
Current Obligations: $23,000 in-flight
This Action:         $15,000 estimated
Total After:         $38,000
Result: PASS ($38,000 <= $50,000)
```

#### 2c. Temporal Constraint

Is the action within its time window?

```
Deadline: 2026-03-15T00:00:00Z
Current:  2026-03-01T10:00:05Z
Time Remaining: 13 days, 13 hours
Result: PASS (sufficient time)
```

#### 2d. Jurisdiction Constraint

Is the action permitted in the target jurisdiction?

```
Required Jurisdiction: US-CA
Agent Jurisdiction:    US-CA (primary)
JAL Check:             Vendor negotiation permitted in US-CA
Result: PASS
```

### Step 3: All Constraints Pass — State: ACCEPTED

**Actor:** ORF Engine (automated)
**State:** `PROPOSED` -> `ACCEPTED`

If all four constraints pass:

1. Envelope state transitions to `ACCEPTED`
2. Resources are reserved (financial exposure allocated)
3. Temporal timer starts (deadline tracking)
4. ACTS logs the acceptance with all constraint evaluation results

If any constraint fails:

1. Envelope state transitions to `REJECTED`
2. Rejection reason recorded with specific constraint failure details
3. Requesting agent notified of rejection
4. ACTS logs the rejection

```json
{
  "event": "orf.envelope.rejected",
  "envelopeId": "orf-env-2026030110001",
  "state": "REJECTED",
  "failedConstraints": [
    {
      "type": "authority",
      "required": 4,
      "actual": 0.6,
      "reason": "Agent authority decayed below required level"
    }
  ],
  "timestamp": "2026-03-01T10:00:06Z"
}
```

### Step 4: Execution Begins — State: EXECUTING

**Actor:** Execution Engine
**State:** `ACCEPTED` -> `EXECUTING`

1. Envelope state transitions to `EXECUTING`
2. The action is dispatched to the appropriate execution handler
3. Progress tracking begins
4. Periodic heartbeats verify execution is ongoing
5. ACTS logs execution start

### Step 5: Action Completes — Finality Determination

**Actor:** Execution Engine + ORF Engine
**Decision Point:** Was the action successful? Is it irreversible?

#### Path A: Success + Irreversible -> FINAL

If the action completed successfully AND produced an irreversible result:

1. Generate a finality hash over the action result
2. The finality hash is a content-addressed, tamper-evident seal
3. Envelope state transitions to `FINAL`
4. This state is immutable — it can never be changed

```json
{
  "event": "orf.envelope.finalized",
  "envelopeId": "orf-env-2026030110001",
  "state": "FINAL",
  "result": {
    "type": "vendor.contract.negotiated",
    "discount": 12,
    "quantity": 12000,
    "contractId": "contract-acme-2026-001"
  },
  "finalityHash": "sha256:a1b2c3d4e5f6...",
  "irreversible": true,
  "reason": "Contract signed and countersigned",
  "timestamp": "2026-03-01T14:30:00Z"
}
```

#### Path B: Success + Reversible -> COMPLETED

If the action completed successfully but the result is reversible:

1. Envelope state transitions to `COMPLETED`
2. No finality hash generated (action can be undone)
3. Result is recorded but marked as non-final

#### Path C: Failure -> FAILED

If the action failed during execution:

1. Envelope state transitions to `FAILED`
2. Failure details are recorded
3. FMS (Failure Management System) classifies the failure severity
4. If recoverable: a new ORF envelope can be created to retry
5. ACTS logs the failure with full details

```json
{
  "event": "orf.envelope.failed",
  "envelopeId": "orf-env-2026030110001",
  "state": "FAILED",
  "failure": {
    "type": "execution_error",
    "code": "VENDOR_API_TIMEOUT",
    "message": "Vendor API did not respond within 30s",
    "severity": "medium",
    "recoverable": true
  },
  "timestamp": "2026-03-01T10:05:00Z"
}
```

### Step 6: Audit Entry for Every State Transition

**Actor:** ACTS (automated)
**System:** ACTS

Every single state transition generates an ACTS audit entry:

```
Envelope: orf-env-2026030110001
──────────────────────────────────────────────────────
Transition  From        To          Time                Duration
1           (none)      PROPOSED    2026-03-01T10:00:00  -
2           PROPOSED    ACCEPTED    2026-03-01T10:00:06  6ms
3           ACCEPTED    EXECUTING   2026-03-01T10:00:07  1ms
4           EXECUTING   FINAL       2026-03-01T14:30:00  4h 29m 53s
──────────────────────────────────────────────────────
Total Lifecycle: 4 hours 30 minutes
Terminal State: FINAL (irreversible)
Finality Hash: sha256:a1b2c3d4e5f6...
```

## Constraint Failure Scenarios

| Constraint | Failure Reason | Recovery Path |
|-----------|---------------|---------------|
| Authority | Agent decayed below required level | Re-authorize via [SOP: Authority Decay](./sop-authority-decay.md), then retry |
| Obligation | Financial exposure limit exceeded | Wait for in-flight obligations to complete, then retry |
| Temporal | Deadline has passed | Create new envelope with updated deadline |
| Jurisdiction | Action not permitted in jurisdiction | Escalate to human; modify action scope or jurisdiction |
| Multiple | Multiple constraints fail | Address each failure; re-evaluate all constraints on retry |

## Performance Metrics

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Envelope creation latency | < 50ms | > 200ms |
| Constraint evaluation latency | < 100ms | > 500ms |
| PROPOSED -> ACCEPTED rate | > 95% | < 85% |
| EXECUTING -> FINAL/COMPLETED rate | > 90% | < 80% |
| FAILED rate | < 5% | > 10% |
| Average lifecycle duration | Varies by action type | > 2x average |

## Related Documents

- [BPMN: AINE Lifecycle](./bpmn-aine-lifecycle.md)
- [BPMN: Venture Cell Creation](./bpmn-venture-cell.md)
- [SOP: Incident Response](./sop-incident-response.md)
- [Platform: ORF Protocol](/docs/platforms/orf-protocol)
- [Systems: ACTS](/docs/systems/cluster-4/acts)
- [Systems: FMS](/docs/systems/cluster-4/fms)
