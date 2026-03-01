---
sidebar_position: 6
title: "Kubernetes Mapping"
description: "How every AINEFF concept maps to Kubernetes primitives: AINE=namespace, agents=pods, PEP=NetworkPolicy, authority=RBAC, decay=CronJobs, death=namespace deletion, birth=Helm release."
---

# Kubernetes Mapping

AINEFF is designed to run natively on Kubernetes. Every AINEFF abstraction has a direct Kubernetes counterpart. This is not an afterthought -- the AINEFF conceptual model was designed so that Kubernetes primitives provide a natural implementation layer.

---

## Concept Mapping Table

```
┌──────────────────────────┬────────────────────────────────────────┐
│  AINEFF Concept           │  Kubernetes Primitive                  │
├──────────────────────────┼────────────────────────────────────────┤
│  AINE (enterprise)        │  Namespace                             │
│  Agent                    │  Pod (managed by Deployment)           │
│  Agent team               │  Multiple Deployments in namespace     │
│  PEP boundary             │  NetworkPolicy (deny-all + allowlist)  │
│  Authority grant (RAMS)   │  RBAC Role + RoleBinding               │
│  Authority decay (ADS)    │  CronJob (periodic authority check)    │
│  Enterprise birth (EMS)   │  Helm release install                  │
│  Enterprise death (MES)   │  Namespace deletion (cascading)        │
│  Resurrection guard (RPS) │  ValidatingWebhookConfiguration       │
│  Genome artifacts         │  ConfigMap + Secret                    │
│  PEP encryption keys      │  Secret (encrypted at rest)            │
│  Service mesh (Layer 1)   │  Istio/Linkerd sidecar injection       │
│  Telemetry                │  ServiceMonitor + PodMonitor           │
│  BPMN engine              │  StatefulSet (workflow state)           │
│  GAAGR registration       │  Custom Resource (AINERegistry)        │
│  Agent scaling             │  HorizontalPodAutoscaler              │
│  Obligation timeout       │  Job with activeDeadlineSeconds        │
└──────────────────────────┴────────────────────────────────────────┘
```

---

## AINE = Namespace

Each AI-Native Enterprise gets its own Kubernetes namespace. This provides:

- **Resource isolation**: CPU/memory quotas per enterprise
- **Network isolation**: NetworkPolicies scope to the namespace
- **RBAC isolation**: Roles and RoleBindings are namespace-scoped
- **Lifecycle management**: Deleting the namespace cascades to all resources
- **Observability**: Metrics and logs are naturally scoped by namespace

### Namespace Specification

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aine-acme-corp
  labels:
    aineff.io/type: aine
    aineff.io/aine-id: acme-corp
    aineff.io/gaagr: aine://acme-corp.us-east.aineff.mesh
    aineff.io/genome-version: "1.2.0"
    aineff.io/state: operating
    aineff.io/birth-timestamp: "2026-03-01T10:00:00Z"
  annotations:
    aineff.io/industry-naics: "332710"
    aineff.io/jurisdiction: "US"
    aineff.io/decay-threshold: "0.10"
    aineff.io/owner: "operator@acme-corp.com"
```

### Resource Quotas

Every AINE namespace has a resource quota derived from the enterprise genome:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: aine-quota
  namespace: aine-acme-corp
spec:
  hard:
    requests.cpu: "8"
    requests.memory: "16Gi"
    limits.cpu: "16"
    limits.memory: "32Gi"
    pods: "50"
    services: "20"
    secrets: "30"
    configmaps: "30"
    persistentvolumeclaims: "10"
```

---

## Agent = Pod

Each AI agent runs as a Pod managed by a Deployment. Agents are stateless by default -- all state is externalized to the PEP-encrypted state store or the BPMN engine.

### Agent Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-quote-calculator
  namespace: aine-acme-corp
  labels:
    aineff.io/type: agent
    aineff.io/agent-id: quote-calculator
    aineff.io/role: estimator
    aineff.io/composed-by: composition-abc123
