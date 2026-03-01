---
sidebar_label: AgentCoders Requirements
sidebar_position: 6
title: "AgentCoders Requirements — What AgentCoders Must Become"
---

# AgentCoders Requirements

**Version:** v1.0.0
**Date:** 2026-03-01

AgentCoders is the agent platform that builds AINEFF itself. This page specifies what AgentCoders must be capable of to ship every AINEFF system, platform, and package.

## Current State (14 Packages)

| Package | Current State | Required State |
|---------|--------------|----------------|
| agent-runtime | Scaffold | Must execute tasks, manage lifecycle, emit AINEFFEvents |
| jarvis-runtime | Scaffold | Must delegate to specialist agents, track progress, make decisions |
| agent-memory | Scaffold | Must persist working/long-term/episodic memory across sessions |
| billing-service | Scaffold | Must track usage, generate invoices, integrate Stripe |
| dashboard | Scaffold | Must show agent health, task status, system metrics |
| enhancement-layer | Scaffold | Must support plugin installation and capability extension |
| governance | Scaffold | Must enforce policy on agent behavior via governance-sdk |
| management-models | Scaffold | Must define org structures: pods, squads, venture cells |
| model-router | Scaffold | Must route to 17+ AI providers with fallback and cost optimization |
| scm-adapters | Scaffold | Must read/write GitHub repos (clone, branch, commit, PR) |
| shared | Scaffold | Must provide common types and utilities |
| skill-registry | Scaffold | Must discover, register, and score skill performance |
| telegram-gateway | Scaffold | Must enable mobile operator access via Telegram bot |
| tenant-manager | Scaffold | Must isolate tenants (K8s namespaces, resource quotas, RBAC) |

## What AgentCoders Must Do to Ship AINEFF

### Capability 1: Read Documentation and Derive Implementation

An AgentCoders agent must be able to:
1. Fetch a documentation page from this site (e.g., the [EMS doc](../systems/cluster-1/ems))
2. Read the [System Contracts](./system-contracts) page for interface definitions
3. Generate TypeScript implementation that satisfies the contracts
4. Write tests that verify the implementation
5. Commit to the correct GitHub repo

**Required packages:** agent-runtime, jarvis-runtime, agent-memory, scm-adapters, model-router

### Capability 2: Fork and Adapt OSS Projects

An AgentCoders agent must be able to:
1. Read the [OSS Discovery Prompt](./oss-discovery-prompt) to find fork candidates
2. Clone the candidate repo
3. Run security audit (dependency scan, SAST, secret detection)
4. Strip telemetry, analytics, and vendor lock-in code
5. Adapt types to `@aineff/shared-types`
6. Wrap I/O in ORF envelopes via `@aineff/orf-sdk`
7. Add `AINEFFEvent` emissions
8. Publish as `@aineff/{system-name}`

**Required packages:** agent-runtime, scm-adapters, skill-registry (security audit skills)

### Capability 3: Multi-Agent Team Coordination

An AgentCoders team building a system looks like:

```
Jarvis CEO (jarvis-runtime)
  ├── Architect Agent     — reads docs, designs implementation plan
  ├── Coder Agent         — writes TypeScript, implements contracts
  ├── Tester Agent        — writes and runs tests
  ├── Security Agent      — scans for vulnerabilities, reviews code
  └── DevOps Agent        — creates Dockerfile, K8s manifest, CI pipeline
```

**Required packages:** jarvis-runtime, management-models, agent-runtime (multiple instances)

### Capability 4: Continuous Self-Improvement

As AgentCoders builds AINEFF systems, it discovers its own limitations. These must be fed back:

```
AgentCoders builds EMS → discovers it needs better K8s skill
  → registers "k8s-namespace-management" skill in skill-registry
  → next time EMS-like system is built, uses improved skill
  → skill performance scored by telemetry
```

**Required packages:** skill-registry, agent-memory, enhancement-layer

### Capability 5: ORF-Native Operations

