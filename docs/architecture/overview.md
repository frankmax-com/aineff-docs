---
sidebar_position: 1
title: "Architecture Overview"
description: "High-level architecture of the AINEFF ecosystem: 6 system clusters, 7 platforms, protocol stack, and the full inventory of ~85 repositories."
---

# Architecture Overview

AINEFF (AI-Native Enterprise Factory Framework) is civilization-scale invisible infrastructure for creating, governing, operating, and retiring AI-native enterprises. The architecture is built on a single design principle:

> **Each repo deployed solo = standalone revenue engine. Brought together = compounding system interactions.**

Every system in the ecosystem produces value independently. When composed, they form feedback loops that compound intelligence, governance, and revenue across the entire enterprise lifecycle.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AINEFF ECOSYSTEM                             │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  Cluster 1   │  │  Cluster 2   │  │  Cluster 3   │               │
│  │  Enterprise  │  │  Governance  │  │  Policy &    │               │
│  │  Birth       │◄─►  & Auth     │◄─►  Semantics   │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
│         │                 │                 │                        │
│         ▼                 ▼                 ▼                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  Cluster 4   │  │  Cluster 5   │  │  Cluster 6   │               │
│  │  Audit &    │◄─►  Safeguards  │◄─►  Intelligence │               │
│  │  Death       │  │              │  │  & Revenue   │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    7 PLATFORMS                                │   │
│  │  ORF · AINE Runtime · AINEG · WGE · LevelupMax ·            │   │
│  │  Frankmax · LPI                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              PROTOCOL STACK (Layer 0 → 4)                    │   │
│  │  L0: Public Internet  │  L1: AINEFF Mesh  │  L2: PEP        │   │
│  │  L3: ORF              │  L4: Enterprise Logic                │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Design Principles

1. **Standalone Revenue**: Every repository ships as a deployable service that generates revenue on its own. A governance system sells governance-as-a-service. An audit system sells audit-as-a-service. No system requires the full ecosystem to be useful.

2. **Compounding Composition**: When systems are deployed together, they connect through the AINEFF Mesh (Layer 1) and form closed feedback loops. Audit data feeds governance. Governance decisions feed role derivation. Role derivation feeds agent composition. Agent execution feeds telemetry. Telemetry feeds revenue intelligence. Each interaction compounds the value of every other system.

3. **Enterprise-as-Code**: An entire AI-native enterprise -- its structure, governance, agents, policies, and lifecycle -- is represented as declarative configuration compiled through the Genome Compiler Service (GCS).

4. **Zero Human Operations**: Once an AINE (AI-Native Enterprise) is born, it operates autonomously. Humans set policy; systems enforce it. Agents execute workflows. Governance gates prevent harm. Death systems ensure clean shutdown.

5. **Jurisdiction-Aware by Default**: Every system is aware of legal jurisdictions. Policy engines, governance systems, and audit trails all resolve jurisdiction-specific rules automatically.

---

## The 6 System Clusters

### Cluster 1 -- Enterprise Birth

These systems handle the creation and instantiation of an AI-native enterprise.

| System | Acronym | Purpose |
|--------|---------|---------|
| Enterprise Management Service | EMS | Creates and manages AINE instances |
| Enterprise Genome Management Service | EGMS | Stores and versions enterprise genomes |
| Pre-Deployment Evaluation Service | PDES | Validates genome before deployment |
| Genome Compiler Service | GCS | Compiles genome specs into deployable artifacts |
| Initial Gate Service | IGS | Authorization gate before enterprise birth |
| Trust & Identity Service | TIS | Enterprise identity and credential management |
| Formation & Bootstrapping Service | FBS | Bootstraps newly born AINE infrastructure |
| GAAGR | GAAGR | Global AINE Address & Governance Registry |

### Cluster 2 -- Governance & Authority

These systems enforce governance, authority, and human-AI interaction rules.

| System | Acronym | Purpose |
|--------|---------|---------|
| Role & Authority Management Service | RAMS | Manages roles, permissions, and authority |
| Governance Boundary Layer | GBL | Enforces governance boundaries |
| Operational Governance & Compliance Reporting | OGCRS | Compliance reporting and governance ops |
| Human Override Escalation Service | HOES | Handles human override and escalation |
| Human-Computer Decision Interface | HCDI | Interfaces between human decisions and system actions |
| Human Control Layer | HCL | Ensures human control over critical operations |
| Chain of Interaction Engine | COIE | Tracks and manages interaction chains |
| Authority Decay Service | ADS | Manages time-based authority expiration |
| Non-Disclosure & Access Restriction | NDAR | Manages confidentiality and access restrictions |

