---
sidebar_position: 1
title: "Systems Overview"
description: "Complete reference for all 43 AINEFF systems organized across 6 functional clusters"
---

# Systems Overview

AINEFF comprises **43 systems** organized into **6 clusters** that together form the
AI-Native Enterprise Factory Framework. Each system is a standalone deployable unit
with its own Kubernetes namespace, event bus, and independent revenue model. When
composed through closed-loop feedback, the systems create compound value that exceeds
the sum of their parts.

Every system is built on three shared governance primitives:

- **`@aineff/audit-logger`** -- append-only, hash-chained audit trail
- **`@aineff/governance-sdk`** -- authority check, escalation trigger, audit log primitives
- **`@aineff/orf-sdk`** -- Obligation & Responsibility Framework binding

## Cluster Map

| # | Cluster | Focus | Systems | Key Revenue |
|---|---------|-------|---------|-------------|
| 1 | [Enterprise Birth](./cluster-1/ems) | AINE/AINEG creation, templates, genomes | 8 | Setup fees, template marketplace |
| 2 | [Governance](./cluster-2/rams) | Roles, authority, human oversight | 9 | Governance-as-a-Service licensing |
| 3 | [Policy & Semantics](./cluster-3/pies) | Compliance, jurisdiction, vocabulary | 5 | Compliance-as-a-Service |
| 4 | [Audit & Death](./cluster-4/acts) | Traceability, failure, termination | 7 | Court-grade audit trail SaaS |
| 5 | [Safeguards](./cluster-5/shfs) | Harm forecasting, liability, emergency | 6 | Risk forecasting, liability tracking |
| 6 | [Intelligence](./cluster-6/bpmn) | BPMN, agents, telemetry, revenue | 8 | Orchestration-as-a-Service |

## All 43 Systems

### Cluster 1 -- Enterprise Birth (8 systems)

| System | Package | Purpose | Standalone Revenue |
|--------|---------|---------|-------------------|
| [EMS](./cluster-1/ems) | `@aineff/ems` | Enterprise Manufacturing System | $5-50K per enterprise |
| [EGMS](./cluster-1/egms) | `@aineff/egms` | Enterprise Group Manufacturing | Portfolio creation fees |
| [PDES](./cluster-1/pdes) | `@aineff/pdes` | Pattern-Derived Enterprise Synthesis | Template marketplace |
| [GCS](./cluster-1/gcs) | `@aineff/gcs` | Genome Compiler System | Genome validation API |
| [IGS](./cluster-1/igs) | `@aineff/igs` | Instantiation Gate System | Gate-as-a-service |
| [TIS](./cluster-1/tis) | `@aineff/tis` | Template Integrity System | Drift detection SaaS |
| [FBS](./cluster-1/fbs) | `@aineff/fbs` | Factory Boundary System | Boundary enforcement consulting |
| [GAAGR](./cluster-1/gaagr) | `@aineff/gaagr` | Global AINE & AINEG Registry | Registry subscription |

### Cluster 2 -- Governance (9 systems)

| System | Package | Purpose | Standalone Revenue |
|--------|---------|---------|-------------------|
| [RAMS](./cluster-2/rams) | `@aineff/rams` | Role, Authority & Mandate System | $50-150K license |
| [GBL](./cluster-2/gbl) | `@aineff/gbl` | Governance Boundary Layer | $50-150K license |
| [OGCRS](./cluster-2/ogcrs) | `@aineff/ogcrs` | Ownership Graph & Control Resolution | Ownership mapping consulting |
| [HOES](./cluster-2/hoes) | `@aineff/hoes` | Human Oversight & Escalation | Escalation workflow SaaS |
| [HCDI](./cluster-2/hcdi) | `@aineff/hcdi` | Human Collective Discipline Infra | Accountability platform |
| [HCL](./cluster-2/hcl) | `@aineff/hcl` | Human Coordination Ledger | Coordination audit SaaS |
| [COIE](./cluster-2/coie) | `@aineff/coie` | Conflict-of-Interest Engine | COI detection API |
| [ADS](./cluster-2/ads) | `@aineff/ads` | Authority Decay System | Authority lifecycle management |
| [NDAR](./cluster-2/ndar) | `@aineff/ndar` | Non-Delegable Authority Registry | Compliance authority tracking |

### Cluster 3 -- Policy & Semantics (5 systems)

| System | Package | Purpose | Standalone Revenue |
|--------|---------|---------|-------------------|
| [PIES](./cluster-3/pies) | `@aineff/pies` | Policy Ingestion & Enforcement | Compliance-as-a-Service |
| [JAL](./cluster-3/jal) | `@aineff/jal` | Jurisdiction Adapter Layer | Multi-jurisdiction compliance API |
| [CVSS](./cluster-3/cvss) | `@aineff/cvss` | Canonical Vocabulary & Semantics | Enterprise taxonomy SaaS |
| [MIDC](./cluster-3/midc) | `@aineff/midc` | Misinterpretation Index & Drift Control | Semantic drift detection |
| [SCS](./cluster-3/scs) | `@aineff/scs` | Semantic Closure System | Meaning standardization consulting |

