---
sidebar_label: OSS Discovery Prompt
sidebar_position: 5
title: "OSS Discovery Prompt — Finding GitHub Gold for AINEFF"
---

# OSS Discovery Prompt

**Version:** v1.0.0
**Date:** 2026-03-01
**Purpose:** Systematic prompt for discovering open-source projects that accelerate AINEFF development. Run this prompt periodically to find new projects as the OSS landscape evolves.

## Strategy

AINEFF's real IP is the protocol layer (ORF, PEP, authority decay, enterprise mortality) and the composition architecture (7 feedback loops). Everything else is infrastructure where high-quality open-source already exists. We fork, security-audit, strip vendor lock-in, adapt to AINEFF interfaces, wrap in ORF envelopes, and ship as `@aineff/*` packages.

**Principle: Build what's novel. Fork what's infrastructure. Never reinvent plumbing.**

---

## The Master Discovery Prompt

Use this prompt with any AI assistant or search tool. It is designed to be run in sections — one per AINEFF capability domain. Each section returns GitHub repos ranked by relevance.

---

### Section 1: Agent Runtime & Orchestration

**Maps to:** AgentCoders (agent-runtime, jarvis-runtime), ACOS, WGE

```
Search GitHub for open-source projects matching ALL of the following criteria.
For each result return: repo URL, stars, last commit date, license, language,
and a 2-sentence summary of why it's relevant.

CATEGORY: AI Agent Runtime & Orchestration

Find projects that provide:
- Multi-agent orchestration frameworks (agent teams, delegation, task routing)
- Agent runtime environments (lifecycle management, health monitoring, restart)
- CEO/manager agent patterns (hierarchical agent delegation)
- Agent memory systems (working memory, long-term memory, episodic memory)
- Agent skill/tool registries (capability discovery, plugin systems)
- Agent-to-agent communication protocols (message passing, event-driven)
- Autonomous agent teams that execute business workflows

EXCLUDE: simple chatbot wrappers, single-agent RAG pipelines, prompt-only frameworks

PRIORITIZE: projects with >100 stars, TypeScript or Python,
active development (commits in last 90 days), permissive license (MIT, Apache 2.0),
multi-agent support, production-ready architecture

KNOWN RELEVANT: CrewAI, AutoGen, LangGraph, Mastra, Julep, AgentStack,
Composio, Semantic Kernel, Haystack agents, Superagent, OpenDevin/OpenHands
```

---

### Section 2: BPMN & Workflow Engines

**Maps to:** aineff-bpmn, BPMN-as-a-Service

```
Search GitHub for open-source BPMN and workflow engine projects.

CATEGORY: BPMN 2.0 Engines & Workflow Orchestration

Find projects that provide:
- BPMN 2.0 XML/JSON parsing and execution
- Visual process modeling and rendering (SVG, Canvas)
- Workflow state machines with persistence
- Human-in-the-loop task assignment
- Event-driven workflow triggers
- Process versioning and migration
- REST/gRPC APIs for workflow management
- TypeScript/JavaScript BPMN engines

EXCLUDE: no-code drag-and-drop builders without API, proprietary engines

PRIORITIZE: embeddable engines, programmatic APIs, active maintenance,
permissive license

KNOWN RELEVANT: bpmn-io/bpmn-js, paed01/bpmn-engine, Camunda (community),
Temporal, Inngest, Trigger.dev, n8n, Windmill, Hatchet
```

---

### Section 3: RBAC, Authorization & Policy Engines

**Maps to:** RAMS, GBL, ADS (authority decay), NDAR, governance-sdk

```
Search GitHub for open-source authorization and policy engines.

CATEGORY: RBAC, ABAC, Policy Engines & Authorization

Find projects that provide:
- Role-based access control (RBAC) with hierarchical roles
- Attribute-based access control (ABAC)
- Policy-as-code engines (Rego, Cedar, custom DSL)
- Permission evaluation APIs (REST, gRPC, SDK)
- Multi-tenant authorization
- Time-based permission expiry or decay
- Authority delegation with constraints
- Audit logging of authorization decisions

EXCLUDE: full IAM/SSO platforms (Keycloak, Auth0 — too heavy),
simple JWT libraries

PRIORITIZE: embeddable engines, TypeScript/Go, fine-grained permissions,
can be extended with custom logic (authority decay)

KNOWN RELEVANT: Casbin, Open Policy Agent (OPA), Cerbos, Permit.io (OSS parts),
SpiceDB/Authzed, Oso, Cedar (AWS), Warrant, OpenFGA
```

---

### Section 4: Audit Trail & Evidence Systems

