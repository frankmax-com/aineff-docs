---
sidebar_label: "SOP: Incident Response"
sidebar_position: 9
---

# SOP: Incident Response for AINE Failures

**Version:** v1.0.0 | **Date:** 2026-03-01 | **SOP ID:** SOP-IR-001

## Summary

This Standard Operating Procedure defines the detection, classification, escalation, and resolution process for AINE failures. It covers the full incident lifecycle from telemetry detection through root cause analysis and lessons learned.

## Severity Levels

| Severity | Description | Response Time | Escalation |
|----------|-------------|---------------|------------|
| **Low** | Minor degradation, no revenue impact | 24 hours | Operator notification |
| **Medium** | Partial capability loss, minor revenue impact | 4 hours | Operator + NLO notification |
| **High** | Significant capability loss, revenue impact | 1 hour | Operator + NLO + Platform team |
| **Critical** | Complete AINE failure or systemic harm risk | 15 minutes | All stakeholders + SEI evaluation |

## Prerequisites

| Prerequisite | Description | Verified By |
|-------------|-------------|-------------|
| Monitoring Active | Telemetry and alerting systems operational | Platform team |
| On-Call Operator | LevelupMax Level 2+ operator available | HOES |
| Runbook Access | Operator has access to operational runbooks | LevelupMax |
| Communication Channels | Alert routing configured (email, Slack, PagerDuty) | HOES |

## Roles Involved

| Role | System | Responsibility |
|------|--------|---------------|
| Telemetry Monitor | Telemetry System | Detects anomalies |
| Failure Classifier | FMS | Classifies severity |
| Harm Evaluator | SHFS | Evaluates systemic harm potential |
| Emergency Controller | SEI | Can trigger emergency halt |
| Human Operator | HOES / LevelupMax | Diagnoses and resolves |
| Audit Logger | ACTS | Records all actions |
| Pattern Learner | PDES | Improves future detection |

## Procedure

### Step 1: Telemetry Detects Anomaly

**Actor:** Telemetry System (automated)
**Systems:** Telemetry, Monitoring

The telemetry system continuously monitors AINE health across multiple dimensions:

```
Anomaly Detection Channels:
─────────────────────────────────────────────────────
Channel              Metric                 Threshold
─────────────────────────────────────────────────────
Health               Agent pod restarts     > 3 in 5 min
Health               Memory usage           > 90%
Health               CPU usage              > 85% sustained
Revenue              Daily revenue          < 50% of target
Revenue              Revenue trend          3-day declining
Governance           Authority violations   Any occurrence
Governance           ORF rejection rate     > 20%
Compliance           Audit gaps             Any occurrence
Compliance           Jurisdiction violation Any occurrence
Infrastructure       Node health            NotReady
Infrastructure       PV capacity            > 85%
─────────────────────────────────────────────────────
```

**Anomaly Event:**

```json
{
  "event": "telemetry.anomaly.detected",
  "aineId": "aine-a1b2c3d4",
  "channel": "health",
  "metric": "agent_pod_restarts",
  "value": 5,
  "threshold": 3,
  "period": "5m",
  "agentId": "operations-v2",
  "timestamp": "2026-03-01T14:22:00Z"
}
```

### Step 2: FMS Classifies Failure

**Actor:** FMS (Failure Management System, automated)
**Systems:** FMS

FMS evaluates the anomaly against classification rules:

```
Failure Classification — incident-2026030114220
────────────────────────────────────────────────
Anomaly:        Agent pod restarts (5 in 5 min)
Agent:          operations-v2
AINE:           aine-a1b2c3d4
────────────────────────────────────────────────
Impact Assessment:
  Revenue Impact:     Partial (operations agent handles 30% of tasks)
  Data Loss Risk:     Low (ORF ensures obligation tracking)
  Cascade Risk:       Medium (other agents depend on operations)
  Compliance Risk:    Low (audit trail maintained)
────────────────────────────────────────────────
Classification:       MEDIUM
Response Time:        4 hours
────────────────────────────────────────────────
```

**Decision Point:** Based on severity:

| Severity | Next Step |
|----------|-----------|
| Low | Skip to Step 5 (operator notification only) |
| Medium | Skip to Step 5 (operator + NLO notification) |
| High | Skip to Step 5 (full escalation) |
| Critical | Proceed to Step 3 (SHFS evaluation) |

### Step 3: SHFS Evaluates Systemic Harm Potential (Critical Only)

**Actor:** SHFS (Systemic Harm Failsafe System, automated)
**Systems:** SHFS

For critical-severity incidents, SHFS evaluates whether the failure could cause systemic harm:

