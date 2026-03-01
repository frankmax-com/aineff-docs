---
sidebar_position: 4
title: "CI/CD"
description: "AINEFF CI/CD pipeline --- GitHub Actions, Turborepo-aware builds, change detection, multi-repo coordination, and deployment automation."
---

# CI/CD

AINEFF uses **GitHub Actions** for continuous integration and deployment, with **Turborepo-aware builds** for monorepo packages and **change detection** to avoid rebuilding unchanged systems. The CI/CD pipeline handles linting, testing, building, container image creation, and deployment across development, staging, and production environments.

## Pipeline Architecture

```
Push / PR
    │
    v
┌──────────────────────────────────────────────────────────────┐
│                    GitHub Actions Pipeline                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Change Detection (Dorny Paths Filter)    │    │
│  │  "Which repos/packages changed in this push/PR?"     │    │
│  └──────────────┬───────────────┬───────────────────────┘    │
│                 │               │                            │
│         ┌───────v───────┐ ┌────v──────────────────┐          │
│         │ Changed = Yes │ │ Changed = No           │          │
│         │ (Build + Test)│ │ (Skip, use cache)      │          │
│         └───────┬───────┘ └────────────────────────┘          │
│                 │                                            │
│  ┌──────────────v─────────────────────────────────────────┐  │
│  │  Lint → Type Check → Test → Build → Image → Deploy    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Change Detection

AINEFF uses path-based change detection to build only what changed:

```yaml
# .github/workflows/ci.yml
name: CI Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      orf: ${{ steps.changes.outputs.orf }}
      aine-runtime: ${{ steps.changes.outputs.aine-runtime }}
      aineg: ${{ steps.changes.outputs.aineg }}
      wge: ${{ steps.changes.outputs.wge }}
      levelupmax: ${{ steps.changes.outputs.levelupmax }}
      frankmax: ${{ steps.changes.outputs.frankmax }}
      chokepoint-web: ${{ steps.changes.outputs.chokepoint-web }}
      agentcoders: ${{ steps.changes.outputs.agentcoders }}
      shared-types: ${{ steps.changes.outputs.shared-types }}
      docs: ${{ steps.changes.outputs.docs }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: changes
        with:
          filters: |
            orf:
              - 'aineff-orf/**'
              - 'aineff-shared-types/**'
            aine-runtime:
              - 'aineff-aine-runtime/**'
              - 'aineff-shared-types/**'
            aineg:
              - 'aineff-aineg/**'
              - 'aineff-shared-types/**'
            wge:
              - 'aineff-wge/**'
              - 'aineff-shared-types/**'
            levelupmax:
              - 'levelupmax/**'
            frankmax:
              - 'frankmax/**'
            chokepoint-web:
              - 'app/**'
            agentcoders:
              - 'agentcoders/**'
            shared-types:
              - 'aineff-shared-types/**'
            docs:
              - 'docs-site/**'
```

## Build Jobs

### Platform System Build

```yaml
  build-orf:
    needs: detect-changes
    if: needs.detect-changes.outputs.orf == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm --filter @aineff/orf lint

      - name: Type check
        run: pnpm --filter @aineff/orf type-check

      - name: Test
        run: pnpm --filter @aineff/orf test

      - name: Build
        run: pnpm --filter @aineff/orf build
```

### AgentCoders Monorepo Build (Turborepo)

```yaml
  build-agentcoders:
    needs: detect-changes
    if: needs.detect-changes.outputs.agentcoders == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        working-directory: agentcoders
        run: pnpm install --frozen-lockfile

      - name: Turbo build (with cache)
        working-directory: agentcoders
        run: pnpm turbo build --cache-dir=.turbo
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}

      - name: Turbo test (with cache)
        working-directory: agentcoders
        run: pnpm turbo test --cache-dir=.turbo

      - name: Turbo lint (with cache)
        working-directory: agentcoders
        run: pnpm turbo lint --cache-dir=.turbo
```

### Chokepoint Intelligence Build

```yaml
  build-chokepoint:
    needs: detect-changes
    if: needs.detect-changes.outputs.chokepoint-web == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        working-directory: app
        run: pnpm install --frozen-lockfile

      - name: Lint
        working-directory: app
        run: pnpm lint

      - name: Type check
        working-directory: app
        run: pnpm type-check

      - name: Test
        working-directory: app
        run: pnpm test

      - name: Build Next.js
        working-directory: app
        run: pnpm build
        env:
          NEXT_TELEMETRY_DISABLED: 1
