---
sidebar_label: Implementation Approach
sidebar_position: 2
title: "Implementation Approach v1"
---

# Implementation Approach

**Version:** v1.0.0
**Date:** 2026-03-01

## Current State

- 85 repos scaffolded with stub `index.ts` files
- Chokepoint Intelligence app is the only functional product (Next.js 16)
- Docusaurus docs site deployed at `https://frankmax-com.github.io/aineff-docs/`
- Monorepo wired: Turborepo, pnpm workspaces, 70 git submodules
- No system has production code yet
- No paying customers yet

## Phase 0: Revenue Now (Weeks 1-4)

**Goal:** Generate first revenue. Validate pricing. Prove market.

| Priority | Deliverable | Revenue |
|----------|-------------|---------|
| 1 | Ship Chokepoint Intelligence as self-service SaaS ($500-2000/assessment) | Immediate |
| 2 | Landing page + Stripe checkout on frankmax.digital | Payment flow |
| 3 | Run 3 paid Frankmax engagements ($15-30K each) | $45-90K |

**What AgentCoders does:** Nothing yet. Humans sell and deliver.

## Phase 1: The Foundation (Weeks 5-12)

**Goal:** Build the 4 packages every other system depends on. To production quality.

| Package | What Gets Built | OSS to Fork |
|---------|----------------|-------------|
| `@aineff/shared-types` | `AINEFFEvent`, `ORFEnvelope`, `AuthorityGrant`, `EnterpriseGenome`, all entity types | None — original |
| `@aineff/orf-sdk` | Obligation binding, constraint evaluation, finality hash generation, fail-closed enforcement | None — original IP |
| `@aineff/audit-logger` | Append-only hash-chained log, ORF-aware entries, query API | Fork: Retraced or event-sourcing lib |
| `@aineff/governance-sdk` | Authority check primitives, decay timer, escalation trigger, role verification | Fork: Casbin/OPA adapter |

**Success criteria:** `npm install @aineff/orf-sdk` works. 100% test coverage. Real TypeScript types. Published to npm (or private registry).

**What AgentCoders does:** Phase 1 is when AgentCoders agents start writing AINEFF code. The agent-runtime and jarvis-runtime packages must be functional enough to generate code, run tests, and commit to repos.

## Phase 2: One Working AINE (Weeks 13-24)

**Goal:** `aineff deploy --genome machine-shop.json` creates a K8s namespace with 3 agent pods running a simple workflow.

| System | What Gets Built | What Gets Skipped | OSS to Fork |
|--------|----------------|-------------------|-------------|
| EMS | Namespace creation, Helm release, agent pod deployment | Complex genome validation | Fork: Capsule or K8s operator |
| GCS | JSON Schema genome validation | Full genome compilation | None — simple validation |
| IGS | Basic gate (has genome? has liable party? → approve) | Multi-stage gating | None — simple logic |
| RAMS | Static role assignment, basic authority check | Authority decay (Phase 4) | Fork: Casbin |
| ACTS | Append-only event log with hash chains | Causal DAG visualization | Fork: Retraced |
| BPMN | Simple sequential workflow execution | Full BPMN 2.0 parser | Fork: bpmn-engine or Temporal |
| agent-runtime | Run one agent pod that executes tasks | 13 other AgentCoders packages | Fork: Mastra or CrewAI patterns |

**Success criteria:** A demo you can show a customer. Namespace appears in `kubectl get ns`. Agents execute a 3-step workflow. Audit trail shows what happened.

**What AgentCoders does:** AgentCoders agents build each system above. Jarvis CEO delegates to specialist agents. Each specialist reads the relevant system doc page, reads the system contract, and implements against `@aineff/shared-types`.

## Phase 3: Revenue Flywheel (Weeks 25-40)

**Goal:** Each product sells the next product.

| Deliverable | Why Now | OSS to Fork |
|-------------|---------|-------------|
| LevelupMax Level 1 (AINE Observer, $800, 2-day course) | Customers can't operate AINEs without training | LMS: Fork an open LMS |
| WGE v1 — 3 industry templates (manufacturing, services, logistics) | Pre-configured agent teams reduce deployment time | Workflow: Inngest or Trigger.dev |
| Telemetry + Revenue Intel | Customers need dashboards showing agent activity and revenue | Fork: SigNoz, OpenTelemetry |
| AINEG v1 | Once 3+ AINEs run, portfolio coordination creates cross-sell | None — custom |
| Operator Dashboard | Operators need a UI to manage AINEs | Fork: Refine, shadcn/ui |

**What AgentCoders does:** Full agent teams building systems in parallel. Each team reads the relevant doc page and system contract.

## Phase 4: Governance Moat (Weeks 41-52)

**Goal:** Build the systems that enterprise buyers evaluate when choosing AI governance.

| System | Why Now |
|--------|---------|
| ADS (Authority Decay) | Enterprise requirement — no permanent permissions |
| NLO-R (Named Liable Officer Registry) | Compliance requirement for regulated industries |
| JAL (Jurisdiction Adapter Layer) | Multi-jurisdiction is table stakes for enterprise |
| TDES + MES + RPS (Enterprise Mortality) | Prove AINEs can die cleanly — differentiator |
| SHFS (Systemic Harm Forecasting) | Risk assessment for board-level visibility |

**What AgentCoders does:** Mature agent teams with feedback loop integration. Systems emit events that feed back into earlier systems.

## Systems to Defer (Build When Needed)

| System | Why Defer |
|--------|----------|
| Semantic Closure System (SCS) | Academic, no customer has asked for it |
| Misinterpretation Index (MIDC) | Nice-to-have drift detection, not blocking revenue |
| Human Collective Discipline Infrastructure (HCDI) | Overlaps with RAMS + HOES |
| Conflict-of-Interest Engine (COIE) | Build when user base is large enough |
| Canonical Export & Fork Protocol (CEFP) | Regulatory requirement, not revenue — build when forced |
| Resurrection Prevention System (RPS) | Build after first AINE death |
| Regulatory Rate-Limiter (RRLS) | Build when growth requires throttling |

**These systems are NOT deleted from the architecture.** They remain documented, specified, and scaffolded. They will be built when the product matures enough to need them.

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-03-01 | Initial implementation approach |