spec:
  replicas: 2
  selector:
    matchLabels:
      aineff.io/agent-id: quote-calculator
  template:
    metadata:
      labels:
        aineff.io/type: agent
        aineff.io/agent-id: quote-calculator
        aineff.io/role: estimator
      annotations:
        # Istio sidecar injection for Layer 1 mesh
        sidecar.istio.io/inject: "true"
        # Prometheus scraping
        prometheus.io/scrape: "true"
        prometheus.io/port: "9090"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: agent-quote-calculator
      containers:
        - name: agent
          image: ghcr.io/aineff/agent-quote-calculator:v1.2.0
          ports:
            - name: grpc
              containerPort: 50051
            - name: metrics
              containerPort: 9090
          env:
            - name: AINE_ID
              value: "acme-corp"
            - name: AGENT_ID
              value: "quote-calculator"
            - name: GAAGR_ADDRESS
              value: "aine://acme-corp.us-east.aineff.mesh"
            - name: PEP_ENABLED
              value: "true"
            - name: PEP_KEY_SECRET
              valueFrom:
                secretKeyRef:
                  name: pep-keys
                  key: encryption-key
            - name: TELEMETRY_ENDPOINT
              value: "telemetry.aineff-system.svc.cluster.local:4317"
            - name: ORF_ENDPOINT
              value: "orf.aineff-system.svc.cluster.local:50051"
          resources:
            requests:
              cpu: "500m"
              memory: "1Gi"
            limits:
              cpu: "1000m"
              memory: "2Gi"
          livenessProbe:
            grpc:
              port: 50051
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            grpc:
              port: 50051
            initialDelaySeconds: 5
            periodSeconds: 10
      # Anti-affinity: spread agent replicas across nodes
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: aineff.io/agent-id
                      operator: In
                      values:
                        - quote-calculator
                topologyKey: kubernetes.io/hostname
```

### Agent Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: agent-quote-calculator
  namespace: aine-acme-corp
  labels:
    aineff.io/type: agent-service
    aineff.io/agent-id: quote-calculator
spec:
  selector:
    aineff.io/agent-id: quote-calculator
  ports:
    - name: grpc
      port: 50051
      targetPort: 50051
    - name: metrics
      port: 9090
      targetPort: 9090
  type: ClusterIP
```

---

## PEP = NetworkPolicy

The Private Enterprise Protocol (PEP) boundary is enforced at the network level using Kubernetes NetworkPolicies. By default, all traffic to and from an AINE namespace is denied. Explicit allowlist rules permit only authorized communication.

### Default Deny Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pep-default-deny
  namespace: aine-acme-corp
  labels:
    aineff.io/type: pep-boundary
spec:
  podSelector: {}   # Applies to all pods in namespace
  policyTypes:
    - Ingress
    - Egress
  # No ingress or egress rules = deny all
```

### Internal Mesh Allow

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pep-allow-internal
  namespace: aine-acme-corp
  labels:
    aineff.io/type: pep-internal
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    # Allow traffic from pods within the same AINE namespace
    - from:
        - podSelector: {}
  egress:
    # Allow traffic to pods within the same AINE namespace
    - to:
        - podSelector: {}
    # Allow DNS resolution
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
        - podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
```

### AINEFF Control Plane Access

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pep-allow-control-plane
  namespace: aine-acme-corp
  labels:
    aineff.io/type: pep-control-plane
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    # Allow egress to AINEFF control plane services
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: aineff-system
      ports:
        - protocol: TCP
          port: 50051    # gRPC (ORF, Telemetry, GAAGR)
        - protocol: TCP
          port: 4317     # OpenTelemetry collector
```

### External API Egress (Restricted)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pep-allow-external-apis
  namespace: aine-acme-corp
  labels:
    aineff.io/type: pep-external
spec:
  podSelector:
    matchLabels:
      aineff.io/external-access: "true"  # Only labeled pods
  policyTypes:
    - Egress
  egress:
    # Allow HTTPS egress to external APIs
    - to: []   # Any destination
      ports:
        - protocol: TCP
          port: 443
```

:::note PEP Beyond NetworkPolicy
NetworkPolicies enforce Layer 1 (mesh) isolation. The actual PEP encryption (Layer 2) is handled at the application level using the PEP keys stored in Kubernetes Secrets. NetworkPolicy prevents unauthorized network access; PEP encryption prevents unauthorized data access even if network isolation is somehow bypassed.
:::

---

## Authority = RBAC

RAMS authority grants map directly to Kubernetes RBAC resources. Each agent gets a ServiceAccount, a Role defining its permissions, and a RoleBinding connecting them.

### Agent ServiceAccount

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: agent-quote-calculator
  namespace: aine-acme-corp
  labels:
    aineff.io/type: agent-sa
    aineff.io/agent-id: quote-calculator
    aineff.io/authority-level: "65"
    aineff.io/decay-rate: "72h"
