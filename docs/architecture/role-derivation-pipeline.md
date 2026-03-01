---
sidebar_position: 5
title: "Role Derivation Pipeline"
description: "How NAICS/SIC codes flow through Industry Intelligence, the Role Derivation Engine, RAMS, ACOS, and AgentCoders to produce deployed AI agents on Kubernetes."
---

# Role Derivation Pipeline

The Role Derivation Pipeline is the process by which real-world industry classifications are transformed into deployed AI agents running on Kubernetes. It answers the question: "Given a business in industry X, what agents should be built, what should they do, and how should they be governed?"

The pipeline flows through six systems:

```
  NAICS/SIC Code
       │
       ▼
  ┌─────────────────┐
  │ Industry Intel   │  What does this industry do?
  └────────┬─────────┘
           │
           ▼
  ┌─────────────────┐
  │ Role Engine      │  What job roles exist?
  └────────┬─────────┘
           │
           ▼
  ┌─────────────────┐
  │ RAMS             │  What authority do roles need?
  └────────┬─────────┘
           │
           ▼
  ┌─────────────────┐
  │ ACOS             │  How should agents be composed?
  └────────┬─────────┘
           │
           ▼
  ┌─────────────────┐
  │ AgentCoders      │  Build the agent code
  └────────┬─────────┘
           │
           ▼
  ┌─────────────────┐
  │ K8s Deployment   │  Deploy as pods in AINE namespace
  └─────────────────┘
```

---

## Stage 1: Industry Intelligence

**System**: `aineff-industry-intel`

Industry Intelligence ingests NAICS (North American Industry Classification System) and SIC (Standard Industrial Classification) codes and produces structured intelligence about what businesses in that industry actually do.

### Input

```typescript
interface IndustryQuery {
  /** 6-digit NAICS code */
  naicsCode: string;
  /** 4-digit SIC code (optional, for cross-reference) */
  sicCode?: string;
  /** Target jurisdiction for regulatory context */
  jurisdiction: string;
  /** Enterprise size category */
  size: "micro" | "small" | "medium" | "large" | "enterprise";
}
```

### Output

```typescript
interface IndustryProfile {
  /** Industry classification */
  classification: {
    naicsCode: string;
    naicsTitle: string;
    sicCode: string;
    sicTitle: string;
    sector: string;
    subsector: string;
  };

  /** Core business functions in this industry */
  businessFunctions: {
    functionId: string;
    name: string;
    description: string;
    criticality: "core" | "supporting" | "administrative";
    regulatoryRequirements: string[];
  }[];

  /** Common job roles in this industry */
  commonRoles: {
    roleTitle: string;
    department: string;
    seniorityLevel: "entry" | "mid" | "senior" | "executive";
    automationPotential: number; // 0.0 - 1.0
  }[];

  /** Industry-specific compliance requirements */
  complianceFrameworks: string[];

  /** Revenue model patterns */
  revenuePatterns: {
    model: string;
    prevalence: number;
  }[];
}
```

### Example: Manufacturing (NAICS 332710)

```
  NAICS 332710 — Machine Shops
  │
  ├── Business Functions
  │   ├── CNC machining operations (core)
  │   ├── Quality control & inspection (core)
  │   ├── Quoting & estimation (supporting)
  │   ├── Supply chain management (supporting)
  │   ├── Invoicing & AR (administrative)
  │   └── Regulatory compliance (supporting)
  │
  ├── Common Roles
  │   ├── CNC Programmer (automationPotential: 0.7)
  │   ├── Quality Inspector (automationPotential: 0.6)
  │   ├── Estimator (automationPotential: 0.85)
  │   ├── Production Scheduler (automationPotential: 0.8)
  │   ├── Purchasing Agent (automationPotential: 0.75)
  │   └── AP/AR Clerk (automationPotential: 0.9)
  │
  └── Compliance: ISO 9001, ITAR, AS9100
```

---

## Stage 2: Role Derivation Engine

**System**: `aineff-role-engine`

The Role Derivation Engine takes the industry profile and decomposes each job role into a hierarchy of automatable primitives. This is the core decomposition:

```
  Job Role
  └── Responsibilities
      └── Business Processes
          └── Workflows
              └── Activities
                  └── Tasks
                      └── Automatable Primitives
```

### The Decomposition Hierarchy

Each level breaks down into finer-grained components:

| Level | Description | Example |
|-------|-------------|---------|
| **Job Role** | A human-recognizable position | "Estimator" |
| **Responsibilities** | What the role is accountable for | "Produce accurate job quotes" |
| **Business Processes** | End-to-end processes the role participates in | "Quote-to-Order" |
| **Workflows** | BPMN-modelable sequences within a process | "Material cost estimation" |
| **Activities** | Individual steps in a workflow | "Look up material prices" |
| **Tasks** | Atomic units of work | "Query supplier API for steel prices" |
| **Automatable Primitives** | The smallest unit an AI agent can execute | "HTTP GET to supplier price endpoint, parse JSON response, extract unit price" |

### Decomposition Example

```
Job Role: Estimator
│
├── Responsibility: Produce accurate job quotes
│   │
│   ├── Business Process: Quote-to-Order
│   │   │
│   │   ├── Workflow: Material Cost Estimation
│   │   │   │
│   │   │   ├── Activity: Gather material requirements
│   │   │   │   ├── Task: Parse drawing/CAD file for materials
│   │   │   │   │   └── Primitive: OCR extraction + material classifier
│   │   │   │   └── Task: Map materials to supplier catalogs
│   │   │   │       └── Primitive: Fuzzy match against supplier DB
│   │   │   │
│   │   │   ├── Activity: Look up material prices
│   │   │   │   ├── Task: Query supplier APIs for current prices
│   │   │   │   │   └── Primitive: HTTP GET + JSON parse
│   │   │   │   └── Task: Apply volume discounts
│   │   │   │       └── Primitive: Discount table lookup
│   │   │   │
│   │   │   └── Activity: Calculate material cost
│   │   │       └── Task: Multiply quantities by unit prices
│   │   │           └── Primitive: Arithmetic computation
│   │   │
│   │   ├── Workflow: Labor Cost Estimation
│   │   │   ├── Activity: Estimate machining time
│   │   │   │   └── Task: Analyze geometry for operation count
│   │   │   │       └── Primitive: CAD feature recognition
│   │   │   └── Activity: Apply labor rates
│   │   │       └── Task: Multiply hours by rate
│   │   │           └── Primitive: Arithmetic + rate lookup
│   │   │
│   │   └── Workflow: Quote Assembly
│   │       ├── Activity: Compile cost components
│   │       ├── Activity: Apply margin
│   │       └── Activity: Generate quote document
│   │
│   └── Business Process: Quote Revision
│       └── ...
│
├── Responsibility: Track quote win/loss rates
│   └── Business Process: Win/Loss Analysis
│       └── ...
│
└── Responsibility: Maintain supplier relationships
    └── Business Process: Supplier Evaluation
        └── ...
```

### Role Derivation Output

```typescript
interface DerivedRole {
  /** Source role from Industry Intelligence */
  sourceRole: string;
  /** Derived agent specifications */
  agents: DerivedAgent[];
  /** BPMN process definitions generated from workflows */
  bpmnProcesses: BPMNProcess[];
  /** Authority requirements for RAMS */
  authorityRequirements: AuthorityRequirement[];
}

interface DerivedAgent {
  /** Unique agent identifier */
  agentId: string;
  /** Human-readable name */
  name: string;
  /** Which primitives this agent handles */
  primitives: {
    primitiveId: string;
    description: string;
    inputSchema: Record<string, unknown>;
    outputSchema: Record<string, unknown>;
    /** Estimated execution time */
    estimatedDurationMs: number;
    /** Required capabilities */
    capabilities: string[];
  }[];
  /** Resource requirements */
  resources: {
    cpu: string;
    memory: string;
    gpu?: string;
    modelRequirements?: {
      provider: "anthropic" | "openai" | "local";
      minimumCapability: string;
    };
  };
}

interface AuthorityRequirement {
  /** What this agent needs authority to do */
  action: string;
  /** Scope of the authority */
  scope: string;
  /** Suggested decay rate in hours */
  suggestedDecayHours: number;
  /** Whether human override is required for this action */
  humanOverrideRequired: boolean;
}
```

---

## Stage 3: RAMS (Role & Authority Management)

**System**: `aineff-rams`

RAMS takes the authority requirements from the Role Derivation Engine and creates a formal authority structure:

```
  DerivedRole.authorityRequirements
        │
        ▼
  ┌─────────────────────────────────────────────┐
  │  RAMS Authority Assignment                   │
  │                                              │
  │  For each agent:                             │
  │  1. Create Role (K8s RBAC Role)             │
  │  2. Create RoleBinding                       │
  │  3. Set authority level (0-100)             │
  │  4. Set decay rate (from AuthorityReq)      │
  │  5. Set human override threshold            │
  │  6. Register in GBL boundary                │
  └─────────────────────────────────────────────┘
```

