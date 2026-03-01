---
sidebar_position: 4
title: "Frankmax Portal"
description: "PIAR + accountability UI --- client-facing portal for Frankmax engagements with assessment results, deliverables, AINE deployment status, and accountability tracking."
---

# Frankmax Portal

The **Frankmax Portal** is the client-facing web application for [Frankmax](/docs/platforms/frankmax) PIAR engagements. It provides clients with real-time visibility into their engagement progress, assessment results, deliverables, AINE deployment status, and ongoing accountability tracking. The portal transforms a consulting engagement into a measurable, trackable, and accountable process.

## Application Identity

| Field | Value |
|-------|-------|
| App ID | `frankmax-portal` |
| Type | Web Application |
| Framework | React / Next.js |
| Language | TypeScript |
| Repository | `frankmax-portal` |
| Access | Engagement clients + Frankmax consultants |

## Portal Sections

### Engagement Dashboard

The primary view for both clients and consultants:

```
┌─────────────────────────────────────────────────────────────┐
│  Frankmax Portal          Client: Acme Manufacturing Corp   │
│  Engagement: PIAR-2026-0047     Type: Deployment ($30K)     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Progress                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Discovery  │ Architecture │ Foundation │ Activation  │   │
│  │  ████████████  ████████████  ██████░░░░  ░░░░░░░░░░ │   │
│  │  Complete     Complete       In Progress  Upcoming    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Current Phase: Foundation (Week 5 of 8)                    │
│  Consultant: John Smith                                     │
│  Next Milestone: AINE Runtime deployment (Mar 8)            │
│                                                             │
│  ┌── Quick Stats ──────────────────────────────────────┐   │
│  │  Chokepoints Identified: 12   │  High Severity: 4   │   │
│  │  Deliverables Completed: 7/12 │  Actions Open: 8    │   │
│  │  Est. Annual Impact: $2.4M    │  Resolution: 35%    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Assessment Results

Interactive view of the Chokepoint Intelligence assessment:

```
┌──────────────────────────────────────────────────────────────┐
│  Chokepoint Assessment Results        Score: 58/100 (YELLOW) │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Chokepoint Radar                  Section Breakdown         │
│  ┌────────────────────┐            ┌────────────────────┐    │
│  │      Bottleneck    │            │ Prod Flow    72/100│    │
│  │    /‾‾‾‾‾‾‾\      │            │ Quality      45/100│    │
│  │   / Automat \  Thru│            │ Supply Chain 38/100│    │
│  │  |    ●      | put │            │ Workforce    82/100│    │
│  │   \ Skill  /  Cycle│            │ Technology   53/100│    │
│  │    \_______/       │            └────────────────────┘    │
│  │      Quality       │                                      │
│  └────────────────────┘            Financial Impact           │
│                                    ┌────────────────────┐    │
│  Top Chokepoints                   │ Bottleneck  $820K  │    │
│  1. Supply Chain Vis  [RED]        │ Supply Ch   $640K  │    │
│  2. Quality Predict   [ORANGE]     │ Quality     $480K  │    │
│  3. Bottleneck Detect [ORANGE]     │ Other       $460K  │    │
│                                    │ Total:      $2.4M  │    │
│                                    └────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Deliverables Repository

All engagement deliverables accessible in one place:

| # | Deliverable | Status | Date | Format |
|---|-------------|--------|------|--------|
| 1 | Chokepoint Intelligence Report | Delivered | Feb 3 | PDF |
| 2 | Opportunity Map | Delivered | Feb 5 | PDF |
| 3 | Executive Summary | Delivered | Feb 7 | PDF |
| 4 | Authority Matrix Design | Delivered | Feb 18 | PDF + YAML |
| 5 | ORF Constraint Specification | Delivered | Feb 20 | YAML |
| 6 | AINE Architecture Document | Delivered | Feb 25 | PDF |
| 7 | Governance Framework | Delivered | Feb 28 | PDF |
| 8 | AINE Deployment Runbook | In Progress | -- | MD |
| 9 | PEP Network Configuration | Pending | -- | YAML |
| 10 | Operator Training Schedule | Pending | -- | PDF |
| 11 | Venture Cell Specification | Pending | -- | PDF |
| 12 | Final Handoff Document | Pending | -- | PDF |