```
SHFS Systemic Harm Evaluation
══════════════════════════════════════════
Incident:           incident-2026030114220
Severity:           CRITICAL
──────────────────────────────────────────
Harm Dimensions:
  Financial:        Can the failure cause uncontrolled financial loss?
  Legal:            Can the failure create legal liability?
  Cascade:          Can the failure propagate to other AINEs?
  Physical:         Can the failure cause physical harm?
  Data:             Can the failure cause data breach/loss?
──────────────────────────────────────────
Evaluation:         SYSTEMIC HARM POSSIBLE
Recommendation:     EMERGENCY HALT RECOMMENDED
══════════════════════════════════════════
```

**Decision Point:** If systemic harm is possible, proceed to Step 4. Otherwise, proceed to Step 5.

### Step 4: SEI Emergency Halt (If Systemic Harm Detected)

**Actor:** SEI (Sovereign Emergency Interface)
**Systems:** SEI, EMS

The SEI has the authority to trigger an immediate emergency halt:

```
╔══════════════════════════════════════════╗
║         EMERGENCY HALT ACTIVATED         ║
║                                          ║
║  AINE: aine-a1b2c3d4                     ║
║  Reason: Systemic harm potential         ║
║  Time: 2026-03-01T14:22:15Z             ║
║                                          ║
║  Actions Taken:                          ║
║  1. All agent pods scaled to 0           ║
║  2. All ORF envelopes frozen             ║
║  3. External APIs disabled               ║
║  4. NLO notified immediately             ║
║  5. Platform team paged                  ║
║                                          ║
║  State: OPERATING → HALTED               ║
╚══════════════════════════════════════════╝
```

The AINE remains in `HALTED` state until a human operator explicitly releases the halt after investigation.

### Step 5: HOES Escalates to Human Operator

**Actor:** HOES (Human Oversight Escalation System)
**Systems:** HOES, LevelupMax

HOES routes the incident to the appropriate human operator based on severity and on-call schedule:

```
INCIDENT ALERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Incident ID:    incident-2026030114220
AINE:           aine-a1b2c3d4
Severity:       MEDIUM
Agent:          operations-v2
Issue:          Pod crash loop (5 restarts in 5 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Impact:         30% task processing degraded
Response SLA:   4 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Assigned To:    operator-john-smith-L2
Escalation:     NLO (if unresolved in 2 hours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 6: Operator Diagnoses and Resolves

**Actor:** Human Operator (LevelupMax Level 2+)
**Systems:** Operator Dashboard, K8s, RAMS

The operator diagnoses the root cause and selects the appropriate resolution:

#### Resolution A: Agent Restart (Agent-Level Failure)

For failures isolated to a single agent (crash loop, OOM, deadlock):

```
Resolution: Agent Restart
────────────────────────────────────────
1. Check agent logs for crash reason
   $ kubectl logs operations-v2-pod -n aine-a1b2c3d4 --previous
2. Identify root cause (OOM, unhandled exception, dependency failure)
3. If OOM: increase memory limits
   $ kubectl patch deployment operations-v2 -n aine-a1b2c3d4 \
     -p '{"spec":{"template":{"spec":{"containers":[{"name":"agent","resources":{"limits":{"memory":"2Gi"}}}]}}}}'
4. Delete the crashing pod (K8s will recreate)
   $ kubectl delete pod operations-v2-pod-xyz -n aine-a1b2c3d4
