---
sidebar_label: "SOP: AINE Death"
sidebar_position: 3
---

# SOP: Enterprise Mortality — Controlled AINE Shutdown

**Version:** v1.0.0 | **Date:** 2026-03-01 | **SOP ID:** SOP-AINE-002

## Summary

This Standard Operating Procedure defines the controlled shutdown (death) process for an AI-Native Enterprise. AINE mortality is a first-class lifecycle event in AINEFF, ensuring clean shutdown, obligation fulfillment, data archival, and resurrection prevention.

## Prerequisites

| Prerequisite | Description | Verified By |
|-------------|-------------|-------------|
| Death Trigger | One of: authority expiry, performance threshold breach, or human decision | TDES |
| NLO Notification | Named Liable Officer must be notified before shutdown begins | HOES |
| No Critical In-Flight | Verify no critical irreversible actions are mid-execution | ORF |
| Archive Capacity | ECS has capacity for full audit archive | ECS |

## Roles Involved

| Role | System | Responsibility |
|------|--------|---------------|
| Death Trigger | TDES | Initiates the decay/death process |
| Stakeholder Notifier | HOES | Notifies all affected parties |
| Obligation Manager | ORF | Drains in-flight obligations |
| Archive Controller | ECS | Archives audit records |
| Encryption Sealer | PEP | Seals encryption keys |
| Namespace Destroyer | MES | Executes K8s namespace deletion |
| Registry Manager | GAAGR | Updates registry status |
| Resurrection Preventer | RPS | Blacklists genome to prevent reuse |
| Audit Controller | ACTS | Logs final death certificate event |

## Estimated Time

| Phase | Duration |
|-------|----------|
| Trigger and Notification | 5-15 minutes |
| Stop Accepting Work | 1-2 minutes (automated) |
| Drain Obligations | 15 minutes - 4 hours (depends on in-flight work) |
| Archive Audit Records | 10-30 minutes |
| Seal Encryption Keys | 2-5 minutes |
| Namespace Deletion | 5-15 minutes |
| Registry Updates | 2-5 minutes |
| Resurrection Prevention | 1-2 minutes |
| Final Audit Entry | 1 minute |
| **Total** | **~1-6 hours** |

## Procedure

### Step 1: TDES Triggers Decay

**Actor:** TDES (Temporal Decay & Entropy System)
**Systems:** TDES, ADS

The death process is initiated by one of three triggers:

1. **Authority Expiry** — All agents have decayed below minimum authority threshold with no renewal
2. **Performance Threshold Breach** — AINE consistently fails health, revenue, or compliance metrics
3. **Human Decision** — NLO or authorized operator explicitly requests shutdown

```json
{
  "event": "governance.tdes.death-trigger",
  "aineId": "aine-a1b2c3d4",
  "trigger": "performance_threshold",
  "reason": "Revenue below 20% of target for 3 consecutive quarters",
  "timestamp": "2026-03-01T14:00:00Z"
}
```

TDES sets the AINE state: `OPERATING → DYING`

### Step 2: Notify All Stakeholders

**Actor:** HOES (Human Oversight Escalation System)
**Systems:** HOES, NLO-R

Notifications are sent to:

- **Named Liable Officer** — Formal notification with shutdown timeline
- **All certified operators** — Access will be revoked upon death
- **Dependent AINEs** — Any AINEs with cross-dependencies are alerted via AINEG
- **Upstream/downstream partners** — External integrations are warned

```
NOTIFICATION: AINE Death Initiated
────────────────────────────────────
AINE ID:     aine-a1b2c3d4
AINE Name:   acme-manufacturing-aine
Trigger:     Performance Threshold Breach
Timeline:    Shutdown will complete within 6 hours
Action Req:  Review and acknowledge within 30 minutes
────────────────────────────────────
```

**Approval Gate:** NLO must acknowledge the death notification. If NLO contests, escalate to SEI (Sovereign Emergency Interface) for final adjudication.

### Step 3: Stop Accepting New Work

**Actor:** WGE (Work Generation Engine)
**Systems:** WGE, BPMN

1. WGE venture cell creation is halted — no new cells can be created
2. BPMN workflows stop accepting new process instances
3. All agent inboxes are frozen — no new tasks accepted
4. External API endpoints return `503 Service Shutting Down`
5. AINE state updated: `DYING → DRAINING`

### Step 4: Drain Existing Obligations

**Actor:** ORF (Obligation Resolution Framework)
**Systems:** ORF, ACTS

All in-flight obligations must reach a terminal state:

1. Enumerate all ORF envelopes in non-terminal states (`proposed`, `accepted`, `executing`)
2. For `executing` obligations with irreversible actions: **wait for completion**
3. For `proposed` obligations: transition to `cancelled`
4. For `accepted` but not started: transition to `cancelled`
5. Set a maximum drain timeout (configurable, default: 4 hours)
6. If timeout exceeded: force-cancel remaining obligations with audit notation

```
Obligation Drain Status:
  Total in-flight:  47
  Completed:        38
  Cancelled:         7
  Force-cancelled:   2
  Remaining:         0
  Drain time:       47 minutes
```

### Step 5: Archive All Audit Records to ECS