### AINE Deployment Tracker

Real-time status of AINE deployment during the Foundation and Activation phases:

```
┌──────────────────────────────────────────────────────────────┐
│  AINE Deployment Status                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Instance: aine-acme-manufacturing                           │
│  Tier: Production          Region: us-east-1                 │
│                                                              │
│  Deployment Checklist                                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  [x] Kubernetes namespace created                    │    │
│  │  [x] ORF Protocol deployed and verified              │    │
│  │  [x] PEP network configured                          │    │
│  │  [x] Authority matrix loaded                         │    │
│  │  [x] Telemetry pipeline active                       │    │
│  │  [ ] Agent pods provisioned                          │    │
│  │  [ ] Venture cell created                            │    │
│  │  [ ] Operator access configured                      │    │
│  │  [ ] Health check passed                             │    │
│  │  [ ] Client handoff completed                        │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Current Step: Agent pods provisioning (ETA: 2 hours)        │
└──────────────────────────────────────────────────────────────┘
```

### Accountability Tracker

Ongoing accountability view showing who is responsible for what:

```typescript
interface AccountabilityEntry {
  entryId: string;
  action: string;
  responsibleParty: {
    name: string;
    role: 'frankmax-consultant' | 'client-operator' | 'agent';
  };
  orfBindingId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  deadline: Date;
  completedAt?: Date;
  evidence?: string;         // Link to deliverable or audit record
}
```

```
┌──────────────────────────────────────────────────────────────┐
│  Accountability Tracker                   8 open / 14 total  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┬───────────────┬──────────┬──────────┐  │
│  │ Action           │ Responsible   │ Deadline │ Status   │  │
│  ├──────────────────┼───────────────┼──────────┼──────────┤  │
│  │ Deploy AINE pods │ Frankmax (JS) │ Mar 8    │ Active   │  │
│  │ Train operators  │ Frankmax (JS) │ Mar 15   │ Pending  │  │
│  │ Approve auth     │ Client (JD)   │ Mar 5    │ Active   │  │
│  │ Provide data     │ Client (MK)   │ Mar 3    │ Overdue  │  │
│  │ Review VC spec   │ Client (JD)   │ Mar 10   │ Pending  │  │
│  │ Configure PEP    │ Frankmax (JS) │ Mar 6    │ Active   │  │
│  │ Validate health  │ Both          │ Mar 12   │ Pending  │  │
│  │ Sign handoff     │ Both          │ Mar 20   │ Pending  │  │
│  └──────────────────┴───────────────┴──────────┴──────────┘  │
│                                                              │
│  All accountability entries are ORF-bound.                   │
│  Overdue items escalate automatically after 48 hours.        │
└──────────────────────────────────────────────────────────────┘
```

### Communication Channel

Secure messaging between client and Frankmax consultant:

```
┌──────────────────────────────────────────────────────────────┐
│  Messages                              Engagement PIAR-0047  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  John Smith (Frankmax) — Mar 1, 9:14 AM                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Authority matrix has been loaded. I need your team   │    │
│  │ to review and approve by March 5th. The matrix       │    │
│  │ document is in Deliverables (#4).                    │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Jane Doe (Client) — Mar 1, 10:02 AM                         │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Reviewed. Two questions:                             │    │
│  │ 1. Can Level 2 operators approve >$5K expenditures?  │    │
│  │ 2. What happens if PEP goes down?                    │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  [Type a message...]                            [Send]       │
└──────────────────────────────────────────────────────────────┘
```

