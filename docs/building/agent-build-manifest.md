---
sidebar_label: Agent Build Manifest
sidebar_position: 3
title: "Agent Build Manifest — What AgentCoders Builds"
---

# Agent Build Manifest

**Version:** v1.0.0
**Date:** 2026-03-01

This page is the work order for AgentCoders agents. Each entry specifies exactly what to build, what interfaces to implement, what events to emit, and what tests must pass.

## How Agents Use This Page

1. Read this page to find the next system to build (ordered by phase priority)
2. Read the system's dedicated doc page (linked) for full specification
3. Read [System Contracts](./system-contracts) for interface definitions
4. Check the OSS column — if a fork candidate exists, start from the fork
5. Implement against `@aineff/shared-types`
6. Wrap all external I/O in ORF envelopes via `@aineff/orf-sdk`
7. Log all state changes via `@aineff/audit-logger`
8. Emit `AINEFFEvent` for every significant action
9. Write tests. If tests fail, the system is not done.

---

## Phase 1 — Foundation Packages

### 1.1 `@aineff/shared-types`

**Repo:** `frankmax-com/aineff-shared-types`
**Doc:** [Shared Types](../systems/packages/shared-types)
**Fork:** None — build from scratch
**Priority:** CRITICAL — everything depends on this

**Deliverables:**
```
src/
  events.ts        — AINEFFEvent interface, event type enums
  orf.ts           — ORFEnvelope, ObligatedParty, ResponsibleParty, FinalityProof
  authority.ts     — AuthorityGrant, AuthorityLevel, DecaySchedule, RoleDefinition
  enterprise.ts    — EnterpriseGenome, AINEConfig, AINEGConfig, LifecycleState
  agent.ts         — AgentSpec, VentureCell, AgentTeam, SkillDefinition
  industry.ts      — NAICSCode, SICCode, IndustryProfile, JobRole, Primitive
  audit.ts         — AuditEntry, CausalTrace, EvidenceRecord, HashChain
  governance.ts    — PolicyRule, JurisdictionConstraint, ComplianceResult
  index.ts         — re-export all
```

**Tests:** Type compilation tests. Every type must be importable and usable.

---

### 1.2 `@aineff/orf-sdk`

**Repo:** `frankmax-com/aineff-orf-sdk`
**Doc:** [ORF SDK](../systems/packages/orf-sdk), [ORF Protocol](../platforms/orf-protocol)
**Fork:** None — core IP, build from scratch
**Priority:** CRITICAL — all systems use this

**Deliverables:**
```
src/
  envelope.ts      — createORFEnvelope(), validateEnvelope(), sealEnvelope()
  obligation.ts    — createObligation(), fulfillObligation(), failObligation()
  constraint.ts    — evaluateConstraint(), ConstraintType enum
  finality.ts      — generateFinalityHash(), verifyFinality(), isReversible()
  middleware.ts    — Express/Fastify middleware that wraps requests in ORF
  index.ts
```

**Key behaviors:**
- `createORFEnvelope(action, obligor, responsibleParty)` → returns sealed envelope
- `evaluateConstraint(envelope, context)` → returns allow/deny with reason
- `generateFinalityHash(envelope)` → SHA-256 proof of irreversible commitment
- Fail-closed: if ORF is unreachable, all actions halt (never proceed unaccounted)

**Tests:** Unit tests for every function. Integration test: create envelope → evaluate → finalize → verify hash.

---

### 1.3 `@aineff/audit-logger`

**Repo:** `frankmax-com/aineff-audit-logger`
**Doc:** [Audit Logger](../systems/packages/audit-logger)
**Fork candidates:** Retraced, event-sourcing frameworks
**Priority:** CRITICAL — all systems log through this

**Deliverables:**
```
src/
  logger.ts        — AuditLogger class with append(), query(), verify()
  chain.ts         — HashChain implementation (SHA-256 linked entries)
  entry.ts         — AuditEntry creation with ORF envelope attachment
  storage.ts       — StorageAdapter interface (in-memory, file, PostgreSQL)
  query.ts         — Query builder for audit trail search
  index.ts
```

