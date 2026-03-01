---
sidebar_position: 1
title: "Chokepoint Intelligence"
description: "Manufacturing chokepoint assessment tool --- Next.js 16, TypeScript, Tailwind v4. Two modes: guided questionnaire and AI file upload. 12 chokepoints scored across 5 sections."
---

# Chokepoint Intelligence

**Chokepoint Intelligence** is the flagship assessment application used within [Frankmax](/docs/platforms/frankmax) PIAR engagements. It identifies and scores manufacturing chokepoints --- operational bottlenecks that constrain enterprise throughput, quality, and revenue. The tool produces actionable intelligence reports with financial impact estimates, delivered as branded PDF documents.

## Application Identity

| Field | Value |
|-------|-------|
| App ID | `chokepoint-web` |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand with sessionStorage persistence |
| Charts | Recharts |
| Animations | Framer Motion |
| PDF | @react-pdf/renderer |
| AI | @anthropic-ai/sdk + openai |
| Revenue | $15-30K per engagement (via Frankmax) |

## Two Assessment Modes

### Mode 1: Guided Questionnaire

A structured 26-question assessment across 5 sections:

| Section | Questions | Chokepoints Covered |
|---------|-----------|-------------------|
| **Section 1: Production Flow** | 5 questions | Bottleneck Detection, Throughput Optimization, Cycle Time |
| **Section 2: Quality Systems** | 6 questions | Quality Prediction, Defect Analysis, SPC |
| **Section 3: Supply Chain** | 5 questions | Supply Chain Visibility, Inventory Optimization, Supplier Risk |
| **Section 4: Workforce** | 5 questions | Workforce Scheduling, Skill Gap Analysis, Safety |
| **Section 5: Technology** | 5 questions | System Integration, Data Quality, Automation Readiness |

Each question is scored on a severity scale that maps to chokepoint impact.

### Mode 2: AI File Upload

Upload operational documents (PDFs, spreadsheets, reports) for AI-powered analysis:

```
Supported File Types:
├── PDF          — Production reports, quality manuals, SOPs
├── XLSX / CSV   — Throughput data, defect logs, inventory records
├── DOCX         — Process documentation, audit reports
└── Images       — Process flow diagrams, facility layouts
```

The AI analyzes uploaded documents against the same 12-chokepoint framework, producing scores equivalent to the questionnaire mode.

## The 12 Chokepoints

| # | Chokepoint | Category | Key Metric |
|---|-----------|----------|------------|
| 1 | **Bottleneck Detection** | Production | Throughput loss per bottleneck |
| 2 | **Throughput Optimization** | Production | Units/hour vs. theoretical max |
| 3 | **Cycle Time Reduction** | Production | Actual vs. target cycle time |
| 4 | **Quality Prediction** | Quality | Defect rate predictability |
| 5 | **Defect Root Cause** | Quality | Mean time to root cause |
| 6 | **SPC Effectiveness** | Quality | Process capability index (Cpk) |
| 7 | **Supply Chain Visibility** | Supply Chain | End-to-end visibility score |
| 8 | **Inventory Optimization** | Supply Chain | Carrying cost vs. stockout risk |
| 9 | **Supplier Risk** | Supply Chain | Supplier concentration risk |
| 10 | **Workforce Scheduling** | Workforce | Schedule adherence rate |
| 11 | **Skill Gap Analysis** | Workforce | Critical skill coverage |
| 12 | **Automation Readiness** | Technology | Automation potential score |

## Scoring Engine

### Severity Weighting

Each chokepoint response receives a weighted severity score:

```typescript
// Scoring flow
Raw Response (1-5 scale)
  → Weighted by chokepoint importance
  → Normalized to 0-100 scale
  → Classified into tier
  → Mapped to financial impact
  → Rolled into composite score
```

### Tier Classification

| Tier | Score Range | Color | Meaning |
|------|------------|-------|---------|
| **Critical** | 0-20 | Red | Severe operational constraint, immediate action required |
| **High** | 21-40 | Orange | Significant impact, should address within 30 days |
| **Medium** | 41-60 | Yellow | Moderate impact, plan for improvement |
| **Low** | 61-80 | Green | Minor impact, optimize when convenient |
| **Optimal** | 81-100 | Blue | Operating at or near best practice |

### Financial Impact Calculation

Each chokepoint score maps to an estimated annual financial impact:

```typescript
interface FinancialImpact {
  chokepointId: string;
  annualCostEstimate: number;      // USD
  confidenceLevel: 'high' | 'medium' | 'low';
  basis: string;                    // Calculation methodology
}

// Example: A "Red" bottleneck detection score for a $50M revenue plant
// might estimate $2.4M annual impact from undetected bottlenecks
```

### Composite Score

The composite score aggregates all 12 chokepoints:

```typescript
interface CompositeScore {
  overall: number;              // 0-100
  tier: 'critical' | 'high' | 'medium' | 'low' | 'optimal';
  sectionScores: {
    productionFlow: number;
    qualitySystems: number;
    supplyChain: number;
    workforce: number;
    technology: number;
  };
  totalFinancialImpact: number; // Sum of all chokepoint impacts
  topChokepoints: string[];     // Top 3 by severity
}
```

