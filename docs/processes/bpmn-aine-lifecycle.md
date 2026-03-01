---
sidebar_label: "BPMN: AINE Lifecycle"
sidebar_position: 6
---

# BPMN: AINE Lifecycle Process

**Version:** v1.0.0 | **Date:** 2026-03-01 | **Process ID:** BPMN-AINE-LC-001

## Summary

This document defines the complete AINE lifecycle as a BPMN (Business Process Model and Notation) process. The lifecycle spans from genome definition through operational state to controlled death, with all decision points, parallel gateways, and error handling paths documented.

## Process Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AINE LIFECYCLE — TOP LEVEL                           │
│                                                                             │
│  ○ ──▶ [Define Genome] ──▶ [Compile] ──▶ ◇ Valid?                          │
│  Start                                    │                                 │
│                                      Yes ─┤── No ──▶ [Return to Spec] ─┐   │
│                                           │                             │   │
│                                           ▼                             │   │
│                                    [Gate Check] ──▶ ◇ Approved?         │   │
│                                                     │                   │   │
│                                                Yes ─┤── No ──▶ ◉ End   │   │
│                                                     │         Rejected  │   │
│                                                     ▼                   │   │
│                                              ╔═══════════╗              │   │
│                                              ║  PARALLEL  ║              │   │
│                                              ║  GATEWAY   ║              │   │
│                                              ╚═════╤═════╝              │   │
│                                          ┌─────────┼─────────┐          │   │
│                                          ▼         ▼         ▼          │   │
│                                     [Deploy   [Assign   [Init          │   │
│                                      EMS]      RAMS]    ACTS]          │   │
│                                          │         │         │          │   │
│                                          └─────────┼─────────┘          │   │
│                                              ╔═════╧═════╗              │   │
│                                              ║   JOIN     ║              │   │
│                                              ╚═════╤═════╝              │   │
│                                                    ▼                    │   │
│                                          [Activate BPMN] ──▶ [Train]   │   │
│                                                               │         │   │
│                                                          ◇ Certified?   │   │
│                                                          │              │   │
│                                                     Yes ─┤── No ───────┘   │
│                                                          ▼                  │
│                                                   ╔═════════════╗           │
│                                                   ║  OPERATING  ║           │
│                                                   ╚══════╤══════╝           │
│                                                          │                  │
│                                                   ◇ Decay Triggered?        │
│                                                   │                         │
│                                              Yes ─┤── No (continue) ──┐     │
│                                                   ▼                   │     │
│                                            [Death Process]            │     │
│                                                   │                   │     │
│                                                   ▼                   │     │
│                                               ◉ DEAD                  │     │
│                                                                       │     │
│                                               ◇ ◀────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Swim Lane Diagram

The AINE lifecycle involves multiple systems (swim lanes), each responsible for specific activities:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ SWIM LANES                                                                   │
├──────────┬───────────────────────────────────────────────────────────────────┤
│          │                                                                   │
│  Human   │  ○──▶[Define Genome]          [Acknowledge      [Certify         │
│  Actor   │       │                        Death Notice]      Operator]       │
│          │       │                             ▲                  │          │
├──────────┤───────┼─────────────────────────────┼──────────────────┼──────────┤
│          │       ▼                             │                  │          │
│  GCS     │  [Compile Genome]──▶◇──▶[Validate] │                  │          │
│          │                     │               │                  │          │
│          │                Valid│  Invalid       │                  │          │
│          │                    │──▶[Error]──┐   │                  │          │
├──────────┤────────────────────┼────────────┼───┼──────────────────┼──────────┤
│          │                    ▼            │   │                  │          │
│  IGS     │              [Gate Check]       │   │                  │          │
│          │               │       │         │   │                  │          │
│          │          Pass─┘  Fail─▶[Reject] │   │                  │          │
├──────────┤───────────┼──────────────────────┼───┼──────────────────┼──────────┤
│          │           ▼                      │   │                  │          │
│  EMS     │     [Create Namespace]           │   │           [Delete          │
│          │     [Deploy Agents]              │   │            Namespace]       │
│          │     [Register GAAGR]             │   │                 │          │
├──────────┤───────────┼──────────────────────┼───┼─────────────────┼──────────┤
│          │           │                      │   │                 │          │
│  RAMS    │     [Assign Authority Matrix]    │   │                 │          │
│          │     [Configure RBAC]             │   │                 │          │
├──────────┤───────────┼──────────────────────┼───┼─────────────────┼──────────┤
│          │           │                      │   │                 │          │
│  ACTS    │     [Init Audit Trail]           │   │  [Seal          │          │
│          │     [Log Birth Event]            │   │   Archive]      │          │
│          │                                  │   │      │    [Death │          │
│          │                                  │   │      │     Cert] │          │
├──────────┤──────────────────────────────────┼───┼──────┼──────────┼──────────┤
│          │                                  │   │      │          │          │
│  BPMN    │  [Activate Workflows]◀───────────┘   │      │          │          │
│          │                                      │      │          │          │
├──────────┤──────────────────────────────────────┼──────┼──────────┼──────────┤
│          │                                      │      │          │          │
│  TDES    │                              [Trigger│Decay]│          │          │
│          │                                      │      │          │          │
├──────────┤──────────────────────────────────────┼──────┼──────────┼──────────┤
│          │                                      │      │          │          │
│  MES     │                                      │      │   [Execute          │
│          │                                      │      │    Deletion]        │
├──────────┤──────────────────────────────────────┼──────┼──────────┼──────────┤
│          │                                      │      │          │          │
│  RPS     │                                      │      │   [Blacklist        │
│          │                                      │      │    Genome]          │
│          │                                      │      │          │          │
└──────────┴──────────────────────────────────────┴──────┴──────────┴──────────┘
```

## Detailed Process Phases

### Phase 1: Birth (Genome to Deployment)

```
○ Start
│
▼
┌─────────────────────┐
│  Define Enterprise   │  Actor: Human (Enterprise Architect)
│  Genome              │  Input: Industry, jurisdiction, agents, governance
│                      │  Output: Genome YAML specification
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Submit to GCS      │  Actor: API (automated)
│  for Compilation     │  Input: Genome YAML
│                      │  Output: Compiled genome artifact (content-addressed)
└──────────┬──────────┘
           ▼
     ◇ Genome Valid?
     │           │
     │ Yes       │ No
     │           ▼
     │    ┌─────────────────────┐
     │    │  Return Error to    │
     │    │  Enterprise Arch.   │──── Loop back to Define Genome
     │    └─────────────────────┘
     ▼
