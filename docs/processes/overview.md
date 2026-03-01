---
sidebar_label: Overview
sidebar_position: 1
---

# AINEFF Processes, SOPs, and BPMN Workflows

**Version:** v1.0.0 | **Date:** 2026-03-01

This section provides comprehensive Standard Operating Procedures (SOPs), BPMN process documentation, and operational reference material for the AI-Native Enterprise Factory Framework.

## Purpose

Every operational activity within AINEFF follows a documented, auditable process. These procedures ensure consistency, enable training, and provide the foundation for regulatory compliance across jurisdictions. All processes interact with the 30-system protocol stack and are enforced through the ORF (Obligation Resolution Framework).

## Standard Operating Procedures (SOPs)

| SOP | Description | Estimated Duration |
|-----|-------------|-------------------|
| [AINE Creation](./sop-aine-creation.md) | End-to-end procedure for birthing a new AI-Native Enterprise | 2-4 hours |
| [AINE Death](./sop-aine-death.md) | Controlled shutdown and mortality procedure for an AINE | 1-6 hours |
| [Frankmax PIAR Engagement](./sop-frankmax-engagement.md) | Running a Frankmax Pre-Investment Assessment Report engagement ($15-30K) | 2-6 weeks |
| [Authority Decay and Re-Authorization](./sop-authority-decay.md) | Managing agent authority lifecycle and human re-authorization | Ongoing (daily CronJob) |
| [Incident Response](./sop-incident-response.md) | Detecting, classifying, and resolving AINE failures | 15 min - 4 hours |
| [LevelupMax Certification](./sop-levelupmax-certification.md) | Operator certification levels, training, and renewal | 2-3 days per level |

## BPMN Process Documentation

| Process | Description | Key Systems |
|---------|-------------|-------------|
| [AINE Lifecycle](./bpmn-aine-lifecycle.md) | Full lifecycle from genome definition through operating state to death | GCS, IGS, EMS, RAMS, ACTS, TDES, MES, RPS |
| [Venture Cell Creation (WGE)](./bpmn-venture-cell.md) | Creating and managing revenue-generating venture cells | WGE, RAMS, BPMN, ACTS |
| [ORF Obligation Lifecycle](./bpmn-orf-obligation.md) | Obligation from proposal through execution to finality | ORF, ACTS, FMS |

## Operational Runbooks

| Runbook | Description | Audience |
|---------|-------------|----------|
| [Kubernetes Operations](./runbook-k8s-operations.md) | Common K8s operational tasks for AINEFF infrastructure | Platform Engineers, SREs |

## How These Documents Relate

```
┌─────────────────────────────────────────────────────────────────┐
│                    AINEFF Process Hierarchy                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │  SOPs        │    │  BPMN Processes   │    │  Runbooks     │ │
│  │  (What to do)│───▶│  (How it flows)   │───▶│  (How to fix) │ │
│  └──────────────┘    └──────────────────┘    └───────────────┘ │
│         │                     │                       │         │
│         ▼                     ▼                       ▼         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AINEFF 30-System Protocol Stack             │   │
│  │   GCS · IGS · EMS · RAMS · ACTS · TDES · MES · RPS     │   │
│  │   BPMN · ORF · WGE · FMS · SHFS · HOES · ADS · ...     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**SOPs** define the step-by-step procedures that humans and systems must follow. **BPMN processes** model the automated workflow orchestration that the BPMN system executes. **Runbooks** provide hands-on operational guidance for infrastructure tasks.

## Conventions

- All procedures include **prerequisites**, **roles involved**, and **approval gates**
- Every state transition is logged to **ACTS** (Audit & Compliance Tracking System)
- All actions are wrapped in **ORF envelopes** ensuring obligation tracking
- Human oversight points are marked with the HOES (Human Oversight Escalation System) icon
- Rollback procedures are provided where applicable
- Version history is tracked at the top of each document
