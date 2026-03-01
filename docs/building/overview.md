---
sidebar_label: Overview
sidebar_position: 1
title: "Building AINEFF — How AgentCoders Ships the Factory"
---

# Building AINEFF

**Version:** v1.0.0
**Date:** 2026-03-01

## The Core Idea

AgentCoders builds AINEFF. The agent platform that AINEFF creates is the same platform that constructs AINEFF itself. This is deliberate dogfooding — every limitation AgentCoders hits while building AINEFF becomes a feature requirement for AgentCoders.

## Three Principles

### 1. Build What's Novel, Fork What's Infrastructure

AINEFF's real intellectual property is:
- **ORF Protocol** — obligation + responsibility + finality as atomic primitive
- **Authority Decay** — RBAC that expires, humans must re-authorize
- **Enterprise Mortality** — AINEs die on schedule, resurrection is cryptographically blocked
- **7 Closed Feedback Loops** — the compounding mechanism
- **Composition Architecture** — standalone revenue + composed compounding

Everything else — BPMN engines, RBAC systems, audit loggers, telemetry, billing, UI components — already exists as high-quality open source. We fork, security-audit, strip vendor lock-in, adapt to AINEFF interfaces, wrap in ORF envelopes, and publish as `@aineff/*` packages.

See [OSS Discovery Prompt](./oss-discovery-prompt) for the systematic search methodology.

### 2. Revenue Before Architecture

No system gets built unless it's on the critical path to revenue. The build order follows the revenue flywheel:

```
Chokepoint SaaS (revenue NOW)
    → ORF SDK + Audit Logger + Types (foundation)
    → One working AINE on K8s (demo-able product)
    → LevelupMax L1 + WGE templates (flywheel start)
    → Governance systems (moat)
```

### 3. The Docs Site Is the Source of Truth

This documentation site (`https://frankmax-com.github.io/aineff-docs/`) is the single source of truth for all agents, all humans, and all systems. When an AgentCoders agent needs to know what to build, it reads these pages. When the approach changes, these pages get a new version — nothing is deleted, only versioned additions showing the transition.

## What's In This Section

| Page | Purpose |
|------|---------|
| [Implementation Approach](./implementation-approach) | Phased build plan with reasoning — what to build and when |
| [Agent Build Manifest](./agent-build-manifest) | Exact specifications for what AgentCoders agents build per system |
| [System Contracts](./system-contracts) | Interface contracts, event types, and ORF envelopes between systems |
| [OSS Discovery Prompt](./oss-discovery-prompt) | Systematic prompt for finding GitHub projects to fork and adapt |
| [AgentCoders Requirements](./agentcoders-requirements) | What AgentCoders needs to become to ship AINEFF |

## Recovery Protocol for Any Agent

Any agent resuming AINEFF work should:

1. Read the [Introduction](../getting-started/introduction) — core concepts, ORF, PEP, clusters, platforms
2. Read the [Architecture Overview](../architecture/overview) — 6 clusters, 5-layer protocol, 7 platforms
3. Read the [Agent Build Manifest](./agent-build-manifest) — what to build next, in what order
4. Read the [Implementation Approach](./implementation-approach) — phases, priorities, what to defer
5. Read the [AgentCoders Requirements](./agentcoders-requirements) — what AgentCoders must become

**The docs site IS the source of truth. If docs and any other file conflict, docs win.**
