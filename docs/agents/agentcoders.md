---
sidebar_position: 2
title: "AgentCoders Monorepo"
description: "14-package monorepo implementing the AINEFF agent runtime --- agent-runtime, jarvis-runtime, agent-memory, billing-service, and 10 more packages for autonomous agent operations."
---

# AgentCoders Monorepo

**AgentCoders** is the monorepo that implements the AINEFF agent runtime infrastructure. It contains 14 packages covering everything from core agent execution to billing, governance, skill management, and multi-tenant isolation. All packages are TypeScript, built with the ESM module system.

## Repository Identity

| Field | Value |
|-------|-------|
| Repository | `agentcoders` |
| Package Scope | `@agentcoders/*` |
| Language | TypeScript |
| Module System | ESM (`"type": "module"`) |
| Build | `tsc` (TypeScript Compiler) |
| Package Manager | pnpm (workspace) |
| Packages | 14 |

## Package Architecture

```
agentcoders/
├── packages/
│   ├── agent-runtime/          — Core agent execution runtime
│   ├── jarvis-runtime/         — Jarvis CEO agent runtime
│   ├── agent-memory/           — Agent persistent memory layer
│   ├── billing-service/        — Usage tracking and billing
│   ├── dashboard/              — Agent operations dashboard
│   ├── enhancement-layer/      — Agent capability enhancements
│   ├── governance/             — Agent governance enforcement
│   ├── management-models/      — Management model definitions
│   ├── model-router/           — AI model routing and selection
│   ├── scm-adapters/           — Source control management adapters
│   ├── shared/                 — Shared utilities and types
│   ├── skill-registry/         — Agent skill discovery and registration
│   ├── telegram-gateway/       — Telegram bot gateway
│   └── tenant-manager/         — Multi-tenant isolation
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json
```

## The 14 Packages

### 1. agent-runtime

The core execution environment for all agents.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/agent-runtime` |
| Purpose | Core agent execution lifecycle management |

```typescript
// Agent runtime responsibilities:
// - Agent pod initialization and shutdown
// - Task queue management
// - Model inference orchestration
// - Health monitoring and reporting
// - Event emission to AINE Runtime
// - PEP (ORF) enforcement integration

interface AgentRuntime {
  initialize(config: AgentConfig): Promise<void>;
  executeTask(task: Task): Promise<TaskResult>;
  getHealth(): HealthStatus;
  shutdown(reason: string): Promise<void>;
}
```

**Key responsibilities:**
- Manages the agent's lifecycle from initialization through shutdown
- Provides the task execution loop: receive task, process, return result
- Integrates with the model router for AI inference
- Reports health metrics to the AINE Runtime telemetry collector
- Enforces ORF constraints on every action via PEP integration

### 2. jarvis-runtime

Extended runtime for Jarvis CEO agents with leadership capabilities.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/jarvis-runtime` |
| Purpose | CEO agent with delegation, strategy, and oversight capabilities |

```typescript
// Jarvis-specific capabilities beyond base agent-runtime:
interface JarvisRuntime extends AgentRuntime {
  decomposeTask(mission: string): Promise<SubTask[]>;
  delegateTask(task: SubTask, agentId: string): Promise<void>;
  trackPerformance(): VentureCellMetrics;
  escalateDecision(decision: EscalationRequest): Promise<void>;
  reportToOperator(report: CellReport): Promise<void>;
}
```

**Key responsibilities:**
- Decomposes high-level missions into actionable subtasks
- Selects the best specialist agent for each subtask
- Monitors task completion and quality across the venture cell
- Generates performance reports for the operator dashboard
- Escalates decisions that exceed Level 3 authority to human operators

### 3. agent-memory

Persistent memory system for agents across sessions and tasks.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/agent-memory` |
| Purpose | Working memory, long-term memory, and episodic memory for agents |

```typescript
interface AgentMemoryService {
  // Working memory (current task context)
  setWorkingContext(context: TaskContext): void;
  getWorkingContext(): TaskContext | null;

