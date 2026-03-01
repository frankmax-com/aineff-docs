---
sidebar_position: 1
title: "AI Provider Factory"
description: "Provider-agnostic AI router supporting 17 providers and 100+ models --- intelligent routing, automatic fallback, cost optimization, and privacy-aware inference."
---

# AI Provider Factory

The **AI Provider Factory** is a provider-agnostic routing layer that abstracts away the complexity of working with multiple AI providers. It supports **17 providers** and **100+ models**, providing intelligent routing, automatic fallback chains, cost optimization, and privacy-aware inference. Every AI inference request in AINEFF passes through this factory.

## Factory Identity

| Field | Value |
|-------|-------|
| Factory ID | `ai-provider-factory` |
| Package | `@agentcoders/model-router` (runtime) |
| Providers | 17 |
| Models | 100+ |
| Integration | AINE Runtime, LPI, AgentCoders |

## Supported Providers

| # | Provider | Type | Models (Examples) |
|---|----------|------|-------------------|
| 1 | **Anthropic** | Cloud | Claude Opus 4, Sonnet 4, Haiku |
| 2 | **OpenAI** | Cloud | GPT-4o, GPT-4.1, o3, o4-mini |
| 3 | **Google** | Cloud | Gemini 2.5 Pro, Gemini 2.5 Flash |
| 4 | **Mistral** | Cloud | Mistral Large, Codestral, Ministral |
| 5 | **Cohere** | Cloud | Command R+, Embed v3 |
| 6 | **Meta** | Open | Llama 4 Scout, Llama 4 Maverick |
| 7 | **Groq** | Cloud | LPU-accelerated inference |
| 8 | **Together AI** | Cloud | Open model hosting |
| 9 | **Fireworks** | Cloud | Fast open model inference |
| 10 | **Replicate** | Cloud | Model marketplace |
| 11 | **Perplexity** | Cloud | Search-augmented models |
| 12 | **DeepSeek** | Cloud | DeepSeek V3, R1 |
| 13 | **Ollama** | Local | Self-hosted open models |
| 14 | **vLLM** | Local | High-throughput self-hosted |
| 15 | **NVIDIA Triton** | Local | Enterprise GPU inference |
| 16 | **HuggingFace** | Hybrid | Inference Endpoints + local |
| 17 | **Azure OpenAI** | Cloud | Azure-hosted OpenAI models |

## Architecture

### Routing Pipeline

```
Inference Request
    │
    v
┌──────────────────────────────────────────────────────────┐
│                    AI Provider Factory                     │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Privacy     │→ │ Model       │→ │ Provider        │  │
│  │ Classifier  │  │ Selector    │  │ Router          │  │
│  └─────────────┘  └─────────────┘  └────────┬────────┘  │
│         │                │                   │           │
│         │                │          ┌────────v────────┐  │
│         │                │          │ Load Balancer   │  │
│         │                │          └────────┬────────┘  │
│         │                │                   │           │
│         │                │          ┌────────v────────┐  │
│         │                │          │ Fallback Chain  │  │
│         │                │          └────────┬────────┘  │
│         │                │                   │           │
│         │                │          ┌────────v────────┐  │
│         │                │          │ Response        │  │
│         │                │          │ Normalizer      │  │
│         │                │          └─────────────────┘  │
│         │                │                               │
│  ┌──────v────────────────v───────────────────────────┐   │
│  │           Telemetry & Billing Collector            │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Privacy Classification

Before routing, the factory classifies the request's privacy requirements:

```typescript
type PrivacyLevel = 'public' | 'internal' | 'confidential' | 'restricted';

interface PrivacyClassification {
  level: PrivacyLevel;
  allowedProviders: string[];
  restrictions: string[];
}

// Privacy → Provider mapping:
// 'public'       → Any provider
// 'internal'     → Cloud providers with DPA agreements
// 'confidential' → LPI (private) or selected cloud with encryption
// 'restricted'   → LPI (on-premises) only, air-gapped
```

### Model Selection

The model selector chooses the optimal model based on multiple criteria:

```typescript
interface ModelSelectionCriteria {
  task: TaskType;
  privacyLevel: PrivacyLevel;
  maxLatencyMs: number;
  maxCostPerMToken: number;    // Per million tokens
  minContextWindow: number;
  capabilities: string[];       // e.g., ['code', 'vision', 'function-calling']
  preferredProvider?: string;
}

type TaskType =
  | 'text-generation'
  | 'code-generation'
  | 'analysis'
  | 'summarization'
  | 'classification'
  | 'embedding'
  | 'vision'
  | 'function-calling'
  | 'reasoning';
