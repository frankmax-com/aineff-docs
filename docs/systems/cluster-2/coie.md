---
sidebar_position: 7
title: "Conflict-of-Interest Engine"
description: "Detects and flags conflicts of interest across roles, ownership, and decisions"
---

# Conflict-of-Interest Engine (COIE)

| Field | Value |
|-------|-------|
| System ID | `aineff-coie` |
| Package | `@aineff/coie` |
| Cluster | Cluster 2 -- Governance |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

COIE continuously scans the governance graph for conflicts of interest -- situations
where a human or agent holds roles, ownership stakes, or authority that could compromise
impartial decision-making. It cross-references RAMS role assignments, OGCRS ownership
graphs, and HCL coordination records to detect actual and potential conflicts, then
triggers appropriate recusal or escalation workflows.

## Standalone Revenue

**COI detection API** -- per-query and subscription pricing for organizations needing
automated conflict-of-interest screening for boards, committees, and AI governance bodies.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | COI screening requests | JSON entity pairs |
| IN | Ongoing monitoring subscriptions | Event stream registration |
| OUT | Conflict assessments | Severity + affected parties |
| OUT | Recusal directives | Event to HOES |

## Events Emitted

- `coie.conflict.detected` -- conflict of interest identified
- `coie.conflict.cleared` -- previously flagged conflict resolved
- `coie.recusal.required` -- entity must recuse from decision
- `coie.initialized` -- system startup complete
- `coie.heartbeat` -- periodic health signal

## Events Consumed

- `rams.role.assigned` -- role changes may create conflicts
- `ogcrs.ownership.declared` -- ownership changes may create conflicts
- `hcl.coordination.completed` -- coordination patterns may reveal conflicts

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| RAMS | <-- | Role assignment data |
| OGCRS | <-- | Ownership graph data |
| HCL | <-- | Coordination patterns |
| HOES | --> | Escalates conflicts requiring human resolution |
| RAMS | --> | Triggers role recusal actions |
| ACTS | --> | Logs all conflict detections |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-coie
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: coie
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-coie
  template:
    spec:
      containers:
        - name: coie
          image: ghcr.io/frankmax-com/aineff-coie:latest
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
