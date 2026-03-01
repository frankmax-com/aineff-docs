---
sidebar_position: 2
title: "GitHub Governance Factory"
description: "GitHub governance enforcement --- automated repository governance, branch protection, PR policies, code review requirements, and compliance enforcement across the AINEFF organization."
---

# GitHub Governance Factory

The **GitHub Governance Factory** enforces governance policies across all AINEFF GitHub repositories. It automates branch protection rules, pull request policies, code review requirements, secret scanning, and compliance enforcement. When agents generate code (via AgentCoders SCM adapters), this factory ensures every change follows the governance framework.

## Factory Identity

| Field | Value |
|-------|-------|
| Factory ID | `github-governance-factory` |
| Integration | GitHub API, GitHub Actions |
| Scope | All repositories in `frankmax-com` organization |
| Enforcement | Automated via GitHub Apps + webhooks |

## Governance Policies

### Branch Protection

| Policy | Rule | Enforcement |
|--------|------|-------------|
| **Main Branch** | No direct pushes to `main` | Branch protection rule |
| **Required Reviews** | Minimum 1 approval for production repos, 2 for infrastructure | PR review requirement |
| **Status Checks** | CI must pass before merge | Required status checks |
| **Signed Commits** | GPG-signed commits required for production repos | Commit signing enforcement |
| **Linear History** | Squash merge only | Merge strategy enforcement |
| **Stale Dismissal** | New commits dismiss existing approvals | Review dismissal rule |

```yaml
# Branch protection configuration
branch_protection:
  main:
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    required_status_checks:
      strict: true
      contexts:
        - "ci/build"
        - "ci/test"
        - "ci/lint"
        - "governance/policy-check"
    enforce_admins: true
    restrictions: null
    required_linear_history: true
    required_signatures: false
```

### Pull Request Policies

| Policy | Requirement | Automated Check |
|--------|-------------|-----------------|
| **PR Template** | Must use standardized PR template | GitHub Action |
| **Size Limit** | Max 400 lines changed per PR | GitHub Action |
| **Description** | Must include description and test plan | GitHub Action |
| **Linked Issue** | Must reference an issue or task | GitHub Action |
| **Label Required** | Must have at least one category label | GitHub Action |
| **No Secrets** | No API keys, passwords, or tokens | Secret scanning |
| **License Headers** | Source files must have license headers | GitHub Action |

### Code Review Matrix

| Repository Type | Min Reviewers | Required Expertise | Turnaround SLA |
|----------------|---------------|-------------------|----------------|
| **Platform** (ORF, AINE Runtime) | 2 | Platform engineer | 24 hours |
| **System** (30+ AINEFF systems) | 1 | Domain expert | 48 hours |
| **Application** (Chokepoint, DocuFlow) | 1 | Full-stack developer | 48 hours |
| **Infrastructure** (K8s, CI/CD) | 2 | DevOps + Security | 24 hours |
| **Shared Package** (SDK, types) | 2 | Package maintainer | 24 hours |

### CODEOWNERS

```
# CODEOWNERS for AINEFF repositories

# Platform repositories
/aineff-orf/**                @frankmax-com/platform-team
/aineff-aine-runtime/**       @frankmax-com/platform-team
/aineff-aineg/**              @frankmax-com/platform-team
/aineff-wge/**                @frankmax-com/platform-team

# Shared packages
/aineff-shared-types/**       @frankmax-com/core-team
/aineff-governance-sdk/**     @frankmax-com/core-team @frankmax-com/security-team
/aineff-orf-sdk/**            @frankmax-com/core-team @frankmax-com/platform-team

# Infrastructure
/.github/**                   @frankmax-com/devops-team
/docs-site/**                 @frankmax-com/docs-team
```

## Architecture

### Enforcement Pipeline

```
Code Change (push / PR)
    │
    v
┌──────────────────────────────────────────────────────────────┐
│                  GitHub Governance Factory                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Webhook      │→ │ Policy       │→ │ Enforcement      │   │
│  │ Receiver     │  │ Evaluator    │  │ Engine           │   │
│  └──────────────┘  └──────────────┘  └────────┬─────────┘   │
│                                                │             │
│  ┌─────────────────────────────────────────────v──────────┐  │
│  │                  GitHub Actions Pipeline                │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────┐ ┌──────────────┐  │  │
│  │  │ Secret  │ │ Size     │ │ Lint  │ │ License      │  │  │
│  │  │ Scan    │ │ Check    │ │ Check │ │ Header Check │  │  │
│  │  └─────────┘ └──────────┘ └───────┘ └──────────────┘  │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────┐ ┌──────────────┐  │  │
│  │  │ Dep     │ │ PR       │ │ Test  │ │ Governance   │  │  │
│  │  │ Audit   │ │ Template │ │ Suite │ │ Policy       │  │  │
│  │  └─────────┘ └──────────┘ └───────┘ └──────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Audit & Compliance Reporter                │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Agent Code Governance

When AgentCoders agents generate code, additional governance checks apply:

```typescript
interface AgentCodeGovernance {
  // Agent-authored code requires:
  agentPRRequirements: {
    humanReviewRequired: boolean;        // Always true
    labelPrefix: 'agent-authored';       // Auto-labeled
    additionalChecks: [
      'code-safety-scan',                // AI-specific safety checks
      'hallucination-detection',         // Verify API/import accuracy
      'test-coverage-minimum',           // Min 80% coverage
    ];
    autoMergeAllowed: boolean;           // false for production repos
  };
}
```

```
Agent generates code
    │
    v
