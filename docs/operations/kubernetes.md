---
sidebar_position: 2
title: "Kubernetes Architecture"
description: "AINEFF Kubernetes architecture --- namespaces per AINE, NetworkPolicies for PEP enforcement, RBAC for authority matrix, and CronJobs for decay detection."
---

# Kubernetes Architecture

AINEFF maps directly onto Kubernetes primitives. Each AINE instance gets its own namespace. ORF Policy Enforcement Points (PEPs) are implemented as NetworkPolicies and sidecar proxies. The authority matrix maps to RBAC roles. Decay detection runs as CronJobs. This document details how AINEFF concepts translate to Kubernetes resources.

## Namespace Strategy

### Namespace Layout

```
Cluster
├── aineff-platform          — Shared platform services (ORF, AINEG, WGE)
├── aineff-apps              — Web applications (Chokepoint, DocuFlow, etc.)
├── aineff-data              — Shared data stores (MongoDB, PostgreSQL, Redis)
├── aineff-monitoring        — Observability stack (Prometheus, Grafana, Loki)
├── aine-enterprise-abc      — AINE instance for Enterprise ABC
├── aine-enterprise-def      — AINE instance for Enterprise DEF
├── aine-enterprise-ghi      — AINE instance for Enterprise GHI
└── ... (one namespace per AINE)
```

### Namespace Template

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aine-{{ .Values.aine.enterpriseId }}
  labels:
    # AINEFF identification
    aineff.io/component: aine-runtime
    aineff.io/aine-id: "{{ .Values.aine.enterpriseId }}"
    aineff.io/enterprise-name: "{{ .Values.aine.enterpriseName }}"
    aineff.io/tier: "{{ .Values.aine.tier }}"

    # Governance
    aineff.io/orf-enabled: "true"
    aineff.io/pep-enforced: "true"
    aineff.io/audit-enabled: "true"

    # Kubernetes policies
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### Namespace Isolation

Each AINE namespace is fully isolated:

```yaml
# ResourceQuota per AINE namespace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: aine-resource-quota
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  hard:
    pods: "{{ .Values.aine.maxAgentPods | add 10 }}"  # Agent pods + system pods
    requests.cpu: "{{ .Values.aine.resources.totalCpu }}"
    requests.memory: "{{ .Values.aine.resources.totalMemory }}"
    limits.cpu: "{{ .Values.aine.resources.maxCpu }}"
    limits.memory: "{{ .Values.aine.resources.maxMemory }}"
    persistentvolumeclaims: "20"
    services: "20"

---
# LimitRange for default pod resources
apiVersion: v1
kind: LimitRange
metadata:
  name: aine-limit-range
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  limits:
    - default:
        cpu: 500m
        memory: 512Mi
      defaultRequest:
        cpu: 100m
        memory: 128Mi
      type: Container
```

## NetworkPolicies for PEP

### Default Deny All

Every AINE namespace starts with deny-all:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
```

### Allow PEP Communication Only

All inter-pod traffic must pass through PEP:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-pep-traffic
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  podSelector:
    matchLabels:
      aineff.io/pep: "true"
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector: {}        # Any pod in this namespace can reach PEP
  egress:
    - to:
        - podSelector: {}        # PEP can reach any pod in this namespace
    - to:
        - namespaceSelector:
            matchLabels:
              aineff.io/component: aineff-platform
      ports:
        - port: 8080             # ORF Protocol endpoint
          protocol: TCP

---
# Agent pods can ONLY communicate through PEP
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: agent-pod-egress
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  podSelector:
    matchLabels:
      aineff.io/component: agent-pod
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              aineff.io/pep: "true"
      ports:
        - port: 8443
          protocol: TCP
```

### Cross-Namespace Communication

AINE namespaces communicate with platform services:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-platform-access
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  podSelector:
    matchLabels:
      aineff.io/component: aine-runtime
  policyTypes:
    - Egress
  egress:
    # Allow access to platform namespace (ORF, AINEG, WGE)
    - to:
        - namespaceSelector:
            matchLabels:
              aineff.io/component: aineff-platform
    # Allow access to data namespace (databases)
    - to:
        - namespaceSelector:
            matchLabels:
              aineff.io/component: aineff-data
    # Allow access to monitoring namespace (telemetry)
    - to:
        - namespaceSelector:
            matchLabels:
              aineff.io/component: aineff-monitoring
    # Allow DNS
    - to:
        - namespaceSelector: {}
      ports:
        - port: 53
          protocol: UDP
        - port: 53
          protocol: TCP
```

## RBAC for Authority Matrix

### Role Hierarchy

The AINEFF authority matrix maps to Kubernetes RBAC:

```yaml
# Level 1: Observer — read-only access
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: aine-observer
  namespace: aine-{{ .Values.aine.enterpriseId }}
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "events"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]

---
# Level 2: Operator — manage agent pods
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: aine-operator
  namespace: aine-{{ .Values.aine.enterpriseId }}
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "events", "configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["delete"]          # Can restart pods
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments/scale"]
    verbs: ["update"]          # Can scale agent deployments

---
# Level 3: Manager — create venture cells, configure authority
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: aine-manager
  namespace: aine-{{ .Values.aine.enterpriseId }}
