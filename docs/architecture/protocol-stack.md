---
sidebar_position: 2
title: "Protocol Stack"
description: "The 5-layer AINEFF protocol stack: from public internet transport through AINEFF Mesh, Private Enterprise Protocol, Obligation Finality, to Enterprise Logic."
---

# Protocol Stack

The AINEFF protocol stack defines how systems communicate across five layers. Each layer builds on the one below it, adding progressively more enterprise-specific semantics. Lower layers handle transport and identity; upper layers handle obligation, cognition, and business logic.

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│   Layer 4   ENTERPRISE LOGIC                                      │
│             BPMN workflows, agent tasks, business rules           │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Layer 3   ORF — Obligation & Responsibility Finality            │
│             Sealed obligation records, harm gates, finality       │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Layer 2   PEP — Private Enterprise Protocol                     │
│             Sealed intra-AINE cognition, encrypted state          │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Layer 1   AINEFF MESH                                           │
│             mTLS, capability discovery, GAAGR resolution          │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Layer 0   PUBLIC INTERNET                                       │
│             HTTP/HTTPS, gRPC, WebSocket                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Layer 0: Public Internet

**Transport protocols**: HTTP/HTTPS, gRPC, WebSocket

Layer 0 is the standard internet transport layer. All AINEFF systems expose public APIs over HTTPS for standalone operation. When deployed as individual SaaS products, systems communicate with external clients exclusively at this layer.

### Characteristics

- Standard REST/JSON over HTTPS for external API consumers
- gRPC for high-throughput inter-service communication
- WebSocket for real-time streaming (telemetry dashboards, live audit feeds)
- No AINEFF-specific semantics -- pure transport

### Example: Standalone ACTS API

```
Client (any HTTP client)
    │
    ▼
┌────────────────────┐
│  ACTS REST API      │  ← Layer 0 only
│  POST /audits       │
│  GET  /audits/:id   │
│  GET  /compliance    │
└────────────────────┘
```

When ACTS runs standalone, it only needs Layer 0. External customers call its REST API, receive audit records, and pay for the service.

:::note
Layer 0 is the only layer visible to external clients. Layers 1-4 are internal to the AINEFF ecosystem and never exposed to end users or third-party integrations.
:::

---

## Layer 1: AINEFF Mesh

**Protocols**: mTLS, capability discovery, GAAGR resolution

Layer 1 creates the secure service mesh that connects AINEFF systems. It handles mutual authentication, service discovery, and address resolution through the Global AINE Address & Governance Registry (GAAGR).

### Characteristics

- **mTLS everywhere**: Every inter-system connection uses mutual TLS. Both sides present certificates issued by the AINEFF certificate authority.
- **Capability discovery**: Systems announce their capabilities to the mesh. Other systems query for capabilities rather than hard-coding service addresses.
- **GAAGR resolution**: The Global AINE Address & Governance Registry resolves enterprise identifiers to mesh endpoints. Every AINE has a unique GAAGR address.

### Service Discovery Flow

```
┌───────────┐    1. Query capability     ┌─────────────────┐
│  ACOS     │ ─────────────────────────► │  Protocol Router │
│  (Agent   │                             │  (Mesh Registry) │
│  Composer)│ ◄───────────────────────── │                  │
└───────────┘    2. Return endpoints      └────────┬─────────┘
      │                                            │
      │         3. mTLS handshake                  │
      ▼                                            ▼
┌───────────┐                             ┌─────────────────┐
│  RAMS     │ ◄──── mTLS channel ───────► │  GAAGR          │
│  (Roles)  │                             │  (Registry)     │
└───────────┘                             └─────────────────┘
```

### GAAGR Address Format

```
aine://<enterprise-id>.<region>.aineff.mesh/<service>/<version>

Examples:
  aine://acme-corp.us-east.aineff.mesh/rams/v1
  aine://acme-corp.us-east.aineff.mesh/acts/v2
  aine://globex.eu-west.aineff.mesh/bpmn/v1
```

### Mesh Configuration

```yaml
# mesh-config.yaml
apiVersion: aineff.io/v1
kind: MeshConfig
metadata:
  name: aineff-mesh
spec:
  mtls:
    mode: STRICT
    certificateAuthority: aineff-ca
    rotationInterval: 24h
  discovery:
    protocol: grpc
    refreshInterval: 30s
    healthCheckInterval: 10s
  gaagr:
    endpoint: gaagr.aineff.mesh:443
    cacheTimeout: 60s
    fallbackMode: last-known
```

---

## Layer 2: PEP (Private Enterprise Protocol)

**Purpose**: Sealed intra-AINE cognition, encrypted enterprise state

Layer 2 is where AINEFF diverges from traditional service mesh architectures. The Private Enterprise Protocol (PEP) creates sealed cognitive boundaries around each AI-native enterprise. Inside a PEP boundary, agents share state, reasoning chains, and decision contexts. Outside the boundary, this information is cryptographically invisible.

### Characteristics