  // Long-term memory (learned patterns)
  storePattern(pattern: Pattern): Promise<void>;
  queryPatterns(query: string, topK: number): Promise<Pattern[]>;

  // Episodic memory (key events)
  recordEvent(event: MemoryEvent): Promise<void>;
  recallEvents(filter: EventFilter): Promise<MemoryEvent[]>;
  summarizeEpisodes(beforeDate: Date): Promise<Summary>;

  // RAG integration
  storeEmbedding(doc: string, metadata: Record<string, unknown>): Promise<void>;
  semanticSearch(query: string, topK: number): Promise<SearchResult[]>;
}
```

**Key responsibilities:**
- Maintains working memory for current task context
- Stores learned patterns for improved future performance
- Records and summarizes episodic memory for event recall
- Integrates with the Knowledge Vault for RAG-based retrieval
- Manages memory lifecycle including summarization and pruning

### 4. billing-service

Usage tracking, metering, and billing for agent operations.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/billing-service` |
| Purpose | Track agent usage, compute costs, generate invoices |

```typescript
interface BillingService {
  trackUsage(event: UsageEvent): Promise<void>;
  getUsageSummary(tenantId: string, period: BillingPeriod): Promise<UsageSummary>;
  calculateCost(usage: UsageSummary): CostBreakdown;
  generateInvoice(tenantId: string, period: BillingPeriod): Promise<Invoice>;
}

interface UsageEvent {
  tenantId: string;
  agentId: string;
  eventType: 'inference' | 'task-execution' | 'storage' | 'network';
  quantity: number;
  unit: 'tokens' | 'seconds' | 'bytes' | 'requests';
  modelId?: string;
  timestamp: Date;
}
```

**Key responsibilities:**
- Meters all agent operations: inference tokens, compute time, storage, network
- Calculates costs based on resource consumption and pricing tiers
- Generates per-tenant usage summaries and invoices
- Feeds revenue data to Revenue Intel and AINEG

### 5. dashboard

Web-based dashboard for AgentCoders operations (internal tooling).

| Field | Value |
|-------|-------|
| Package | `@agentcoders/dashboard` |
| Purpose | Internal operations dashboard for agent infrastructure management |

**Key responsibilities:**
- Visualizes agent fleet status across all tenants
- Shows model router performance and fallback metrics
- Displays billing summaries and usage trends
- Provides skill registry management interface

### 6. enhancement-layer

Plugin system for extending agent capabilities.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/enhancement-layer` |
| Purpose | Pluggable capability enhancements for agents |

```typescript
interface Enhancement {
  enhancementId: string;
  name: string;
  type: 'pre-processor' | 'post-processor' | 'tool' | 'middleware';
  apply(context: EnhancementContext): Promise<EnhancementResult>;
}

// Example enhancements:
// - Chain-of-thought reasoning enforcer
// - Output format validator
// - Confidence scoring
// - Multi-step verification
// - Domain-specific prompt injection
```

**Key responsibilities:**
- Provides a plugin architecture for adding capabilities to agents
- Pre-processors modify inputs before model inference
- Post-processors validate and transform model outputs
- Tools give agents access to external systems and APIs
- Middleware intercepts the execution pipeline for cross-cutting concerns

### 7. governance

Agent-level governance enforcement.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/governance` |
| Purpose | Enforce governance rules on agent behavior |

```typescript
interface GovernanceEnforcer {
  evaluateAction(agent: AgentContext, action: ProposedAction): GovernanceResult;
  checkAuthority(agent: AgentContext, requiredLevel: number): boolean;
  enforcePolicy(policy: GovernancePolicy, context: ExecutionContext): void;
  reportViolation(violation: GovernanceViolation): Promise<void>;
}
```

**Key responsibilities:**
- Evaluates every agent action against governance rules
- Integrates with the AINEFF `@aineff/governance-sdk`
- Enforces authority level checks before action execution
- Reports governance violations to the audit logger
- Manages policy lifecycle: creation, update, enforcement, expiry

### 8. management-models

