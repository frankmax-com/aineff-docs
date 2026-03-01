---
sidebar_position: 3
title: "Monitoring"
description: "AINEFF telemetry system --- metrics collection, distributed tracing, log aggregation, alerting, and dashboards for platform and AINE instance observability."
---

# Monitoring

AINEFF includes a comprehensive telemetry system that provides metrics collection, distributed tracing, log aggregation, alerting, and dashboards. Every AINEFF system emits standardized telemetry data, enabling full observability across the platform and all AINE instances.

## Telemetry Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AINEFF Systems                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ ORF  │ │ AINE │ │ WGE  │ │Agent │ │ Apps │ │ ...  │   │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘   │
│     │        │        │        │        │        │         │
│     └────────┴────────┴────────┴────────┴────────┘         │
│                         │                                   │
│              ┌──────────v──────────┐                        │
│              │  Telemetry Collector │                        │
│              │  (OpenTelemetry)     │                        │
│              └──────────┬──────────┘                        │
└─────────────────────────┼───────────────────────────────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
     ┌──────v──────┐ ┌───v────┐ ┌──────v──────┐
     │ Prometheus  │ │ Tempo  │ │    Loki     │
     │ (Metrics)   │ │(Traces)│ │   (Logs)    │
     └──────┬──────┘ └───┬────┘ └──────┬──────┘
            │             │             │
            └─────────────┼─────────────┘
                          │
                   ┌──────v──────┐
                   │   Grafana   │
                   │ (Dashboards)│
                   └──────┬──────┘
                          │
                   ┌──────v──────┐
                   │ AlertManager│
                   │  (Alerts)   │
                   └─────────────┘
```

## Metrics

### Standard Metrics

Every AINEFF system exposes these standard metrics on port 9090 at `/metrics`:

```
# System health
aineff_system_up{system_id="aineff-orf"} 1
aineff_system_heartbeat_timestamp{system_id="aineff-orf"} 1709312400
aineff_system_uptime_seconds{system_id="aineff-orf"} 86400

# Request metrics
aineff_requests_total{system_id="aineff-orf", method="evaluate", status="success"} 12847
aineff_requests_total{system_id="aineff-orf", method="evaluate", status="denied"} 234
aineff_requests_total{system_id="aineff-orf", method="evaluate", status="error"} 12
aineff_request_duration_seconds{system_id="aineff-orf", method="evaluate", quantile="0.5"} 0.023
aineff_request_duration_seconds{system_id="aineff-orf", method="evaluate", quantile="0.99"} 0.145

# Event metrics
aineff_events_emitted_total{system_id="aineff-orf", event_type="obligation.created"} 5432
aineff_events_consumed_total{system_id="aineff-orf", event_type="aine-runtime.agent.action"} 8901
```

### ORF-Specific Metrics

```
# Obligation metrics
aineff_orf_obligations_active 234
aineff_orf_obligations_created_total 12847
aineff_orf_obligations_finalized_total 11923
aineff_orf_obligations_violated_total 34

# Constraint evaluation
aineff_orf_constraint_evaluations_total{result="permitted"} 45231
aineff_orf_constraint_evaluations_total{result="denied"} 1234
aineff_orf_constraint_evaluation_duration_seconds{quantile="0.5"} 0.012
aineff_orf_constraint_evaluation_duration_seconds{quantile="0.99"} 0.089

# PEP metrics
aineff_orf_pep_requests_total{action="allow"} 89012
aineff_orf_pep_requests_total{action="deny"} 456
```

### AINE Runtime Metrics

```
# Pod metrics
aineff_aine_agent_pods_active{aine_id="enterprise-abc"} 14
aineff_aine_agent_pods_healthy{aine_id="enterprise-abc"} 13
aineff_aine_venture_cells_active{aine_id="enterprise-abc"} 4

# Health scores
aineff_aine_health_score{aine_id="enterprise-abc"} 96
aineff_aine_decay_score{aine_id="enterprise-abc"} 8

# Revenue
aineff_aine_revenue_mtd_usd{aine_id="enterprise-abc"} 47200