- **Sealed cognition**: Agent reasoning, intermediate state, and decision traces are encrypted within the PEP boundary. No external system -- not even other AINEs -- can observe the internal cognitive state.
- **Enterprise-scoped encryption**: Each AINE has a unique PEP encryption key derived from its GAAGR identity. State is encrypted at rest and in transit.
- **Cognitive isolation**: Even when multiple AINEs run on shared infrastructure, PEP ensures complete cognitive isolation between enterprises.

### PEP Envelope Structure

```typescript
interface PEPEnvelope {
  /** GAAGR address of the sending AINE */
  source: string;
  /** GAAGR address of the receiving AINE (same AINE for internal) */
  destination: string;
  /** PEP protocol version */
  version: "pep/1.0";
  /** Encrypted payload — only decryptable within the AINE boundary */
  sealedPayload: {
    /** AES-256-GCM encrypted cognitive state */
    ciphertext: Uint8Array;
    /** Nonce for decryption */
    nonce: Uint8Array;
    /** Authentication tag */
    tag: Uint8Array;
  };
  /** Metadata visible to the mesh (non-sensitive) */
  metadata: {
    messageType: "cognitive-state" | "decision-trace" | "agent-handoff";
    timestamp: string;
    ttl: number;
  };
}
```

### PEP Boundary Diagram

```
┌──────────────────────────────────────────────────┐
│                PEP BOUNDARY (AINE: acme-corp)     │
│                                                   │
│  ┌──────────┐  cognitive   ┌──────────┐          │
│  │  Agent A  │ ──state───► │  Agent B  │          │
│  └──────────┘              └──────────┘          │
│       │                         │                 │
│       └────── shared ───────────┘                 │
│              reasoning                            │
│              context                              │
│                                                   │
│  All internal traffic encrypted with              │
│  AINE-specific PEP key                            │
└──────────────────────────────────────────────────┘
         │
         │  Layer 1 mTLS (no cognitive state leaked)
         ▼
┌──────────────────────────────────────────────────┐
│                PEP BOUNDARY (AINE: globex)        │
│                                                   │
│  Cannot read acme-corp cognitive state            │
│  Even on shared K8s infrastructure                │
│                                                   │
└──────────────────────────────────────────────────┘
```

:::info Why PEP Matters
Traditional microservice architectures share state freely between services. In AINEFF, AI agents generate reasoning chains, decision trees, and intermediate cognitive artifacts that are proprietary to each enterprise. PEP ensures this cognitive IP is sealed, even from the infrastructure operator.
:::

---

## Layer 3: ORF (Obligation & Responsibility Finality)

**Purpose**: Sealed obligation records, harm prevention gates, finality proofs

Layer 3 introduces the concept of **obligation finality** -- the idea that every action taken by an AINE creates an obligation, and that obligation must be tracked to completion or failure with cryptographic proof.

### Characteristics

- **Obligation records**: Every significant action generates an obligation record -- a sealed, immutable artifact that tracks what was promised, what was delivered, and whether harm resulted.
- **Responsibility chains**: When an agent delegates work to another agent, the responsibility chain is explicitly tracked. If harm occurs, the chain identifies every participant.
- **Finality proofs**: When an obligation is fulfilled (or fails), a finality proof is generated and anchored to the Audit Chain. This proof is tamper-evident and jurisdiction-aware.
- **Harm gates**: Before any obligation can be executed, it passes through harm gates that check for potential negative consequences.

### Obligation Lifecycle

```
  ┌──────────┐     ┌───────────┐     ┌──────────────┐
  │ CREATED  │────►│ VALIDATED │────►│ IN_PROGRESS  │
  └──────────┘     └───────────┘     └──────┬───────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        ▼                   ▼                   ▼
                 ┌────────────┐     ┌──────────────┐    ┌────────────┐
                 │ FULFILLED  │     │   FAILED     │    │   HARMED   │
                 └─────┬──────┘     └──────┬───────┘    └─────┬──────┘
                       │                   │                  │
                       ▼                   ▼                  ▼
                 ┌────────────────────────────────────────────────┐
                 │              FINALITY PROOF GENERATED          │
                 │         (anchored to Audit Chain)              │
                 └────────────────────────────────────────────────┘
```

### ORF Record Structure

```typescript
interface ORFRecord {
  /** Unique obligation identifier */
  obligationId: string;
  /** GAAGR address of the responsible AINE */
  aineAddress: string;
  /** Chain of agents involved in this obligation */
  responsibilityChain: {
    agentId: string;
    role: string;
    delegatedAt: string;
    scope: string;
  }[];
  /** What was promised */
  obligation: {
    type: "task" | "decision" | "transaction" | "governance-action";
    description: string;
    deadline: string;
    jurisdiction: string;
  };
  /** Current state */
  state: "created" | "validated" | "in_progress" | "fulfilled" | "failed" | "harmed";
  /** Harm assessment (if applicable) */
  harmAssessment?: {
    detected: boolean;
    severity: "none" | "low" | "medium" | "high" | "critical";
    affectedParties: string[];
    mitigationActions: string[];
  };
  /** Cryptographic finality proof */
  finalityProof?: {
    hash: string;
    algorithm: "sha3-256";
    auditChainAnchor: string;
    timestamp: string;
  };
}
```