Defines management structures and decision-making models for agent teams.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/management-models` |
| Purpose | Organizational structures for agent team coordination |

```typescript
type ManagementModel =
  | 'hierarchical'    // Jarvis delegates top-down
  | 'collaborative'   // Agents negotiate task assignment
  | 'competitive'     // Multiple agents compete, best result wins
  | 'pipeline'        // Sequential task handoff
  | 'swarm';          // Emergent behavior, no fixed structure

interface TeamStructure {
  model: ManagementModel;
  leader: string;              // Agent ID
  members: string[];           // Agent IDs
  communicationPattern: 'broadcast' | 'directed' | 'mesh';
  decisionMaking: 'leader-decides' | 'consensus' | 'voting';
}
```

### 9. model-router

Intelligent routing of AI inference requests across multiple providers and models.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/model-router` |
| Purpose | Provider-agnostic model selection and routing |

```typescript
interface ModelRouter {
  route(request: InferenceRequest): Promise<InferenceResponse>;
  selectModel(requirements: ModelRequirements): ModelSelection;
  getFallbackChain(primaryModel: string): string[];
  getProviderHealth(): Record<string, ProviderHealth>;
}

interface ModelRequirements {
  task: 'generation' | 'analysis' | 'code' | 'embedding' | 'classification';
  maxLatencyMs: number;
  maxCostPerToken: number;
  minQualityScore: number;
  contextWindowMin: number;
  privacyLevel: 'public' | 'private' | 'air-gapped';
}
```

**Key responsibilities:**
- Routes inference requests to the optimal model/provider combination
- Maintains health status for all connected providers
- Implements automatic fallback when a provider is unavailable
- Optimizes for cost, latency, and quality based on request requirements
- Integrates with LPI for private inference routing

### 10. scm-adapters

Adapters for source control management systems.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/scm-adapters` |
| Purpose | GitHub, GitLab, Bitbucket integration for code-generating agents |

```typescript
interface SCMAdapter {
  cloneRepository(url: string): Promise<LocalRepo>;
  createBranch(repo: LocalRepo, name: string): Promise<Branch>;
  commitChanges(repo: LocalRepo, message: string, files: FileChange[]): Promise<Commit>;
  createPullRequest(repo: LocalRepo, pr: PRSpec): Promise<PullRequest>;
  getReviewComments(pr: PullRequest): Promise<ReviewComment[]>;
}

// Supported platforms:
type SCMPlatform = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops';
```

### 11. shared

Shared utilities, types, and constants used across all packages.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/shared` |
| Purpose | Common types, utilities, and constants |

**Contents:**
- Common TypeScript types and interfaces
- Error types and error handling utilities
- Logger configuration
- Event type definitions
- Configuration loading utilities
- Date/time helpers

### 12. skill-registry

Central registry for discovering, registering, and managing agent skills.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/skill-registry` |
| Purpose | Skill catalog, discovery, versioning, and metrics |

```typescript
interface SkillRegistry {
  register(skill: SkillDefinition): Promise<void>;
  discover(query: SkillQuery): Promise<SkillDefinition[]>;
  getSkill(skillId: string): Promise<SkillDefinition | null>;
  updateMetrics(skillId: string, metrics: SkillMetrics): Promise<void>;
  deprecate(skillId: string, reason: string): Promise<void>;
}

interface SkillQuery {
  category?: SkillCategory;
  capabilities?: string[];
  minSuccessRate?: number;
  maxLatencyMs?: number;
}
```

**Key responsibilities:**
- Maintains the catalog of all available agent skills
- Supports skill discovery by category, capability, and performance
- Tracks skill usage metrics (success rate, latency, usage count)
- Manages skill versioning and deprecation
- WGE queries this registry when assembling venture cell teams

### 13. telegram-gateway

Telegram bot interface for agent interaction.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/telegram-gateway` |
| Purpose | Telegram bot gateway for operator-agent communication |