**Key behaviors:**
- Every entry includes previous entry's hash → tamper-evident chain
- Entries are append-only — no update, no delete
- Query by time range, system, event type, correlation ID
- Verify chain integrity: `auditLogger.verifyChain()` → returns integrity report

**Tests:** Chain integrity tests. Tamper detection tests. Query tests.

---

### 1.4 `@aineff/governance-sdk`

**Repo:** `frankmax-com/aineff-governance-sdk`
**Doc:** [Governance SDK](../systems/packages/governance-sdk)
**Fork candidates:** Casbin (policy engine), OPA (constraint evaluation)
**Priority:** CRITICAL — all systems enforce governance through this

**Deliverables:**
```
src/
  authority.ts     — checkAuthority(), grantAuthority(), revokeAuthority()
  decay.ts         — AuthorityDecayTimer, calculateDecay(), isExpired()
  escalation.ts    — triggerEscalation(), EscalationLevel enum
  role.ts          — resolveRole(), RoleResolver class
  policy.ts        — evaluatePolicy(), PolicyEngine adapter
  index.ts
```

**Key behaviors:**
- `checkAuthority(agentId, action, resource)` → returns AuthorityDecision
- `calculateDecay(grant)` → returns remaining authority percentage (0-100)
- `triggerEscalation(reason, context)` → notifies human oversight
- All decisions are audit-logged automatically

**Tests:** Authority check tests. Decay calculation tests. Escalation trigger tests.

---

## Phase 2 — Core Systems

### 2.1 EMS (Enterprise Manufacturing System)

**Repo:** `frankmax-com/aineff-ems`
**Doc:** [EMS](../systems/cluster-1/ems)
**Fork candidates:** Capsule (K8s namespace management)
**Priority:** HIGH — creates AINEs

**Deliverables:**
- API endpoint: `POST /api/v1/enterprises` — accepts genome, creates AINE
- K8s namespace creation with labels, annotations, resource quotas
- Helm chart installation for AINE agent pods
- GAAGR registration
- Health check endpoint

**Events emitted:** `factory.ems.enterprise-created`, `factory.ems.agents-deployed`
**Events consumed:** `factory.gcs.genome-compiled`, `factory.igs.gate-approved`

---

### 2.2 GCS (Genome Compiler System)

**Repo:** `frankmax-com/aineff-gcs`
**Doc:** [GCS](../systems/cluster-1/gcs)
**Fork:** None — JSON Schema validation
**Priority:** HIGH — validates genomes before birth

**Deliverables:**
- API endpoint: `POST /api/v1/genomes/compile` — validates genome spec
- JSON Schema validation against enterprise genome schema
- Jurisdiction constraint checking
- Risk parameter evaluation
- Compiled genome output (deployment-ready artifact)

**Events emitted:** `factory.gcs.genome-compiled`, `factory.gcs.genome-rejected`

---

### 2.3 IGS (Instantiation Gate System)

**Repo:** `frankmax-com/aineff-igs`
**Doc:** [IGS](../systems/cluster-1/igs)
**Fork:** None — simple gate logic
**Priority:** HIGH — final approval before birth

**Deliverables:**
- API endpoint: `POST /api/v1/gates/evaluate` — mechanical go/no-go
- Checks: genome compiled? liable party bound? payment confirmed? jurisdiction valid?
- ORF constraint: human liability bearer MUST be bound (atomic requirement)

**Events emitted:** `factory.igs.gate-approved`, `factory.igs.gate-denied`

---

### 2.4 RAMS (Role, Authority & Mandate System)

**Repo:** `frankmax-com/aineff-rams`
**Doc:** [RAMS](../systems/cluster-2/rams)
**Fork candidates:** Casbin, OpenFGA
**Priority:** HIGH — enforces who can do what