Every action AgentCoders takes must be ORF-wrapped:
- Code commits bind the committing agent as obligor, the Jarvis CEO as responsible party
- Test results bind the tester agent as obligor, the system owner as responsible party
- Deployments bind the DevOps agent as obligor, the human operator as responsible party

**Required packages:** governance, agent-runtime (with ORF integration)

---

## Strengthening Priority: What to Build First in AgentCoders

### Tier 1 — Must Work Before AgentCoders Can Build Anything

| Package | What to Implement | OSS to Fork |
|---------|------------------|-------------|
| model-router | Multi-provider routing (Anthropic, OpenAI, local), streaming, fallback | LiteLLM |
| agent-runtime | Task queue, lifecycle management, health checks, event emission | Mastra patterns |
| scm-adapters | GitHub: clone, branch, read files, write files, commit, push, create PR | Octokit + custom |
| shared | Common types aligned with `@aineff/shared-types` | None |

### Tier 2 — Must Work for Team Coordination

| Package | What to Implement | OSS to Fork |
|---------|------------------|-------------|
| jarvis-runtime | Delegation, task breakdown, progress tracking, decision-making | CrewAI manager pattern |
| management-models | Pod, squad, venture cell definitions | None — small |
| agent-memory | Working memory (session), long-term (persistent), episodic (experience) | Mem0, Zep patterns |
| skill-registry | Skill registration, discovery, performance scoring | None — custom |

### Tier 3 — Must Work for Production Operations

| Package | What to Implement | OSS to Fork |
|---------|------------------|-------------|
| governance | Policy enforcement on agent actions via `@aineff/governance-sdk` | OPA adapter |
| tenant-manager | K8s namespace isolation, resource quotas, RBAC per tenant | Capsule |
| billing-service | Usage metering, invoice generation, Stripe integration | Lago |
| dashboard | Agent health UI, task status, system metrics | Refine + shadcn/ui |
| enhancement-layer | Plugin system for new capabilities | None — custom |
| telegram-gateway | Telegram bot for operator commands | grammy/telegraf |

---

## AgentCoders → AINEFF Dependency Removal

Today, AgentCoders depends on external services to function. To ship AINEFF reliably, these dependencies must be internalized:

| External Dependency | Replace With | Timeline |
|--------------------|-------------|----------|
| Direct AI provider API calls | model-router (multi-provider with fallback) | Tier 1 |
| Manual GitHub operations | scm-adapters (automated clone/branch/commit/PR) | Tier 1 |
| No persistent memory | agent-memory (working + long-term + episodic) | Tier 2 |
| No team coordination | jarvis-runtime + management-models | Tier 2 |
| No governance on agent actions | governance package + ORF SDK | Tier 3 |
| No billing/usage tracking | billing-service + metering | Tier 3 |
| No skill improvement | skill-registry + enhancement-layer | Tier 3 |

---

## How to Verify AgentCoders Is Ready

### Test 1: Can It Build a Package?

```
INPUT: "Build @aineff/shared-types from the system-contracts doc page"
EXPECTED: Agent reads docs, generates TypeScript types, writes tests,
          commits to frankmax-com/aineff-shared-types, all tests pass
```

### Test 2: Can It Fork and Adapt?

```
INPUT: "Fork LiteLLM and adapt it as @aineff/model-router"
EXPECTED: Agent clones repo, runs security scan, strips vendor code,
          adds AINEFF types, wraps in ORF, publishes package
```

### Test 3: Can a Team Build a System?

```
INPUT: "Build aineff-ems from the EMS doc page and system contracts"
EXPECTED: Jarvis CEO delegates to architect, coder, tester, security, devops.
          Each agent reads the relevant docs. System is built, tested,
          containerized, and has a CI pipeline. All tests pass.
```

### Test 4: Does It Self-Improve?

```
INPUT: Build 3 systems in sequence.
EXPECTED: The 3rd system builds faster than the 1st because skills
          from earlier builds are registered and reused.
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-03-01 | Initial AgentCoders requirements and strengthening plan |