# Authority
aineff_aine_authority_evaluations_total{result="granted"} 3421
aineff_aine_authority_evaluations_total{result="denied"} 89
aineff_aine_authority_escalations_total 23
```

### Agent Metrics

```
# Per-agent metrics
aineff_agent_tasks_completed_total{agent_id="agent-01", agent_type="jarvis-ceo"} 1247
aineff_agent_tasks_failed_total{agent_id="agent-01"} 12
aineff_agent_task_duration_seconds{agent_id="agent-01", quantile="0.5"} 2.3
aineff_agent_inference_tokens_total{agent_id="agent-01", direction="input"} 4521000
aineff_agent_inference_tokens_total{agent_id="agent-01", direction="output"} 1890000
aineff_agent_inference_cost_usd_total{agent_id="agent-01"} 23.45
aineff_agent_health_score{agent_id="agent-01"} 98
```

### Venture Cell Metrics

```
# Per-cell metrics
aineff_cell_revenue_usd{cell_id="vc-0042"} 12100
aineff_cell_revenue_target_usd{cell_id="vc-0042"} 10000
aineff_cell_target_achievement{cell_id="vc-0042"} 1.21
aineff_cell_agents_active{cell_id="vc-0042"} 4
aineff_cell_kpi_met{cell_id="vc-0042", kpi="invoices-processed"} 1
aineff_cell_kpi_met{cell_id="vc-0042", kpi="accuracy-rate"} 1
```

## Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # Platform services
  - job_name: 'aineff-platform'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['aineff-platform']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: (.+)
        replacement: ${1}:9090

  # AINE instances (dynamic discovery)
  - job_name: 'aine-instances'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: []  # All namespaces
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace]
        action: keep
        regex: aine-.*
      - source_labels: [__meta_kubernetes_pod_label_aineff_io_component]
        action: keep
        regex: (aine-runtime|agent-pod|pep-gateway)

  # Applications
  - job_name: 'aineff-apps'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['aineff-apps']
```

## Distributed Tracing

### Trace Instrumentation

Every AINEFF service uses OpenTelemetry for distributed tracing:

```typescript
import { trace, SpanKind, context } from '@opentelemetry/api';

const tracer = trace.getTracer('aineff-orf', '1.0.0');

async function evaluateConstraint(request: ConstraintRequest): Promise<ConstraintResult> {
  return tracer.startActiveSpan('orf.evaluateConstraint', {
    kind: SpanKind.SERVER,
    attributes: {
      'aineff.system_id': 'aineff-orf',
      'aineff.actor_id': request.actorId,
      'aineff.action': request.action,
      'aineff.authority_required': request.requiredLevel,
    },
  }, async (span) => {
    try {
      // Load authority matrix
      const authority = await tracer.startActiveSpan('orf.loadAuthority', async (childSpan) => {
        const result = await authorityService.getLevel(request.actorId);
        childSpan.setAttribute('aineff.authority_level', result.level);
        childSpan.end();
        return result;
      });

      // Evaluate constraint
      const result = evaluateAgainstConstraints(request, authority);

      span.setAttribute('aineff.result', result.permitted ? 'permitted' : 'denied');
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Trace Flow Example

```
[Operator Dashboard] POST /api/approve-action
    └── [AINE Runtime] evaluateAuthority
        ├── [ORF Protocol] evaluateConstraint (23ms)
        │   ├── loadAuthority (5ms)
        │   └── evaluateRules (12ms)
        ├── [Audit Logger] logDecision (3ms)
        └── [Agent Runtime] executeApprovedAction
            ├── [Model Router] routeInference (245ms)
            │   └── [Anthropic API] inference (238ms)
            └── [Agent Memory] storeResult (8ms)
```

## Log Aggregation

### Structured Logging

All AINEFF systems use structured JSON logging:

```typescript
// Standard log format
interface AINEFFLog {
  timestamp: string;           // ISO 8601
  level: 'debug' | 'info' | 'warn' | 'error';
  system_id: string;
  aine_id?: string;
  agent_id?: string;
  trace_id?: string;
  span_id?: string;
  message: string;
  context: Record<string, unknown>;
}

// Example log entry
{
  "timestamp": "2026-03-01T09:14:23.456Z",
  "level": "info",
  "system_id": "aineff-orf",
  "aine_id": "enterprise-abc",
  "trace_id": "abc123def456",
  "message": "Constraint evaluation completed",
  "context": {
    "actor_id": "agent-01",
    "action": "approve-expenditure",
    "result": "permitted",
    "duration_ms": 23
  }
}
```

### Loki Configuration

```yaml
# Loki pipeline stages for AINEFF logs
pipeline_stages:
  - json:
      expressions:
        level: level
        system_id: system_id
        aine_id: aine_id
        agent_id: agent_id
        trace_id: trace_id
  - labels:
      level:
      system_id:
      aine_id:
  - timestamp:
      source: timestamp
      format: RFC3339Nano
