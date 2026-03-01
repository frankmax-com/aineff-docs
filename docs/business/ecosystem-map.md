---
sidebar_position: 2
title: "Ecosystem Map"
description: "Full AINEFF ecosystem map --- 85 components across 6 clusters, 7 platforms, 4 applications, 14 agent packages, 4 factories, and shared infrastructure."
---

# Ecosystem Map

The AINEFF ecosystem comprises **85+ components** organized into core systems, platforms, applications, agents, factories, and shared packages. This document maps every component, its category, its connections, and its revenue contribution.

## Ecosystem Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          AINEFF Ecosystem                            │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    7 PLATFORMS                                 │  │
│  │  ORF  │  AINE Runtime  │  AINEG  │  WGE  │  LMax  │  Fmax  │ │  │
│  │       │                │        │       │  LPI   │        │ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────┐  ┌────────────────────────────────────┐  │
│  │    4 APPLICATIONS    │  │         14 AGENT PACKAGES          │  │
│  │  Chokepoint  DocuFlow│  │  agent-runtime  jarvis-runtime     │  │
│  │  Operator    Frankmax│  │  agent-memory   billing-service    │  │
│  │  Dashboard   Portal  │  │  dashboard      enhancement-layer  │  │
│  │                      │  │  governance     management-models  │  │
│  └──────────────────────┘  │  model-router   scm-adapters       │  │
│                            │  shared         skill-registry     │  │
│  ┌──────────────────────┐  │  telegram-gw    tenant-manager     │  │
│  │    4 FACTORIES       │  └────────────────────────────────────┘  │
│  │  AI Provider         │                                          │
│  │  GitHub Governance   │  ┌────────────────────────────────────┐  │
│  │  Database Governance │  │        30+ CORE SYSTEMS             │  │
│  │  RiskOps Pipeline    │  │  6 clusters + 6 shared packages    │  │
│  └──────────────────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Component Registry

### Cluster 1: Enterprise Birth (8 systems)

| # | System | ID | Package | Purpose | Revenue Contribution |
|---|--------|-----|---------|---------|---------------------|
| 1 | Enterprise Management System | `aineff-ems` | `@aineff/ems` | Enterprise enrollment and identity | Enables AINE creation |
| 2 | Enterprise Governance Mgmt | `aineff-egms` | `@aineff/egms` | Enterprise structure creation | Enables governance setup |
| 3 | Policy Derivation Engine | `aineff-pdes` | `@aineff/pdes` | Policy generation from context | Automates compliance |
| 4 | Governance Configuration | `aineff-gcs` | `@aineff/gcs` | Governance parameter management | Configuration fees |
| 5 | Identity Governance System | `aineff-igs` | `@aineff/igs` | Identity and access management | Security compliance |
| 6 | Temporal Intelligence | `aineff-tis` | `@aineff/tis` | Time-aware policy evaluation | Temporal constraint value |
| 7 | Feedback System | `aineff-fbs` | `@aineff/fbs` | Closed-loop feedback collection | Quality improvement |
| 8 | GAAGR | `aineff-gaagr` | `@aineff/gaagr` | Governance agreement registry | Compliance tracking |

### Cluster 2: Governance (9 systems)

| # | System | ID | Package | Purpose | Revenue Contribution |
|---|--------|-----|---------|---------|---------------------|
| 9 | Role & Authority Mgmt | `aineff-rams` | `@aineff/rams` | Authority matrix management | Core governance value |
| 10 | Governance Boundary Layer | `aineff-gbl` | `@aineff/gbl` | Boundary enforcement | Isolation enforcement |
| 11 | Operational Governance | `aineff-ogcrs` | `@aineff/ogcrs` | Runtime governance rules | Operational compliance |
| 12 | Human Override & Escalation | `aineff-hoes` | `@aineff/hoes` | Human-in-the-loop controls | Safety assurance |
| 13 | Human-Centric Design | `aineff-hcdi` | `@aineff/hcdi` | Human interaction patterns | UX value |
| 14 | Human Capability Layer | `aineff-hcl` | `@aineff/hcl` | Human capability assessment | Training integration |
| 15 | Conflict of Interest Engine | `aineff-coie` | `@aineff/coie` | COI detection and prevention | Compliance value |
| 16 | Authority Delegation | `aineff-ads` | `@aineff/ads` | Authority delegation rules | Governance flexibility |
| 17 | Non-Delegation Authority | `aineff-ndar` | `@aineff/ndar` | Non-delegable authority rules | Safety constraints |