```

### Fallback Chains

Every primary model has a configured fallback chain:

```typescript
// Example fallback chains
const fallbackChains: Record<string, string[]> = {
  'claude-opus-4': [
    'claude-sonnet-4',           // Same provider, lower tier
    'gpt-4o',                    // Alternative provider
    'gemini-2.5-pro',            // Third option
  ],
  'gpt-4o': [
    'gpt-4.1',
    'claude-sonnet-4',
    'gemini-2.5-pro',
  ],
  'llama-4-scout': [             // Open model fallbacks
    'llama-4-maverick',
    'mistral-large',
    'deepseek-v3',
  ],
};
```

### Response Normalization

All provider responses are normalized to a unified format:

```typescript
interface NormalizedResponse {
  requestId: string;
  provider: string;
  model: string;
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costUsd: number;
  };
  latency: {
    timeToFirstTokenMs: number;
    totalDurationMs: number;
  };
  metadata: {
    finishReason: 'stop' | 'length' | 'tool_use' | 'error';
    functionCalls?: FunctionCall[];
    citations?: Citation[];
  };
}
```

## Configuration

```typescript
interface AIProviderFactoryConfig {
  // Provider credentials
  providers: {
    anthropic?: { apiKey: string; baseUrl?: string };
    openai?: { apiKey: string; orgId?: string; baseUrl?: string };
    google?: { apiKey: string; project?: string };
    mistral?: { apiKey: string };
    groq?: { apiKey: string };
    ollama?: { baseUrl: string };    // e.g., 'http://localhost:11434'
    vllm?: { baseUrl: string };
    // ... additional providers
  };

  // Routing
  routing: {
    defaultModel: string;             // e.g., 'claude-sonnet-4'
    costOptimization: boolean;        // Default: true
    latencyOptimization: boolean;     // Default: false
    loadBalancing: 'round-robin' | 'least-latency' | 'cost-weighted';
  };

  // Limits
  limits: {
    maxConcurrentRequests: number;    // Default: 100
    maxRetries: number;               // Default: 3
    timeoutMs: number;                // Default: 60000
    rateLimitPerMinute: number;       // Default: 1000
  };

  // Privacy
  privacy: {
    defaultLevel: PrivacyLevel;       // Default: 'internal'
    piiDetection: boolean;            // Default: true
    logPrompts: boolean;              // Default: false (privacy)
    logResponses: boolean;            // Default: false (privacy)
  };

  // Telemetry
  telemetry: {
    trackUsage: boolean;              // Default: true
    trackCost: boolean;               // Default: true
    trackLatency: boolean;            // Default: true
    reportingIntervalMs: number;      // Default: 60000
  };
}
```

## Usage

### Basic Inference

```typescript
import { AIProviderFactory } from '@agentcoders/model-router';

const factory = new AIProviderFactory(config);

// Simple text generation
const response = await factory.generate({
  prompt: 'Analyze the production throughput data and identify bottlenecks.',
  model: 'claude-sonnet-4',
  maxTokens: 4096,
});

// With automatic model selection
const response = await factory.generate({
  prompt: 'Write a TypeScript function to validate invoices.',
  task: 'code-generation',
  requirements: {
    maxLatencyMs: 5000,
    maxCostPerMToken: 10,
    capabilities: ['code', 'function-calling'],
  },
});
```

### Streaming Inference

```typescript
// SSE streaming
const stream = await factory.stream({
  prompt: 'Generate a detailed supply chain risk assessment.',
  model: 'claude-sonnet-4',
  maxTokens: 8192,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}
```

### Embedding Generation

```typescript
// Generate embeddings for RAG
const embeddings = await factory.embed({
  texts: ['Document chunk 1', 'Document chunk 2'],
  model: 'nomic-embed-text',  // or 'text-embedding-3-large'
});
```

### Privacy-Aware Routing

```typescript
// Confidential data - routes to LPI only
const response = await factory.generate({
  prompt: 'Analyze this patient medical record...',
  privacyLevel: 'restricted',
  // Factory automatically routes to LPI (on-premises)
});
```

## Provider Health Monitoring

```typescript
interface ProviderHealth {
  providerId: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyP50Ms: number;
  latencyP99Ms: number;
  errorRate: number;           // Last 5 minutes
  rateLimitRemaining: number;
  lastChecked: Date;
}

// Health dashboard
const health = await factory.getProviderHealth();
// {
//   anthropic: { status: 'healthy', latencyP50Ms: 245, errorRate: 0.001 },
//   openai:    { status: 'healthy', latencyP50Ms: 312, errorRate: 0.003 },
//   ollama:    { status: 'degraded', latencyP50Ms: 890, errorRate: 0.05 },
// }
```

## Cost Tracking

```typescript
interface CostReport {
  period: { start: Date; end: Date };
  totalCostUsd: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
  byTask: Record<string, number>;
  tokensByProvider: Record<string, { input: number; output: number }>;
}

const report = await factory.getCostReport('2026-02');
// {
//   totalCostUsd: 2847.32,
//   byProvider: { anthropic: 1245.00, openai: 982.12, ollama: 0 },
//   byModel: { 'claude-sonnet-4': 890.00, 'gpt-4o': 712.00, ... },
// }
```

## Integration Points

| System | Integration | Purpose |
|--------|-------------|---------|
| **AgentCoders** | Core dependency | All agent inference routed through factory |
| **LPI** | Provider | Private inference for restricted data |
| **AINE Runtime** | Consumer | Agent pods use factory for AI inference |
| **Billing Service** | Telemetry | Usage and cost tracking |
| **Telemetry** | Outbound | Latency, throughput, error rate metrics |

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | AI Provider Factory can be deployed as an independent AI gateway for any organization. Revenue from inference volume and model management fees. |
| **Composed** | Every agent in every AINE uses the AI Provider Factory for inference. Cost optimization across the fleet reduces operational costs while maintaining quality. Privacy-aware routing ensures compliance without manual provider selection. |