```

### Agent Role

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: role-quote-calculator
  namespace: aine-acme-corp
  labels:
    aineff.io/type: agent-role
    aineff.io/agent-id: quote-calculator
rules:
  # Can read ConfigMaps (material data, pricing tables)
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list", "watch"]

  # Can read and write Secrets (quote data, encrypted state)
  - apiGroups: [""]
    resources: ["secrets"]
    resourceNames:
      - quote-data
      - agent-state-quote-calculator
    verbs: ["get", "update", "patch"]

  # Can create ORF obligation records (custom resource)
  - apiGroups: ["aineff.io"]
    resources: ["obligations"]
    verbs: ["create", "get", "list", "update"]

  # Cannot delete anything — no destructive permissions
  # Cannot access other agents' secrets
  # Cannot modify RBAC — only RAMS can
```

### Agent RoleBinding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: binding-quote-calculator
  namespace: aine-acme-corp
  labels:
    aineff.io/type: agent-binding
    aineff.io/agent-id: quote-calculator
    aineff.io/granted-at: "2026-03-01T10:00:00Z"
    aineff.io/expires-at: "2026-03-04T10:00:00Z"
subjects:
  - kind: ServiceAccount
    name: agent-quote-calculator
    namespace: aine-acme-corp
roleRef:
  kind: Role
  name: role-quote-calculator
  apiGroup: rbac.authorization.k8s.io
```

---

## Decay = CronJob

The Authority Decay Service (ADS) runs as a CronJob inside each AINE namespace. It periodically checks authority grants and decays or revokes them based on time elapsed and performance metrics.

### Authority Decay CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: authority-decay-check
  namespace: aine-acme-corp
  labels:
    aineff.io/type: decay-checker
spec:
  schedule: "0 * * * *"   # Every hour
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      activeDeadlineSeconds: 300   # 5 minute timeout
      template:
        spec:
          serviceAccountName: decay-checker
          containers:
            - name: decay-check
              image: ghcr.io/aineff/authority-decay-checker:v1.0.0
              env:
                - name: AINE_ID
                  value: "acme-corp"
                - name: NAMESPACE
                  valueFrom:
                    fieldRef:
                      fieldPath: metadata.namespace
                - name: RAMS_ENDPOINT
                  value: "rams.aineff-system.svc.cluster.local:50051"
                - name: ADS_ENDPOINT
                  value: "ads.aineff-system.svc.cluster.local:50051"
                - name: HOES_ENDPOINT
                  value: "hoes.aineff-system.svc.cluster.local:50051"
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "200m"
                  memory: "256Mi"
          restartPolicy: OnFailure
```

### Decay Checker ServiceAccount (with RBAC modification permissions)

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: decay-checker
  namespace: aine-acme-corp
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: role-decay-checker
  namespace: aine-acme-corp
rules:
  # Can read all RoleBindings to check expiry
  - apiGroups: ["rbac.authorization.k8s.io"]
    resources: ["rolebindings"]
    verbs: ["get", "list", "watch", "delete"]
  # Can read ServiceAccount annotations (authority metadata)
  - apiGroups: [""]
    resources: ["serviceaccounts"]
    verbs: ["get", "list", "patch"]
  # Can emit events for audit trail
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: binding-decay-checker
  namespace: aine-acme-corp
subjects:
  - kind: ServiceAccount
    name: decay-checker
roleRef:
  kind: Role
  name: role-decay-checker
  apiGroup: rbac.authorization.k8s.io
```

### Decay Logic

```
  Every hour:
  ┌──────────────────────────────────────────────────┐
  │  1. List all RoleBindings in namespace            │
  │  2. For each binding:                             │
  │     a. Read aineff.io/expires-at annotation      │
  │     b. If expired:                                │
  │        - Delete the RoleBinding                   │
  │        - Emit AINEFFEvent (governance-decay loop) │
  │        - Notify HOES for human review             │
  │     c. If approaching expiry (<10% remaining):   │
  │        - Emit warning event                       │
  │        - Notify RAMS for potential renewal        │
  │  3. Check aggregate authority level               │
  │     If total authority < decay-threshold:         │
  │        - Emit lifecycle decay event               │
  │        - Notify TDES for death evaluation         │
  └──────────────────────────────────────────────────┘