### Cluster 3: Policy & Semantics (5 systems)

| # | System | ID | Package | Purpose | Revenue Contribution |
|---|--------|-----|---------|---------|---------------------|
| 18 | Policy Interpretation Engine | `aineff-pies` | `@aineff/pies` | Natural language policy parsing | Policy automation |
| 19 | Jurisdictional Alignment | `aineff-jal` | `@aineff/jal` | Multi-jurisdiction compliance | Global compliance |
| 20 | Contextual Value Scoring | `aineff-cvss` | `@aineff/cvss` | Context-dependent value assessment | Decision support |
| 21 | Multi-Interest Decision | `aineff-midc` | `@aineff/midc` | Multi-stakeholder decisions | Conflict resolution |
| 22 | Semantic Consistency | `aineff-scs` | `@aineff/scs` | Cross-system semantic alignment | Data consistency |

### Cluster 4: Audit & Death (7 systems)

| # | System | ID | Package | Purpose | Revenue Contribution |
|---|--------|-----|---------|---------|---------------------|
| 23 | Accountability Tracking | `aineff-acts` | `@aineff/acts` | Audit trail management | Compliance revenue |
| 24 | Forensic Management | `aineff-fms` | `@aineff/fms` | Post-incident forensics | Investigation value |
| 25 | Termination & Death Engine | `aineff-tdes` | `@aineff/tdes` | Graceful system shutdown | Lifecycle management |
| 26 | Non-Persistence Operations | `aineff-npos` | `@aineff/npos` | Ephemeral data handling | Privacy compliance |
| 27 | Ethical Constraint System | `aineff-ecs` | `@aineff/ecs` | Ethical boundary enforcement | Trust value |
| 28 | Recovery & Persistence | `aineff-rps` | `@aineff/rps` | State recovery after failure | Reliability |
| 29 | Model Execution Sandbox | `aineff-mes` | `@aineff/mes` | Isolated model execution | Safety isolation |

### Cluster 5: Safeguards (6 systems)

| # | System | ID | Package | Purpose | Revenue Contribution |
|---|--------|-----|---------|---------|---------------------|
| 30 | Shadow Hierarchical Failsafe | `aineff-shfs` | `@aineff/shfs` | Failsafe governance layer | Safety assurance |
| 31 | Non-Linear Override | `aineff-nlo-r` | `@aineff/nlo-r` | Emergency override system | Critical safety |
| 32 | Self-Sovereign Decision | `aineff-ssdt` | `@aineff/ssdt` | Autonomous decision tracking | Accountability |
| 33 | Constraint Enforcement | `aineff-cefp` | `@aineff/cefp` | Hard constraint enforcement | Compliance |
| 34 | Sentinel Enforcement | `aineff-sei` | `@aineff/sei` | Watchdog monitoring | Continuous safety |
| 35 | Recursive Recovery Loop | `aineff-rrls` | `@aineff/rrls` | Self-healing recovery | Reliability |

### Cluster 6: Intelligence (8 systems)

