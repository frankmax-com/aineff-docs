---
sidebar_position: 6
title: "Regulatory Rate-Limiter System"
description: "Governs the velocity of AINEFF ecosystem expansion to prevent systemic risk"
---

# Regulatory Rate-Limiter System (RRLS)

| Field | Value |
|-------|-------|
| System ID | `aineff-rrls` |
| Package | `@aineff/rrls` |
| Cluster | Cluster 5 -- Safeguards |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |

## Purpose

RRLS governs how fast the AINEFF ecosystem can grow. It enforces rate limits on
enterprise creation, agent deployment, cross-jurisdiction expansion, and resource
consumption. RRLS prevents the scenario where uncontrolled growth overwhelms governance
capacity, outpaces human oversight, or creates systemic risk through over-concentration.
It is the speed governor that keeps expansion sustainable.

## Standalone Revenue

**Expansion velocity governance** -- advisory and tooling for organizations that need
to manage the pace of AI deployment to match governance capacity.

## Interfaces

| Direction | Interface | Format |
|-----------|-----------|--------|
| IN | Rate check requests | gRPC from IGS/EMS |
| IN | Rate limit configuration | JSON rules |
| OUT | Rate decisions | Approve/throttle/deny |
| OUT | Capacity reports | Utilization analytics |

## Events Emitted

- `rrls.rate.approved` -- expansion request within limits
- `rrls.rate.throttled` -- expansion slowed to match capacity
- `rrls.rate.denied` -- expansion blocked, limits exceeded
- `rrls.limits.updated` -- rate limits reconfigured
- `rrls.initialized` -- system startup complete
- `rrls.heartbeat` -- periodic health signal

## Events Consumed

- `igs.gate.passed` -- tracks instantiation rate
- `shfs.threshold.breached` -- harm forecasts tighten rate limits
- `telemetry.capacity.report` -- infrastructure capacity signals
- `sei.override.activated` -- sovereign orders may freeze expansion

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| IGS | <--> | Rate checks during instantiation gate |
| SHFS | <-- | Harm forecasts tighten limits |
| Telemetry | <-- | Capacity utilization data |
| SEI | <-- | Sovereign freeze orders |
| EMS | --> | Throttles enterprise creation |
| HOES | --> | Notifies humans of rate limit changes |
| ACTS | --> | Logs all rate decisions |

## K8s Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aineff-rrls
  namespace: aineff-system
  labels:
    app.kubernetes.io/name: rrls
    app.kubernetes.io/part-of: aineff
    aineff.io/cluster: safeguards
spec:
  replicas: 2
  selector:
    matchLabels:
      app: aineff-rrls
  template:
    spec:
      containers:
        - name: rrls
          image: ghcr.io/frankmax-com/aineff-rrls:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
```