```

---

## Death = Namespace Deletion

When MES determines that an AINE should die, the death process culminates in namespace deletion, which cascades to all resources within it.

### Death Sequence

```
  MES Death Decision
        │
        ▼
  ┌──────────────────────────────────────────────┐
  │  Phase 1: Drain (graceful)                    │
  │  - Scale all Deployments to 0 replicas       │
  │  - Wait for in-flight requests to complete    │
  │  - Cancel pending CronJob runs               │
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │  Phase 2: Seal (audit)                        │
  │  - Export all audit records to Audit Chain    │
  │  - Generate finality proofs for obligations   │
  │  - Seal PEP encryption keys (last use)       │
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │  Phase 3: Destroy (irreversible)              │
  │  - Delete PEP key Secrets                     │
  │  - Delete namespace (cascading delete)        │
  │  - Revoke TIS certificates                    │
  │  - Tombstone GAAGR address                    │
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │  Phase 4: Guard (prevention)                  │
  │  - RPS installs resurrection webhook         │
  │  - GAAGR marked DEAD permanently             │
  │  - Emit lifecycle.mes.aine-died event        │
  └──────────────────────────────────────────────┘
```

:::info Cascading Delete
When a Kubernetes namespace is deleted, all resources within it are automatically garbage-collected: Deployments, Pods, Services, Secrets, ConfigMaps, CronJobs, RBAC resources -- everything. This is why the AINE=Namespace mapping is so powerful. Death is a single `kubectl delete namespace` command.
:::

---

## Birth = Helm Release

AINE birth is implemented as a Helm chart installation. The AINE Runtime Helm chart packages all the resources needed for an enterprise.

### Helm Chart Structure

```
aineff-aine-runtime/
├── Chart.yaml
├── values.yaml                # Default values
├── templates/
│   ├── _helpers.tpl
│   ├── namespace.yaml         # AINE namespace
│   ├── resource-quota.yaml    # Resource limits
│   ├── pep-networkpolicy.yaml # PEP boundary rules
│   ├── pep-keys-secret.yaml   # PEP encryption keys
│   ├── agent-deployment.yaml  # Template for each agent
│   ├── agent-service.yaml     # Services for agents
│   ├── agent-rbac.yaml        # RBAC per agent
│   ├── agent-hpa.yaml         # Autoscaler per agent
│   ├── bpmn-statefulset.yaml  # BPMN engine
│   ├── decay-cronjob.yaml     # Authority decay checker
│   ├── servicemonitor.yaml    # Prometheus monitoring
│   └── aine-registry-cr.yaml  # GAAGR custom resource
└── charts/                    # Sub-charts (optional)
```

### Sample values.yaml

```yaml
# values.yaml — Generated by GCS from enterprise genome
aine:
  id: acme-corp
  gaagr: "aine://acme-corp.us-east.aineff.mesh"
  genomeVersion: "1.2.0"
  state: operating
  industry:
    naics: "332710"
    sic: "3599"
  jurisdiction: US
  owner: operator@acme-corp.com

resources:
  quota:
    cpu: "16"
    memory: "32Gi"
    pods: 50

pep:
  enabled: true
  # Key material is injected by IGS during birth, not stored in values
  networkPolicy:
    denyAll: true
    allowInternal: true
    allowControlPlane: true
    allowExternalHttps: true
    externalAccessLabels:
      aineff.io/external-access: "true"

agents:
  - id: material-price-agent
    image: ghcr.io/aineff/agent-material-price:v1.0.0
    replicas: 1
    role: estimator
    resources:
      requests:
        cpu: "250m"
        memory: "512Mi"
      limits:
        cpu: "500m"
        memory: "1Gi"
    authority:
      level: 40
      decayHours: 168
    externalAccess: true   # Needs to call supplier APIs

  - id: quote-calculator
    image: ghcr.io/aineff/agent-quote-calculator:v1.2.0
    replicas: 2
    role: estimator
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"
      limits:
        cpu: "1000m"
        memory: "2Gi"
    authority:
      level: 65
      decayHours: 72
    externalAccess: false

  - id: quote-approver
    image: ghcr.io/aineff/agent-quote-approver:v1.1.0
    replicas: 1
    role: estimator
    resources:
      requests:
        cpu: "250m"
        memory: "512Mi"
      limits:
        cpu: "500m"
        memory: "1Gi"
    authority:
      level: 80
      decayHours: 24
    externalAccess: false
    escalation:
      threshold: 10000   # Escalate quotes > $10k
      target: human

