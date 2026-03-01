---
sidebar_position: 6
title: "Agent Composition & Orchestration"
description: "Orchestration-as-a-Service for composing and coordinating AI agent constellations"
---

# Agent Composition & Orchestration (ACOS)

| Field | Value |
|-------|-------|
| System ID | `aineff-acos` |
| Package | `@aineff/acos` |
| Cluster | Cluster 6 -- Intelligence |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

ACOS manages the lifecycle and coordination of AI agent constellations within AINEs.
It handles agent composition (selecting which agents to deploy), orchestration (routing
work between agents), scaling (adding/removing agents based on load), and health
monitoring (detecting and replacing failing agents). ACOS is the brain that turns a
collection of individual agents into a coherent enterprise workforce.

## Standalone Revenue

**Orchestration-as-a-Service** -- subscription product for organizations needing
multi-agent coordination infrastructure for their AI operations.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Orchestration definitions | JSON workflow specs |
| IN | Agent health signals | Heartbeat + metrics |
| OUT | Agent deployment commands | K8s API |
| OUT | Orchestration state | Real-time status stream |

## Events Emitted

- `acos.orchestration.requested` -- new orchestration initiated
- `acos.agent.deployed` -- individual agent deployed to constellation
- `acos.agent.removed` -- agent removed from constellation
- `acos.constellation.healthy` -- all agents passing health checks
- `acos.initialized` -- system startup complete
- `acos.heartbeat` -- periodic health signal

## Events Consumed

- `ems.agents.deployed` -- initial agent constellation from creation
- `bpmn.task.assigned` -- BPMN tasks assigned to agent groups
- `rams.role.assigned` -- role context for agent authority
- `telemetry.anomaly.detected` -- triggers agent scaling/replacement

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| EMS | <-- | Initial agent constellation |
| BPMN | <--> | BPMN tasks drive agent orchestration |
| RAMS | <-- | Authority context for agent actions |
| Telemetry | <--> | Metrics inform scaling, reports health |
| Protocol Router | --> | Agent-to-agent messaging |
| ACTS | --> | Logs all orchestration decisions |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-acos
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: acos
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: intelligence
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aineff-acos
  template:
    spec:
      containers:
        - name: acos
          image: ghcr.io/frankmax-com/aineff-acos:latest
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