```

## Container Image Pipeline

```yaml
  build-images:
    needs: [build-orf, build-aine-runtime, build-aineg, build-wge]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        system:
          - { name: orf-protocol, path: aineff-orf }
          - { name: aine-runtime, path: aineff-aine-runtime }
          - { name: aineg-coordinator, path: aineff-aineg }
          - { name: wge, path: aineff-wge }
    steps:
      - uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ${{ matrix.system.path }}/Dockerfile
          push: true
          tags: |
            ghcr.io/frankmax-com/${{ matrix.system.name }}:latest
            ghcr.io/frankmax-com/${{ matrix.system.name }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Deployment Pipeline

### Staging Deployment

```yaml
  deploy-staging:
    needs: build-images
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/setup-kubectl@v4

      - name: Set kubeconfig
        run: echo "${{ secrets.STAGING_KUBECONFIG }}" > kubeconfig
        env:
          KUBECONFIG: kubeconfig

      - name: Deploy to staging
        run: |
          helm upgrade --install aineff-platform charts/aineff-platform \
            --namespace aineff-platform \
            -f environments/staging/values.yaml \
            --set global.imageTag=${{ github.sha }} \
            --wait --timeout 5m

      - name: Smoke tests
        run: |
          kubectl -n aineff-platform wait --for=condition=ready pod -l app=orf-protocol --timeout=120s
          kubectl -n aineff-platform wait --for=condition=ready pod -l app=aine-runtime --timeout=120s
          # Run smoke test suite
          pnpm --filter @aineff/smoke-tests test
```

### Production Deployment

```yaml
  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production    # Requires manual approval
    steps:
      - uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/setup-kubectl@v4

      - name: Set kubeconfig
        run: echo "${{ secrets.PRODUCTION_KUBECONFIG }}" > kubeconfig

      - name: Deploy to production (canary)
        run: |
          helm upgrade --install aineff-platform charts/aineff-platform \
            --namespace aineff-platform \
            -f environments/production/values.yaml \
            --set global.imageTag=${{ github.sha }} \
            --set canary.enabled=true \
            --set canary.weight=10 \
            --wait --timeout 10m

      - name: Monitor canary (5 min)
        run: |
          # Check error rate for 5 minutes
          sleep 300
          ERROR_RATE=$(curl -s http://prometheus:9090/api/v1/query?query=rate(aineff_requests_total{status="error"}[5m]) | jq '.data.result[0].value[1]')
          if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
            echo "Canary error rate too high: $ERROR_RATE"
            helm rollback aineff-platform --namespace aineff-platform
            exit 1
          fi

      - name: Promote canary to full deployment
        run: |
          helm upgrade aineff-platform charts/aineff-platform \
            --namespace aineff-platform \
            -f environments/production/values.yaml \
            --set global.imageTag=${{ github.sha }} \
            --set canary.enabled=false \
            --wait --timeout 10m
```

## Turborepo Configuration

For the AgentCoders monorepo:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**/*.ts", "tsconfig.json", "package.json"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.ts", "src/**/*.test.ts"]
    },
    "lint": {
      "inputs": ["src/**/*.ts", ".eslintrc.*"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.ts", "tsconfig.json"]
    }
  }
}
```

Turborepo provides:
- **Dependency-aware builds**: `shared` builds before `agent-runtime` which builds before `jarvis-runtime`
- **Remote caching**: Unchanged packages skip build entirely using cached outputs
- **Parallel execution**: Independent packages build in parallel

## Quality Gates

| Gate | PR Check | Main Branch | Production |
|------|----------|-------------|------------|
| Lint (ESLint) | Required | Required | Required |
| Type check (tsc) | Required | Required | Required |
| Unit tests | Required | Required | Required |
| Integration tests | Optional | Required | Required |
| Secret scanning | Required | Required | Required |
| Dependency audit | Required | Required | Required |
| PR size (<400 lines) | Required | -- | -- |
| Code review (1+) | Required | -- | -- |
| Smoke tests | -- | Required | Required |
| Canary monitoring | -- | -- | Required |
| Manual approval | -- | -- | Required |

## Notifications

```yaml
  notify:
    needs: [deploy-staging, deploy-production]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Slack notification
        uses: slackapi/slack-github-action@v2
        with:
          payload: |
            {
              "text": "AINEFF Deployment: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*AINEFF Deployment*\nCommit: `${{ github.sha }}`\nStatus: ${{ job.status }}\nEnvironment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Repository-Specific Pipelines

Each AINEFF repository can have its own CI workflow that follows the standard pattern:

| Repository | Build Tool | Test Framework | Special Steps |
|-----------|-----------|----------------|--------------|
| `aineff-orf` | tsc | Vitest | ORF constraint validation tests |
| `aineff-aine-runtime` | tsc | Vitest | K8s integration tests |
| `agentcoders` | Turborepo + tsc | Vitest | 14-package dependency build |
| `app` (Chokepoint) | Next.js | Vitest + Playwright | E2E browser tests |
| `docs-site` | Docusaurus | -- | Build verification, broken link check |
| `levelupmax` | tsc | Vitest | Training scenario validation |
| `frankmax` | tsc | Vitest | Assessment engine tests |