┌─────────────────────┐
│  IGS Gate Check     │  Actor: IGS (automated + human confirm)
│  - NLO bound?       │  Decision: Pass / Fail
│  - Payment cleared?  │
│  - Compliance OK?    │
└──────────┬──────────┘
           ▼
     ◇ Gate Approved?
     │           │
     │ Yes       │ No
     │           ▼
     │       ◉ End (Rejected — refund initiated)
     ▼
╔═══════════════════╗
║ PARALLEL GATEWAY  ║  All three activities execute simultaneously
╚═══════╤═══════════╝
   ┌────┼────┐
   ▼    ▼    ▼
 [EMS] [RAMS] [ACTS]
   │    │      │
   └────┼────┘
╔═══════╧═══════════╗
║ PARALLEL JOIN     ║  Wait for all three to complete
╚═══════╤═══════════╝
        ▼
┌─────────────────────┐
│  Activate BPMN      │  Load industry-specific workflows
│  Workflows           │  Set state: ACTIVATING
└──────────┬──────────┘
           ▼
     ◇ Operator Certified?
     │           │
     │ Yes       │ No ──▶ [Send to LevelupMax Training] ──▶ Wait ──┐
     │           │                                                   │
     │           └───────────────────────────────────────────────────┘
     ▼
╔═══════════════════╗
║    OPERATING      ║  AINE is live and generating value
╚═══════════════════╝
```

### Phase 2: Operating (Steady State)

```
╔═══════════════════╗
║    OPERATING      ║
╚═══════╤═══════════╝
        │
        ▼
   ◇ Continuous Monitoring Loop
   │
   ├──▶ [ADS: Check Authority Decay] ──▶ ◇ Decayed?
   │                                      │        │
   │                                  No ─┘    Yes ▼
   │                                        [Notify HOES]
   │                                             │
   │                                        ◇ Human Decision
   │                                        │    │     │
   │                                   RENEW  MODIFY  REVOKE
   │                                        │    │     │
   │                                        ▼    ▼     ▼
   │                                   [Update RAMS/RBAC]
   │                                             │
   ├──▶ [WGE: Create Venture Cells] ◀───────────┘
   │
   ├──▶ [BPMN: Execute Workflows]
   │
   ├──▶ [Telemetry: Monitor Health]
   │
   └──▶ ◇ Death Trigger?
        │           │
        │ No        │ Yes
        │           ▼
        └───┐  ╔═══════════╗
            │  ║  PHASE 3  ║
            │  ╚═══════════╝
            │
            └──▶ (Loop continues)
```

### Phase 3: Death (Controlled Shutdown)

```
╔═══════════════════╗
║  DEATH TRIGGERED  ║  Trigger: Authority expiry / Performance / Human
╚═══════╤═══════════╝
        ▼
