---
sidebar_position: 5
title: "UI Design System"
description: "Shared dark theme component library for all AINEFF front-end applications"
---

# UI Design System (`@aineff/ui`)

| Field | Value |
|-------|-------|
| Package | `@aineff/ui` |
| Type | Shared component library |
| Consumers | Operator Dashboard, Frankmax Portal, LevelupMax, DocuFlow |

## Purpose

`@aineff/ui` is the shared component library that enforces visual consistency across
all AINEFF front-end applications. It implements the AINEFF dark theme (Navy #1E2761,
Ice Blue #CADCFC, Accent Green #00D4AA), provides pre-built components for common
patterns (data tables, status indicators, governance badges, audit trail viewers),
and integrates with the design tokens used across the ecosystem.

## Key Exports

```typescript
// Layout components
export { AppShell, Sidebar, TopNav, ContentArea } from './layout';

// Data display
export { DataTable, StatusBadge, MetricCard, TimelineView } from './data';

// Governance UI
export { AuthorityBadge, EscalationCard, AuditTrailViewer } from './governance';

// Charts (Recharts wrappers)
export { RevenueChart, TelemetryGraph, HarmForecastView } from './charts';

// Theme
export { darkTheme, lightTheme, ThemeProvider } from './theme';
export { tokens } from './tokens';
```

## Installation

```bash
pnpm add @aineff/ui
```

## Usage

```typescript
import { DataTable, StatusBadge, ThemeProvider, darkTheme } from '@aineff/ui';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <DataTable columns={columns} data={data} />
    </ThemeProvider>
  );
}
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#1E2761` | Primary background |
| `--ice-blue` | `#CADCFC` | Text, borders |
| `--accent-green` | `#00D4AA` | CTAs, success states |
| `--font-heading` | Space Grotesk | Headings |
| `--font-body` | Inter | Body text |

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4 with `@theme inline` blocks
- Lucide React icons
- Recharts for data visualization
- Framer Motion for animations

## K8s Deployment

Not applicable -- `@aineff/ui` is a shared library bundled into each front-end
application's build. It produces no independent runtime artifacts.