5. Monitor for stability (15 minutes)
6. Verify agent health checks pass
────────────────────────────────────────
```

#### Resolution B: Authority Adjustment (Governance Failure)

For failures related to authority or governance:

```
Resolution: Authority Adjustment
────────────────────────────────────────
1. Check authority status in RAMS
2. If authority decayed: execute Authority Decay SOP (RENEW/MODIFY)
3. If RBAC misconfigured: regenerate and apply RBAC manifests
4. If governance rules violated: review and update governance model
5. Verify ORF rejection rate returns to normal
────────────────────────────────────────
```

See [SOP: Authority Decay](./sop-authority-decay.md) for detailed authority resolution.

#### Resolution C: AINE Decay Trigger (Unrecoverable Failure)

For failures that cannot be resolved without destroying the AINE:

```
Resolution: AINE Death Trigger
────────────────────────────────────────
1. Confirm failure is unrecoverable with NLO
2. Document reason for death decision
3. Execute AINE Death SOP
4. If needed: create new AINE with corrected genome
────────────────────────────────────────
```

See [SOP: AINE Death](./sop-aine-death.md) for the full death procedure.

### Step 7: Root Cause Analysis Logged to ACTS

**Actor:** Human Operator + ACTS
**Systems:** ACTS

After resolution, the operator documents the root cause analysis:

```json
{
  "event": "incident.resolved",
  "incidentId": "incident-2026030114220",
  "aineId": "aine-a1b2c3d4",
  "severity": "MEDIUM",
  "rootCause": {
    "category": "resource_exhaustion",
    "detail": "Operations agent processing large batch job exceeded memory limits",
    "contributing": [
      "Memory limit set too low for batch processing workload",
      "No memory-based HPA configured for burst workloads"
    ]
  },
  "resolution": {
    "type": "agent_restart",
    "actions": [
      "Increased memory limit from 1Gi to 2Gi",
      "Added HPA with memory target of 70%",
      "Restarted agent pod"
    ]
  },
  "timeline": {
    "detected": "2026-03-01T14:22:00Z",
    "classified": "2026-03-01T14:22:05Z",
    "notified": "2026-03-01T14:22:30Z",
    "acknowledged": "2026-03-01T14:35:00Z",
    "resolved": "2026-03-01T15:10:00Z"
  },
  "timeToResolve": "48 minutes",
  "withinSLA": true,
  "timestamp": "2026-03-01T15:15:00Z"
}
```

### Step 8: Lessons Learned Feed Back to PDES

**Actor:** PDES (Pattern Discovery & Evolution System, automated)
**Systems:** PDES

The incident data feeds back into the pattern discovery system:

1. PDES ingests the incident record and root cause analysis
2. Correlates with historical incidents across all AINEs
3. Identifies recurring patterns (e.g., "operations agents frequently OOM on batch jobs")
4. Generates improvement recommendations:
   - Default resource limits should be higher for operations agents
   - Batch processing should be chunked to limit memory usage
   - HPA should be standard for all agent deployments
5. Recommendations are reviewed by platform team for implementation

```
PDES Pattern Analysis
──────────────────────────────────────────
Pattern:        OOM on batch processing
Occurrences:    7 incidents across 4 AINEs in last 90 days
Confidence:     0.92
──────────────────────────────────────────
Recommendation: Update operations-agent template
  - Default memory limit: 1Gi → 2Gi
  - Add mandatory HPA configuration
  - Add batch chunking middleware
──────────────────────────────────────────
Status:         Pending platform team review
```

## Incident Response Flowchart

```
○ Anomaly Detected
│
▼
┌─────────────────┐
│ FMS: Classify   │
│ Severity        │
└────────┬────────┘
         │
    ◇ Severity?
    │    │    │    │
   Low  Med  High  Critical
    │    │    │    │
    │    │    │    ▼
    │    │    │  ┌─────────────────┐
    │    │    │  │ SHFS: Evaluate  │
    │    │    │  │ Systemic Harm   │
    │    │    │  └────────┬────────┘
    │    │    │           │
    │    │    │      ◇ Systemic?
    │    │    │      │        │
    │    │    │     Yes       No
    │    │    │      │        │
    │    │    │      ▼        │
    │    │    │  ┌──────────┐ │
    │    │    │  │ SEI:     │ │
    │    │    │  │ HALT     │ │
    │    │    │  └────┬─────┘ │
    │    │    │       │       │
    └────┴────┴───────┴───────┘
              │
              ▼
    ┌─────────────────┐
    │ HOES: Escalate  │
    │ to Operator     │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Operator:       │
    │ Diagnose        │
    └────────┬────────┘
             │
        ◇ Resolution?
        │      │      │
     Restart  Auth   Death
        │    Adjust  Trigger
        │      │      │
        └──────┴──────┘
               │
               ▼
    ┌─────────────────┐
    │ ACTS: Log RCA   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ PDES: Pattern   │
    │ Learning        │
    └────────┬────────┘
             │
             ▼
         ◉ Resolved
```

## Post-Incident Checklist

- [ ] Incident severity correctly classified
- [ ] Appropriate stakeholders notified within SLA
- [ ] If critical: SHFS evaluation completed
- [ ] If systemic harm: SEI halt executed (if applicable)
- [ ] Root cause identified and documented
- [ ] Resolution applied and verified
- [ ] AINE health restored to normal
- [ ] ACTS audit entry complete with RCA
- [ ] PDES has ingested the incident for pattern learning
- [ ] Any follow-up actions assigned and tracked

## Related Documents

- [SOP: Authority Decay](./sop-authority-decay.md)
- [SOP: AINE Death](./sop-aine-death.md)
- [SOP: LevelupMax Certification](./sop-levelupmax-certification.md)
- [BPMN: ORF Obligation Lifecycle](./bpmn-orf-obligation.md)
- [Runbook: Kubernetes Operations](./runbook-k8s-operations.md)
- [Systems: FMS](/docs/systems/cluster-4/fms)
- [Systems: SHFS](/docs/systems/cluster-5/shfs)
- [Systems: SEI](/docs/systems/cluster-5/sei)