| # | System | ID | Package | Purpose | Revenue Contribution |
|---|--------|-----|---------|---------|---------------------|
| 36 | BPMN Engine | `aineff-bpmn` | `@aineff/bpmn` | Business process modeling | Process automation |
| 37 | Role Engine | `aineff-role-engine` | `@aineff/role-engine` | Dynamic role derivation | Authority management |
| 38 | Industry Intel | `aineff-industry-intel` | `@aineff/industry-intel` | Industry-specific intelligence | Domain value |
| 39 | Protocol Router | `aineff-protocol-router` | `@aineff/protocol-router` | Inter-system protocol routing | System integration |
| 40 | Audit Chain | `aineff-audit-chain` | `@aineff/audit-chain` | Immutable audit chain | Compliance |
| 41 | ACOS | `aineff-acos` | `@aineff/acos` | Agent coordination | Agent management |
| 42 | Telemetry | `aineff-telemetry` | `@aineff/telemetry` | Observability infrastructure | Monitoring |
| 43 | Revenue Intel | `aineff-revenue-intel` | `@aineff/revenue-intel` | Revenue signal analysis | Revenue optimization |

### Shared Packages (6 packages)

| # | Package | ID | Purpose | Used By |
|---|---------|-----|---------|---------|
| 44 | Shared Types | `@aineff/shared-types` | Common TypeScript types | All systems |
| 45 | Governance SDK | `@aineff/governance-sdk` | Governance client library | All systems |
| 46 | Audit Logger | `@aineff/audit-logger` | Audit trail client | All systems |
| 47 | Jurisdiction Engine | `@aineff/jurisdiction-engine` | Multi-jurisdiction rules | Policy systems |
| 48 | UI Components | `@aineff/ui` | Shared UI library | All applications |
| 49 | ORF SDK | `@aineff/orf-sdk` | ORF client library | All systems |

### Platforms (7)

| # | Platform | ID | Revenue |
|---|----------|----|---------|
| 50 | ORF Protocol | `aineff-orf` | Protocol licensing |
| 51 | AINE Runtime | `aineff-aine-runtime` | Hosting fees |
| 52 | AINEG Coordinator | `aineff-aineg` | SaaS subscription |
| 53 | Work Genesis Engine | `aineff-wge` | Per cell fees |
| 54 | LevelupMax | `levelupmax` | $800-1500/participant |
| 55 | Frankmax | `frankmax` | $15-30K/engagement |
| 56 | LPI | `aineff-lpi` | Network licensing |

### Applications (4)

| # | Application | ID | Integration |
|---|-------------|-----|-------------|
| 57 | Chokepoint Intelligence | `chokepoint-web` | Frankmax |
| 58 | DocuFlow | `docuflow` | AINE Runtime |
| 59 | Operator Dashboard | `operator-dashboard` | AINE Runtime, LevelupMax |
| 60 | Frankmax Portal | `frankmax-portal` | Frankmax |

### Agent Packages (14)

| # | Package | Scope | Purpose |
|---|---------|-------|---------|
| 61 | agent-runtime | `@agentcoders` | Core agent execution |
| 62 | jarvis-runtime | `@agentcoders` | CEO agent runtime |
| 63 | agent-memory | `@agentcoders` | Persistent memory |
| 64 | billing-service | `@agentcoders` | Usage billing |
| 65 | dashboard | `@agentcoders` | Operations dashboard |
| 66 | enhancement-layer | `@agentcoders` | Agent extensions |
| 67 | governance | `@agentcoders` | Agent governance |
| 68 | management-models | `@agentcoders` | Team structures |
| 69 | model-router | `@agentcoders` | Model routing |
| 70 | scm-adapters | `@agentcoders` | Git integration |
| 71 | shared | `@agentcoders` | Shared utilities |
| 72 | skill-registry | `@agentcoders` | Skill catalog |
| 73 | telegram-gateway | `@agentcoders` | Telegram bot |
| 74 | tenant-manager | `@agentcoders` | Multi-tenancy |

### Factories (4)

| # | Factory | Purpose |
|---|---------|---------|
| 75 | AI Provider Factory | Provider-agnostic AI routing |
| 76 | GitHub Governance Factory | Repository governance |
| 77 | Database Governance Factory | Data layer governance |
| 78 | Enterprise RiskOps Pipeline | Continuous risk assessment |

### Supporting Components (7+)