### Authority Matrix

RAMS produces an authority matrix that maps every agent to its permitted actions:

```
┌────────────────────────┬───────┬───────┬───────┬───────┬───────┐
│ Agent                  │ Read  │ Write │ Ext.  │ Spend │ Human │
│                        │ Data  │ Data  │ API   │ Money │ Escal.│
├────────────────────────┼───────┼───────┼───────┼───────┼───────┤
│ material-price-agent   │  Yes  │  No   │  Yes  │  No   │  No   │
│ quote-calculator       │  Yes  │  Yes  │  No   │  No   │  No   │
│ quote-approver         │  Yes  │  Yes  │  No   │ <$10k │  Yes  │
│ supplier-comms-agent   │  Yes  │  Yes  │  Yes  │  No   │  Yes  │
│ invoice-processor      │  Yes  │  Yes  │  Yes  │ <$50k │  Yes  │
└────────────────────────┴───────┴───────┴───────┴───────┴───────┘

Decay rates:
  material-price-agent:  168h (7 days)  — low risk, slow decay
  quote-calculator:       72h (3 days)  — medium risk
  quote-approver:         24h (1 day)   — high risk, fast decay
  supplier-comms-agent:   48h (2 days)  — medium-high risk
  invoice-processor:      24h (1 day)   — financial authority, fast decay
```

---

## Stage 4: ACOS (Agent Composition & Orchestration)

**System**: `aineff-acos`

ACOS takes the derived agents and their authority assignments and composes them into coordinated teams that can execute the BPMN workflows.

```
  ┌─────────────────────────────────────────────────────────┐
  │  ACOS Composition Plan                                   │
  │                                                          │
  │  Team: "Quote Processing Team"                           │
  │  Workflow: Quote-to-Order                                │
  │                                                          │
  │  ┌─────────────────┐                                    │
  │  │ material-price   │──┐                                │
  │  │ agent            │  │                                │
  │  └─────────────────┘  │   ┌──────────────────┐         │
  │                        ├──►│ quote-calculator  │──┐     │
  │  ┌─────────────────┐  │   └──────────────────┘  │     │
  │  │ labor-estimate   │──┘                          │     │
  │  │ agent            │      ┌──────────────────┐  │     │
  │  └─────────────────┘   ┌──│ quote-approver    │◄─┘     │
  │                        │  └──────────────────┘         │
  │  ┌─────────────────┐  │                                │
  │  │ supplier-comms   │◄─┘                                │
  │  │ agent            │                                   │
  │  └─────────────────┘                                    │
  │                                                          │
  │  Orchestration: Sequential pipeline with approval gate  │
  │  Governance: quote-approver requires human escalation   │
  │              for quotes > $10,000                        │
  └─────────────────────────────────────────────────────────┘
```

### Composition Output

```typescript
interface AgentComposition {
  /** Composition identifier */
  compositionId: string;
  /** Target AINE */
  aineId: string;
  /** BPMN process this composition executes */
  bpmnProcessId: string;

  /** Agent team members */
  agents: {
    agentId: string;
    image: string;        // Container image
    replicas: number;
    role: string;
    dependencies: string[]; // Other agents this one depends on
  }[];

  /** Inter-agent communication rules */
  communicationRules: {
    from: string;
    to: string;
    protocol: "grpc" | "event" | "direct";
    encrypted: boolean;   // PEP encryption
  }[];

  /** Escalation rules */
  escalationRules: {
    condition: string;
    escalateTo: "human" | "supervisor-agent";
    timeout: string;
  }[];
}
```

---

## Stage 5: AgentCoders

**System**: `agentcoders`

AgentCoders is the AI-powered code generation system that builds the actual agent implementations from the primitive specifications. Each automatable primitive identified by the Role Engine is turned into executable agent code.

```
  Primitive: "HTTP GET to supplier price endpoint, parse JSON, extract unit price"
        │
        ▼
  ┌─────────────────────────────────────────────────┐
  │  AgentCoders                                     │
  │                                                  │
  │  1. Generate tool definition (function schema)  │
  │  2. Generate execution logic (TypeScript)        │
  │  3. Generate test suite                          │
  │  4. Generate Dockerfile                          │
  │  5. Build container image                        │
  │  6. Push to registry                             │
  │                                                  │
  │  Output: ghcr.io/aineff/agent-material-price:v1 │
  └─────────────────────────────────────────────────┘
```

### Generated Agent Structure