rules:
  - apiGroups: [""]
    resources: ["*"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods", "services", "configmaps", "secrets"]
    verbs: ["create", "update", "delete"]
  - apiGroups: ["apps"]
    resources: ["deployments", "statefulsets"]
    verbs: ["create", "update", "delete"]
  - apiGroups: ["batch"]
    resources: ["jobs", "cronjobs"]
    verbs: ["create", "update", "delete"]

---
# Level 4: Director — cross-namespace access
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aine-director
rules:
  - apiGroups: [""]
    resources: ["namespaces"]
    verbs: ["get", "list"]
    resourceNames: []          # Scoped to aine-* namespaces via binding
  - apiGroups: [""]
    resources: ["pods", "services", "events"]
    verbs: ["get", "list", "watch"]

---
# Level 5: Architect — full cluster authority
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aine-architect
rules:
  - apiGroups: ["*"]
    resources: ["*"]
    verbs: ["*"]              # Full access (production: use with caution)
```

### Role Bindings

```yaml
# Bind operator to AINE namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: operator-jane-doe
  namespace: aine-enterprise-abc
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: aine-operator
subjects:
  - kind: User
    name: jane.doe@enterprise-abc.com
    apiGroup: rbac.authorization.k8s.io
```

## CronJobs for Decay Detection

### AINE Health Check

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: aine-health-check
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  schedule: "*/5 * * * *"    # Every 5 minutes
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: health-checker
              image: aineff/health-checker:latest
              env:
                - name: AINE_ID
                  value: "{{ .Values.aine.enterpriseId }}"
                - name: THRESHOLD_DECAY_SCORE
                  value: "70"
                - name: ALERT_ENDPOINT
                  value: "http://riskops.aineff-platform:8080/api/signals"
          restartPolicy: Never
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 5
  failedJobsHistoryLimit: 3
```

### Authority Matrix Decay

Detects stale or expired authority grants:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: authority-decay-check
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  schedule: "0 */6 * * *"   # Every 6 hours
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: authority-decay
              image: aineff/authority-decay-checker:latest
              env:
                - name: AINE_ID
                  value: "{{ .Values.aine.enterpriseId }}"
                - name: EXPIRY_WARNING_DAYS
                  value: "30"
                - name: CERTIFICATION_CHECK_ENABLED
                  value: "true"
          restartPolicy: Never
```

### Venture Cell Revenue Check

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: cell-revenue-check
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  schedule: "0 0 * * *"     # Daily at midnight
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: revenue-checker
              image: aineff/cell-revenue-checker:latest
              env:
                - name: AINE_ID
                  value: "{{ .Values.aine.enterpriseId }}"
                - name: AUTO_TERMINATE_THRESHOLD
                  value: "0.3"   # Terminate cells below 30% target
                - name: REVIEW_THRESHOLD
                  value: "0.8"   # Flag cells below 80% target for review
          restartPolicy: Never
```

### ORF Obligation Cleanup

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: orf-obligation-cleanup
  namespace: aineff-platform
spec:
  schedule: "0 2 * * *"     # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: obligation-cleanup
              image: aineff/orf-cleanup:latest
              env:
                - name: FINALIZED_RETENTION_DAYS
                  value: "2555"   # 7 years
                - name: ARCHIVE_ENABLED
                  value: "true"
          restartPolicy: Never
```

## Pod Templates

### Agent Pod Template

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: agent-{{ .agentId }}
  namespace: aine-{{ .aineId }}
  labels:
    aineff.io/component: agent-pod
    aineff.io/agent-id: "{{ .agentId }}"
    aineff.io/agent-type: "{{ .agentType }}"
    aineff.io/venture-cell: "{{ .ventureCellId }}"
    aineff.io/aine-id: "{{ .aineId }}"
    aineff.io/pep: "false"
  annotations:
    aineff.io/authority-level: "{{ .authorityLevel }}"
    aineff.io/skills: "{{ .skills | join ',' }}"
spec:
  serviceAccountName: agent-sa
  containers:
    - name: agent
      image: aineff/agent-runtime:latest
      ports:
        - containerPort: 8080
          name: api
        - containerPort: 9090
          name: metrics
      env:
        - name: AGENT_ID
          value: "{{ .agentId }}"
        - name: AGENT_TYPE
          value: "{{ .agentType }}"
        - name: VENTURE_CELL_ID
          value: "{{ .ventureCellId }}"
        - name: MODEL_PROVIDER
          valueFrom:
            secretKeyRef:
              name: ai-provider-config
              key: provider
        - name: MODEL_ID
          value: "{{ .modelId }}"
      resources:
        requests:
          cpu: "{{ .resources.cpuRequest }}"
          memory: "{{ .resources.memoryRequest }}"
        limits:
          cpu: "{{ .resources.cpuLimit }}"
          memory: "{{ .resources.memoryLimit }}"
    - name: pep-sidecar
      image: aineff/pep-sidecar:latest
      ports:
        - containerPort: 8443
          name: pep
      env:
        - name: ORF_ENDPOINT
          value: "http://orf-protocol.aineff-platform:8080"
        - name: AGENT_ID
          value: "{{ .agentId }}"
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
```

## Service Mesh Considerations

For production deployments with many AINE instances, consider adding a service mesh:

```yaml
# Istio sidecar injection for AINE namespaces
apiVersion: v1
kind: Namespace
metadata:
  name: aine-enterprise-abc
  labels:
    istio-injection: enabled
```

The PEP sidecar can be replaced with Istio's Envoy proxy configured with custom ORF filters, providing:

- Mutual TLS between all pods
- Traffic management and circuit breaking
- Distributed tracing integration
- ORF constraint evaluation at the mesh level

## Scaling

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: aine-runtime-hpa
  namespace: aine-{{ .Values.aine.enterpriseId }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: aine-runtime
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```