| # | Component | Purpose |
|---|-----------|---------|
| 79 | docs-site | Docusaurus documentation |
| 80 | sales-agent-bot | Automated sales qualification |
| 81 | Helm charts | Kubernetes deployment packages |
| 82 | CI/CD workflows | GitHub Actions pipelines |
| 83 | Monitoring stack | Prometheus + Grafana + Loki + Tempo |
| 84 | Container registry | GHCR image hosting |
| 85 | Infrastructure as Code | Terraform / Pulumi |

## Connection Map

### Primary Data Flows

```
┌──────────────────────────────────────────────────────────────────┐
│                     Primary Data Flows                            │
│                                                                  │
│  Frankmax ──→ Chokepoint Intelligence ──→ Assessment Results     │
│     │                                         │                  │
│     └──→ AINE Runtime ←──── ORF Protocol ────→│                  │
│              │                    │            │                  │
│              ├──→ Agent Pods ←──→ PEP Network  │                  │
│              │        │                        │                  │
│              │        └──→ Model Router ──→ AI Providers          │
│              │        └──→ Agent Memory ──→ Knowledge Vault       │
│              │                                                   │
│              ├──→ WGE ──→ Venture Cells ──→ Revenue              │
│              │                                    │              │
│              └──→ Telemetry ──→ Prometheus ──→ Grafana            │
│                                                   │              │
│  AINEG ←─── All AINE Heartbeats ──────────────────┘              │
│     │                                                            │
│     └──→ Revenue Intel ──→ New Opportunities ──→ Frankmax        │
│                                                                  │
│  LevelupMax ──→ Certified Operators ──→ Operator Dashboard       │
│                                                                  │
│  LPI ──→ Private Inference ──→ Agent Pods                        │
│                                                                  │
│  RiskOps ←── All System Signals ──→ Alerts ──→ Dashboard         │
│                                                                  │
│  DocuFlow ──→ Document Processing ──→ Knowledge Vault            │
└──────────────────────────────────────────────────────────────────┘
```

### Event Bus Topology

All systems communicate through a structured event bus:

| Event Producer | Event Consumer(s) | Signal Type |
|---------------|-------------------|-------------|
| ORF Protocol | All systems | Constraint results, obligations |
| AINE Runtime | AINEG, Telemetry, RiskOps | Health, agent status, metrics |
| WGE | AINE Runtime, AINEG, Billing | Cell lifecycle events |
| Agents | AINE Runtime, Audit Logger | Task results, actions |
| AINEG | WGE, Frankmax | Opportunities, portfolio metrics |
| Frankmax | AINE Runtime, LevelupMax | Engagement lifecycle |
| LevelupMax | RAMS, ORF | Certifications, authority grants |
| Telemetry | Prometheus, RiskOps | Metrics, alerts |
| Audit Logger | ACTS, Forensics | Audit records |

## Ecosystem Growth Path

```
Phase 1: Foundation (Current)
├── Core systems (30+ built)
├── ORF Protocol
├── AINE Runtime
├── Chokepoint Intelligence (live)
├── Frankmax (live)
└── AgentCoders (in development)

Phase 2: Platform (Next)
├── WGE (venture cells)
├── LevelupMax (operator training)
├── Operator Dashboard
├── AINEG Coordinator
└── DocuFlow

Phase 3: Scale
├── LPI (private AI)
├── Frankmax Portal
├── RiskOps Pipeline
├── GitHub Governance Factory
├── Database Governance Factory
└── AI Provider Factory (expanded)

Phase 4: Ecosystem
├── Third-party skill marketplace
├── Partner integrations
├── Industry-specific templates
├── Global deployment (multi-region)
└── Self-service AINE provisioning
```

## Component Count Summary

| Category | Count |
|----------|-------|
| Core Systems (6 clusters) | 43 |
| Shared Packages | 6 |
| Platforms | 7 |
| Applications | 4 |
| Agent Packages | 14 |
| Factories | 4 |
| Supporting Components | 7+ |
| **Total** | **85+** |