┌─────────────────────┐
│  TDES: Set state    │  State: OPERATING → DYING
│  DYING              │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  HOES: Notify All   │  NLO, operators, dependent AINEs
│  Stakeholders        │
└──────────┬──────────┘
           ▼
     ◇ NLO Contests?
     │           │
     │ No        │ Yes ──▶ [SEI Adjudication] ──▶ ◇ Upheld?
     │           │                                 │       │
     │           │                            Yes ─┘   No ─▶ [Cancel Death]
     ▼                                                        ──▶ OPERATING
┌─────────────────────┐
│  WGE: Stop New Work │  State: DYING → DRAINING
│  Freeze Agent Inbox  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  ORF: Drain         │  Wait for in-flight obligations
│  Obligations         │  Cancel pending obligations
└──────────┬──────────┘  Force-cancel after timeout
           ▼
╔═══════════════════╗
║ PARALLEL GATEWAY  ║  Archive + Seal execute simultaneously
╚═══════╤═══════════╝
   ┌────┴────┐
   ▼         ▼
[Archive  [Seal PEP
 to ECS]   Keys]
   │         │
   └────┬────┘
╔═══════╧═══════════╗
║ PARALLEL JOIN     ║
╚═══════╤═══════════╝
        ▼
┌─────────────────────┐
│  MES: Delete        │  State: DRAINING → DEAD
│  K8s Namespace       │
└──────────┬──────────┘
           ▼
╔═══════════════════╗
║ PARALLEL GATEWAY  ║  Registry + Prevention execute simultaneously
╚═══════╤═══════════╝
   ┌────┴────┐
   ▼         ▼
[Update   [RPS:
 GAAGR]   Blacklist]
   │         │
   └────┬────┘
╔═══════╧═══════════╗
║ PARALLEL JOIN     ║
╚═══════╤═══════════╝
        ▼
┌─────────────────────┐
│  ACTS: Write Death  │  Final audit entry
│  Certificate         │  Immutable record
└──────────┬──────────┘
           ▼
       ◉ DEAD (FINAL)
```

## Decision Points Summary

| ID | Decision | Gateway Type | Outcomes |
|----|----------|-------------|----------|
| D1 | Genome Valid? | Exclusive (XOR) | Yes: proceed / No: return to spec |
| D2 | Gate Approved? | Exclusive (XOR) | Yes: deploy / No: reject |
| D3 | Operator Certified? | Exclusive (XOR) | Yes: operate / No: send to training |
| D4 | Authority Decayed? | Exclusive (XOR) | Yes: notify HOES / No: continue |
| D5 | Human Authority Decision | Exclusive (XOR) | RENEW / MODIFY / REVOKE |
| D6 | Death Triggered? | Exclusive (XOR) | Yes: begin death / No: continue operating |
| D7 | NLO Contests Death? | Exclusive (XOR) | Yes: SEI adjudication / No: proceed |
| P1 | Birth Deployment | Parallel (AND) | EMS + RAMS + ACTS simultaneously |
| P2 | Death Archive | Parallel (AND) | ECS Archive + PEP Seal simultaneously |
| P3 | Death Finalization | Parallel (AND) | GAAGR Update + RPS Blacklist simultaneously |

## Error Handling Paths

| Error | Detection | Recovery |
|-------|-----------|----------|
| GCS compilation failure | Schema validation error | Return error details, loop to Define Genome |
| EMS deployment failure | K8s pod health check | Retry with backoff; if persistent, rollback namespace |
| RAMS RBAC failure | K8s API error | Retry; if persistent, manual kubectl intervention |
| ACTS initialization failure | Write failure to ledger | Retry; block AINE birth until audit is available |
| Drain timeout exceeded | Timer expiry | Force-cancel remaining obligations with audit notation |
| Namespace deletion stuck | K8s finalizer timeout | Manual finalizer removal by platform engineer |
| GAAGR update failure | Registry API error | Retry with exponential backoff; alert platform team |

## State Transition Summary

```
UNBORN ──▶ PROVISIONING ──▶ ACTIVATING ──▶ OPERATING ──▶ DYING ──▶ DRAINING ──▶ DEAD
  │              │                │              │           │           │          │
  │         (Birth fails)   (Training     (Normal ops)  (Contested) (Timeout)  (Final)
  │              │          incomplete)       │           │           │
  └──────────────┴──────────────┘             │           ▼           ▼
        Returns to UNBORN              Death trigger  SEI Review  Force-cancel
                                              │           │
                                              ▼           ▼
                                           DYING    Back to OPERATING
                                                    or confirm DYING
```

## Related Documents

- [SOP: AINE Creation](./sop-aine-creation.md)
- [SOP: AINE Death](./sop-aine-death.md)
- [SOP: Authority Decay](./sop-authority-decay.md)
- [BPMN: Venture Cell Creation](./bpmn-venture-cell.md)
- [Architecture: AINE Lifecycle](/docs/architecture/aine-lifecycle)
