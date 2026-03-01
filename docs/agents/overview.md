---
sidebar_position: 1
title: "Agent Architecture Overview"
description: "AINEFF agent architecture --- Jarvis CEO pods, specialist agents, venture cells, skill registry, and the agent runtime that powers autonomous enterprise operations."
---

# Agent Architecture Overview

AINEFF agents are autonomous AI workers that operate within [AINE Runtime](/docs/platforms/aine-runtime) instances. They are organized into **venture cells** (created by [WGE](/docs/platforms/wge)), led by **Jarvis CEO agents**, and staffed with **specialist agents** drawn from a **skill registry**. Every agent action is governed by [ORF Protocol](/docs/platforms/orf-protocol) constraints and tracked by the authority matrix.

## Agent Hierarchy

```
AINE Runtime Instance
├── Jarvis CEO Agent (1 per venture cell)
│   ├── Specialist Agent A
│   ├── Specialist Agent B
│   ├── Specialist Agent C
│   └── Specialist Agent D (max 4 per cell)
├── Jarvis CEO Agent (another venture cell)
│   ├── Specialist Agent E
│   ├── Specialist Agent F
│   └── Specialist Agent G
└── Standalone Agents (not in cells)
    ├── System monitoring agent
    └── Telemetry collection agent
```

## Agent Types

### Jarvis CEO Agent

The **Jarvis CEO** is the leadership agent for each venture cell. There is exactly one Jarvis CEO per cell.

| Responsibility | Description |
|---------------|-------------|
| **Strategy** | Translates the venture cell mission into actionable tasks |
| **Delegation** | Assigns tasks to specialist agents based on skills and capacity |
| **Coordination** | Manages task dependencies and workflow between specialists |
| **Reporting** | Reports cell performance to the operator dashboard |
| **Revenue** | Tracks revenue generation against cell targets |
| **Escalation** | Escalates decisions that exceed its authority to human operators |

```typescript
interface JarvisCEOAgent {
  agentId: string;
  type: 'jarvis-ceo';
  ventureCell: string;
  authorityLevel: 3;          // Jarvis operates at Level 3
  capabilities: [
    'task-decomposition',
    'agent-delegation',
    'performance-tracking',
    'revenue-reporting',
    'stakeholder-communication',
    'escalation',
  ];
  model: {
    provider: string;
    modelId: string;           // Typically a frontier model
    contextWindow: number;
  };
  state: {
    activeTasks: number;
    delegatedTasks: number;
    pendingEscalations: number;
    cellRevenue: number;
  };
}
```

### Specialist Agents

Specialists are domain-specific workers. Each specialist has a defined set of skills from the skill registry.

| Specialist Type | Skills | Typical Use |
|----------------|--------|-------------|
| **Data Analyst** | data-analysis, visualization, statistical-modeling | Analyze datasets, generate insights |
| **Process Engineer** | bpmn-modeling, process-optimization, workflow-design | Design and optimize business processes |
| **Report Writer** | report-generation, document-formatting, executive-summary | Create professional reports and documents |
| **API Integrator** | api-integration, data-transformation, webhook-management | Connect systems and automate data flows |
| **Quality Analyst** | quality-analysis, spc, defect-analysis | Quality control and prediction |
| **Code Developer** | code-generation, code-review, testing | Build and maintain software |
| **Document Extractor** | ocr, document-parsing, data-extraction | Extract structured data from documents |
| **Risk Assessor** | risk-modeling, compliance-checking, audit-preparation | Assess and mitigate risks |

```typescript
interface SpecialistAgent {
  agentId: string;
  type: 'specialist';
  specialization: string;
  ventureCell: string;
  authorityLevel: 1 | 2;      // Specialists are Level 1-2
  skills: Skill[];
  model: {
    provider: string;
    modelId: string;
    contextWindow: number;
  };
  performance: {
    tasksCompleted: number;
    averageLatencyMs: number;
    errorRate: number;
    qualityScore: number;      // 0-100
  };
}
```

## Skill Registry

The skill registry is a centralized catalog of all capabilities available to agents. WGE queries it when assembling venture cells.

### Skill Definition

```typescript
interface Skill {
  skillId: string;
  name: string;
  description: string;
  category: SkillCategory;
  version: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  requirements: {
    minModelCapability: string;
    estimatedTokens: number;
    toolsRequired: string[];
  };
  metrics: {
    successRate: number;
    avgLatencyMs: number;
    usageCount: number;
  };
}

type SkillCategory =
  | 'data-analysis'
  | 'document-processing'
  | 'code-generation'
  | 'communication'
  | 'integration'
  | 'quality'
  | 'risk'
  | 'process'
  | 'creative';
```

### Skill Discovery

```
Agent needs a skill
    │
    v
Query Skill Registry
    │
    ├── Exact match: Return skill implementation
    ├── Partial match: Return closest skill + gap analysis
    └── No match: Flag to WGE for new skill development
```

### Skill Registry Contents

