---
sidebar_position: 3
title: "Monorepo Setup"
description: "Detailed explanation of the AINEFF monorepo structure, directory layout, git submodules, pnpm workspaces, and Turborepo pipelines."
---

# Monorepo Setup

AINEFF is organized as a monorepo containing ~85 components. Each component is an independent git repository included as a submodule, and all are orchestrated through pnpm workspaces and Turborepo. This architecture enables both standalone operation (each repo is a self-contained product) and composed operation (the monorepo creates compounding feedback loops between components).

## Directory Layout

```
AINEFF/
├── systems/                    # 43 systems organized into 6 clusters
│   ├── cluster-1-factory/      # Enterprise Birth, Manufacturing & Pattern Control
│   │   ├── ems/                #   Enterprise Manufacturing System
│   │   ├── egms/               #   Enterprise Group Manufacturing System
│   │   ├── pdes/               #   Pattern-Derived Enterprise Synthesis
│   │   ├── gcs/                #   Genome Compiler System
│   │   ├── igs/                #   Instantiation Gate System
│   │   ├── tis/                #   Template Integrity System
│   │   ├── fbs/                #   Factory Boundary System
│   │   └── gaagr/              #   Global AINE & AINEG Registry
│   ├── cluster-2-governance/   # Governance, Authority & Human Discipline
│   │   ├── rams/               #   Role, Authority & Mandate System
│   │   ├── gbl/                #   Governance Boundary Layer
│   │   ├── ogcrs/              #   Ownership Graph & Control Resolution
│   │   ├── hoes/               #   Human Oversight & Escalation System
│   │   ├── hcdi/               #   Human Collective Discipline Infrastructure
│   │   ├── hcl/                #   Human Coordination Ledger
│   │   ├── coie/               #   Conflict-of-Interest Engine
│   │   ├── ads/                #   Authority Decay System
│   │   └── ndar/               #   Non-Delegable Authority Registry
│   ├── cluster-3-policy/       # Policy, Semantics & Interpretation Control
│   │   ├── pies/               #   Policy Ingestion & Enforcement System
│   │   ├── jal/                #   Jurisdiction Adapter Layer
│   │   ├── cvss/               #   Canonical Vocabulary & Semantics System
│   │   ├── midc/               #   Misinterpretation Index & Drift Control
│   │   └── scs/                #   Semantic Closure System
│   ├── cluster-4-audit/        # Audit, Failure, Time & Death
│   │   ├── acts/               #   Audit & Causal Trace System
│   │   ├── fms/                #   Failure Management System
│   │   ├── tdes/               #   Time, Decay & Exit System
│   │   ├── npos/               #   Non-Participation & Opt-Out System
│   │   ├── ecs/                #   Evidence Custody System
│   │   ├── rps/                #   Resurrection Prevention System
│   │   └── mes/                #   Mortality Enforcement System
│   ├── cluster-5-safeguards/   # Systemic Safeguards & Regulator Interfaces
│   │   ├── shfs/               #   Systemic Harm Forecasting System
│   │   ├── nlo-r/              #   Named Liable Officer Registry
│   │   ├── ssdt/               #   Semantic Snapshot at Decision Time
│   │   ├── cefp/               #   Canonical Export & Fork Protocol
│   │   ├── sei/                #   Sovereign Emergency Interface
│   │   └── rrls/               #   Regulatory Rate-Limiter System
│   └── cluster-6-intelligence/ # Intelligence & Infrastructure
│       ├── bpmn/               #   BPMN Engine
│       ├── role-engine/        #   Role Derivation Engine
│       ├── industry-intel/     #   Industry Intelligence
│       ├── protocol-router/    #   Protocol Router
│       ├── audit-chain/        #   Audit Chain
│       ├── acos/               #   Agent Composition & Orchestration
│       ├── telemetry/          #   Telemetry System
│       └── revenue-intel/      #   Revenue Intelligence
├── platforms/                  # 7 higher-level orchestration platforms
│   ├── orf/                    # ORF Protocol
│   ├── aine-runtime/           # AINE Runtime
│   ├── aineg/                  # AINEG Coordinator
│   ├── wge/                    # Work Genesis Engine
│   ├── levelupmax/             # Operator Training Platform
│   ├── frankmax/               # PIAR Services Platform
│   └── lpi/                    # Limitless Private Intelligence
├── packages/                   # 6 shared packages consumed across the ecosystem
│   ├── shared-types/           # @aineff/shared-types
│   ├── governance-sdk/         # @aineff/governance-sdk
│   ├── audit-logger/           # @aineff/audit-logger
│   ├── jurisdiction-engine/    # @aineff/jurisdiction-engine
│   ├── ui/                     # @aineff/ui (React component library)
│   └── orf-sdk/                # @aineff/orf-sdk
├── apps/                       # User-facing applications
│   ├── chokepoint-web/         # Chokepoint Intelligence (Next.js, alpha)
│   ├── docuflow/               # Document workflow automation
│   ├── operator-dashboard/     # LevelupMax operator portal
│   ├── frankmax-portal/        # PIAR + accountability UI
│   ├── frankmax-site/          # Brand/marketing (Hugo)
│   ├── levelupmax-web/         # Training portal
│   └── blog/                   # Contributor blog
├── agents/                     # AI agent packages
│   └── packages/               # AgentCoders (14 agent packages)
├── factories/                  # Governance factory implementations
│   ├── ai-provider/            # AI Provider Factory
│   ├── github-governance/      # GitHub Governance Factory
│   ├── database-governance/    # Database Governance Factory
│   ├── azure-devops-governance/ # Azure DevOps Governance Factory
│   └── riskops/                # Enterprise RiskOps Pipeline
├── deploy/                     # Infrastructure and deployment
│   ├── ci/                     # GitHub Actions workflows
│   ├── docker/                 # Dockerfile templates
│   ├── helm/                   # Helm charts for AINE lifecycle
│   ├── k8s/                    # Kustomize base + overlays
│   └── openclaw/               # OpenClaw K8s orchestration (submodule)
├── config/                     # Shared configuration data
│   ├── chokepoint-catalog/     # Universal chokepoint patterns
│   ├── jurisdictions/          # Legal constraint definitions
│   └── naics-sic/              # Industry classification data (NAICS/SIC)
├── docs-site/                  # This documentation site (Docusaurus)
├── scripts/                    # Monorepo utility scripts
├── turbo.json                  # Turborepo pipeline configuration
├── pnpm-workspace.yaml         # pnpm workspace definitions
├── package.json                # Root package with monorepo scripts
├── tsconfig.base.json          # Shared TypeScript configuration
├── SYSTEM_REGISTRY.md          # Complete inventory of all 85 components
└── CLOSED_LOOP.md              # Feedback loop architecture documentation
```

