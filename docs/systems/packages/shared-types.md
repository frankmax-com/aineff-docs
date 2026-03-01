---
sidebar_position: 1
title: "Shared Types"
description: "Canonical TypeScript types for all AINEFF entities, events, and interfaces"
---

# Shared Types (`@aineff/shared-types`)

| Field | Value |
|-------|-------|
| Package | `@aineff/shared-types` |
| Type | Shared library (no runtime) |
| Consumers | All 43 systems |

## Purpose

`@aineff/shared-types` is the canonical type package for the entire AINEFF ecosystem.
It defines the TypeScript interfaces and types that every system uses to describe
entities (AINE, AINEG, Agent, Role), events (domain events, audit events, lifecycle
events), configurations, and API contracts. By centralizing type definitions, it
ensures compile-time safety and semantic consistency across all 43 systems.

## Key Exports

```typescript
// Entity types
export interface AINEEntity { ... }
export interface AINEGEntity { ... }
export interface AgentDescriptor { ... }
export interface RoleDescriptor { ... }

// Event types
export interface DomainEvent { ... }
export interface AuditEvent { ... }
export interface LifecycleEvent { ... }

// Configuration types
export interface SystemConfig { ... }
export interface GenomeConfig { ... }

// Common enums
export type EntityStatus = 'initializing' | 'ready' | 'processing' | 'error' | 'shutdown';
export type ClusterName = 'enterprise-birth' | 'governance' | 'policy-semantics' | ...;
```

## Installation

```bash
pnpm add @aineff/shared-types
```

## Usage

```typescript
import type { AINEEntity, DomainEvent, EntityStatus } from '@aineff/shared-types';
```

## Versioning

All 43 systems pin to the same version of `@aineff/shared-types`. Version bumps are
coordinated through CI/CD to prevent type mismatches across the monorepo.

## Consumers

Every system in the AINEFF ecosystem depends on this package. It is the single source
of truth for all cross-system type contracts.

## K8s Deployment

Not applicable -- `@aineff/shared-types` is a compile-time dependency only. It produces
no runtime artifacts and is not deployed as a service.
