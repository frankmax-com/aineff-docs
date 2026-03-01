---
sidebar_position: 1
title: "Deployment Guide"
description: "Deployment guide for AINEFF --- Docker containers, Kubernetes orchestration, Helm charts, environment configuration, and multi-environment deployment strategies."
---

# Deployment Guide

This guide covers deploying AINEFF components using Docker containers, Kubernetes orchestration, and Helm charts. AINEFF is designed for cloud-native deployment with support for development, staging, and production environments.

## Prerequisites

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| **Docker** | 24.0+ | Container runtime |
| **Kubernetes** | 1.28+ | Container orchestration |
| **Helm** | 3.14+ | Kubernetes package management |
| **kubectl** | 1.28+ | Kubernetes CLI |
| **pnpm** | 10.30+ | Node.js package manager |
| **Node.js** | 22 LTS | JavaScript runtime |
| **TypeScript** | 5.8+ | Language compiler |

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                aineff-platform namespace                │  │
│  │  ■ ORF Protocol    ■ AINEG Coordinator                │  │
│  │  ■ WGE             ■ Telemetry Aggregator             │  │
│  │  ■ RiskOps         ■ Ingress Controller               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            aine-{enterprise-id} namespace(s)           │  │
│  │  ■ AINE Runtime    ■ PEP Gateway                      │  │
│  │  ■ Agent Pods      ■ Telemetry Collector              │  │
│  │  ■ Event Bus       ■ Authority Service                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               aineff-apps namespace                    │  │
│  │  ■ Chokepoint Intelligence  ■ DocuFlow                │  │
│  │  ■ Operator Dashboard       ■ Frankmax Portal         │  │
│  │  ■ LevelupMax Portal                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               aineff-data namespace                    │  │
│  │  ■ MongoDB         ■ PostgreSQL                       │  │
│  │  ■ Redis           ■ Blob Storage                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             aineff-monitoring namespace                 │  │
│  │  ■ Prometheus      ■ Grafana                          │  │
│  │  ■ Loki            ■ Tempo                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Environment Configuration

### Development

```yaml
# environments/dev/values.yaml
global:
  environment: development
  domain: dev.aineff.local
  tls: false
  replicas: 1

orf:
  failClosed: false          # Fail open in dev for easier debugging
  pepMode: embedded          # No sidecar overhead in dev

aine:
  maxAgentPods: 5
  maxVentureCells: 2
  tier: development

telemetry:
  tracesSampleRate: 1.0      # Sample everything in dev
  logLevel: debug

resources:
  default:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
```

### Staging

```yaml
# environments/staging/values.yaml
global:
  environment: staging
  domain: staging.aineff.io
  tls: true
  replicas: 2

orf:
  failClosed: true
  pepMode: sidecar

aine:
  maxAgentPods: 20
  maxVentureCells: 5
  tier: staging

telemetry:
  tracesSampleRate: 0.5
  logLevel: info

resources:
  default:
    requests:
      cpu: 250m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi
```

### Production

```yaml
# environments/production/values.yaml
global:
  environment: production
  domain: aineff.io
  tls: true
  replicas: 3

orf:
  failClosed: true
  pepMode: sidecar
  confirmationCount: 3

aine:
  maxAgentPods: 50
  maxVentureCells: 10
  tier: production

telemetry:
  tracesSampleRate: 0.1
  logLevel: warn

resources:
  default:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi

persistence:
  enabled: true
  storageClass: fast-ssd

highAvailability:
  enabled: true
  podDisruptionBudget:
    minAvailable: 2
```

## Docker

### Building Images

Each AINEFF system has its own Dockerfile:

```dockerfile
# Example: Platform system Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ packages/

RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm -r build

FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/packages/orf-protocol/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/orf-protocol/package.json ./

EXPOSE 8080 9090
USER node

CMD ["node", "dist/index.js"]
```

### Building All Images

```bash
# Build all system images
docker compose -f docker-compose.build.yml build

# Build specific system
docker build -t aineff/orf-protocol:latest -f packages/orf-protocol/Dockerfile .

# Tag for registry
docker tag aineff/orf-protocol:latest ghcr.io/frankmax-com/orf-protocol:v1.0.0

# Push to registry
docker push ghcr.io/frankmax-com/orf-protocol:v1.0.0
```

### Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  orf-protocol:
    build:
      context: .
      dockerfile: packages/orf-protocol/Dockerfile
    ports:
      - "8080:8080"
      - "9090:9090"
    environment:
      - ORF_FAIL_OPEN=true
      - LOG_LEVEL=debug

  aine-runtime:
    build:
      context: .
      dockerfile: packages/aine-runtime/Dockerfile
    ports:
      - "8081:8080"
    depends_on:
      - orf-protocol
      - mongodb
      - postgresql
      - redis

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  postgresql:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=aineff
      - POSTGRES_USER=aineff
      - POSTGRES_PASSWORD=dev-password
    volumes:
      - postgresql_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongodb_data:
  postgresql_data:
```

## Helm Charts

### Chart Structure

```
charts/
├── aineff-platform/
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── templates/
│   │   ├── deployment-orf.yaml
│   │   ├── deployment-aineg.yaml
│   │   ├── deployment-wge.yaml
│   │   ├── service-orf.yaml
│   │   ├── service-aineg.yaml
│   │   ├── service-wge.yaml
│   │   ├── configmap.yaml
│   │   ├── secrets.yaml
│   │   └── networkpolicy.yaml
│   └── charts/
├── aineff-aine/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── namespace.yaml
│       ├── deployment-runtime.yaml
│       ├── daemonset-pep.yaml
│       ├── statefulset-authority.yaml
│       ├── networkpolicy.yaml
│       └── rbac.yaml
├── aineff-apps/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
└── aineff-monitoring/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
```

### Installing Charts

```bash
# Add AINEFF Helm repository
helm repo add aineff https://charts.aineff.io
helm repo update

# Install platform components
helm install aineff-platform aineff/aineff-platform \
  --namespace aineff-platform \
  --create-namespace \
  -f environments/production/values.yaml

# Install AINE instance for a specific enterprise
helm install aine-enterprise-abc aineff/aineff-aine \
  --namespace aine-enterprise-abc \
  --create-namespace \
  --set aine.enterpriseId=enterprise-abc \
  --set aine.enterpriseName="Enterprise ABC" \
  --set aine.tier=production

# Install applications
helm install aineff-apps aineff/aineff-apps \
  --namespace aineff-apps \
  --create-namespace

# Install monitoring stack
helm install aineff-monitoring aineff/aineff-monitoring \
  --namespace aineff-monitoring \
  --create-namespace
```

### Upgrading

```bash
# Upgrade platform with new values
helm upgrade aineff-platform aineff/aineff-platform \
  --namespace aineff-platform \
  -f environments/production/values.yaml

# Rollback if needed
helm rollback aineff-platform 1 --namespace aineff-platform
```

## Secrets Management

```bash
# Create secrets for AI providers
kubectl create secret generic ai-provider-secrets \
  --namespace aineff-platform \
  --from-literal=ANTHROPIC_API_KEY=sk-ant-... \
  --from-literal=OPENAI_API_KEY=sk-...

# Create secrets for database connections
kubectl create secret generic db-secrets \
  --namespace aineff-data \
  --from-literal=MONGODB_URI=mongodb://... \
  --from-literal=POSTGRESQL_URL=postgresql://... \
  --from-literal=REDIS_URL=redis://...

# For production, use a secrets manager:
# - AWS Secrets Manager + External Secrets Operator
# - Azure Key Vault + CSI Driver
# - HashiCorp Vault
```

## Health Checks

Every AINEFF service exposes standard health endpoints:

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /readyz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5

startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 30
```

## Deployment Checklist

### Pre-Deployment

- [ ] Kubernetes cluster provisioned and accessible
- [ ] Container registry configured and accessible
- [ ] TLS certificates provisioned (production/staging)
- [ ] Secrets created in target namespace
- [ ] Database instances provisioned and accessible
- [ ] DNS records configured
- [ ] Network policies reviewed

### Deployment

- [ ] Platform namespace created
- [ ] ORF Protocol deployed and healthy
- [ ] AINEG Coordinator deployed and healthy
- [ ] WGE deployed and healthy
- [ ] AINE namespace(s) created
- [ ] AINE Runtime(s) deployed and healthy
- [ ] PEP network active and enforcing
- [ ] Application namespace created
- [ ] Apps deployed and accessible
- [ ] Monitoring stack deployed

### Post-Deployment

- [ ] Health checks passing for all services
- [ ] Telemetry data flowing to monitoring
- [ ] ORF constraint evaluation functional
- [ ] Agent pods can be created
- [ ] Operator dashboard accessible
- [ ] Smoke tests passing
- [ ] Alerts configured and tested
