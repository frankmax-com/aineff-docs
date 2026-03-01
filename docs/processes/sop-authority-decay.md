---
sidebar_label: "SOP: Authority Decay"
sidebar_position: 5
---

# SOP: Authority Decay and Re-Authorization

**Version:** v1.0.0 | **Date:** 2026-03-01 | **SOP ID:** SOP-GOV-001

## Summary

This Standard Operating Procedure defines how agent authority decays over time, how the system detects and responds to low-authority conditions, and how human operators re-authorize agents. Authority decay is a core governance mechanism in AINEFF that ensures no agent retains unchecked authority indefinitely.

## Core Principle

> **No agent operates with permanent authority.** Every authority grant has a decay rate and an expiry. Human oversight is mandatory for renewal.

## Authority Decay Formula

```
current_level = initial_level * (1 - decay_rate * days_elapsed)
```

**Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `initial_level` | Authority level at time of grant (1-10 scale) | 8 |
| `decay_rate` | Daily decay rate (0.0 - 1.0) | 0.02 |
| `days_elapsed` | Days since authority was granted | 30 |
| `current_level` | Effective authority right now | 8 * (1 - 0.02 * 30) = 3.2 |

**Threshold:** When `current_level` drops below the configured threshold (default: 20% of `initial_level`), the decay event is triggered.

## Prerequisites

| Prerequisite | Description | Verified By |
|-------------|-------------|-------------|
| ADS Running | Authority Decay System CronJob is healthy | K8s / Monitoring |
| HOES Available | Human Oversight Escalation System is operational | HOES |
| Operator Certified | At least one Level 2 certified operator is available | LevelupMax |
| RAMS Accessible | Role & Authority Management System is online | RAMS |

## Roles Involved

| Role | System | Responsibility |
|------|--------|---------------|
| Decay Monitor | ADS | Runs daily authority calculations |
| Escalation Handler | HOES | Notifies human operators |
| Human Operator | LevelupMax L2+ | Reviews and decides on authority |
| Role Manager | RAMS | Updates K8s RBAC |
| Audit Logger | ACTS | Records all decisions |

## Procedure

### Step 1: ADS Runs Daily CronJob

**Actor:** ADS (Authority Decay System)
**Schedule:** Daily at 00:00 UTC (configurable)

The ADS CronJob executes the following for every agent in every active AINE:

1. Retrieve all active authority grants from RAMS
2. Calculate `current_level` using the decay formula
3. Check if `current_level` is below the threshold
4. If below threshold: proceed to Step 2
5. If above threshold: log current levels and exit

```
ADS Daily Report — 2026-03-01
─────────────────────────────────────────────────────────────────
AINE: aine-a1b2c3d4
─────────────────────────────────────────────────────────────────
Agent              Initial  Decay   Days  Current  Threshold  Status
jarvis-ceo-v3      8.0      0.02    30    3.20     1.60       OK
operations-v2      6.0      0.03    30    0.60     1.20       DECAYED
finance-v2         6.0      0.03    25    1.50     1.20       OK
compliance-v1      5.0      0.04    30    -1.00    1.00       DECAYED
─────────────────────────────────────────────────────────────────
DECAYED AGENTS: 2     ACTION REQUIRED: Yes
```

### Step 2: Emit Decay Event and Restrict Capabilities

**Actor:** ADS (automated)
**Systems:** ADS, RAMS, ACTS

When an agent's authority drops below threshold:

1. **Emit event:** `governance.ads.authority-decayed`

```json
{
  "event": "governance.ads.authority-decayed",
  "aineId": "aine-a1b2c3d4",
  "agentId": "operations-v2",
  "initialLevel": 6.0,
  "currentLevel": 0.60,
  "threshold": 1.20,
  "decayRate": 0.03,
  "daysElapsed": 30,
  "timestamp": "2026-03-01T00:00:00Z"
}
```

2. **Restrict capabilities:** RAMS immediately downgrades the agent's K8s RBAC:
   - Write permissions revoked
   - External API access revoked
   - Agent enters read-only/advisory mode
   - ORF will reject new obligations from this agent

3. **Log to ACTS:** The restriction event is recorded in the audit trail

### Step 3: HOES Notifies Human Operator

**Actor:** HOES (Human Oversight Escalation System)
**Systems:** HOES, LevelupMax

HOES escalates to the appropriate human operator:

