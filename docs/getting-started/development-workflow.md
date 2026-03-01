---
sidebar_position: 4
title: "Development Workflow"
description: "How to develop, test, build, and deploy changes in the AINEFF monorepo, including system-level workflows, change propagation, and the CI pipeline."
---

# Development Workflow

This guide covers the day-to-day workflow for developing within the AINEFF monorepo: how to work on a system, how changes propagate across the dependency graph, how to run tests, how to build, and how the CI pipeline validates your work.

## Working on a System

### 1. Navigate to the System

Each system lives in its cluster directory as a git submodule. Begin by entering the system's directory and ensuring you are on a working branch:

```bash
cd systems/cluster-2-governance/rams

# Submodules check out in detached HEAD state by default.
# Switch to a real branch before making changes.
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feat/authority-decay-events
```

### 2. Install Dependencies

If you have not already run `pnpm install` from the monorepo root, do so now. All workspace dependencies, including internal `@aineff/*` packages, will be resolved and linked:

```bash
# From monorepo root
cd /path/to/AINEFF
pnpm install
```

### 3. Start the Dev Server

Run the dev server for just the system you are working on:

```bash
pnpm turbo dev --filter=@aineff/rams
```

If your system depends on other packages (e.g., `@aineff/shared-types`), they are already linked via the workspace. Changes to those dependencies will be reflected automatically if they also have a `dev` or `watch` mode running.

To run dev servers for a system and all its dependencies simultaneously:

```bash
pnpm turbo dev --filter=@aineff/rams...
```

### 4. Make Changes

Edit source files within the system's `src/` directory. The system's `package.json` defines its own scripts, dependencies, and build configuration. Typical system structure:

```
systems/cluster-2-governance/rams/
├── src/
│   ├── index.ts          # Public API exports
│   ├── types.ts          # System-specific types
│   ├── engine.ts         # Core business logic
│   └── events.ts         # Event definitions (emitted/consumed)
├── tests/
│   ├── engine.test.ts
│   └── events.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 5. Commit to the Submodule

When your changes are ready, commit within the submodule's own git context:

```bash
cd systems/cluster-2-governance/rams
git add .
git commit -m "feat(rams): add authority decay event emission"
git push origin feat/authority-decay-events
```

### 6. Update the Monorepo Reference

After pushing changes to the submodule, update the monorepo to point to the new commit:

```bash
cd /path/to/AINEFF
git add systems/cluster-2-governance/rams
git commit -m "chore: bump RAMS to latest"
```

This two-level commit pattern (submodule commit + monorepo pin) ensures that the monorepo always points to a known-good state of each submodule.

## How Changes Propagate

### The Dependency Graph

Changes propagate through the AINEFF monorepo based on the package dependency graph. When you modify a shared package, every system that depends on it must be rebuilt and retested.

**Example propagation chain:**

```
@aineff/shared-types (modified)
  └── @aineff/governance-sdk (depends on shared-types, must rebuild)
        ├── @aineff/rams (depends on governance-sdk, must rebuild)
        ├── @aineff/gbl (depends on governance-sdk, must rebuild)
        └── @aineff/hoes (depends on governance-sdk, must rebuild)
              └── @aineff/chokepoint-web (depends on hoes, must rebuild)