**Maps to:** ACTS, ECS, audit-logger, audit-chain

```
Search GitHub for open-source audit trail and evidence custody projects.

CATEGORY: Audit Logging, Event Sourcing & Tamper-Proof Records

Find projects that provide:
- Append-only, hash-chained audit logs
- Event sourcing frameworks (event store, projections, snapshots)
- Tamper-evident logging (Merkle trees, blockchain anchoring)
- Causal trace / event correlation (distributed tracing)
- Court-grade evidence chains (timestamping, non-repudiation)
- Compliance audit log formats (CEF, OCSF, CloudEvents)
- GraphQL/REST APIs for audit queries

EXCLUDE: simple application loggers (winston, pino — too low-level)

PRIORITIZE: hash-chain integrity, TypeScript/Go, query APIs,
tamper detection, retention policies

KNOWN RELEVANT: Retraced, OpenTelemetry, Jaeger (tracing),
event-sourcing frameworks (EventStoreDB client, nestjs-event-sourcing),
sigstore (code signing), Trillian (transparency log)
```

---

### Section 5: AI Governance, Compliance & GRC

**Maps to:** PIES, JAL, GBL, SHFS, NLO-R, CVSS, COIE

```
Search GitHub for open-source AI governance and compliance projects.

CATEGORY: AI Governance, GRC, Regulatory Compliance

Find projects that provide:
- AI governance platforms (risk assessment, bias detection, model cards)
- Regulatory compliance frameworks (EU AI Act, ISO 42001, NIST AI RMF)
- LLM security monitoring (prompt injection detection, shadow AI)
- Compliance-as-code (policy definition, automated enforcement)
- Risk register templates and workflows
- Multi-jurisdiction compliance mapping
- Responsible AI toolkits (fairness, explainability, accountability)
- AI audit readiness tools

EXCLUDE: academic papers without code, single-model evaluation scripts

PRIORITIZE: framework coverage (EU AI Act, ISO, NIST), production-ready,
active community, TypeScript/Python

KNOWN RELEVANT: verifywise-ai/verifywise, fiddlecube/compliant-llm,
bluewave-labs/flagwise, aws-samples/compliance-assistant,
AI-Governance-Starter-Pack, awesome-ai-governance,
JohnYoungSuh/ai-agent-governance-framework, Microsoft Responsible AI Toolbox,
Google Model Cards Toolkit, IBM AI Fairness 360
```

---

### Section 6: Kubernetes Operators & Multi-Tenancy

**Maps to:** AINE Runtime, EMS (birth), MES (death), tenant-manager

```
Search GitHub for open-source Kubernetes operators and multi-tenancy solutions.

CATEGORY: K8s Operators, Namespace Lifecycle, Multi-Tenant Isolation

Find projects that provide:
- Kubernetes operators for namespace lifecycle (create, manage, delete)
- Multi-tenant Kubernetes isolation (namespace-per-tenant)
- Virtual clusters or namespace hierarchies
- K8s RBAC automation (role creation, binding, expiry)
- Namespace resource quotas and limit ranges
- Network policy generation and enforcement
- Helm chart lifecycle management (install, upgrade, rollback, delete)
- Custom Resource Definitions (CRDs) for business entities

EXCLUDE: full PaaS platforms (OpenShift), cloud-provider-specific tools

PRIORITIZE: lightweight operators, CRD-based, Go or TypeScript,
namespace isolation focus, active maintenance

KNOWN RELEVANT: Capsule, vcluster (Loft), Kubernetes Hierarchical Namespaces,
kiosk, Crossplane, Argo CD, Flux CD, Kyverno (policy),
kubevela, Radius
```

---

### Section 7: Model Routing & AI Provider Abstraction

**Maps to:** model-router, ai-provider-factory, LPI

```
Search GitHub for open-source LLM routing and AI provider abstraction projects.

CATEGORY: LLM Routing, Multi-Provider AI, Model Gateway

Find projects that provide:
- Multi-provider LLM routing (OpenAI, Anthropic, Google, local models)
- Intelligent model selection (cost, latency, capability-based routing)
- Rate limiting and quota management per provider
- Fallback and retry logic across providers
- Usage tracking and billing aggregation
- API key management and rotation
- Streaming support (SSE, WebSocket)
- Private/local model deployment (Ollama, vLLM, TGI integration)

EXCLUDE: single-provider SDKs, chat UIs without routing

PRIORITIZE: provider coverage (10+), TypeScript/Python,
production-ready, active maintenance, self-hostable

KNOWN RELEVANT: LiteLLM, Portkey, OpenRouter (API only),
ai-provider-factory (frankmax-com), Helicone, BricksLLM,
Martian, RouteLLM, Braintrust Proxy, Unify.ai
```

