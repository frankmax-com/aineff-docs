---
sidebar_position: 1
title: "BPMN Engine"
description: "BPMN-as-a-Service for process visualization and workflow execution across AINEs"
---

# BPMN Engine

| Field | Value |
|-------|-------|
| System ID | `aineff-bpmn` |
| Package | `@aineff/bpmn` |
| Cluster | Cluster 6 -- Intelligence |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

The BPMN Engine provides process modeling, visualization, and execution capabilities
for AINE operations. It translates enterprise genomes into executable BPMN workflows,
renders real-time process visualizations for the operator dashboard, and orchestrates
multi-step business processes across agent constellations. Every AINE operation is
modeled as a BPMN process, making complex AI workflows auditable and human-readable.

## Standalone Revenue

**BPMN-as-a-Service** -- subscription product for organizations needing process
modeling and execution for AI-driven workflows.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Process definitions | BPMN 2.0 XML / JSON |
| IN | Process execution triggers | Event-driven / REST API |
| OUT | Process instances | Running workflow state |
| OUT | Visualization data | SVG / JSON diagram data |

## Events Emitted

- `bpmn.process.started` -- workflow execution initiated
- `bpmn.process.completed` -- workflow finished successfully
- `bpmn.task.assigned` -- task routed to agent or human
- `bpmn.process.failed` -- workflow execution failed
- `bpmn.initialized` -- system startup complete
- `bpmn.heartbeat` -- periodic health signal

## Events Consumed

- `ems.enterprise.created` -- instantiates AINE-specific workflows
- `acos.orchestration.requested` -- agent orchestration triggers processes
- `hoes.escalation.created` -- human tasks within BPMN workflows

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EMS | <-- | Enterprise creation triggers workflow setup |
| ACOS | <--> | Agent orchestration mapped to BPMN processes |
| HOES | <--> | Human tasks in workflows route through HOES |
| RAMS | <-- | Role context determines task assignment |
| Telemetry | --> | Emits process execution metrics |
| ACTS | --> | Logs workflow audit trail |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-bpmn
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: bpmn
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: intelligence
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-bpmn
  template:
    spec:
      containers:
        - name: bpmn
          image: ghcr.io/frankmax-com/aineff-bpmn:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: "2"
              memory: 1Gi
```