SCM Adapter creates PR
    │
    v
GitHub Governance Factory
    ├── Label: "agent-authored"
    ├── Run: code-safety-scan
    ├── Run: hallucination-detection
    ├── Run: standard CI pipeline
    ├── Require: human review (mandatory)
    └── Block: auto-merge to main
```

## GitHub Actions Workflows

### Policy Check Workflow

```yaml
# .github/workflows/governance-policy-check.yml
name: Governance Policy Check
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  policy-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR size
        uses: frankmax-com/pr-size-check@v1
        with:
          max_lines: 400
          exclude_patterns: |
            *.lock
            *.generated.*
            docs/**

      - name: Check PR template
        uses: frankmax-com/pr-template-check@v1
        with:
          required_sections:
            - "## Summary"
            - "## Test plan"

      - name: Check linked issue
        uses: frankmax-com/linked-issue-check@v1

      - name: Check license headers
        uses: frankmax-com/license-header-check@v1
        with:
          license: "Proprietary - Frankmax"
          file_patterns: "*.ts,*.tsx,*.js"

      - name: Secret scanning
        uses: frankmax-com/secret-scan@v1
        with:
          fail_on_detection: true

      - name: Dependency audit
        run: pnpm audit --audit-level=high
```

### Agent Code Review Workflow

```yaml
# .github/workflows/agent-code-review.yml
name: Agent Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  agent-check:
    if: contains(github.event.pull_request.labels.*.name, 'agent-authored')
    runs-on: ubuntu-latest
    steps:
      - name: Code safety scan
        uses: frankmax-com/ai-code-safety@v1
        with:
          scan_level: strict

      - name: Hallucination detection
        uses: frankmax-com/hallucination-check@v1
        with:
          verify_imports: true
          verify_apis: true

      - name: Enforce human review
        uses: frankmax-com/require-human-review@v1
        with:
          block_bot_approvals: true
```

## Compliance Reporting

The factory generates compliance reports for governance audits:

```typescript
interface GovernanceReport {
  period: { start: Date; end: Date };
  repositories: number;
  pullRequests: {
    total: number;
    merged: number;
    policyCompliant: number;
    policyViolations: number;
    agentAuthored: number;
    humanReviewed: number;
  };
  branchProtection: {
    compliant: number;
    nonCompliant: number;
    exceptions: BranchException[];
  };
  secretScanning: {
    scansRun: number;
    secretsDetected: number;
    secretsRevoked: number;
  };
  dependencyAudit: {
    totalDependencies: number;
    vulnerabilities: { critical: number; high: number; medium: number; low: number };
    patchedWithin24h: number;
  };
}
```

## Configuration

```typescript
interface GitHubGovernanceConfig {
  // Organization
  organization: string;           // 'frankmax-com'
  repositories: string[];         // ['*'] for all, or specific repos

  // Branch protection
  branchProtection: {
    defaultBranch: string;        // 'main'
    requirePR: boolean;           // true
    minReviewers: number;         // 1
    requireStatusChecks: boolean; // true
    requireSignedCommits: boolean; // false (per repo)
  };

  // PR policies
  pullRequests: {
    maxSize: number;              // 400 lines
    requireTemplate: boolean;     // true
    requireLinkedIssue: boolean;  // true
    requireLabels: boolean;       // true
  };

  // Security
  security: {
    secretScanning: boolean;      // true
    dependencyAudit: boolean;     // true
    codeScanning: boolean;        // true
    vulnerabilityAlerts: boolean; // true
  };

  // Agent-specific
  agentCode: {
    requireHumanReview: boolean;  // true
    additionalChecks: string[];
    autoMergeAllowed: boolean;    // false
  };
}
```

## Integration Points

| System | Integration | Purpose |
|--------|-------------|---------|
| **AgentCoders (SCM Adapters)** | GitHub API | Agent-authored PR governance |
| **ORF Protocol** | Event bus | Governance violations create ORF alerts |
| **Audit Logger** | Event bus | All governance decisions logged |
| **CI/CD Pipeline** | GitHub Actions | Automated policy enforcement |
| **Telemetry** | Metrics | Governance compliance metrics |

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | GitHub governance automation service for any organization. Enforces consistent policies across repositories without manual setup. |
| **Composed** | Essential for AgentCoders operations --- ensures agent-generated code is safe, reviewed, and compliant. Provides the code governance layer that makes autonomous coding agents trustworthy for enterprise deployment. |
