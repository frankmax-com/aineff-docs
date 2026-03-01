---
sidebar_position: 4
title: "AINE Lifecycle"
description: "The full lifecycle state machine of an AI-Native Enterprise (AINE): from Genome Spec through birth, operation, decay, death, and resurrection prevention, mapped to Kubernetes primitives."
---

# AINE Lifecycle

An AI-Native Enterprise (AINE) has a deterministic lifecycle managed by a state machine. Every AINE is born, operates, decays, and dies. There is no ambiguity about which phase an AINE is in at any point in time.

This document describes the lifecycle state machine, the systems responsible for each transition, and how each phase maps to Kubernetes infrastructure.

---

## Lifecycle State Machine

```
                          ┌──────────────────┐
                          │                  │
                          │   GENOME SPEC    │ ◄── Enterprise genome authored
                          │   (definition)   │     (EGMS stores it)
                          │                  │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │
                          │   GCS COMPILE    │ ◄── Genome compiled into
                          │   (compilation)  │     deployable artifacts
                          │                  │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │
                          │   PDES EVALUATE  │ ◄── Pre-deployment checks:
                          │   (validation)   │     policy, risk, resources
                          │                  │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │     Authorization gate:
                          │   IGS GATE       │ ◄── human approval,
                          │   (authorization)│     compliance check,
                          │                  │     budget verification
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │     K8s namespace created,
                          │   EMS BIRTH      │ ◄── Helm release installed,
                          │   (instantiation)│     agents deployed as pods
                          │                  │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │     Active enterprise:
                          │   OPERATING      │ ◄── agents running,
                          │   (running)      │     workflows executing,
                          │                  │     revenue generating
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │     Authority expires,
                          │   TDES DECAY     │ ◄── performance drops,
                          │   (degradation)  │     obligations unfulfilled
                          │                  │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │     Namespace deleted,
                          │   MES DEATH      │ ◄── pods terminated,
                          │   (termination)  │     audit records sealed
                          │                  │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │     GAAGR marked dead,
                          │   RPS PREVENTION │ ◄── resurrection attempts
                          │   (sealed)       │     blocked, keys destroyed
                          │                  │
                          └──────────────────┘
```

---

## Phase Details

### Phase 1: Genome Spec

**System**: EGMS (Enterprise Genome Management Service)

The enterprise genome is a declarative specification that defines everything about an AINE: its industry, roles, governance rules, agent compositions, policies, and resource requirements.

```typescript
interface EnterpriseGenome {
  /** Unique genome identifier */
  genomeId: string;
  /** Genome version (semver) */
  version: string;

  /** Enterprise identity */
  identity: {
    name: string;
    industry: {
      naicsCode: string;
      sicCode: string;
    };
    jurisdiction: string;
    gaagr: string;   // Requested GAAGR address
  };

  /** Role definitions derived from industry intelligence */
  roles: {
    roleId: string;
    title: string;
    responsibilities: string[];
    authorityLevel: number;
    decayRate: number;  // Hours until authority expires
  }[];

  /** Agent compositions */
  agents: {
    agentId: string;
    role: string;
    capabilities: string[];
    resourceRequirements: {
      cpu: string;
      memory: string;
      gpu?: string;
    };
  }[];

  /** Governance rules */
  governance: {
    humanOverridePolicy: string;
    escalationThresholds: Record<string, number>;
    auditRetentionDays: number;
  };

  /** BPMN workflow definitions */
  workflows: {
    processId: string;
    bpmnXml: string;
  }[];
}
```

### Phase 2: GCS Compile

**System**: GCS (Genome Compiler Service)

The Genome Compiler Service takes the declarative genome spec and compiles it into deployable artifacts:

- **Kubernetes manifests**: Namespace, Deployments, Services, NetworkPolicies, RBAC roles
- **Helm values**: Parameterized configuration for the AINE Runtime Helm chart
- **PEP keys**: Generated encryption keys for the Private Enterprise Protocol boundary
- **BPMN deployments**: Compiled workflow definitions ready for the BPMN Engine
- **Agent images**: Container image references for each agent in the genome

```
  Genome Spec (YAML/JSON)
        │
        ▼
  ┌──────────────┐
  │  GCS          │
  │  Compiler     │
  │               │
  │  ├─ K8s gen   │──► Namespace + Deployments + RBAC
  │  ├─ Helm gen  │──► values.yaml for AINE Runtime chart
  │  ├─ PEP gen   │──► Encryption key material
  │  ├─ BPMN gen  │──► Compiled workflow artifacts
  │  └─ Agent ref │──► Container image manifest
  └──────────────┘
```

### Phase 3: PDES Evaluate

**System**: PDES (Pre-Deployment Evaluation Service)

