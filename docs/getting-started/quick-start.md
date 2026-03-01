---
sidebar_position: 2
title: "Quick Start"
description: "Clone the AINEFF monorepo and get the Chokepoint Intelligence app running locally in under 5 minutes."
---

# Quick Start

This guide walks you through cloning the AINEFF monorepo, installing dependencies, and running the existing Chokepoint Intelligence application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | >= 20 | JavaScript runtime |
| **pnpm** | 10.30.1 | Package manager (workspace-aware) |
| **Git** | >= 2.30 | Version control with submodule support |
| **Turborepo** | >= 2.5 | Monorepo build orchestration (installed as devDependency) |

### Installing pnpm

If you do not have pnpm installed at the correct version:

```bash
corepack enable
corepack prepare pnpm@10.30.1 --activate
```

Or install directly:

```bash
npm install -g pnpm@10.30.1
```

## Step 1: Clone the Monorepo

```bash
git clone https://github.com/frankmax-com/AINEFF.git
cd AINEFF
```

## Step 2: Initialize Git Submodules

AINEFF uses git submodules extensively. Each of the ~85 component repositories is included as a submodule in the monorepo. You must initialize and fetch them:

```bash
git submodule update --init --recursive
```

This will clone all system, platform, package, agent, factory, and application repositories into their respective directories. Depending on your network connection, this may take a few minutes on the first run.

:::tip
If you only need to work on a specific subset of the codebase, you can selectively initialize submodules:

```bash
# Initialize only the chokepoint-web app
git submodule update --init apps/chokepoint-web

# Initialize only Cluster 1 systems
git submodule update --init systems/cluster-1-factory/*

# Initialize only shared packages
git submodule update --init packages/*
```
:::

## Step 3: Install Dependencies

From the monorepo root, install all workspace dependencies:

```bash
pnpm install
```

pnpm will resolve dependencies across all workspaces defined in `pnpm-workspace.yaml`, deduplicating shared packages and linking internal `@aineff/*` dependencies automatically.

## Step 4: Run the Chokepoint Intelligence App

The Chokepoint Intelligence app (`apps/chokepoint-web`) is the first production application in the AINEFF ecosystem. It is a Next.js 16 application that performs AI-powered manufacturing chokepoint analysis.

```bash
pnpm dev:chokepoint
```

This command is a shorthand defined in the root `package.json` that runs:

```bash
pnpm --filter @aineff/chokepoint-web dev
```

The app will start on [http://localhost:3000](http://localhost:3000).

### What You'll See

The Chokepoint Intelligence app provides two modes:

1. **Guided Questionnaire** -- A 26-question assessment across 5 sections that identifies manufacturing chokepoints.
2. **AI File Upload** -- Upload operational documents and let AI directly analyze them for chokepoints.

Both modes score across 12 manufacturing chokepoints, producing severity tiers (red/orange/yellow/green/blue), financial impact estimates, and a composite score.

## Running Other Commands

### Development Server (All Workspaces)

```bash
pnpm dev
```

This runs `turbo dev` which starts development servers for all workspaces that define a `dev` script.

### Build Everything

```bash
pnpm build
```

Turborepo will build all workspaces in dependency order, respecting the `dependsOn: ["^build"]` pipeline configuration.

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Clean Build Artifacts

```bash
pnpm clean
```

## Filtering with Turborepo

Turborepo's `--filter` flag is essential for working efficiently in a monorepo of this size. You do not need to build or test everything -- filter to just the workspace(s) you care about.

### Filter by Package Name

```bash
# Build only the shared-types package
pnpm turbo build --filter=@aineff/shared-types

# Dev server for operator dashboard only
pnpm turbo dev --filter=@aineff/operator-dashboard
```

### Filter by Directory

```bash
# Build all systems in Cluster 2
pnpm turbo build --filter='./systems/cluster-2-governance/*'

# Build all shared packages
pnpm turbo build --filter='./packages/*'
```

### Filter by Dependency Graph

```bash
# Build a package and everything it depends on
pnpm turbo build --filter=@aineff/chokepoint-web...

# Build everything that depends on shared-types
pnpm turbo build --filter=...@aineff/shared-types
```

### Filter by Git Changes

```bash
# Build only what changed since the main branch
pnpm turbo build --filter='...[origin/main]'
```

This is the same filter used in the CI pipeline and is the most efficient way to validate your changes before pushing.

## Environment Variables

The Chokepoint Intelligence app requires API keys for AI functionality. Create a `.env.local` file in `apps/chokepoint-web/`:

```bash
# Required for AI analysis features
ANTHROPIC_API_KEY=sk-ant-...
# OR
OPENAI_API_KEY=sk-...
```

The app supports both Claude (via `@anthropic-ai/sdk`) and OpenAI as AI providers. At least one key is required for the AI File Upload mode; the Guided Questionnaire mode works without any API keys.

## Troubleshooting

### Submodule Errors

If you see errors about missing submodule content:

```bash
# Reset and re-fetch all submodules
git submodule sync --recursive
git submodule update --init --recursive --force
```

### pnpm Version Mismatch

The monorepo enforces pnpm 10.30.1 via the `packageManager` field in `package.json`. If you see version warnings:

```bash
corepack prepare pnpm@10.30.1 --activate
```

### Port Conflicts

If port 3000 is already in use:

```bash
PORT=3001 pnpm dev:chokepoint
```

### Node Version

AINEFF requires Node.js >= 20. If you are on an older version, use `nvm` or `fnm` to switch:

```bash
nvm use 20
```

## What's Next

- [Monorepo Setup](./monorepo-setup) -- Deep dive into the directory structure, submodule architecture, and workspace configuration.
- [Development Workflow](./development-workflow) -- How to work on a specific system, run tests, and push changes through CI.