```
AUTHORITY DECAY ALERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AINE:       aine-a1b2c3d4 (acme-manufacturing)
Agent:      operations-v2
Authority:  0.60 / 6.00 (10.0% — BELOW THRESHOLD)
Status:     RESTRICTED — read-only mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action Required: RENEW, MODIFY, or REVOKE
Deadline:   48 hours (auto-revoke if no response)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Notification channels (configurable per AINE):
- Email to certified operator(s)
- Operator Dashboard alert
- Webhook to external systems (Slack, PagerDuty, etc.)

**Escalation Path:** If no response within 24 hours, escalate to NLO. If no response within 48 hours, auto-revoke.

### Step 4: Human Reviews Authority Grant

**Actor:** Human Operator (LevelupMax Level 2+)
**Systems:** Operator Dashboard, RAMS

The human operator reviews the authority grant and chooses one of three actions:

#### Option A: RENEW

Reset authority to initial level with a new expiry:

- Authority restored to `initial_level`
- Decay timer resets to day 0
- Expiry date set to new term (e.g., 90 days)
- Agent capabilities fully restored

```
Decision: RENEW
Agent:    operations-v2
New Level: 6.0 (restored to initial)
New Expiry: 2026-05-30
Decay Rate: 0.03/day (unchanged)
Reason:   "Agent performing well, renewal approved"
```

#### Option B: MODIFY

Adjust the scope, level, or decay rate:

- Authority level can be increased or decreased
- Decay rate can be adjusted (faster or slower decay)
- Scope can be narrowed (e.g., restrict to specific WGE cells)
- New expiry date set

```
Decision: MODIFY
Agent:    operations-v2
New Level: 4.0 (reduced from 6.0)
New Expiry: 2026-04-30 (shorter term)
Decay Rate: 0.02/day (slowed)
Scope:    Restricted to cell-manufacturing-001 only
Reason:   "Reducing scope after Q4 performance review"
```

#### Option C: REVOKE

Remove authority entirely:

- All authority revoked immediately
- Agent enters dormant state (no capabilities)
- If this is the last active agent: may trigger AINE death (see Step 4c below)

```
Decision: REVOKE
Agent:    operations-v2
Reason:   "Agent no longer needed — function consolidated"
```

**Decision Cascades:**
- If all agents in an AINE are revoked, TDES evaluates whether to trigger AINE death
- If the Jarvis CEO agent is revoked, the AINE cannot function — death is automatically triggered

### Step 5: RAMS Updates K8s RBAC

**Actor:** RAMS (automated)
**Systems:** RAMS, K8s

Based on the human decision:

1. Update the authority record in RAMS database
2. Generate new K8s RBAC manifests reflecting the decision
3. Apply RBAC changes to the AINE namespace
4. Verify agent capabilities match the new authority level
5. If RENEW or MODIFY: restore agent to active mode
6. If REVOKE: confirm agent is in dormant state

```bash
# Example RBAC update (automated by RAMS)
kubectl apply -f rbac-operations-v2-renewed.yaml -n aine-a1b2c3d4
```

### Step 6: ACTS Logs the Decision with ORF Binding

**Actor:** ACTS (automated)
**Systems:** ACTS, ORF

The complete decision is logged as an auditable, obligation-bound event:

```json
{
  "event": "governance.ads.authority-decision",
  "aineId": "aine-a1b2c3d4",
  "agentId": "operations-v2",
  "decision": "RENEW",
  "previousLevel": 0.60,
  "newLevel": 6.0,
  "newDecayRate": 0.03,
  "newExpiry": "2026-05-30T00:00:00Z",
  "decidedBy": "operator-john-smith-L2",
  "reason": "Agent performing well, renewal approved",
  "orfEnvelopeId": "orf-env-789xyz",
  "timestamp": "2026-03-01T09:15:00Z"
}
```

The ORF envelope ensures this decision is tracked as an obligation with full provenance.

## Authority Decay Examples

### Example 1: Standard Decay (90-day grant)

```
Day  0: authority = 8.0 * (1 - 0.02 *  0) = 8.00  [FULL]
Day 15: authority = 8.0 * (1 - 0.02 * 15) = 5.60  [OK]
Day 30: authority = 8.0 * (1 - 0.02 * 30) = 3.20  [OK]
Day 40: authority = 8.0 * (1 - 0.02 * 40) = 1.60  [THRESHOLD — 20% of 8.0]
Day 45: authority = 8.0 * (1 - 0.02 * 45) = 0.80  [DECAYED — restricted]
Day 50: authority = 8.0 * (1 - 0.02 * 50) = 0.00  [ZERO — auto-revoke]
```

### Example 2: Aggressive Decay (high-risk agent)

```
Day  0: authority = 5.0 * (1 - 0.05 *  0) = 5.00  [FULL]
Day  5: authority = 5.0 * (1 - 0.05 *  5) = 3.75  [OK]
Day 10: authority = 5.0 * (1 - 0.05 * 10) = 2.50  [OK]
Day 16: authority = 5.0 * (1 - 0.05 * 16) = 1.00  [THRESHOLD — 20% of 5.0]
Day 18: authority = 5.0 * (1 - 0.05 * 18) = 0.50  [DECAYED — restricted]
Day 20: authority = 5.0 * (1 - 0.05 * 20) = 0.00  [ZERO — auto-revoke]
```

## Rollback Procedures

| Scenario | Rollback Action |
|----------|----------------|
| Accidental REVOKE | Re-issue authority grant via RAMS (requires NLO approval) |
| RBAC update failed | RAMS retries automatically; manual kubectl intervention if needed |
| Incorrect MODIFY | Issue new MODIFY with correct parameters |

## Post-Procedure Verification

- [ ] ADS CronJob completed successfully (check K8s job logs)
- [ ] All decayed agents have been restricted in RAMS/RBAC
- [ ] HOES notifications were delivered to appropriate operators
- [ ] Human decisions are recorded in ACTS with ORF binding
- [ ] K8s RBAC reflects the current authority state for all agents
- [ ] No agent operates with expired or below-threshold authority

## Related Documents

- [SOP: AINE Creation](./sop-aine-creation.md) (initial authority assignment)
- [SOP: AINE Death](./sop-aine-death.md) (when all authority is revoked)
- [SOP: Incident Response](./sop-incident-response.md) (authority-related incidents)
- [Systems: ADS](/docs/systems/cluster-2/ads)
- [Systems: RAMS](/docs/systems/cluster-2/rams)
- [Systems: HOES](/docs/systems/cluster-2/hoes)