### Cluster 3 -- Policy & Semantics

These systems manage policy interpretation, jurisdiction logic, and semantic understanding.

| System | Acronym | Purpose |
|--------|---------|---------|
| Policy Interpretation & Enforcement Service | PIES | Interprets and enforces policies |
| Jurisdiction & Applicability Layer | JAL | Determines jurisdiction-specific rules |
| Contextual Value & Semantic Scoring | CVSS | Scores semantic context and value |
| Meaning, Intent & Decision Clarity | MIDC | Ensures decision clarity and intent alignment |
| Semantic Consistency Service | SCS | Maintains semantic consistency across systems |

### Cluster 4 -- Audit & Death

These systems handle audit trails, failure management, and enterprise lifecycle termination.

| System | Acronym | Purpose |
|--------|---------|---------|
| Audit & Compliance Tracking Service | ACTS | Immutable audit trail and compliance tracking |
| Failure Management Service | FMS | Detects and manages system failures |
| Temporal Decay & Expiry Service | TDES | Manages time-based decay of authority and data |
| Non-Performance & Obligation Shortfall | NPOS | Tracks obligation fulfillment failures |
| Enterprise Compliance Service | ECS | Enterprise-level compliance monitoring |
| Resurrection Prevention Service | RPS | Prevents unauthorized re-activation of dead AINEs |
| Mortality & Exit Service | MES | Manages graceful enterprise death |

### Cluster 5 -- Safeguards

These systems prevent harm, enforce limits, and protect against system abuse.

| System | Acronym | Purpose |
|--------|---------|---------|
| System Halt & Fail-Safe | SHFS | Emergency halt and fail-safe mechanisms |
| Non-Lethal Override & Recovery | NLO-R | Non-destructive override and recovery |
| Self-Sabotage Detection & Treatment | SSDT | Detects and prevents self-sabotage behavior |
| Catastrophic Event & Failure Prevention | CEFP | Prevents catastrophic cascading failures |
| Semantic & Ethical Integrity | SEI | Ensures ethical integrity in system behavior |
| Rate & Resource Limiting Service | RRLS | Rate limiting and resource management |

### Cluster 6 -- Intelligence & Revenue

These systems generate intelligence, compose agents, and track revenue.

| System | Acronym | Purpose |
|--------|---------|---------|
| BPMN Engine | BPMN | Executes business process workflows |
| Role Derivation Engine | Role Engine | Derives automatable roles from industry data |
| Industry Intelligence | Industry Intel | NAICS/SIC-based industry intelligence |
| Protocol Router | Protocol Router | Routes inter-system protocol messages |
| Audit Chain | Audit Chain | Blockchain-anchored audit evidence |
| Agent Composition & Orchestration Service | ACOS | Composes and orchestrates agent teams |
| Telemetry Service | Telemetry | System-wide observability and metrics |
| Revenue Intelligence | Revenue Intel | Revenue tracking and optimization |

---

## The 7 Platforms

Platforms are higher-order compositions of systems that serve as deployable products.

| Platform | Purpose | Key Systems |
|----------|---------|-------------|
| **ORF** (Obligation & Responsibility Finality) | Enterprise obligation protocol | ACTS, NPOS, FMS, TDES |
| **AINE Runtime** | Runtime engine for AI-native enterprises | EMS, FBS, GCS, IGS |
| **AINEG** (AI-Native Enterprise Gateway) | External-facing enterprise gateway | Protocol Router, TIS, GAAGR |
| **WGE** (Workforce Governance Engine) | Workforce governance and role management | RAMS, Role Engine, ACOS |
| **LevelupMax** | Employee upskilling and AI readiness | Industry Intel, Role Engine, BPMN |
| **Frankmax** | Digital transformation consultancy platform | Chokepoint Intelligence, Revenue Intel |
| **LPI** (LevelupMax Partner Integration) | Partner and channel integration | Industry Intel, Telemetry |

---

## Protocol Stack Summary

The AINEFF protocol stack has 5 layers, from physical transport to enterprise logic.

