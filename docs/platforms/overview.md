---
sidebar_position: 1
title: "Platforms Overview"
description: "Overview of all 7 AINEFF platforms — the revenue-generating layer that composes 30+ systems into deployable enterprise products."
---

# Platforms Overview

AINEFF platforms are the **revenue-generating composition layer** that sits above the 30+ core systems. Each platform is independently monetizable as a standalone product, yet becomes exponentially more valuable when composed with other platforms through the AINEFF closed-loop feedback architecture.

## The 7 Platforms

| # | Platform | Package | Revenue Model | Standalone Value |
|---|----------|---------|---------------|-----------------|
| 1 | [ORF Protocol](./orf-protocol) | `@aineff/orf` | Protocol licensing | Atomic constraint enforcement for any enterprise |
| 2 | [AINE Runtime](./aine-runtime) | `@aineff/aine-runtime` | Runtime hosting | Enterprise K8s runtime with governance built in |
| 3 | [AINEG Coordinator](./aineg) | `@aineff/aineg` | Portfolio SaaS | Cross-enterprise coordination and optimization |
| 4 | [Work Genesis Engine](./wge) | `@aineff/wge` | Venture creation | Autonomous revenue-generating agent teams |
| 5 | [LevelupMax](./levelupmax) | `@aineff/levelupmax` | Training ($800-1500/participant) | Operator certification and training |
| 6 | [Frankmax](./frankmax) | `@aineff/frankmax` | PIAR services ($15-30K/engagement) | Private Intelligence, Accountability, Responsibility |
| 7 | [Limitless Private Intelligence](./lpi) | `@aineff/lpi` | Network licensing | Enterprise private AI deployment |

## Platform Architecture

```
                    +-----------------------+
                    |    AINEG Coordinator   |  <-- Portfolio-level coordination
                    +-----------+-----------+
                                |
              +-----------------+-----------------+
              |                                   |
     +--------v--------+               +---------v--------+
     |  AINE Runtime A  |               |  AINE Runtime B  |  <-- Per-enterprise runtimes
     +--------+---------+               +---------+--------+
              |                                   |
     +--------v--------+               +---------v--------+
     | ORF Protocol     |               | ORF Protocol     |  <-- Obligation enforcement
     +---------+--------+               +---------+--------+
              |                                   |
    +---------+---------+              +----------+---------+
    |         |         |              |          |         |
  +--v-+   +-v--+  +--v-+          +-v--+    +-v--+   +--v-+
  |WGE |   |LMax|  |Fmax|          |WGE |    |LMax|   |LPI |
  +----+   +----+  +----+          +----+    +----+   +----+
   Venture  Training PIAR           Venture   Training  Private AI
   Cells               Services     Cells                Network
```

## Protocol Layer Mapping

All platforms operate at **Layer 3 (ORF)** and **Layer 4 (Enterprise Logic)** of the AINEFF protocol stack:

| Protocol Layer | Function | Platforms |
|---------------|----------|-----------|
| Layer 5 | Telemetry & Analytics | All platforms emit telemetry |
| **Layer 4** | **Enterprise Logic** | **AINEG, AINE Runtime, WGE, LevelupMax, Frankmax, LPI** |
| **Layer 3** | **ORF Constraint Enforcement** | **ORF Protocol (defines), all others (consume)** |
| Layer 2 | Governance & Audit | Shared governance SDK |
| Layer 1 | Infrastructure | Kubernetes, databases, messaging |

## Standalone vs. Composed Revenue

Each platform generates revenue independently:

```
Standalone Revenue (per platform):
  ORF Protocol         →  License fees per enterprise
  AINE Runtime         →  Hosting fees per runtime instance
  AINEG Coordinator    →  SaaS subscription per enterprise group
  Work Genesis Engine  →  Per venture cell created
  LevelupMax           →  $800-1500 per training participant
  Frankmax             →  $15-30K per PIAR engagement
  LPI                  →  Network licensing per deployment
```

When composed, platforms create **compound revenue loops**:

```
Compound Revenue Example:
  Frankmax engagement ($15-30K)
    → Identifies need for LevelupMax training (5 operators x $1200)
    → Operators deploy AINE Runtime (hosting fees)
    → AINE uses ORF Protocol (license fees)
    → WGE creates venture cells (per-cell fees)
    → AINEG coordinates portfolio (SaaS subscription)
    → Revenue from single engagement: $15K → $80K+ annually
```

## Governance Integration

Every platform integrates with the AINEFF governance stack:

- **`@aineff/audit-logger`** --- All operations produce immutable audit trails
- **`@aineff/governance-sdk`** --- Authority checks enforce who can do what
- **`@aineff/orf-sdk`** --- Obligation binding ensures accountability
- **`@aineff/telemetry`** --- Metrics, traces, and health signals flow to central dashboards

## Events Architecture

Platforms communicate through a structured event system:

```typescript
// Every platform emits standardized lifecycle events
interface PlatformEvent {
  eventId: string;
  systemId: string;      // e.g., 'aineff-orf', 'aineff-aine-runtime'
  timestamp: Date;
  payload: Record<string, unknown>;
}

// Standard lifecycle events per platform
type LifecycleEvents =
  | `${SystemId}.initialized`   // System startup complete
  | `${SystemId}.heartbeat`     // Periodic health signal
  | `${SystemId}.error`         // Error condition
  | `${SystemId}.shutdown`;     // Graceful shutdown
```

## Getting Started

1. **Single Platform** --- Deploy any platform standalone for immediate revenue
2. **Two-Platform Composition** --- Pair Frankmax + LevelupMax for services + training
3. **Full Stack** --- Deploy all 7 for maximum compound revenue

See individual platform documentation for deployment guides, API references, and integration patterns.