Before an AINE can be born, it must pass pre-deployment evaluation:

| Check | Description | Failure Action |
|-------|-------------|----------------|
| Policy compliance | Genome satisfies all PIES policies | Reject with policy violations |
| Jurisdiction validation | JAL confirms legal compliance | Reject with jurisdiction conflicts |
| Resource availability | Cluster has sufficient resources | Queue until resources available |
| Risk assessment | CVSS scores within acceptable range | Escalate to human review |
| Conflict detection | No GAAGR address collisions | Reject with conflict details |

### Phase 4: IGS Gate

**System**: IGS (Initial Gate Service)

The IGS gate is the final authorization checkpoint. It requires:

1. **PDES approval**: All pre-deployment checks passed
2. **Human authorization**: A human operator has approved the birth (via HCL)
3. **Budget verification**: Sufficient funds or credits for the AINE's resource requirements
4. **TIS identity**: Trust & Identity Service has issued certificates for the new AINE

:::note
The IGS gate is the last point where a human can prevent an AINE from being born. Once past this gate, the birth process is automated and irreversible (though the AINE can be killed via MES).
:::

### Phase 5: EMS Birth

**System**: EMS (Enterprise Management Service), FBS (Formation & Bootstrapping Service)

Birth is the instantiation of the AINE on Kubernetes infrastructure:

1. **Namespace creation**: A dedicated Kubernetes namespace is created for the AINE
2. **RBAC application**: Role-Based Access Control policies are applied
3. **NetworkPolicy deployment**: PEP boundaries are enforced via NetworkPolicies
4. **Helm release**: The AINE Runtime chart is installed with compiled values
5. **Agent pod deployment**: Agent containers are scheduled and started
6. **GAAGR registration**: The AINE's address is registered in the global registry
7. **Health verification**: FBS verifies all components are healthy

```
  IGS Gate PASSED
        │
        ▼
  ┌────────────────────────────────────────────┐
  │  EMS Birth Sequence                         │
  │                                             │
  │  1. kubectl create namespace aine-acme-corp │
  │  2. kubectl apply -f rbac.yaml              │
  │  3. kubectl apply -f networkpolicy.yaml     │
  │  4. helm install aine-acme-corp aineff/aine │
  │  5. Wait for pod readiness                  │
  │  6. Register in GAAGR                       │
  │  7. FBS health check                        │
  │                                             │
  │  Status: OPERATING                          │
  └────────────────────────────────────────────┘
```

### Phase 6: Operating

**Systems**: All clusters active

During the operating phase, the AINE is a fully functional AI-native enterprise:

- **Agents execute workflows** via the BPMN Engine
- **Governance is enforced** by RAMS, GBL, and PIES
- **Telemetry flows** to the Intelligence & Revenue cluster
- **Obligations are tracked** by ORF
- **Authority decays** over time via ADS and TDES

The operating phase continues until decay thresholds trigger the transition to death.

### Phase 7: TDES Decay

**System**: TDES (Temporal Decay & Expiry Service), ADS (Authority Decay Service)

Decay is not a sudden event -- it is a gradual degradation triggered by:

- **Authority expiration**: Agent authorities decay and are not renewed
- **Performance degradation**: Revenue intelligence shows declining returns
- **Obligation failures**: NPOS detects accumulating unfulfilled obligations
- **Resource exhaustion**: Budget or compute resources depleted
- **Human decision**: An operator explicitly initiates shutdown

```
  Decay Triggers
  ├── Authority at 0% (ADS)          ──┐
  ├── Revenue below threshold          │
  ├── Obligation failure rate > 50%    ├──► MES Death initiated
  ├── Budget exhausted                 │
  └── Human kill command               ──┘
```

### Phase 8: MES Death

**System**: MES (Mortality & Exit Service)

Death is a graceful, ordered process:

1. **Stop new work**: No new workflows accepted
2. **Drain existing work**: Complete or cancel in-flight obligations
3. **Seal audit records**: All audit records are finalized and anchored to the Audit Chain
4. **Export data**: Enterprise data is exported per retention policies
5. **Destroy PEP keys**: PEP encryption keys are destroyed, making sealed cognitive state permanently unrecoverable
6. **Delete namespace**: Kubernetes namespace and all resources are deleted
7. **Update GAAGR**: Enterprise status set to DEAD in the registry

:::info Graceful Death
MES always attempts a graceful death. In-flight obligations are either completed or marked as failed with finality proofs. Only after all obligations are settled does namespace deletion occur.
:::

### Phase 9: RPS Prevention

**System**: RPS (Resurrection Prevention Service)

After death, RPS ensures the AINE cannot be brought back:

- **GAAGR tombstone**: The GAAGR address is permanently marked as dead and cannot be re-registered
- **Key destruction verification**: Confirms PEP keys are destroyed
- **Certificate revocation**: TIS certificates are revoked in the certificate authority
- **Namespace guard**: A Kubernetes ValidatingWebhook prevents namespace re-creation with the same name
- **Audit seal**: A final sealed audit record confirms death and prevention measures

---

## Kubernetes Mapping

Every AINEFF lifecycle concept maps directly to a Kubernetes primitive:

```
┌──────────────────────────────────────────────────────────────┐
│  AINEFF CONCEPT          │  KUBERNETES PRIMITIVE              │
├──────────────────────────┼───────────────────────────────────┤
│  AINE (enterprise)       │  Namespace                        │
│  Agent                   │  Pod (within Deployment)          │
│  PEP boundary            │  NetworkPolicy                    │
│  Authority (RAMS)        │  RBAC (Role + RoleBinding)        │
│  Authority decay (ADS)   │  CronJob (periodic check)         │
│  Death (MES)             │  Namespace deletion               │
│  Birth (EMS)             │  Helm release install              │
│  Genome artifacts        │  ConfigMap + Secret                │
│  Telemetry               │  ServiceMonitor (Prometheus)      │
│  Service mesh (Layer 1)  │  Istio/Linkerd sidecar            │
│  Resurrection guard      │  ValidatingWebhookConfiguration   │
└──────────────────────────────────────────────────────────────┘
```

### Namespace Structure

```
cluster/
├── aineff-system/                 # AINEFF control plane
│   ├── ems-deployment
│   ├── gaagr-deployment
│   ├── protocol-router-deployment
│   └── ...
│
├── aine-acme-corp/               # AINE: Acme Corp
│   ├── agent-invoice-processor   # Agent pod
│   ├── agent-compliance-checker  # Agent pod
│   ├── bpmn-engine              # BPMN pod
│   ├── pep-networkpolicy        # PEP boundary
│   └── authority-decay-cronjob  # ADS decay check
│
├── aine-globex/                  # AINE: Globex
│   ├── agent-hr-assistant
│   ├── agent-payroll-processor
│   ├── bpmn-engine
│   ├── pep-networkpolicy
│   └── authority-decay-cronjob
│
└── aine-initech/                 # AINE: Initech (DECAYING)
    ├── agent-report-generator    # Pod in CrashLoopBackOff
    ├── bpmn-engine              # Still running
    └── authority-decay-cronjob  # Reporting 0% authority
```

### State-to-K8s Mapping

| Lifecycle Phase | K8s Operations |
|----------------|----------------|
| Genome Spec | ConfigMap created in `aineff-system` namespace |
| GCS Compile | Job generates manifests, stores in ConfigMap/Secret |
| PDES Evaluate | Validating admission webhook checks manifests |
| IGS Gate | Manual approval via custom resource status |
| EMS Birth | `kubectl create namespace` + `helm install` |
| Operating | Pods running, CronJobs active, Services exposed |
| TDES Decay | CronJob detects decay, updates custom resource status |
| MES Death | Drain pods, seal records, `kubectl delete namespace` |
| RPS Prevention | ValidatingWebhook blocks re-creation of namespace |

---

## State Transition Events

Each state transition emits an `AINEFFEvent` with the lifecycle loop tag:

```typescript
// Birth event
{
  eventType: "lifecycle.ems.aine-born",
  loops: ["lifecycle-death"],
  payload: {
    aineId: "aine-acme-corp",
    gaagr: "aine://acme-corp.us-east.aineff.mesh",
    namespace: "aine-acme-corp",
    genomeVersion: "1.0.0",
    agentCount: 5,
    helmRelease: "aine-acme-corp",
  }
}

// Decay event
{
  eventType: "lifecycle.tdes.decay-threshold-reached",
  loops: ["lifecycle-death", "governance-decay"],
  payload: {
    aineId: "aine-acme-corp",
    decayMetrics: {
      authorityRemaining: 0.12,
      obligationFailureRate: 0.67,
      revenueDecline: 0.45,
    },
    recommendation: "initiate-death",
  }
}

// Death event
{
  eventType: "lifecycle.mes.aine-died",
  loops: ["lifecycle-death"],
  payload: {
    aineId: "aine-acme-corp",
    deathReason: "authority-exhaustion",
    finalAuditHash: "sha3-256:abc123...",
    namespaceDeletionConfirmed: true,
    pepKeysDestroyed: true,
    gaaggrTombstoned: true,
  }
}
```

:::tip Lifecycle Observability
The Operator Dashboard (`operator-dashboard`) provides a real-time view of all AINE lifecycle states across the cluster. Each AINE is shown with its current phase, decay metrics, and time-to-death estimate.
:::