### Cluster 4 -- Audit & Death (7 systems)

| System | Package | Purpose | Standalone Revenue |
|--------|---------|---------|-------------------|
| [ACTS](./cluster-4/acts) | `@aineff/acts` | Audit & Causal Trace System | Court-grade audit trail SaaS |
| [FMS](./cluster-4/fms) | `@aineff/fms` | Failure Management System | Failure classification API |
| [TDES](./cluster-4/tdes) | `@aineff/tdes` | Time, Decay & Exit System | Enterprise lifecycle management |
| [NPOS](./cluster-4/npos) | `@aineff/npos` | Non-Participation & Opt-Out | Clean exit protocol SaaS |
| [ECS](./cluster-4/ecs) | `@aineff/ecs` | Evidence Custody System | Tamper-proof evidence storage |
| [RPS](./cluster-4/rps) | `@aineff/rps` | Resurrection Prevention System | Anti-revival enforcement |
| [MES](./cluster-4/mes) | `@aineff/mes` | Mortality Enforcement System | Enterprise termination services |

### Cluster 5 -- Safeguards (6 systems)

| System | Package | Purpose | Standalone Revenue |
|--------|---------|---------|-------------------|
| [SHFS](./cluster-5/shfs) | `@aineff/shfs` | Systemic Harm Forecasting | Risk forecasting API |
| [NLO-R](./cluster-5/nlo-r) | `@aineff/nlo-r` | Named Liable Officer Registry | Liability tracking SaaS |
| [SSDT](./cluster-5/ssdt) | `@aineff/ssdt` | Semantic Snapshot at Decision Time | Decision context capture |
| [CEFP](./cluster-5/cefp) | `@aineff/cefp` | Canonical Export & Fork Protocol | Data portability API |
| [SEI](./cluster-5/sei) | `@aineff/sei` | Sovereign Emergency Interface | Government override protocol |
| [RRLS](./cluster-5/rrls) | `@aineff/rrls` | Regulatory Rate-Limiter System | Expansion velocity governance |

### Cluster 6 -- Intelligence (8 systems)

| System | Package | Purpose | Standalone Revenue |
|--------|---------|---------|-------------------|
| [BPMN](./cluster-6/bpmn) | `@aineff/bpmn` | BPMN Engine | BPMN-as-a-Service |
| [Role Engine](./cluster-6/role-engine) | `@aineff/role-engine` | Role Derivation Engine | Role Intelligence API |
| [Industry Intel](./cluster-6/industry-intel) | `@aineff/industry-intel` | Industry Intelligence | Industry data product |
| [Protocol Router](./cluster-6/protocol-router) | `@aineff/protocol-router` | Protocol Router | PEP licensing |
| [Audit Chain](./cluster-6/audit-chain) | `@aineff/audit-chain` | Audit Chain | Blockchain audit trail |
| [ACOS](./cluster-6/acos) | `@aineff/acos` | Agent Composition & Orchestration | Orchestration-as-a-Service |
| [Telemetry](./cluster-6/telemetry) | `@aineff/telemetry` | Telemetry System | Operational analytics product |
| [Revenue Intel](./cluster-6/revenue-intel) | `@aineff/revenue-intel` | Revenue Intelligence | FinOps revenue tracking |

## Shared Packages

All 43 systems depend on these 6 foundational packages:

| Package | Purpose |
|---------|---------|
| [`@aineff/shared-types`](./packages/shared-types) | Canonical TypeScript types for all AINEFF entities |
| [`@aineff/governance-sdk`](./packages/governance-sdk) | Authority check, escalation trigger, audit log primitives |
| [`@aineff/audit-logger`](./packages/audit-logger) | Append-only, hash-chained audit trail library |
| [`@aineff/jurisdiction-engine`](./packages/jurisdiction-engine) | Geography to executable constraints compiler |
| [`@aineff/ui`](./packages/ui) | Shared dark theme component library |
| [`@aineff/orf-sdk`](./packages/orf-sdk) | Obligation & Responsibility binding SDK |

## Architecture Principles

1. **Each system is independently deployable** -- separate K8s Deployment, Service, and HPA
2. **Event-driven communication** -- systems emit and consume domain events via NATS/Kafka
3. **Governance by default** -- every operation is audit-logged, authority-checked, and obligation-bound
4. **Closed-loop feedback** -- outputs of one system feed inputs of others, creating compound intelligence
5. **Standalone revenue** -- every system can be sold independently before composition