```

## Alerting

### Alert Rules

```yaml
# Prometheus alert rules
groups:
  - name: aineff-platform
    rules:
      - alert: ORFDown
        expr: aineff_system_up{system_id="aineff-orf"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "ORF Protocol is down"
          description: "ORF Protocol has been unreachable for 1 minute. All ORF-governed actions are halted."

      - alert: ORFHighDenialRate
        expr: rate(aineff_orf_constraint_evaluations_total{result="denied"}[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High ORF denial rate"
          description: "More than 10 constraint denials per second sustained for 5 minutes."

      - alert: AINEDecayDetected
        expr: aineff_aine_decay_score > 30
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "AINE decay detected for {{ $labels.aine_id }}"
          description: "AINE {{ $labels.aine_id }} decay score is {{ $value }}/100."

      - alert: AINECriticalDecay
        expr: aineff_aine_decay_score > 70
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Critical AINE decay for {{ $labels.aine_id }}"

      - alert: VentureCellUnderperforming
        expr: aineff_cell_target_achievement < 0.5
        for: 24h
        labels:
          severity: warning
        annotations:
          summary: "Venture cell {{ $labels.cell_id }} below 50% of revenue target"

      - alert: AgentHighErrorRate
        expr: rate(aineff_agent_tasks_failed_total[15m]) / rate(aineff_agent_tasks_completed_total[15m]) > 0.1
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Agent {{ $labels.agent_id }} error rate above 10%"

      - alert: HighInferenceCost
        expr: increase(aineff_agent_inference_cost_usd_total[1h]) > 100
        for: 0m
        labels:
          severity: info
        annotations:
          summary: "Agent {{ $labels.agent_id }} spent >$100 on inference in the last hour"
```

### Alert Routing

```yaml
# AlertManager configuration
route:
  receiver: 'default'
  group_by: ['alertname', 'aine_id']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      repeat_interval: 15m
    - match:
        severity: warning
      receiver: 'slack-warnings'
    - match:
        severity: info
      receiver: 'email-daily-digest'

receivers:
  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '<pagerduty-key>'
  - name: 'slack-warnings'
    slack_configs:
      - api_url: '<slack-webhook>'
        channel: '#aineff-alerts'
  - name: 'email-daily-digest'
    email_configs:
      - to: 'ops@frankmax.digital'
```

## Grafana Dashboards

### Dashboard List

| Dashboard | Description | Audience |
|-----------|-------------|----------|
| **Platform Overview** | ORF, AINEG, WGE health and throughput | Platform engineers |
| **AINE Instance** | Per-AINE health, agents, cells, revenue | Operators (Level 2+) |
| **Agent Fleet** | All agents across all AINEs | Platform engineers |
| **Venture Cell Performance** | Revenue vs. target, KPI tracking | Managers (Level 3+) |
| **Portfolio** | AINEG portfolio-level view | Directors (Level 4+) |
| **Risk** | RiskOps pipeline, risk scores, alerts | Security, compliance |
| **Cost** | AI inference costs, resource consumption | Finance, operations |
| **Governance** | ORF evaluations, denials, violations | Compliance |

### AINE Instance Dashboard Panels

```
┌──────────────────────────────────────────────────┐
│ AINE: enterprise-abc                              │
├──────────────────────────────────────────────────┤
│ Health: 96 │ Decay: 8 │ Agents: 14 │ Cells: 4   │
├──────────────────────────────────────────────────┤
│                                                  │
│  Agent Health Over Time          CPU/Memory      │
│  ┌─────────────────────┐  ┌──────────────────┐  │
│  │ 100 ___________     │  │  CPU:  52%       │  │
│  │  90 │           │   │  │  Mem:  64%       │  │
│  │  80 │           │   │  │  Net:  28%       │  │
│  │     0h   12h   24h  │  │  Disk: 41%       │  │
│  └─────────────────────┘  └──────────────────┘  │
│                                                  │
│  ORF Evaluations/min    Revenue Trend (30d)      │
│  ┌─────────────────────┐  ┌──────────────────┐  │
│  │  Permitted: 847     │  │  $47.2K MTD      │  │
│  │  Denied:    12      │  │  Target: $48K    │  │
│  │  Avg: 23ms          │  │  +12% MoM        │  │
│  └─────────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────┘
```

## OpenTelemetry Collector

```yaml
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    send_batch_size: 1000
    timeout: 10s
  memory_limiter:
    check_interval: 1s
    limit_mib: 512

exporters:
  prometheus:
    endpoint: 0.0.0.0:8889
  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true
  loki:
    endpoint: http://loki:3100/loki/api/v1/push

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [prometheus]
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp/tempo]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [loki]
```