### Harm Gate Flow

```
  Incoming obligation
        │
        ▼
  ┌──────────────┐     PASS     ┌──────────────┐
  │  PIES Policy │ ───────────► │  Execute      │
  │  Check       │              │  Obligation   │
  └──────┬───────┘              └──────────────┘
         │
         │ FAIL
         ▼
  ┌──────────────┐
  │  HOES        │──► Human Override Decision
  │  Escalation  │
  └──────┬───────┘
         │
         │ DENIED
         ▼
  ┌──────────────┐
  │  FMS Failure │──► Obligation marked FAILED
  │  Record      │    Finality proof generated
  └──────────────┘
```

:::tip ORF SDK
The `aineff-orf-sdk` package provides client libraries for creating, tracking, and finalizing obligation records from any AINEFF system. See the [ORF Protocol documentation](../platforms/orf-protocol.md) for integration guides.
:::

---

## Layer 4: Enterprise Logic

**Purpose**: BPMN workflows, agent tasks, business rules

Layer 4 is the application layer where enterprise business logic executes. This is where BPMN workflows run, agents perform tasks, and business rules are evaluated. All Layer 4 operations are wrapped in Layer 3 obligation records, transmitted over Layer 2 PEP channels, routed through the Layer 1 mesh, and transported over Layer 0 internet protocols.

### Characteristics

- **BPMN-driven**: Business processes are modeled as BPMN 2.0 workflows and executed by the BPMN Engine.
- **Agent tasks**: Individual steps in a workflow are executed by AI agents composed by ACOS.
- **Rule evaluation**: Business rules are evaluated by PIES (policy) and CVSS (semantic scoring) at each decision point.
- **Full observability**: Every workflow step emits telemetry events that feed the Intelligence & Revenue cluster.

### Workflow Execution Stack

```
┌──────────────────────────────────────────────────────────────┐
│  BPMN Workflow Definition                                     │
│  ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐              │
│  │ Start│───►│Task A│───►│Gate  │───►│Task B│───►End       │
│  └──────┘    └──────┘    └──────┘    └──────┘              │
├──────────────────────────────────────────────────────────────┤
│  Agent Execution (ACOS)                                       │
│  Task A → Agent: "invoice-processor" (Pod in K8s)            │
│  Task B → Agent: "compliance-checker" (Pod in K8s)           │
├──────────────────────────────────────────────────────────────┤
│  ORF Obligation Wrapping (Layer 3)                            │
│  Each task creates an obligation record with harm gates       │
├──────────────────────────────────────────────────────────────┤
│  PEP Encryption (Layer 2)                                     │
│  Agent state and reasoning encrypted within AINE boundary    │
├──────────────────────────────────────────────────────────────┤
│  AINEFF Mesh Routing (Layer 1)                                │
│  mTLS between pods, GAAGR resolution for service lookup      │
├──────────────────────────────────────────────────────────────┤
│  Transport (Layer 0)                                          │
│  gRPC between agents, HTTPS for external callbacks           │
└──────────────────────────────────────────────────────────────┘
```

### Layer 4 Event Contract

Every Layer 4 execution emits a standardized event:

```typescript
interface Layer4ExecutionEvent {
  /** Event metadata */
  eventId: string;
  timestamp: string;
  source: string;

  /** Workflow context */
  workflow: {
    workflowId: string;
    stepId: string;
    bpmnProcessId: string;
  };

  /** Agent context */
  agent: {
    agentId: string;
    role: string;
    composedBy: string; // ACOS composition ID
  };

  /** Execution result */
  result: {
    status: "completed" | "failed" | "escalated";
    outputHash: string;
    durationMs: number;
  };

  /** ORF reference */
  obligationId: string;

  /** Telemetry tags */
  tags: Record<string, string>;
}
```

---

## Cross-Layer Message Flow

A complete message traverses all five layers:

```
  Enterprise Logic (L4)        "Process this invoice"
        │
        ▼
  ORF Wrapping (L3)            Create obligation record, harm check
        │
        ▼
  PEP Sealing (L2)             Encrypt cognitive state
        │
        ▼
  Mesh Routing (L1)            Resolve GAAGR address, mTLS connect
        │
        ▼
  Transport (L0)               gRPC frame over TCP/TLS

  ─────── network ───────

  Transport (L0)               Receive gRPC frame
        │
        ▼
  Mesh Auth (L1)               Verify mTLS certificate
        │
        ▼
  PEP Unsealing (L2)           Decrypt with AINE PEP key
        │
        ▼
  ORF Validation (L3)          Validate obligation, check authority
        │
        ▼
  Enterprise Logic (L4)        Execute agent task
```

:::note Protocol Router
The `aineff-protocol-router` service is responsible for the Layer 1 mesh routing decisions. It maintains the capability registry, handles GAAGR lookups, and manages connection pooling for mTLS channels.
:::