**Actor:** ACTS / ECS
**Systems:** ACTS, ECS (Evidence Custody System)

1. Export the complete audit ledger for this AINE
2. Compute integrity hash over the full audit trail
3. Transfer to ECS with tamper-evident sealing
4. Verify archive integrity (hash comparison)
5. Set retention period per jurisdiction requirements (minimum: 7 years)

```
Archive Summary:
  AINE ID:          aine-a1b2c3d4
  Audit Events:     1,247,893
  Date Range:       2025-06-15 → 2026-03-01
  Archive Hash:     sha256:def456...
  Retention Until:  2033-03-01
  ECS Location:     ecs://vault-us-west/aine-a1b2c3d4/final
```

### Step 6: Seal PEP Encryption Keys

**Actor:** PEP (Policy Enforcement Point)
**Systems:** PEP, ECS

1. Rotate all encryption keys one final time
2. Encrypt the final key material with the ECS archival key
3. Destroy the active key material from K8s secrets
4. Store sealed keys in ECS alongside audit archive
5. Verify no plaintext keys remain in the namespace

This ensures that archived data can be decrypted for legal/regulatory purposes by ECS key holders, but no active system retains access.

### Step 7: MES Executes Namespace Deletion

**Actor:** MES (Mortality Execution System)
**Systems:** MES, EMS

1. Verify all prior steps are complete (drain, archive, seal)
2. Scale all deployments to zero replicas
3. Delete all K8s resources in the AINE namespace
4. Delete the namespace itself
5. Verify no orphaned resources remain

```bash
# Executed by MES (automated)
kubectl delete namespace aine-a1b2c3d4 --grace-period=30
```

AINE state updated: `DRAINING → DEAD`

### Step 8: Update GAAGR Registry

**Actor:** GAAGR (Global AINE Agent Governance Registry)
**Systems:** GAAGR

1. Update AINE status in GAAGR: `DEAD`
2. Record death timestamp and reason
3. Record archive location (ECS reference)
4. Remove from active AINE listings
5. Retain historical record indefinitely

### Step 9: RPS Registers Resurrection Prevention

**Actor:** RPS (Resurrection Prevention System)
**Systems:** RPS

1. Add the genome hash to the resurrection blacklist
2. Add the AINE ID to the blacklist
3. Configure prevention rules:
   - Same genome hash cannot be reused
   - Same NLO + same industry + same jurisdiction triggers review
4. Set blacklist expiry (default: permanent, configurable)

This prevents accidental or malicious re-creation of a dead AINE with the same configuration.

### Step 10: Final Audit Entry — Death Certificate

**Actor:** ACTS
**Systems:** ACTS, ECS

The final audit entry serves as the AINE's death certificate:

```json
{
  "event": "governance.aine.death-certificate",
  "aineId": "aine-a1b2c3d4",
  "genomeHash": "sha256:abc123...",
  "deathTrigger": "performance_threshold",
  "deathReason": "Revenue below 20% of target for 3 consecutive quarters",
  "nloId": "nlo-jane-doe-001",
  "nloAcknowledged": true,
  "obligationsDrained": 47,
  "obligationsForced": 2,
  "archiveHash": "sha256:def456...",
  "archiveLocation": "ecs://vault-us-west/aine-a1b2c3d4/final",
  "keysSealed": true,
  "namespaceDeleted": true,
  "gaaggrUpdated": true,
  "resurrectionPrevented": true,
  "timestamp": "2026-03-01T15:47:00Z",
  "state": "DEAD (FINAL)"
}
```

This event is written to both the AINE's sealed audit archive and the global ACTS ledger.

## Rollback Procedures

| Step | Rollback Possible? | Notes |
|------|-------------------|-------|
| Step 1-3 | Yes | Cancel death, restore to OPERATING state |
| Step 4 (partial drain) | Yes | Re-open obligation acceptance |
| Step 5+ (archive begun) | No | Once archival begins, death is irreversible |
| Step 7 (namespace deleted) | No | Data is gone; only archive remains |

**Important:** Death becomes irreversible after Step 5 begins. The NLO has until Step 4 completion to contest and cancel the death process.

## Post-Procedure Verification

- [ ] AINE appears in GAAGR with state `DEAD`
- [ ] K8s namespace is fully deleted (no orphaned resources)
- [ ] Audit archive is sealed in ECS with verified integrity hash
- [ ] PEP encryption keys are sealed and active material destroyed
- [ ] RPS blacklist entry exists for genome hash and AINE ID
- [ ] Death certificate event is logged in global ACTS ledger
- [ ] NLO has acknowledged death notification
- [ ] All dependent AINEs have been notified

## Related Documents

- [SOP: AINE Creation](./sop-aine-creation.md)
- [BPMN: AINE Lifecycle](./bpmn-aine-lifecycle.md)
- [SOP: Incident Response](./sop-incident-response.md)
- [Systems: TDES](/docs/systems/cluster-4/tdes)
- [Systems: MES](/docs/systems/cluster-4/mes)
- [Systems: RPS](/docs/systems/cluster-4/rps)
- [Systems: ECS](/docs/systems/cluster-4/ecs)