## Architecture

### Component Structure

```
Frankmax Portal
├── Authentication
│   ├── Client SSO / Magic Link   — Secure client access
│   ├── Frankmax OAuth            — Consultant access
│   └── Role Manager              — Client vs. consultant permissions
├── Engagement Manager
│   ├── Progress Tracker          — Phase and milestone tracking
│   ├── Timeline Engine           — Visual timeline rendering
│   └── Milestone Alerts          — Deadline notifications
├── Assessment Viewer
│   ├── Chokepoint Visualizer     — Interactive assessment charts
│   ├── Score Breakdown           — Detailed score analysis
│   └── Impact Calculator        — Financial impact presentation
├── Deliverable Manager
│   ├── Document Repository       — Versioned deliverable storage
│   ├── Approval Workflow         — Client sign-off tracking
│   └── Download Manager          — Secure document downloads
├── Deployment Tracker
│   ├── Status Poller             — AINE deployment status
│   ├── Checklist Engine          — Deployment step tracking
│   └── Health Validator          — Post-deployment verification
├── Accountability Engine
│   ├── ORF Integration           — Obligation binding for actions
│   ├── Deadline Monitor          — SLA tracking and escalation
│   └── Evidence Collector        — Completion evidence linking
└── Communication
    ├── Message Engine            — Secure messaging
    ├── Notification Service      — Email + in-app notifications
    └── File Sharing              — Secure file exchange
```

## Configuration

```typescript
interface FrankmaxPortalConfig {
  // Branding
  branding: {
    logo: string;
    primaryColor: string;
    customDomain?: string;       // client-specific subdomain
  };

  // Engagement
  engagement: {
    maxDeliverables: number;     // Default: 20
    communicationRetention: string; // Default: '2y'
    autoEscalationHours: number;  // Default: 48
  };

  // Security
  security: {
    mfaRequired: boolean;        // Default: true
    sessionTimeoutMin: number;   // Default: 60
    documentEncryption: boolean; // Default: true
    auditAllAccess: boolean;     // Default: true
  };
}
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `frankmax-portal.session.started` | `{ userId, role }` | User logged in |
| `frankmax-portal.deliverable.viewed` | `{ docId, userId }` | Client viewed deliverable |
| `frankmax-portal.deliverable.approved` | `{ docId, userId }` | Client approved deliverable |
| `frankmax-portal.accountability.updated` | `{ entryId, status }` | Action status changed |
| `frankmax-portal.message.sent` | `{ engagementId, senderId }` | Message sent |
| `frankmax-portal.milestone.reached` | `{ engagementId, milestone }` | Phase milestone completed |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `frankmax.engagement.phase.completed` | Frankmax | Update progress tracker |
| `frankmax.assessment.completed` | Frankmax | Populate assessment results |
| `aineff-aine-runtime.initialized` | AINE Runtime | Update deployment tracker |
| `aineff-orf.obligation.created` | ORF | Add to accountability tracker |
| `aineff-orf.obligation.finalized` | ORF | Mark accountability item complete |

## Integration Points

| System | Integration | Purpose |
|--------|-------------|---------|
| **Frankmax** | REST API | Engagement data, phase progression |
| **Chokepoint Intelligence** | REST API | Assessment results and scores |
| **AINE Runtime** | REST API | Deployment status monitoring |
| **ORF Protocol** | REST API | Accountability obligation bindings |
| **DocuFlow** | REST API | Deliverable document management |
| **Audit Logger** | Event bus | All portal actions logged |

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | Included in Frankmax engagement pricing. The portal is a differentiator that makes engagements transparent and accountable. |
| **Composed** | Portal drives trust, which drives upsell to Foundation and Deployment engagements. Accountability tracking via ORF demonstrates the value of the AINEFF governance model, driving platform adoption. Client visibility into AINE deployment accelerates the transition from engagement to ongoing hosting revenue. |