```typescript
interface TelegramGateway {
  registerBot(config: BotConfig): Promise<void>;
  sendMessage(chatId: string, message: AgentMessage): Promise<void>;
  handleCommand(command: TelegramCommand): Promise<CommandResult>;
  broadcastAlert(alert: Alert): Promise<void>;
}

// Supported commands:
// /status       — Get AINE status summary
// /agents       — List active agents
// /cells        — List venture cells
// /approve <id> — Approve pending action
// /deny <id>    — Deny pending action
// /escalate <id> — Escalate to higher authority
```

**Key responsibilities:**
- Provides mobile-friendly operator access via Telegram
- Sends real-time alerts for pending approvals and incidents
- Supports approval/denial of agent actions directly from Telegram
- Enables quick status checks without accessing the full dashboard

### 14. tenant-manager

Multi-tenant isolation for hosting multiple enterprises on shared infrastructure.

| Field | Value |
|-------|-------|
| Package | `@agentcoders/tenant-manager` |
| Purpose | Tenant isolation, resource quotas, and data segregation |

```typescript
interface TenantManager {
  createTenant(config: TenantConfig): Promise<Tenant>;
  getTenant(tenantId: string): Promise<Tenant>;
  isolateExecution(tenantId: string, fn: () => Promise<unknown>): Promise<unknown>;
  enforceQuota(tenantId: string, resource: string, amount: number): boolean;
  listTenants(): Promise<Tenant[]>;
}

interface TenantConfig {
  tenantId: string;
  aineId: string;            // Associated AINE instance
  quotas: {
    maxAgents: number;
    maxTokensPerDay: number;
    maxStorageGb: number;
    maxConcurrentTasks: number;
  };
  isolation: {
    level: 'namespace' | 'cluster' | 'node';
    networkPolicy: 'strict' | 'standard';
    dataEncryption: boolean;
  };
}
```

## Package Dependency Graph

```
                    shared
                      │
        ┌─────────────┼─────────────┐
        │             │             │
  agent-runtime  governance   billing-service
        │             │             │
   ┌────┼────┐        │             │
   │    │    │        │             │
jarvis model  agent   │         tenant-
runtime router memory  │         manager
   │    │    │        │
   │    │    │    enhancement-
   │    │    │      layer
   │    │    │
   │    │    │         ┌────────────┐
   │    │    │         │            │
   │    │    └─────────┤ skill-     │
   │    │              │ registry   │
   │    │              └────────────┘
   │    │
   │    └──────────────┐
   │                   │
   │            management-
   │              models
   │
   ├── scm-adapters
   ├── telegram-gateway
   └── dashboard
```

## Development

### Workspace Setup

```bash
# Clone the repository
git clone https://github.com/frankmax-com/agentcoders.git
cd agentcoders

# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Build specific package
pnpm --filter @agentcoders/agent-runtime build

# Run in development mode
pnpm --filter @agentcoders/agent-runtime dev
```

### Package Scripts

Every package exposes the same standard scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### Adding a New Package

```bash
# Create package directory
mkdir packages/my-new-package

# Initialize with standard structure
cd packages/my-new-package
cat > package.json << 'EOF'
{
  "name": "@agentcoders/my-new-package",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.8.0"
  }
}
EOF
```

## Integration with AINEFF

AgentCoders integrates with the broader AINEFF ecosystem through:

| Integration | Package | AINEFF System |
|-------------|---------|---------------|
| Governance enforcement | `governance` | `@aineff/governance-sdk` |
| Audit logging | `shared` | `@aineff/audit-logger` |
| ORF obligation binding | `governance` | `@aineff/orf-sdk` |
| Telemetry emission | `agent-runtime` | `@aineff/telemetry` |
| Type sharing | `shared` | `@aineff/shared-types` |

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | AgentCoders can be deployed independently as an AI agent platform. Revenue from agent hosting, inference usage, and tenant management. |
| **Composed** | Within AINEFF, AgentCoders provides the execution layer for all WGE venture cells. Every agent running in every AINE is powered by AgentCoders packages. Revenue scales linearly with AINE deployments and venture cell count. |