---

### Section 8: Industry Data & Classification

**Maps to:** aineff-industry-intel, aineff-role-engine, config/naics-sic

```
Search GitHub for open-source industry classification and job role data projects.

CATEGORY: NAICS/SIC Data, O*NET Job Roles, Industry Intelligence

Find projects that provide:
- NAICS code databases (searchable, structured, API-ready)
- SIC code mappings and cross-references
- O*NET occupation data (skills, tasks, work activities)
- BLS occupational employment statistics
- Industry-to-job-role mapping datasets
- Business process taxonomies
- Automation potential scoring for job tasks
- Industry compliance requirement databases

EXCLUDE: paywalled datasets, government PDFs without structured data

PRIORITIZE: structured data (JSON, CSV, SQL), API-ready,
regularly updated, US + international coverage

KNOWN RELEVANT: NAICS Association data, Census Bureau NAICS files,
O*NET Web Services, BLS OES datasets, UN ISIC classifications
```

---

### Section 9: Telemetry & Observability

**Maps to:** aineff-telemetry, aineff-revenue-intel, monitoring stack

```
Search GitHub for open-source telemetry and observability projects.

CATEGORY: Application Telemetry, Metrics, Distributed Tracing

Find projects that provide:
- OpenTelemetry instrumentation libraries (TypeScript, Node.js)
- Metrics collection and aggregation (Prometheus-compatible)
- Distributed tracing (correlation IDs, span management)
- Custom business metrics (revenue tracking, conversion funnels)
- Real-time dashboards and alerting
- Log aggregation with structured search
- Self-hosted observability stacks (alternative to Datadog/New Relic)

EXCLUDE: cloud-only SaaS without self-host option

PRIORITIZE: OpenTelemetry-compatible, TypeScript SDK,
self-hostable, Kubernetes-native, active maintenance

KNOWN RELEVANT: SigNoz, Grafana stack (Prometheus + Loki + Tempo),
OpenTelemetry JS, Uptrace, HyperDX, Highlight.io, Baselime
```

---

### Section 10: Billing, Payments & Usage Metering

**Maps to:** billing-service, revenue model, per-AINE pricing

```
Search GitHub for open-source billing and usage metering projects.

CATEGORY: Usage-Based Billing, Metering, Subscription Management

Find projects that provide:
- Usage-based billing engines (metered billing, per-unit pricing)
- Subscription management (tiers, upgrades, downgrades)
- Stripe/payment gateway integration
- Usage event ingestion and aggregation
- Invoice generation
- Multi-tenant billing isolation
- Revenue analytics and MRR tracking

EXCLUDE: simple Stripe checkout wrappers without metering

PRIORITIZE: usage-based pricing support, multi-tenant,
TypeScript/Go, self-hostable, active maintenance

KNOWN RELEVANT: Lago, OpenMeter, Kill Bill, Stripe Billing (API),
Schematic, Stigg, Amberflo
```

---

### Section 11: Document Processing & Workflow

**Maps to:** DocuFlow, Chokepoint Intelligence (AI file upload)

```
Search GitHub for open-source document processing and analysis projects.

CATEGORY: Document AI, PDF Processing, Intelligent Document Workflows

Find projects that provide:
- PDF parsing and text extraction (tables, images, structured data)
- Document classification and routing
- AI-powered document analysis (LLM-based extraction)
- Document workflow automation (approval chains, routing rules)
- OCR integration (Tesseract, cloud OCR)
- Document template generation (reports, invoices)
- Multi-format support (PDF, DOCX, XLSX, images)

EXCLUDE: simple PDF viewers, document storage only

PRIORITIZE: AI-enhanced extraction, TypeScript/Python,
structured output, production-ready

KNOWN RELEVANT: Docling (IBM), Unstructured.io, LlamaParse,
pdf-lib, pdf.js, Paperless-ngx, Stirling-PDF
```

---

### Section 12: UI Component Libraries & Design Systems

**Maps to:** aineff-ui, operator-dashboard, frankmax-portal

```
Search GitHub for open-source dark-theme UI component libraries.

CATEGORY: React Component Libraries, Admin Dashboards, Design Systems

Find projects that provide:
- React component libraries with dark theme support
- Admin dashboard templates (data tables, charts, forms)
- Design system frameworks (tokens, typography, spacing)
- Real-time data visualization components
- Kubernetes/DevOps dashboard patterns
- Enterprise SaaS UI patterns (multi-tenant, role-based views)

EXCLUDE: marketing site templates, landing page builders

PRIORITIZE: React 18+/19, TypeScript, Tailwind CSS compatible,
dark-first design, accessible (WCAG 2.1), active maintenance

KNOWN RELEVANT: shadcn/ui, Tremor, Refine, AdminJS, Mantine,
Radix Primitives, NextUI, Park UI, Headless UI
```