bpmn:
  enabled: true
  replicas: 1
  storage:
    size: 10Gi
    storageClass: standard

decay:
  schedule: "0 * * * *"   # Check every hour
  threshold: 0.10          # Initiate death below 10% authority

telemetry:
  enabled: true
  endpoint: telemetry.aineff-system.svc.cluster.local:4317
  samplingRate: 1.0

monitoring:
  serviceMonitor:
    enabled: true
    interval: 30s
```

### Helm Install Command

```bash
# Birth: install the AINE
helm install aine-acme-corp aineff/aine-runtime \
  --namespace aine-acme-corp \
  --create-namespace \
  --values /compiled/acme-corp/values.yaml \
  --set pep.keySecret=pep-keys \
  --wait \
  --timeout 5m

# Verify birth
kubectl get pods -n aine-acme-corp
kubectl get networkpolicies -n aine-acme-corp
kubectl get rolebindings -n aine-acme-corp
```

---

## Resurrection Prevention = ValidatingWebhook

After an AINE dies, RPS installs a ValidatingWebhookConfiguration that prevents recreation of the namespace.

### Resurrection Prevention Webhook

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: rps-resurrection-guard
  labels:
    aineff.io/type: resurrection-guard
webhooks:
  - name: rps.aineff.io
    admissionReviewVersions: ["v1"]
    sideEffects: None
    clientConfig:
      service:
        name: rps
        namespace: aineff-system
        path: /validate-namespace
    rules:
      - operations: ["CREATE"]
        apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["namespaces"]
    failurePolicy: Fail
    # RPS checks if the namespace name matches any tombstoned GAAGR entry
    # If it does, the creation is rejected
```

### RPS Validation Logic

```
  Namespace CREATE request
        │
        ▼
  ┌──────────────────────────────────────────────┐
  │  RPS Webhook Handler                          │
  │                                               │
  │  1. Extract namespace name from request       │
  │  2. Query GAAGR for tombstoned addresses      │
  │     matching this namespace pattern            │
  │  3. If match found:                           │
  │     → DENY with message:                      │
  │       "Namespace matches tombstoned AINE.     │
  │        Resurrection is prohibited.            │
  │        GAAGR address: aine://acme-corp...     │
  │        Death timestamp: 2026-03-01T..."       │
  │  4. If no match:                              │
  │     → ALLOW                                   │
  └──────────────────────────────────────────────┘
```

---

## Custom Resources

AINEFF extends Kubernetes with Custom Resource Definitions (CRDs) to represent AINEFF-specific concepts:

```yaml
# AINE Registry — represents an AINE in the cluster
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: aineregistries.aineff.io
spec:
  group: aineff.io
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                aineId:
                  type: string
                gaagr:
                  type: string
                genomeVersion:
                  type: string
                state:
                  type: string
                  enum:
                    - genome-spec
                    - compiling
                    - evaluating
                    - gated
                    - birthing
                    - operating
                    - decaying
                    - dying
                    - dead
                    - tombstoned
                industry:
                  type: object
                  properties:
                    naics:
                      type: string
                    sic:
                      type: string
            status:
              type: object
              properties:
                authorityLevel:
                  type: number
                agentCount:
                  type: integer
                activeObligations:
                  type: integer
                lastDecayCheck:
                  type: string
                  format: date-time
  scope: Cluster
  names:
    plural: aineregistries
    singular: aineregistry
    kind: AINERegistry
    shortNames:
      - aine
      - aines
```

### Using the CRD

```bash
# List all AINEs in the cluster
kubectl get aines

# Example output:
# NAME         STATE       AUTHORITY   AGENTS   AGE
# acme-corp    operating   0.72        5        14d
# globex       operating   0.91        8        3d
# initech      decaying    0.08        3        45d
# umbrella     dead        0.00        0        90d

# Describe a specific AINE
kubectl describe aine acme-corp
```

:::tip Operator Pattern
The AINEFF control plane systems (EMS, MES, TDES, RPS) act as Kubernetes operators that watch the AINERegistry custom resources and reconcile cluster state. When an AINE's authority drops below the decay threshold, the TDES operator updates the AINERegistry status, which triggers the MES operator to begin the death sequence.
:::
