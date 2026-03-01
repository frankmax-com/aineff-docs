---
sidebar_position: 7
title: "Frankmax"
description: "PIAR services platform --- Private Intelligence, Accountability, and Responsibility. $15-30K per engagement for enterprise AI readiness assessment and deployment."
---

# Frankmax

**Frankmax** is the professional services platform delivering **PIAR** --- Private Intelligence, Accountability, and Responsibility --- engagements to enterprises. Each engagement assesses an enterprise's readiness for AI-native operations, identifies chokepoints and opportunities, and produces a concrete deployment roadmap. Frankmax is the primary enterprise entry point into the AINEFF ecosystem.

## System Identity

| Field | Value |
|-------|-------|
| System ID | `frankmax` |
| Package | `@aineff/frankmax` |
| Cluster | Platform |
| Protocol Layer | Layer 3 (ORF) / Layer 4 (Enterprise Logic) |
| Revenue | $15-30K per engagement |
| Repository | `frankmax` |
| Website | [frankmax.digital](https://frankmax.digital) |

## Core Concepts

### What is PIAR?

PIAR stands for **Private Intelligence, Accountability, and Responsibility**:

| Component | Definition | Deliverable |
|-----------|-----------|-------------|
| **Private Intelligence** | AI-powered analysis of enterprise operations that stays within the enterprise's private infrastructure | Chokepoint assessment, process analysis, opportunity identification |
| **Accountability** | Clear mapping of who is responsible for every AI decision and action | Authority matrix design, ORF binding specification |
| **Responsibility** | Defined obligations and finality conditions for every AI-assisted process | Governance framework, compliance documentation |

### Engagement Types

| Engagement | Price Range | Duration | Deliverables |
|-----------|------------|----------|-------------|
| **Discovery** | $15,000 | 2-3 weeks | Chokepoint assessment, opportunity map, high-level roadmap |
| **Foundation** | $22,000 | 4-6 weeks | Discovery + authority matrix design + AINE architecture spec |
| **Deployment** | $30,000 | 6-8 weeks | Foundation + AINE deployment + operator training + first venture cell |

### PIAR Engagement Flow

```
Week 1-2: Discovery Phase
├── Enterprise intake questionnaire (or AI file upload)
├── Chokepoint assessment across 12 manufacturing dimensions
├── Current-state process mapping
├── Stakeholder interviews
└── Deliverable: Chokepoint Intelligence Report

Week 3-4: Architecture Phase
├── Authority matrix design
├── ORF constraint specification
├── AINE instance architecture
├── Governance framework
└── Deliverable: AINE Architecture Document

Week 5-6: Foundation Phase
├── AINE Runtime deployment
├── PEP network configuration
├── Agent skill mapping
├── Telemetry pipeline setup
└── Deliverable: Running AINE Instance

Week 7-8: Activation Phase
├── LevelupMax operator training (Level 2)
├── First venture cell creation via WGE
├── Revenue pipeline activation
├── Handoff to enterprise team
└── Deliverable: Active Venture Cell + Trained Operators
```

## Architecture

### Platform Components

```
Frankmax
├── Engagement Manager
│   ├── Pipeline Tracker        — Prospect → Client conversion
│   ├── SOW Generator           — Automated scope of work creation
│   ├── Deliverable Templates   — Standardized engagement deliverables
│   └── Revenue Tracker         — Engagement revenue and margin
├── Assessment Engine
│   ├── Chokepoint Intelligence — 12-dimension manufacturing assessment
│   ├── Process Analyzer        — Current-state operational analysis
│   ├── Opportunity Scorer      — AI readiness scoring
│   └── Benchmark Database      — Industry comparison data
├── Architecture Designer
│   ├── AINE Configurator       — AINE instance specification
│   ├── Authority Builder       — Authority matrix design tool
│   ├── ORF Constraint Editor   — Constraint specification editor
│   └── Governance Templates    — Industry-specific governance frameworks
├── Deployment Toolkit
│   ├── AINE Provisioner        — Automated AINE deployment
│   ├── PEP Installer           — PEP network setup
│   ├── Telemetry Bootstrapper  — Monitoring pipeline initialization
│   └── Health Validator        — Post-deployment verification
└── Client Portal
    ├── Engagement Dashboard    — Client-facing progress view
    ├── Document Repository     — All deliverables
    ├── Communication Channel   — Secure messaging
    └── Feedback Collector      — Client satisfaction tracking
```

### Chokepoint Intelligence Integration

Frankmax uses the [Chokepoint Intelligence app](/docs/apps/chokepoint-web) as its primary assessment tool. The app provides:

- **Guided Questionnaire**: 26 questions across 5 sections covering 12 manufacturing chokepoints
- **AI File Upload**: Upload operational documents for AI-powered analysis
- **Scoring Engine**: Weighted severity scoring producing tier classifications (red/orange/yellow/green/blue)
- **Financial Impact**: Dollar-value estimates of chokepoint costs
- **PDF Reports**: Professional branded reports for client delivery

```
┌──────────────────────────────────────────────────────┐
│              Chokepoint Intelligence                  │
│                                                      │
│  Section 1: Production Flow        ████████░░  80%   │
│  Section 2: Quality Systems        ██████░░░░  60%   │
│  Section 3: Supply Chain           ████░░░░░░  40%   │
│  Section 4: Workforce              ██████████  100%  │
│  Section 5: Technology             ████████░░  80%   │
│                                                      │
│  Composite Score: 72/100           Tier: ORANGE      │
│  Estimated Annual Impact: $2.4M                      │
│                                                      │
│  Top Chokepoints:                                    │
│  1. Bottleneck Detection (Critical)                  │
│  2. Quality Prediction (High)                        │
│  3. Supply Chain Visibility (High)                   │
└──────────────────────────────────────────────────────┘
```

## Configuration

```typescript
interface FrankmaxConfig {
  systemId: string;
  version: string;
  enabled: boolean;

  // Engagement settings
  engagements: {
    types: EngagementType[];
    defaultCurrency: string;        // Default: 'USD'
    maxConcurrentEngagements: number; // Default: 20
    autoArchiveAfterDays: number;   // Default: 90
  };

  // Assessment
  assessment: {
    chokepointDimensions: number;   // Default: 12
    questionnaireQuestions: number;  // Default: 26
    scoringSections: number;        // Default: 5
    aiUploadEnabled: boolean;       // Default: true
  };

  // Client portal
  portal: {
    enabled: boolean;               // Default: true
    customBranding: boolean;        // Default: true
    documentRetentionDays: number;  // Default: 365
  };
}
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `frankmax.initialized` | `{ config }` | System startup |
| `frankmax.heartbeat` | `{ activeEngagements, revenue }` | Every 30s |
| `frankmax.engagement.created` | `{ engagementId, type, clientId }` | New engagement started |
| `frankmax.engagement.phase.completed` | `{ engagementId, phase }` | Phase milestone reached |
| `frankmax.assessment.completed` | `{ engagementId, scores, tier }` | Chokepoint assessment finished |
| `frankmax.aine.deployed` | `{ engagementId, aineId }` | AINE provisioned for client |
| `frankmax.engagement.completed` | `{ engagementId, revenue, satisfaction }` | Engagement delivered |
| `frankmax.upsell.identified` | `{ engagementId, opportunity }` | Additional service opportunity detected |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `aineff-aine-runtime.initialized` | AINE Runtime | Confirm AINE deployment for engagement |
| `levelupmax.certification.issued` | LevelupMax | Confirm operator training for engagement |
| `aineff-wge.cell.activated` | WGE | Confirm venture cell creation for engagement |
| `sales-agent-bot.lead.qualified` | Sales Agent | Ingest qualified leads into engagement pipeline |

## Closed-Loop Connections

| Connected System | Direction | Signal Type |
|-----------------|-----------|-------------|
| Chokepoint Intelligence | Outbound | Assessment requests, score retrieval |
| AINE Runtime | Outbound | AINE provisioning for client deployments |
| LevelupMax | Outbound | Operator training scheduling |
| WGE | Outbound | Venture cell creation for deployment phase |
| ORF Protocol | Outbound | Engagement obligation bindings |
| Sales Agent Bot | Inbound | Qualified leads |
| Revenue Intel | Outbound | Engagement revenue signals |
| Billing Service | Outbound | Invoice and payment events |

## Client Journey

```
Prospect discovers Frankmax (website, referral, sales bot)
    │
    v
Discovery engagement ($15K)
    │   └── Chokepoint Intelligence assessment
    │   └── Opportunity map
    │   └── Client sees ROI potential
    │
    v
Foundation engagement ($22K)
    │   └── AINE architecture designed
    │   └── Authority matrix built
    │   └── Governance framework established
    │
    v
Deployment engagement ($30K)
    │   └── AINE Runtime deployed
    │   └── Operators trained via LevelupMax ($5K additional)
    │   └── First venture cell via WGE (per-cell fees begin)
    │
    v
Ongoing Revenue
    ├── AINE Runtime hosting fees (monthly)
    ├── WGE venture cell fees (per-cell monthly)
    ├── LevelupMax certification renewals (annual)
    ├── AINEG portfolio coordination (if multi-AINE)
    └── Additional Frankmax engagements for expansion
```

## Revenue Projections

| Scenario | Engagements/Year | Avg. Revenue | Annual Revenue |
|----------|------------------|-------------|---------------|
| **Conservative** | 10 | $20,000 | $200,000 |
| **Moderate** | 40 | $22,000 | $880,000 |
| **Aggressive** | 100 | $25,000 | $2,500,000 |

**Compound effect**: Each Frankmax engagement generates an average of 3.2x its engagement value in downstream AINEFF platform revenue over the first 12 months.

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | $15-30K per PIAR engagement. Frankmax generates immediate consulting revenue with high margins. The Chokepoint Intelligence assessment is productized and repeatable. |
| **Composed** | Frankmax is the **primary customer acquisition channel** for all other platforms. Every engagement leads to AINE deployments (hosting), operator training (LevelupMax), venture cell creation (WGE), and potentially portfolio coordination (AINEG). A single $20K engagement can generate $60K+ in annual recurring revenue. |