## Technical Architecture

### Project Structure

```
app/
├── src/
│   ├── app/                          — Next.js App Router pages
│   │   ├── layout.tsx                — Root layout (Space Grotesk + Inter fonts)
│   │   ├── page.tsx                  — Landing / mode selection
│   │   ├── questionnaire/            — Guided questionnaire flow
│   │   ├── upload/                   — AI file upload flow
│   │   └── results/                  — Results dashboard
│   ├── components/
│   │   ├── questionnaire/            — Question components per section
│   │   ├── charts/                   — Recharts visualizations
│   │   ├── pdf/
│   │   │   └── ReportTemplate.tsx    — @react-pdf/renderer template
│   │   └── ui/                       — Shared UI components
│   ├── lib/
│   │   ├── store.ts                  — Zustand store (sessionStorage)
│   │   ├── types/
│   │   │   └── index.ts              — TypeScript type definitions
│   │   ├── questionnaire/
│   │   │   └── sections.ts           — 26 questions, 5 sections
│   │   ├── chokepoints.ts            — 12 chokepoint definitions
│   │   ├── scoring/
│   │   │   └── engine.ts             — Scoring engine (questionnaire + AI)
│   │   └── ai/
│   │       └── provider.ts           — Claude + OpenAI, SSE streaming
│   └── styles/
│       └── globals.css               — Tailwind v4 @theme inline blocks
```

### State Management

```typescript
// Zustand store with sessionStorage persistence
interface ChokepointStore {
  // Mode
  mode: 'questionnaire' | 'ai-upload' | null;

  // Questionnaire state
  currentSection: number;
  responses: Record<string, number>;  // 'sc-1' through 'sc-26'

  // AI upload state
  uploadedFiles: File[];
  aiAnalysis: AIAnalysisResult | null;

  // Results
  scores: ChokepointScore[] | null;
  compositeScore: CompositeScore | null;
  financialImpact: FinancialImpact[] | null;

  // Actions
  setMode: (mode: 'questionnaire' | 'ai-upload') => void;
  setResponse: (questionId: string, value: number) => void;
  calculateScores: () => void;
  reset: () => void;
}
```

### AI Integration

The AI provider supports both Claude and OpenAI with SSE streaming:

```typescript
// AI provider configuration
interface AIProviderConfig {
  provider: 'anthropic' | 'openai';
  model: string;
  streaming: boolean;  // SSE streaming for real-time analysis feedback
}

// AI scoring uses different response keys than questionnaire
// Questionnaire: 'sc-1', 'sc-2', ..., 'sc-26'
// AI Upload:     'ai-bottleneck-detection', 'ai-quality-prediction', etc.
```

### Design System

| Element | Value |
|---------|-------|
| Background | Navy `#1E2761` |
| Primary Text | Ice Blue `#CADCFC` |
| Accent | Green `#00D4AA` |
| Heading Font | Space Grotesk |
| Body Font | Inter |
| Theme | Dark mode |

### PDF Report Generation

Reports are generated using `@react-pdf/renderer`:

```typescript
// PDF report includes:
// - Executive summary with composite score
// - Radar chart of 12 chokepoints
// - Section-by-section breakdown
// - Financial impact table
// - Recommended actions prioritized by severity
// - Frankmax branding and engagement details

// Known quirk: renderToBuffer needs `as any` cast for element param
const buffer = await renderToBuffer(element as any);
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Submit files for AI analysis (SSE streaming) |
| `/api/score` | POST | Calculate scores from responses |
| `/api/report` | POST | Generate PDF report |
| `/api/health` | GET | Health check |

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### Environment Variables

```bash
# AI Provider Configuration
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
AI_PROVIDER=anthropic          # or 'openai'
AI_MODEL=claude-sonnet-4-20250514  # or 'gpt-4o'

# Application
NEXT_PUBLIC_APP_URL=https://chokepoint.frankmax.digital
```

## Integration with Frankmax

Chokepoint Intelligence is the primary tool used in Frankmax Discovery engagements:

```
Frankmax Engagement
    │
    ├── Consultant runs Chokepoint Intelligence assessment
    │   ├── Option A: Guided questionnaire with client
    │   └── Option B: Client uploads operational documents
    │
    ├── Scoring engine produces results
    │   ├── 12 chokepoint scores with tiers
    │   ├── Financial impact estimates
    │   └── Composite score
    │
    ├── PDF report generated
    │   └── Branded, professional deliverable
    │
    └── Results inform next engagement phase
        ├── Architecture phase: address top chokepoints
        └── Deployment phase: venture cells for high-impact areas
```

## Known Technical Quirks

1. **@react-pdf/renderer**: The `renderToBuffer` function requires casting the React element to `any` due to type incompatibility
2. **Recharts Tooltip**: The formatter callback requires casting `value as number` for proper TypeScript type checking
3. **AI Response Keys**: AI scoring mode uses `ai-{chokepointId}` response keys (e.g., `ai-bottleneck-detection`) while the questionnaire mode uses `sc-1` through `sc-26`
4. **Tailwind v4**: Uses `@theme inline` blocks in `globals.css` instead of `tailwind.config.ts` for theme configuration