```
┌──────────────────────────────────────────────────┐
│  Layer 4: Enterprise Logic                       │
│  BPMN workflows, agent tasks, business rules     │
├──────────────────────────────────────────────────┤
│  Layer 3: ORF (Obligation & Responsibility)      │
│  Sealed obligation finality, harm prevention     │
├──────────────────────────────────────────────────┤
│  Layer 2: PEP (Private Enterprise Protocol)      │
│  Sealed intra-AINE cognition, encrypted state    │
├──────────────────────────────────────────────────┤
│  Layer 1: AINEFF Mesh                            │
│  mTLS, capability discovery, GAAGR resolution    │
├──────────────────────────────────────────────────┤
│  Layer 0: Public Internet                        │
│  HTTP/HTTPS, gRPC, WebSocket                     │
└──────────────────────────────────────────────────┘
```

For a detailed breakdown, see the [Protocol Stack](./protocol-stack.md) documentation.

---

## Full Ecosystem Inventory

The complete AINEFF ecosystem comprises approximately 85 repositories organized into the categories below.

### Core Systems (50 repos)

**Cluster 1 -- Enterprise Birth (8)**
`aineff-ems` `aineff-egms` `aineff-pdes` `aineff-gcs` `aineff-igs` `aineff-tis` `aineff-fbs` `aineff-gaagr`

**Cluster 2 -- Governance & Authority (9)**
`aineff-rams` `aineff-gbl` `aineff-ogcrs` `aineff-hoes` `aineff-hcdi` `aineff-hcl` `aineff-coie` `aineff-ads` `aineff-ndar`

**Cluster 3 -- Policy & Semantics (5)**
`aineff-pies` `aineff-jal` `aineff-cvss` `aineff-midc` `aineff-scs`

**Cluster 4 -- Audit & Death (7)**
`aineff-acts` `aineff-fms` `aineff-tdes` `aineff-npos` `aineff-ecs` `aineff-rps` `aineff-mes`

**Cluster 5 -- Safeguards (6)**
`aineff-shfs` `aineff-nlo-r` `aineff-ssdt` `aineff-cefp` `aineff-sei` `aineff-rrls`

**Cluster 6 -- Intelligence & Revenue (8)**
`aineff-bpmn` `aineff-role-engine` `aineff-industry-intel` `aineff-protocol-router` `aineff-audit-chain` `aineff-acos` `aineff-telemetry` `aineff-revenue-intel`

### Shared Packages (7 repos)
`aineff-shared-types` `aineff-governance-sdk` `aineff-audit-logger` `aineff-jurisdiction-engine` `aineff-ui` `aineff-orf-sdk` `aineff-orf`

### Platforms (7 repos)
`aineff-orf` `aineff-aine-runtime` `aineff-aineg` `aineff-wge` `levelupmax` `frankmax` `aineff-lpi`

### Applications (4 repos)
`aineff-chokepoint-web` `docuflow` `operator-dashboard` `frankmax-portal`

### Agents & Factories (5 repos)
`agentcoders` `sales-agent-bot` `aineff-ai-provider` `aineff-github-governance` `aineff-riskops`

### Infrastructure & DevOps (~5 repos)
`aineff-infra` `aineff-helm-charts` `aineff-ci-cd` `aineff-database-governance` `aineff-monitoring`

:::info Total Repository Count
The ecosystem currently contains **60 scaffolded repositories** with approximately **25 additional repositories** planned for infrastructure, factories, additional agents, and partner integrations -- bringing the total to approximately **85 repositories** at full buildout.
:::

---

## Standalone vs. Composed

Every AINEFF system follows the dual-mode deployment model:

```
┌─────────────────────────┐     ┌──────────────────────────────────┐
│    STANDALONE MODE       │     │        COMPOSED MODE              │
│                          │     │                                   │
│  aineff-acts             │     │  aineff-acts                      │
│  ├── REST API            │     │  ├── REST API                     │
│  ├── Audit-as-a-Service  │     │  ├── Audit-as-a-Service           │
│  └── $49/mo SaaS         │     │  ├── ← FMS failure events        │
│                          │     │  ├── ← RRLS rate decisions        │
│  Revenue: direct sales   │     │  ├── → OGCRS compliance reports   │
│                          │     │  ├── → Audit Chain evidence        │
│                          │     │  └── → Revenue Intel signals       │
│                          │     │                                   │
│                          │     │  Revenue: compounding ecosystem   │
└─────────────────────────┘     └──────────────────────────────────┘
```

:::tip Design Implication
When building a new AINEFF system, always design the standalone API first. Ecosystem integrations are added as optional event listeners and publishers -- never as hard dependencies.
:::