```

Turborepo handles this automatically. When you run `pnpm turbo build`, it computes the dependency graph and builds packages in topological order, parallelizing where possible.

### Impact Analysis

Before pushing changes, you can preview what will be affected:

```bash
# See what packages are affected by changes since main
pnpm turbo build --filter='...[origin/main]' --dry-run
```

The `--dry-run` flag shows what Turborepo would build without actually building anything. This is useful for understanding the blast radius of your changes.

### Shared Package Changes

Changes to shared packages (`packages/*`) have the widest blast radius. If you modify `@aineff/shared-types`, potentially every system, platform, and app in the monorepo is affected. Handle these with extra care:

1. Make the change in the shared package.
2. Run `pnpm turbo typecheck --filter=...@aineff/shared-types` to type-check all dependents.
3. Run `pnpm turbo test --filter=...@aineff/shared-types` to test all dependents.
4. Only then commit and push.

## Running Tests

### Test a Single System

```bash
pnpm turbo test --filter=@aineff/rams
```

### Test a System and All Its Dependencies

```bash
pnpm turbo test --filter=@aineff/rams...
```

### Test Everything Affected by Your Changes

```bash
pnpm turbo test --filter='...[origin/main]'
```

This is the same filter the CI pipeline uses. If this passes locally, CI will pass.

### Test an Entire Cluster

```bash
pnpm turbo test --filter='./systems/cluster-2-governance/*'
```

### Test All Shared Packages

```bash
pnpm turbo test --filter='./packages/*'
```

## Building

### Build a Single Package

```bash
pnpm turbo build --filter=@aineff/ems
```

### Build with Dependencies

```bash
# Build EMS and everything it depends on
pnpm turbo build --filter=@aineff/ems...
```

### Build Only What Changed

```bash
pnpm turbo build --filter='...[origin/main]'
```

### Full Build (All Workspaces)

```bash
pnpm build
```

This is equivalent to `pnpm turbo build` and will build all workspaces in dependency order. On a first run this may take several minutes. Subsequent runs will use the Turborepo cache and complete in seconds if nothing has changed.

### Build Outputs

Build outputs are stored according to the `turbo.json` configuration:

| Package Type | Output Directory | Contents |
|-------------|-----------------|----------|
| Systems | `dist/` | Compiled TypeScript |
| Packages | `dist/` | Compiled TypeScript |
| Next.js Apps | `.next/` | Next.js build output |
| Other Apps | `dist/` | Compiled output |

## Type Checking and Linting

### Type Check Everything

```bash
pnpm typecheck
```

### Type Check a Specific Package

```bash
pnpm turbo typecheck --filter=@aineff/rams
```

### Lint Everything

```bash
pnpm lint
```

### Lint a Specific Package

```bash
pnpm turbo lint --filter=@aineff/rams
```

## The CI Pipeline

The AINEFF CI pipeline is defined in `deploy/ci/ci.yaml` and runs on every push to `main` and every pull request targeting `main`.

### Pipeline Stages

```
┌─────────────────────┐
│   detect-changes    │  Determine which directories changed
│   (paths-filter)    │  using dorny/paths-filter
└─────────┬───────────┘
          │
          v
┌─────────────────────┐
│       build         │  Build, typecheck, and lint all
│   (turbo --filter)  │  affected packages
└─────────┬───────────┘
          │
          v
┌─────────────────────┐
│       test          │  Run tests for all affected packages
│   (turbo --filter)  │
└─────────────────────┘
```

### Stage 1: Detect Changes

The pipeline uses `dorny/paths-filter` to determine which top-level directories have changed:

```yaml
filters: |
  systems:
    - 'systems/**'
  platforms:
    - 'platforms/**'
  packages:
    - 'packages/**'
  apps:
    - 'apps/**'
  agents:
    - 'agents/**'
```

### Stage 2: Build

The build stage runs three Turborepo commands, all filtered to only process packages affected by the changes:

```bash
pnpm turbo build --filter='...[origin/main]'
pnpm turbo typecheck --filter='...[origin/main]'
pnpm turbo lint --filter='...[origin/main]'
```

The `...[origin/main]` filter tells Turborepo to determine what has changed since `origin/main` and build those packages plus all their dependents. This means that if you change `@aineff/shared-types`, every package that imports it will be rebuilt and type-checked.

### Stage 3: Test

After a successful build, tests run for all affected packages:

```bash
pnpm turbo test --filter='...[origin/main]'
```

### Concurrency

The pipeline uses GitHub Actions concurrency groups to cancel in-progress runs when a new push arrives:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### Reproducing CI Locally

To exactly reproduce what CI will do with your changes:

```bash
pnpm turbo build --filter='...[origin/main]'
pnpm turbo typecheck --filter='...[origin/main]'
pnpm turbo lint --filter='...[origin/main]'
pnpm turbo test --filter='...[origin/main]'
```

If all four commands pass locally, your PR will pass CI.

## Branching Strategy

### Submodule Repositories

Each submodule repository follows its own branching conventions:

- `main` -- stable, release-ready code
- `feat/*` -- feature branches
- `fix/*` -- bug fix branches

### Monorepo

The monorepo's `main` branch tracks the stable commit of every submodule. Feature work happens in the submodule repositories. The monorepo primarily receives "bump" commits that update submodule pointers.

### Workflow Summary

```
1. Create feature branch in submodule repo
2. Develop, test locally using Turborepo filters
3. Push feature branch to submodule remote
4. Open PR in submodule repo
5. After merge, update monorepo submodule pointer
6. Push monorepo change, CI validates composition
```

## Working Across Multiple Systems

When your change spans multiple systems (e.g., adding a new event type that one system emits and another consumes):

### 1. Define the Interface First

Start in `@aineff/shared-types` to define the event interface:

```typescript
// packages/shared-types/src/events.ts
export interface AuthorityDecayedEvent extends AINEFFEvent {
  eventType: 'ads.authority.decayed';
  payload: {
    authorityId: string;
    decayPercentage: number;
    triggeredAt: string;
  };
}
```

### 2. Implement the Emitter

Update the Authority Decay System to emit the event:

```bash
cd systems/cluster-2-governance/ads
# implement emission logic
```

### 3. Implement the Consumer

Update the Human Oversight & Escalation System to consume it:

```bash
cd systems/cluster-2-governance/hoes
# implement consumption logic
```

### 4. Validate the Full Chain

```bash
# Type-check everything that depends on shared-types
pnpm turbo typecheck --filter=...@aineff/shared-types

# Test the specific systems involved
pnpm turbo test --filter=@aineff/ads --filter=@aineff/hoes
```

## Cleaning Up

### Remove Build Artifacts

```bash
pnpm clean
```

### Reset a Submodule to Monorepo-Expected State

```bash
cd systems/cluster-2-governance/rams
git checkout $(cd /path/to/AINEFF && git ls-tree HEAD systems/cluster-2-governance/rams | awk '{print $3}')
```

### Prune Unused Dependencies

```bash
pnpm prune
```

## What's Next

- [Architecture Overview](/docs/architecture/overview) -- Understand the protocol stack, closed-loop feedback, and AINE lifecycle.
- [Systems Reference](/docs/systems/overview) -- Detailed documentation for each of the 43 systems.
- [Platforms](/docs/platforms/overview) -- Platform-level documentation for ORF, AINE Runtime, and more.
