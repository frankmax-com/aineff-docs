---
sidebar_position: 3
title: "AINE Runtime"
description: "Enterprise runtime hosting on Kubernetes --- manages agent pods, PEP network, authority matrix, and telemetry for AI-native enterprise instances."
---

# AINE Runtime

The **AINE Runtime** (AI-Native Enterprise Runtime) is the core hosting platform for AINEFF enterprise instances. Each AINE is a fully isolated enterprise runtime that manages its own agent pods, enforces its own authority matrix, runs its own PEP (Policy Enforcement Point) network, and emits its own telemetry. AINE Runtime is the unit of deployment --- one AINE per enterprise.

## System Identity

| Field | Value |
|-------|-------|
| System ID | `aineff-aine-runtime` |
| Package | `@aineff/aine-runtime` |
| Cluster | Platform |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |
| Revenue | Hosting fees per runtime instance |
| Repository | `aineff-aine-runtime` |

## Core Concepts

### What is an AINE?

An AINE is a **single enterprise instance** --- a self-contained runtime that encapsulates all the systems, agents, governance, and data for one enterprise. Think of it as a "virtual enterprise" running on Kubernetes.

```
┌─────────────────────────────────────────────────────┐
│                    AINE Instance                     │
│                  (Enterprise ABC)                    │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Agent    │  │ Agent    │  │  Venture Cells    │  │
│  │ Pod 1   │  │ Pod 2   │  │  (from WGE)       │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                  │            │
│  ┌────v──────────────v──────────────────v─────────┐  │
│  │              PEP Network (ORF)                 │  │
│  └────────────────────┬──────────────────────────┘  │
│                       │                              │
│  ┌────────────────────v──────────────────────────┐  │
│  │            Authority Matrix (RAMS)            │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Audit    │  │ Telemetry│  │  Governance       │  │
│  │ Logger   │  │ Collector│  │  SDK              │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### AINE Lifecycle

Every AINE follows a defined lifecycle managed by the runtime:

```
  Birth → Configuration → Active → Monitoring → Death
    │          │              │          │          │
    │          │              │          │          └── TDES terminates, audit sealed
    │          │              │          └── Continuous telemetry, decay detection
    │          │              └── Running, processing, generating revenue
    │          └── Authority matrix loaded, PEP deployed, agents initialized
    └── EGMS creates enterprise structure, EMS enrolls
```

### Namespace Isolation

Each AINE gets its own Kubernetes namespace with strict isolation:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aine-enterprise-abc
  labels:
    aineff.io/aine-id: "enterprise-abc"
    aineff.io/tier: "production"
    aineff.io/orf-enabled: "true"
```

## Architecture

### Runtime Components

| Component | Function | K8s Resource |
|-----------|----------|-------------|
| **Agent Controller** | Manages agent pod lifecycle | Deployment |
| **PEP Gateway** | ORF constraint enforcement at network edge | DaemonSet |
| **Authority Service** | RAMS authority matrix evaluation | StatefulSet |
| **Telemetry Collector** | Metrics, traces, logs aggregation | DaemonSet |
| **State Manager** | AINE state persistence and recovery | StatefulSet |
| **Event Bus** | Inter-system event routing | Deployment |
| **Decay Monitor** | Detects AINE health degradation | CronJob |

### Agent Pod Management

The AINE Runtime manages agent pods through a declarative spec:

```typescript
interface AgentPodSpec {
  agentId: string;
  agentType: 'jarvis-ceo' | 'specialist' | 'venture-cell-member';
  resources: {
    cpu: string;       // e.g., '500m'
    memory: string;    // e.g., '1Gi'
    gpu?: string;      // Optional GPU allocation
  };
  skills: string[];     // From skill registry
  authorityLevel: number;
  ventureCell?: string; // If part of a WGE venture cell
  model: {
    provider: string;   // AI model provider
    modelId: string;    // Specific model
    fallback?: string;  // Fallback model
  };
}
```

### PEP Network

Every inter-pod and inter-system communication passes through ORF Policy Enforcement Points:

```
Pod A ──→ PEP Sidecar ──→ NetworkPolicy ──→ PEP Sidecar ──→ Pod B
              │                                    │
              └──→ Audit Logger ←──────────────────┘
```

```yaml
# NetworkPolicy enforcing PEP requirement
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: enforce-pep
  namespace: aine-enterprise-abc
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              aineff.io/pep: "true"
  egress:
    - to:
        - podSelector:
            matchLabels:
              aineff.io/pep: "true"
```

### Authority Matrix

The authority matrix defines what each actor (human or agent) can do within this AINE:

```typescript
interface AuthorityMatrix {
  aineId: string;
  entries: AuthorityEntry[];
}

interface AuthorityEntry {
  actorId: string;
  actorType: 'human-operator' | 'agent' | 'system';
  level: 1 | 2 | 3 | 4 | 5;
  permissions: Permission[];
  constraints: ORFConstraint[];
  expiresAt?: Date;
}

type Permission =
  | 'agent.create'
  | 'agent.terminate'
  | 'venture-cell.create'
  | 'venture-cell.approve'
  | 'deployment.approve'
  | 'expenditure.approve'
  | 'authority.delegate'
  | 'aine.shutdown';
```

## Configuration

```typescript
interface AINERuntimeConfig {
  systemId: string;
  version: string;
  enabled: boolean;

  // Instance settings
  instance: {
    aineId: string;
    enterpriseName: string;
    tier: 'development' | 'staging' | 'production';
    region: string;
  };

  // Resource limits
  resources: {
    maxAgentPods: number;          // Default: 50
    maxVentureCells: number;       // Default: 10
    maxConcurrentActions: number;  // Default: 100
    storageQuotaGb: number;       // Default: 100
  };

  // Telemetry
  telemetry: {
    metricsIntervalMs: number;     // Default: 15000
    tracesSampleRate: number;      // Default: 0.1
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };

  // ORF integration
  orf: {
    pepMode: 'sidecar' | 'gateway';
    failClosed: boolean;           // Default: true
  };
}
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `aineff-aine-runtime.initialized` | `{ aineId, config }` | AINE startup complete |
| `aineff-aine-runtime.heartbeat` | `{ aineId, podCount, health }` | Every 30s |
| `aineff-aine-runtime.agent.spawned` | `{ agentId, agentType, podSpec }` | New agent pod created |
| `aineff-aine-runtime.agent.terminated` | `{ agentId, reason }` | Agent pod removed |
| `aineff-aine-runtime.agent.action` | `{ agentId, action, context }` | Agent performing an action (sent to ORF) |
| `aineff-aine-runtime.authority.evaluated` | `{ actorId, permission, result }` | Authority check completed |
| `aineff-aine-runtime.decay.detected` | `{ aineId, decayScore, signals }` | Health degradation detected |
| `aineff-aine-runtime.shutdown` | `{ aineId, reason, auditTrailId }` | AINE graceful shutdown |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `aineff-orf.obligation.created` | ORF Protocol | Register obligation in AINE state |
| `aineff-orf.pep.denied` | ORF Protocol | Log and alert on denied actions |
| `aineff-wge.cell.created` | WGE | Provision agent pods for venture cell |
| `aineff-rams.authority.changed` | RAMS | Reload authority matrix |
| `aineff-egms.enterprise.created` | EGMS | Initialize new AINE instance |
| `aineff-tdes.death.initiated` | TDES | Begin AINE shutdown sequence |

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| ORF Protocol | Bidirectional | Constraint requests / enforcement results |
| AINEG Coordinator | Outbound | AINE health, metrics, revenue data |
| WGE | Inbound | Venture cell provisioning requests |
| RAMS | Inbound | Authority matrix updates |
| EGMS | Inbound | Enterprise creation signals |
| TDES | Inbound | Death/termination signals |
| Telemetry | Outbound | All runtime metrics |
| Audit Logger | Outbound | All operations audit trail |

## Deployment

### Helm Chart

```yaml
# values.yaml for AINE Runtime
replicaCount: 3

image:
  repository: aineff/aine-runtime
  tag: latest

aine:
  tier: production
  maxAgentPods: 50
  maxVentureCells: 10

orf:
  pepMode: sidecar
  failClosed: true

telemetry:
  metricsInterval: 15s
  tracesSampleRate: 0.1

resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 2000m
    memory: 2Gi

persistence:
  enabled: true
  storageClass: fast-ssd
  size: 100Gi
```

### Multi-AINE Deployment

For hosting multiple AINEs on a single cluster:

```
Cluster
├── Namespace: aine-enterprise-abc     (AINE #1)
│   ├── aine-runtime (controller)
│   ├── pep-gateway
│   ├── agent-pod-1 ... agent-pod-N
│   └── telemetry-collector
├── Namespace: aine-enterprise-def     (AINE #2)
│   ├── aine-runtime (controller)
│   ├── pep-gateway
│   ├── agent-pod-1 ... agent-pod-M
│   └── telemetry-collector
└── Namespace: aineff-platform         (Shared)
    ├── orf-protocol
    ├── aineg-coordinator
    └── telemetry-aggregator
```

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | Each AINE Runtime instance generates hosting revenue. Enterprises pay per-instance fees based on tier, resource consumption, and agent count. |
| **Composed** | AINE Runtime is the mandatory hosting layer for all other platforms. Every WGE venture cell, every LevelupMax-trained operator, every Frankmax engagement --- all require a running AINE. AINE is the multiplier for all other platform revenue. |