---

### Section 13: Security Scanning & Supply Chain

**Maps to:** Fork-Audit-Adapt pipeline (security audit step)

```
Search GitHub for open-source security scanning and supply chain audit tools.

CATEGORY: Dependency Scanning, SAST, Supply Chain Security

Find projects that provide:
- Dependency vulnerability scanning (npm, pip, go modules)
- Static application security testing (SAST)
- Malicious package detection (typosquatting, obfuscated code)
- License compliance scanning
- Software Bill of Materials (SBOM) generation
- Container image scanning
- Secret detection in source code
- Supply chain attack detection

EXCLUDE: cloud-only scanners without CLI/self-host

PRIORITIZE: CI/CD integration, npm ecosystem support,
active maintenance, low false-positive rate

KNOWN RELEVANT: Socket.dev, Snyk (CLI), Trivy, Grype, Syft,
npm audit, Semgrep, GitLeaks, TruffleHog, Scorecard (OSSF),
Mend (formerly WhiteSource), OWASP Dependency-Check
```

---

## How to Use Results

For each discovered project, evaluate using this scorecard:

| Criteria | Weight | Score (1-5) |
|----------|--------|-------------|
| Stars & community size | 10% | |
| Last commit < 90 days | 15% | |
| License compatibility (MIT/Apache 2.0) | 15% | |
| TypeScript or easily wrappable | 10% | |
| Maps to AINEFF system directly | 20% | |
| Can be ORF-wrapped (input/output are capturable) | 15% | |
| Security posture (known vulns, maintainer reputation) | 15% | |

**Score >= 3.5 → Fork candidate**
**Score >= 4.0 → High-priority fork**

## Fork-Audit-Adapt Pipeline

```
1. DISCOVER  — Run search prompts above
2. EVALUATE  — Score with scorecard
3. FORK      — Fork to frankmax-com org as aineff-fork-{name}
4. AUDIT     — Run Trivy + Semgrep + Socket.dev + manual review
5. STRIP     — Remove telemetry, analytics, vendor lock-in code
6. ADAPT     — Add @aineff/shared-types, AINEFFEvent emissions
7. ORF-WRAP  — Wrap all external I/O in ORF envelopes
8. PUBLISH   — Publish as @aineff/{system-name} package
9. REGISTER  — Add to SYSTEM_REGISTRY.md with "forked" origin tag
```

---

## Mapping: OSS to AINEFF Systems

| AINEFF System | Best OSS Candidates | Category |
|---|---|---|
| aineff-bpmn | bpmn-engine, Temporal, Inngest | Workflow |
| aineff-rams | Casbin, OPA, Cerbos, OpenFGA | Authorization |
| aineff-acts | Retraced, OpenTelemetry, EventStoreDB | Audit |
| aineff-telemetry | SigNoz, OpenTelemetry, Grafana | Observability |
| aineff-pies | verifywise, compliant-llm | GRC |
| aineff-jal | verifywise (multi-framework) | Compliance |
| aineff-shfs | flagwise, Responsible AI Toolbox | Safety |
| model-router | LiteLLM, Portkey | AI Routing |
| agent-runtime | CrewAI, LangGraph, Mastra | Agents |
| billing-service | Lago, OpenMeter | Billing |
| tenant-manager | Capsule, vcluster | K8s Multi-Tenancy |
| aineff-ui | shadcn/ui, Tremor | UI |
| DocuFlow | Docling, Unstructured.io | Document AI |
| aineff-aine-runtime | Capsule + Helm operator | K8s Lifecycle |
| aineff-ecs | Trillian, sigstore | Evidence |
| aineff-industry-intel | NAICS datasets, O*NET | Industry Data |
| aineff-audit-chain | Trillian, Rekor | Transparency Log |
| aineff-gbl | OPA, Kyverno | Policy |
| governance (AgentCoders) | compliant-llm, OPA | Agent Governance |

**Systems that MUST be built from scratch (core IP):**
- aineff-orf (ORF Protocol) — novel, no equivalent
- aineff-orf-sdk — novel SDK
- aineff-ads (Authority Decay) — novel concept
- aineff-tdes + aineff-mes + aineff-rps (Enterprise Mortality) — novel concept
- aineff-gaagr (Global Registry) — AINEFF-specific
- aineff-shared-types — AINEFF-specific type system