## Git Submodules

### Why Submodules

AINEFF uses git submodules rather than a traditional monorepo (all code in one repository) for a specific reason: **each component must be independently deployable, licensable, and revenue-generating**. A customer purchasing the Audit & Causal Trace System (ACTS) gets access to the `aineff-acts` repository as a standalone product. When composed in the monorepo, that same repository participates in cross-system feedback loops.

Each submodule points to a specific commit in its upstream repository, hosted under the `frankmax-com` GitHub organization.

### Common Submodule Operations

**Initialize all submodules (first time):**

```bash
git submodule update --init --recursive
```

**Update all submodules to latest upstream commits:**

```bash
git submodule update --remote --merge
```

**Check submodule status:**

```bash
git submodule status
```

A `+` prefix indicates the submodule is at a different commit than what the monorepo expects. A `-` prefix indicates the submodule has not been initialized.

**Work inside a submodule:**

```bash
cd systems/cluster-1-factory/ems
git checkout main
git pull origin main
# Make changes, commit, push to the submodule's own repo
```

After updating a submodule, the monorepo will show the submodule directory as modified. You need to commit this change in the monorepo to pin the new submodule commit:

```bash
cd /path/to/AINEFF
git add systems/cluster-1-factory/ems
git commit -m "chore: bump EMS to latest"
```

**Selectively initialize specific submodules:**