**Deliverables:**
- API endpoint: `POST /api/v1/authority/check` — evaluates authority
- Role CRUD: create, assign, revoke roles
- Authority grant with scope, duration, decay rate
- Mandate creation with deadline tracking
- K8s RBAC generation from role definitions

**Events emitted:** `governance.rams.role-assigned`, `governance.rams.authority-confirmed`, `governance.rams.authority-denied`

---

### 2.5 ACTS (Audit & Causal Trace System)

**Repo:** `frankmax-com/aineff-acts`
**Doc:** [ACTS](../systems/cluster-4/acts)
**Fork candidates:** Retraced, OpenTelemetry tracing
**Priority:** HIGH — everything gets logged here

**Deliverables:**
- Event ingestion: accepts `AINEFFEvent` from all systems
- Hash-chained storage (uses `@aineff/audit-logger` internally)
- Causal trace builder: links events by `correlationId` and `causationId`
- Query API: search by time, system, event type, AINE, agent
- Integrity verification endpoint

**Events emitted:** `audit.acts.record-created`, `audit.acts.trace-completed`, `audit.acts.integrity-verified`

---

### 2.6 BPMN Engine

**Repo:** `frankmax-com/aineff-bpmn`
**Doc:** [BPMN](../systems/cluster-6/bpmn)
**Fork candidates:** bpmn-engine (npm), Temporal, Inngest
**Priority:** HIGH — agent workflow execution

**Deliverables:**
- Process definition ingestion (BPMN 2.0 XML or JSON)
- Sequential workflow execution engine
- Task assignment to agent pods
- Process state persistence
- Visualization data output (SVG/JSON)

**Events emitted:** `intelligence.bpmn.process-started`, `intelligence.bpmn.task-assigned`, `intelligence.bpmn.process-completed`

---

### 2.7 AgentCoders agent-runtime

**Repo:** `frankmax-com/agentcoders` (package: `@agentcoders/agent-runtime`)
**Doc:** [AgentCoders](../agents/agentcoders)
**Fork candidates:** Mastra, CrewAI runtime patterns
**Priority:** HIGH — agents execute tasks

**Deliverables:**
- Agent lifecycle management (create, start, stop, restart, health check)
- Task queue (receive tasks from BPMN, execute, report results)
- Model orchestration (route to AI providers via model-router)
- Skill execution (load skills from skill-registry, execute)
- Telemetry emission (report metrics, logs, traces)
- ORF integration (all actions wrapped in ORF envelopes)

---

## Phase 3 — Flywheel Systems

### 3.1 LevelupMax — Level 1 Training

**Doc:** [LevelupMax](../platforms/levelupmax)
**Fork candidates:** Open LMS platforms
**Deliverables:** AINE Observer course, sandbox environment, assessment, certificate generation

### 3.2 WGE — 3 Industry Templates

**Doc:** [WGE](../platforms/wge)
**Fork candidates:** Inngest, Trigger.dev
**Deliverables:** Template engine, 3 pre-built templates, cell factory, cell manager

### 3.3 Telemetry System

**Doc:** [Telemetry](../systems/cluster-6/telemetry)
**Fork candidates:** SigNoz, OpenTelemetry
**Deliverables:** Metrics collection, Prometheus export, dashboard data API

### 3.4 AINEG Coordinator

**Doc:** [AINEG](../platforms/aineg)
**Deliverables:** Multi-AINE heartbeat aggregation, cross-sell detection, portfolio dashboard

### 3.5 Operator Dashboard

**Doc:** [Operator Dashboard](../apps/operator-dashboard)
**Fork candidates:** Refine, shadcn/ui
**Deliverables:** AINE status view, agent health, telemetry charts, authority management UI

---

## Phase 4 — Governance Systems

Build specifications for Phase 4 systems will be versioned into this manifest when Phase 3 is underway.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-03-01 | Initial build manifest covering Phases 1-3 |
