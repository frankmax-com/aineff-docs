---
sidebar_position: 4
title: "Jurisdiction Engine"
description: "Geography to executable constraints compiler used across policy and governance systems"
---

# Jurisdiction Engine (`@aineff/jurisdiction-engine`)

| Field | Value |
|-------|-------|
| Package | `@aineff/jurisdiction-engine` |
| Type | Shared runtime library |
| Consumers | JAL, PIES, GBL, GCS, NDAR, and others |

## Purpose

`@aineff/jurisdiction-engine` compiles geographic jurisdictions into executable
constraint sets. Given a set of ISO country/region codes, it resolves the applicable
regulatory frameworks (GDPR, CCPA, PDPA, etc.), identifies conflicts between
jurisdictions, computes the most restrictive common denominator, and outputs constraint
objects that governance systems can enforce at runtime.

## Key Exports

```typescript
// Compilation
export function compileConstraints(jurisdictions: JurisdictionCode[]): Promise<ConstraintSet>;
export function resolveConflicts(constraints: ConstraintSet[]): Promise<ResolvedConstraints>;

// Queries
export function getJurisdiction(code: JurisdictionCode): Promise<JurisdictionInfo>;
export function listFrameworks(code: JurisdictionCode): Promise<RegulatoryFramework[]>;

// Types
export interface ConstraintSet {
  jurisdictions: JurisdictionCode[];
  dataResidency: DataResidencyRule[];
  consentRequirements: ConsentRule[];
  retentionLimits: RetentionRule[];
  reportingObligations: ReportingRule[];
  nonDelegableAuthorities: string[];
}

export type JurisdictionCode = string; // ISO 3166-1 alpha-2
```

## Installation

```bash
pnpm add @aineff/jurisdiction-engine
```

## Usage

```typescript
import { compileConstraints } from '@aineff/jurisdiction-engine';

const constraints = await compileConstraints(['DE', 'US-CA', 'SG']);
// Returns the most restrictive common denominator of GDPR + CCPA + PDPA
```

## Rule Database

The jurisdiction engine maintains a versioned database of regulatory frameworks,
updated through the JAL system's continuous monitoring of regulatory changes.
Each framework version is timestamped and immutable for audit purposes.

## Consumers

| System | Usage |
|--------|-------|
| JAL | Primary jurisdiction resolution |
| PIES | Policy selection by jurisdiction |
| GBL | Jurisdiction-specific governance rules |
| GCS | Genome validation against jurisdiction constraints |
| NDAR | Jurisdiction-specific non-delegable authorities |

## K8s Deployment

Not applicable -- `@aineff/jurisdiction-engine` is a shared library. The rule
database is managed by JAL and distributed to consumers via the event bus.