```
agent-material-price/
├── src/
│   ├── index.ts              # Agent entrypoint
│   ├── tools/
│   │   ├── query-supplier.ts # Tool: HTTP GET supplier API
│   │   ├── parse-response.ts # Tool: Parse JSON response
│   │   └── extract-price.ts  # Tool: Extract unit price
│   ├── schemas/
│   │   ├── input.ts          # Input validation schema
│   │   └── output.ts         # Output validation schema
│   └── telemetry.ts          # Telemetry emission
├── test/
│   ├── query-supplier.test.ts
│   ├── parse-response.test.ts
│   └── integration.test.ts
├── Dockerfile
└── helm/
    └── values.yaml           # Default Helm values
```

---

## Stage 6: Kubernetes Deployment

The final stage deploys the composed agent team into the AINE's Kubernetes namespace.

### Deployment Flow

```
  ACOS Composition Plan
        │
        ▼
  ┌──────────────────────────────────────────────┐
  │  Helm Install / Upgrade                       │
  │                                               │
  │  Namespace: aine-acme-corp                    │
  │                                               │
  │  Deployments:                                 │
  │  ├── material-price-agent (1 replica)        │
  │  ├── labor-estimate-agent (1 replica)        │
  │  ├── quote-calculator    (2 replicas)        │
  │  ├── quote-approver      (1 replica)         │
  │  └── supplier-comms-agent(1 replica)         │
  │                                               │
  │  Services:                                    │
  │  ├── material-price-agent-svc (ClusterIP)    │
  │  ├── quote-calculator-svc     (ClusterIP)    │
  │  └── ...                                      │
  │                                               │
  │  NetworkPolicies:                             │
  │  ├── pep-boundary (deny all external)        │
  │  ├── allow-internal-mesh                      │
  │  └── allow-egress-suppliers (ext API only)   │
  │                                               │
  │  RBAC:                                        │
  │  ├── role-material-price   (read-only)       │
  │  ├── role-quote-approver   (read-write)      │
  │  └── ...                                      │
  │                                               │
  │  CronJobs:                                    │
  │  └── authority-decay-check (every 1h)        │
  └──────────────────────────────────────────────┘
```

### Sample Kustomize Overlay

```yaml
# kustomization.yaml for aine-acme-corp agent team
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: aine-acme-corp

resources:
  - ../../base/agent-deployment
  - ../../base/pep-networkpolicy
  - ../../base/authority-rbac

patches:
  - target:
      kind: Deployment
      name: agent-template
    patch: |-
      - op: replace
        path: /metadata/name
        value: material-price-agent
      - op: replace
        path: /spec/template/spec/containers/0/image
        value: ghcr.io/aineff/agent-material-price:v1
      - op: replace
        path: /spec/template/spec/containers/0/resources/requests/cpu
        value: "250m"
      - op: replace
        path: /spec/template/spec/containers/0/resources/requests/memory
        value: "512Mi"

configMapGenerator:
  - name: agent-config
    literals:
      - AINE_ID=aine-acme-corp
      - GAAGR_ADDRESS=aine://acme-corp.us-east.aineff.mesh
      - PEP_ENABLED=true
      - TELEMETRY_ENDPOINT=telemetry.aineff-system.svc:4317
```

---

## End-to-End Pipeline Timing

```
  ┌──────────────────┬──────────────────┬──────────────┐
  │ Stage            │ Duration         │ Output       │
  ├──────────────────┼──────────────────┼──────────────┤
  │ Industry Intel   │ ~200ms (cached)  │ Profile      │
  │ Role Engine      │ ~2-5s            │ Derived roles│
  │ RAMS             │ ~500ms           │ Auth matrix  │
  │ ACOS             │ ~1-3s            │ Composition  │
  │ AgentCoders      │ ~30-120s         │ Built images │
  │ K8s Deployment   │ ~15-60s          │ Running pods │
  ├──────────────────┼──────────────────┼──────────────┤
  │ TOTAL            │ ~1-3 minutes     │ Live AINE    │
  └──────────────────┴──────────────────┴──────────────┘
```

:::note Pipeline Caching
Industry Intelligence profiles and Role Engine derivations are cached. For commonly-seen NAICS codes, the first two stages return near-instantly. AgentCoders uses layer caching for container builds, so only net-new primitives require full code generation.
:::

:::tip Feedback Integration
The Role Derivation Pipeline is not a one-shot process. It participates in **Loop 3** (Role Intelligence -- Agent Composition -- Execution -- Feedback). Telemetry from running agents feeds back into the Role Engine to improve future derivations. An agent that performs poorly causes the Role Engine to adjust the decomposition, and ACOS to try a different composition strategy.
:::