| Category | Skills Available | Example |
|----------|-----------------|---------|
| Data Analysis | 12 | `statistical-modeling`, `trend-detection`, `anomaly-scoring` |
| Document Processing | 8 | `pdf-extraction`, `ocr`, `summarization` |
| Code Generation | 10 | `typescript-generation`, `test-writing`, `code-review` |
| Communication | 6 | `email-drafting`, `report-writing`, `stakeholder-updates` |
| Integration | 9 | `rest-api-calling`, `webhook-management`, `data-transformation` |
| Quality | 7 | `spc-analysis`, `defect-prediction`, `compliance-checking` |
| Risk | 5 | `risk-scoring`, `audit-preparation`, `vulnerability-assessment` |
| Process | 8 | `bpmn-modeling`, `workflow-optimization`, `bottleneck-detection` |

## Agent Lifecycle

### Pod Lifecycle

```
Requested → Scheduled → Initializing → Ready → Active → Draining → Terminated
    │           │            │           │        │         │           │
    │           │            │           │        │         │           └── Pod removed,
    │           │            │           │        │         │               resources freed
    │           │            │           │        │         └── Finishing current tasks,
    │           │            │           │        │              no new tasks accepted
    │           │            │           │        └── Processing tasks,
    │           │            │           │            reporting to Jarvis
    │           │            │           └── Skills loaded,
    │           │            │               model connected,
    │           │            │               health check passed
    │           │            └── Container starting,
    │           │                loading dependencies
    │           └── K8s scheduler
    │                placing pod
    └── WGE or operator
         requested agent
```

### Agent Communication

Agents communicate through the AINE Runtime event bus. All messages pass through PEP (ORF enforcement):

```
Jarvis CEO ──→ PEP ──→ Event Bus ──→ PEP ──→ Specialist
                │                      │
                v                      v
           Audit Logger           Audit Logger
```

```typescript
interface AgentMessage {
  messageId: string;
  from: string;           // Agent ID
  to: string;             // Agent ID or broadcast
  type: 'task' | 'result' | 'status' | 'escalation';
  payload: {
    taskId?: string;
    content: unknown;
    priority: 'low' | 'normal' | 'high' | 'critical';
  };
  orfBindingId: string;   // Every message creates an obligation
  timestamp: Date;
}
```

## Agent Memory

Agents maintain persistent memory through the `agent-memory` package:

```typescript
interface AgentMemory {
  agentId: string;

  // Short-term: current task context
  workingMemory: {
    currentTask: TaskContext | null;
    recentMessages: AgentMessage[];
    pendingActions: Action[];
  };

  // Long-term: learned patterns and preferences
  longTermMemory: {
    taskPatterns: Pattern[];          // Successful task patterns
    errorPatterns: Pattern[];         // Common failure modes
    stakeholderPreferences: Record<string, Preference>;
    domainKnowledge: Embedding[];    // RAG embeddings
  };

  // Episodic: key events
  episodicMemory: {
    events: MemoryEvent[];
    maxEvents: number;               // Default: 1000
    summarizationThreshold: number;  // Summarize after N events
  };
}
```

## Agent-Operator Interaction

```
┌─────────────────────────────────────────────────────┐
│                    Authority Flow                    │
│                                                     │
│   Agent (Level 1-2)                                 │
│       │                                             │
│       │  Action within authority?                   │
│       ├── YES → Execute (ORF binding created)       │
│       └── NO  → Escalate to Jarvis (Level 3)        │
│                   │                                 │
│                   │  Action within Jarvis authority? │
│                   ├── YES → Approve + execute        │
│                   └── NO  → Escalate to Operator     │
│                               │                     │
│                               │  Operator decides    │
│                               ├── Approve            │
│                               ├── Deny               │
│                               └── Escalate further   │
└─────────────────────────────────────────────────────┘
```

## Key Design Principles

1. **Agents are accountable**: Every agent action creates an ORF obligation binding. There is always a responsible party (human operator) for every agent decision.

2. **Skills are composable**: Agents gain capabilities through skills, not through monolithic programming. New skills can be added to the registry without changing agent code.

3. **Venture cells are the revenue unit**: Agents do not generate revenue individually. Revenue is generated at the venture cell level, where a team of agents collaborates on a mission.

4. **Humans stay in the loop**: Agents can act autonomously within their authority level, but high-stakes decisions always escalate to human operators.

5. **Failure is contained**: If an agent fails, the venture cell continues with remaining agents. If a cell fails, the AINE continues with remaining cells. Failure does not propagate.

## Related Documentation

- [AgentCoders Monorepo](./agentcoders) --- The 14-package monorepo that implements the agent runtime
- [AINE Runtime](/docs/platforms/aine-runtime) --- The hosting platform for agent pods
- [WGE](/docs/platforms/wge) --- The engine that creates venture cells and assembles agent teams
- [LevelupMax](/docs/platforms/levelupmax) --- Training for human operators who oversee agents
- [Operator Dashboard](/docs/apps/operator-dashboard) --- The interface for managing agents