```bash
# Only systems in a specific cluster
git submodule update --init systems/cluster-4-audit/*

# Only shared packages
git submodule update --init packages/*

# A single specific system
git submodule update --init platforms/orf
```

### Submodule Gotchas

- **Detached HEAD:** Submodules check out a specific commit, not a branch. If you need to make changes, explicitly check out a branch first (`git checkout main`).
- **Nested submodules:** Some submodules (like `deploy/openclaw`) may contain their own submodules. Use `--recursive` to handle these.
- **CI builds:** The CI pipeline uses `submodules: recursive` in the checkout action to ensure all code is available.

## pnpm Workspaces

The `pnpm-workspace.yaml` file defines which directories contain workspace packages:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "systems/cluster-1-factory/*"
  - "systems/cluster-2-governance/*"
  - "systems/cluster-3-policy/*"
  - "systems/cluster-4-audit/*"
  - "systems/cluster-5-safeguards/*"
  - "systems/cluster-6-intelligence/*"
  - "platforms/*"
  - "factories/*"
  - "agents"
```

### How It Works

Each workspace package has its own `package.json` with a scoped name (e.g., `@aineff/ems`, `@aineff/shared-types`). When one package depends on another, pnpm creates a symlink rather than downloading from the registry:

```json
// In systems/cluster-1-factory/ems/package.json
{
  "dependencies": {
    "@aineff/shared-types": "workspace:*",
    "@aineff/governance-sdk": "workspace:*",
    "@aineff/audit-logger": "workspace:*"
  }
}
```

The `workspace:*` protocol tells pnpm to resolve the dependency from the local workspace rather than the npm registry.

### Workspace Commands

**Run a command in a specific workspace:**

```bash
pnpm --filter @aineff/ems dev
```

**Run a command in all workspaces matching a pattern:**

```bash
pnpm --filter './systems/cluster-1-factory/*' build
```

**Add a dependency to a specific workspace:**

```bash
pnpm --filter @aineff/ems add zod
```

**Add an internal dependency:**

```bash
pnpm --filter @aineff/ems add @aineff/shared-types --workspace
```

## Turborepo Pipelines

Turborepo orchestrates task execution across all workspaces, respecting dependency order and maximizing parallelism. The pipeline is defined in `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Pipeline Behavior

| Task | `dependsOn` | Caching | Behavior |
|------|-------------|---------|----------|
| `build` | `^build` | Yes (outputs: `dist/**`, `.next/**`) | Builds dependencies first (topological order), caches outputs |
| `dev` | None | No | Runs dev servers, persistent (does not exit) |
| `lint` | `^build` | Yes | Lints after dependencies are built |
| `typecheck` | `^build` | Yes | Type-checks after dependencies are built |
| `test` | `build` | Yes | Tests after the package itself is built |
| `clean` | None | No | Removes build artifacts |

The `^` prefix in `dependsOn` means "the same task in all dependency packages must complete first." So `build` in `@aineff/ems` will wait for `build` in `@aineff/shared-types`, `@aineff/governance-sdk`, and any other dependency to complete before starting.

### Caching

Turborepo caches task outputs. If you run `pnpm build` twice and nothing has changed, the second run will restore outputs from cache in milliseconds. Cache keys are computed from:

- Source file hashes
- Environment variables
- Dependency outputs
- `turbo.json` configuration

To force a full rebuild without cache:

```bash
pnpm turbo build --force
```

### Dependency Graph Visualization

To visualize the dependency graph:

```bash
pnpm turbo build --graph
```

This generates a graph showing how all workspace packages relate to each other, which is useful for understanding how changes propagate through the monorepo.

## Shared TypeScript Configuration

All workspaces extend a common TypeScript configuration from the monorepo root:

```json
// In any workspace's tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

The base configuration (`tsconfig.base.json`) establishes consistent compiler options across all 85 components, including strict mode, ESNext module resolution, and path aliases for internal packages.

## What's Next

- [Development Workflow](./development-workflow) -- How to work on a specific system, test changes, and push through CI.
- [Architecture Overview](/docs/architecture/overview) -- The protocol stack, closed-loop feedback, and AINE lifecycle.
