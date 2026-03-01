---
sidebar_label: "Runbook: K8s Operations"
sidebar_position: 11
---

# Runbook: Kubernetes Operations for AINEFF

**Version:** v1.0.0 | **Date:** 2026-03-01 | **Runbook ID:** RB-K8S-001

## Summary

This runbook provides hands-on operational procedures for managing the Kubernetes infrastructure that underlies AINEFF. It is intended for Platform Engineers and SREs who manage the physical infrastructure, not for AINE Operators who manage individual AINEs via the operator dashboard.

## Audience

| Role | Access Level | Use Cases |
|------|-------------|-----------|
| Platform Engineer | Cluster admin | All procedures in this runbook |
| SRE | Cluster admin | Incident response, debugging, recovery |
| AINE Operator (Level 2) | Namespace admin | Limited: agent pod restart, log viewing |

## Prerequisites

- `kubectl` configured with cluster admin credentials
- Access to the AINEFF cluster (or clusters in multi-cluster setup)
- Familiarity with Kubernetes concepts (namespaces, deployments, RBAC, etc.)
- Access to monitoring dashboards (Prometheus/Grafana or equivalent)

## Common Operational Tasks

### 1. Scaling Agent Pods

#### Manual Scaling

Scale a specific agent deployment within an AINE namespace:

```bash
# View current replica count
kubectl get deployment -n aine-a1b2c3d4

# Scale up operations agent to 3 replicas
kubectl scale deployment operations-v2 -n aine-a1b2c3d4 --replicas=3

# Scale down finance agent to 1 replica
kubectl scale deployment finance-v2 -n aine-a1b2c3d4 --replicas=1

# Verify scaling
kubectl get pods -n aine-a1b2c3d4 -l agent=operations-v2
```

#### Horizontal Pod Autoscaler (HPA)

Configure auto-scaling for an agent:

```yaml
# hpa-operations-v2.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: operations-v2-hpa
  namespace: aine-a1b2c3d4
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: operations-v2
  minReplicas: 1
  maxReplicas: 5
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
          averageUtilization: 75
```

```bash
# Apply HPA
kubectl apply -f hpa-operations-v2.yaml

# View HPA status
kubectl get hpa -n aine-a1b2c3d4

# Describe HPA for detailed metrics
kubectl describe hpa operations-v2-hpa -n aine-a1b2c3d4
```

### 2. Rotating Secrets and Certificates

#### Rotating Agent API Keys

```bash
# List current secrets in AINE namespace
kubectl get secrets -n aine-a1b2c3d4

# Create new secret with rotated key
kubectl create secret generic agent-api-keys \
  -n aine-a1b2c3d4 \
  --from-literal=api-key="$(openssl rand -hex 32)" \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart agent pods to pick up new secrets (rolling restart)
kubectl rollout restart deployment operations-v2 -n aine-a1b2c3d4
kubectl rollout restart deployment finance-v2 -n aine-a1b2c3d4

# Verify rollout completed
kubectl rollout status deployment operations-v2 -n aine-a1b2c3d4
```

#### Rotating TLS Certificates

```bash
# Check certificate expiry
kubectl get secret tls-cert -n aine-a1b2c3d4 -o jsonpath='{.data.tls\.crt}' \
  | base64 -d | openssl x509 -noout -enddate

# If expiring soon, generate new cert (using cert-manager)
kubectl delete certificate aine-a1b2c3d4-tls -n aine-a1b2c3d4
# cert-manager will automatically provision a new certificate

# Or manually replace TLS secret
kubectl create secret tls tls-cert \
  -n aine-a1b2c3d4 \
  --cert=new-cert.pem \
  --key=new-key.pem \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart pods that mount the TLS secret
kubectl rollout restart deployment -n aine-a1b2c3d4
```

### 3. Debugging Failed AINE Births

When an AINE birth fails (EMS deployment step), use this debugging procedure:

```bash
# Step 1: Check if namespace was created
kubectl get namespace aine-a1b2c3d4

# Step 2: Check events in the namespace
kubectl get events -n aine-a1b2c3d4 --sort-by='.lastTimestamp'

# Step 3: Check pod status
kubectl get pods -n aine-a1b2c3d4

# Step 4: Check for pods in error states
kubectl get pods -n aine-a1b2c3d4 --field-selector=status.phase!=Running

# Step 5: Describe a failing pod for details
kubectl describe pod <pod-name> -n aine-a1b2c3d4

# Step 6: Check pod logs
kubectl logs <pod-name> -n aine-a1b2c3d4
kubectl logs <pod-name> -n aine-a1b2c3d4 --previous  # if pod restarted

# Step 7: Check resource quotas
kubectl describe resourcequota -n aine-a1b2c3d4

# Step 8: Check if PVCs are bound
kubectl get pvc -n aine-a1b2c3d4

# Step 9: Check network policies
kubectl get networkpolicy -n aine-a1b2c3d4
```

**Common Birth Failure Causes:**

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Pods stuck in `Pending` | Insufficient resources | Add nodes or free resources |
| Pods in `ImagePullBackOff` | Image not found or auth issue | Verify image tag and pull secret |
| Pods in `CrashLoopBackOff` | Application error | Check logs for startup failure |
| PVCs stuck in `Pending` | No available PV or StorageClass | Provision storage or fix StorageClass |
| Network policy blocking | Misconfigured network policy | Review and fix network policy rules |

### 4. Investigating Authority Decay Issues

When authority decay appears to malfunction:

```bash
# Check ADS CronJob status
kubectl get cronjob authority-decay-check -n aineff-system
kubectl get jobs -n aineff-system --sort-by='.status.startTime' | head -10

# Check the most recent ADS job
kubectl logs job/authority-decay-check-<timestamp> -n aineff-system

# Verify RAMS is responding
kubectl get pods -n aineff-system -l app=rams
kubectl logs -l app=rams -n aineff-system --tail=50

# Check authority records directly (if RAMS exposes an API)
kubectl exec -it deploy/rams -n aineff-system -- \
  curl -s localhost:8080/api/v1/aine/aine-a1b2c3d4/authorities

# Verify RBAC matches expected authority
kubectl get rolebinding -n aine-a1b2c3d4
kubectl get role -n aine-a1b2c3d4
```

**Common Authority Decay Issues:**

| Issue | Symptom | Fix |
|-------|---------|-----|
| CronJob not running | No recent jobs | Check CronJob schedule and suspension status |
| RAMS API timeout | Decay check job fails | Restart RAMS pods, check resource limits |
| RBAC out of sync | Agent has wrong permissions | Manually trigger RAMS RBAC reconciliation |
| Clock skew | Incorrect decay calculations | Verify NTP sync across nodes |

### 5. Recovering from Namespace Corruption

If an AINE namespace enters a corrupted state (orphaned resources, stuck finalizers):

```bash
# Step 1: Identify orphaned resources
kubectl api-resources --verbs=list --namespaced -o name \
  | while read resource; do
      kubectl get "$resource" -n aine-a1b2c3d4 2>/dev/null
    done

# Step 2: Check for resources stuck in Terminating
kubectl get all -n aine-a1b2c3d4 | grep Terminating

# Step 3: Remove stuck finalizers (CAUTION: data loss possible)
# Only use if you've confirmed the resource should be deleted
kubectl patch <resource-type>/<resource-name> -n aine-a1b2c3d4 \
  -p '{"metadata":{"finalizers":null}}' --type=merge

# Step 4: If namespace itself is stuck in Terminating
kubectl get namespace aine-a1b2c3d4 -o json | \
  jq '.spec.finalizers = []' | \
  kubectl replace --raw "/api/v1/namespaces/aine-a1b2c3d4/finalize" -f -

# Step 5: Verify cleanup
kubectl get all -n aine-a1b2c3d4
```

**WARNING:** Removing finalizers bypasses cleanup logic. Only do this after confirming that the finalized resources have been properly archived (per AINE Death SOP).

### 6. Performing GAAGR Registry Maintenance

The GAAGR (Global AINE Agent Governance Registry) tracks all AINEs across the cluster:

```bash
# Check GAAGR pod health
kubectl get pods -n aineff-system -l app=gaagr

# View GAAGR logs for errors
kubectl logs -l app=gaagr -n aineff-system --tail=100

# List all registered AINEs (via GAAGR API)
kubectl exec -it deploy/gaagr -n aineff-system -- \
  curl -s localhost:8080/api/v1/aines | jq '.[] | {id, state, created}'

# Find AINEs in inconsistent state
# (GAAGR says OPERATING but namespace doesn't exist)
kubectl exec -it deploy/gaagr -n aineff-system -- \
  curl -s localhost:8080/api/v1/aines?state=OPERATING | jq -r '.[].id' | \
  while read aine_id; do
    kubectl get namespace "$aine_id" 2>/dev/null || echo "ORPHANED: $aine_id"
  done

# Manually update GAAGR state (emergency only)
kubectl exec -it deploy/gaagr -n aineff-system -- \
  curl -s -X PATCH localhost:8080/api/v1/aines/aine-a1b2c3d4 \
  -H "Content-Type: application/json" \
  -d '{"state": "DEAD", "reason": "Manual correction — namespace deleted"}'
```

### 7. Backup and Restore Procedures for Audit Data

#### Backup ACTS Audit Data

```bash
# Identify ACTS storage (typically a PVC-backed database)
kubectl get pvc -n aineff-system -l app=acts

# Create a backup job
kubectl apply -f - <<'EOF'
apiVersion: batch/v1
kind: Job
metadata:
  name: acts-backup-20260301
  namespace: aineff-system
spec:
  template:
    spec:
      containers:
      - name: backup
        image: aineff/acts-backup:latest
        env:
        - name: BACKUP_TARGET
          value: "s3://aineff-backups/acts/2026-03-01"
        - name: ACTS_DB_URL
          valueFrom:
            secretKeyRef:
              name: acts-db-credentials
              key: url
        volumeMounts:
        - name: acts-data
          mountPath: /data
          readOnly: true
      volumes:
      - name: acts-data
        persistentVolumeClaim:
          claimName: acts-data-pvc
      restartPolicy: Never
  backoffLimit: 3
EOF

# Monitor backup progress
kubectl logs job/acts-backup-20260301 -n aineff-system -f

# Verify backup
kubectl exec -it deploy/acts -n aineff-system -- \
  curl -s localhost:8080/api/v1/backups/latest | jq .
```

#### Restore ACTS Audit Data

```bash
# Create a restore job
kubectl apply -f - <<'EOF'
apiVersion: batch/v1
kind: Job
metadata:
  name: acts-restore-20260301
  namespace: aineff-system
spec:
  template:
    spec:
      containers:
      - name: restore
        image: aineff/acts-backup:latest
        command: ["restore"]
        env:
        - name: RESTORE_SOURCE
          value: "s3://aineff-backups/acts/2026-03-01"
        - name: ACTS_DB_URL
          valueFrom:
            secretKeyRef:
              name: acts-db-credentials
              key: url
        volumeMounts:
        - name: acts-data
          mountPath: /data
      volumes:
      - name: acts-data
        persistentVolumeClaim:
          claimName: acts-data-pvc
      restartPolicy: Never
  backoffLimit: 1
EOF

# IMPORTANT: Scale down ACTS before restore to prevent data conflicts
kubectl scale deployment acts -n aineff-system --replicas=0

# Wait for restore to complete
kubectl wait --for=condition=complete job/acts-restore-20260301 -n aineff-system --timeout=600s

# Scale ACTS back up
kubectl scale deployment acts -n aineff-system --replicas=2

# Verify data integrity
kubectl exec -it deploy/acts -n aineff-system -- \
  curl -s localhost:8080/api/v1/integrity-check | jq .
```

### 8. Network Policy Debugging for PEP Boundaries

PEP (Policy Enforcement Point) boundaries are enforced via Kubernetes NetworkPolicies. When agents cannot communicate as expected:

```bash
# List all network policies in an AINE namespace
kubectl get networkpolicy -n aine-a1b2c3d4

# Describe a specific network policy
kubectl describe networkpolicy pep-boundary -n aine-a1b2c3d4

# Check if a pod can reach another pod
kubectl exec -it <source-pod> -n aine-a1b2c3d4 -- \
  curl -s --connect-timeout 5 http://<target-service>:8080/health

# Check CNI plugin logs (varies by CNI — example for Calico)
kubectl logs -n kube-system -l k8s-app=calico-node --tail=50

# View effective network policy for a specific pod
# (requires Calico or similar CNI with policy audit)
kubectl exec -it -n kube-system <calico-node-pod> -- \
  calico-node -bird -show policy

# Test connectivity between namespaces
# (AINE-to-AINE communication for AINEG cross-sell)
kubectl exec -it <pod> -n aine-a1b2c3d4 -- \
  curl -s --connect-timeout 5 http://<service>.aine-e5f6g7h8.svc.cluster.local:8080/health
```

**Common Network Policy Issues:**

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Agent cannot reach RAMS | Egress policy too restrictive | Add RAMS service to egress allow list |
| Cross-AINE communication blocked | Missing inter-namespace policy | Add NetworkPolicy allowing AINEG traffic |
| Agent cannot reach external API | Egress to external blocked | Add external CIDR to egress policy |
| Incoming webhook fails | Ingress policy missing | Add ingress rule for webhook source |
| DNS resolution fails | DNS egress not allowed | Ensure kube-dns is in egress allow list |

```yaml
# Example: Allow agent-to-RAMS communication
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-rams-egress
  namespace: aine-a1b2c3d4
spec:
  podSelector:
    matchLabels:
      role: agent
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: aineff-system
          podSelector:
            matchLabels:
              app: rams
      ports:
        - protocol: TCP
          port: 8080
    - to:  # Allow DNS
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
```

## Emergency Procedures

### Emergency Cluster-Wide AINE Halt

If a cluster-wide issue requires halting all AINEs:

```bash
# Scale all agent deployments to 0 across all AINE namespaces
kubectl get namespaces -l type=aine -o jsonpath='{.items[*].metadata.name}' | \
  tr ' ' '\n' | while read ns; do
    echo "Halting AINE: $ns"
    kubectl get deployments -n "$ns" -o name | while read deploy; do
      kubectl scale "$deploy" -n "$ns" --replicas=0
    done
  done

# Verify all AINE pods are terminated
kubectl get pods --all-namespaces -l type=aine-agent --field-selector=status.phase=Running
```

**WARNING:** This is a destructive operation. Only use in genuine emergency situations. All in-flight ORF obligations will be interrupted.

### Emergency ACTS Preservation

If cluster storage is at risk, prioritize preserving audit data:

```bash
# Emergency ACTS data export
kubectl exec -it deploy/acts -n aineff-system -- \
  acts-cli export --format=jsonl --output=/tmp/acts-emergency-export.jsonl

# Copy export out of the cluster
kubectl cp aineff-system/acts-pod:/tmp/acts-emergency-export.jsonl \
  ./acts-emergency-export-$(date +%Y%m%d%H%M%S).jsonl
```

## Monitoring Quick Reference

| What to Check | Command |
|--------------|---------|
| All AINE namespaces | `kubectl get ns -l type=aine` |
| Pod health across all AINEs | `kubectl get pods --all-namespaces -l type=aine-agent` |
| Resource usage | `kubectl top pods --all-namespaces -l type=aine-agent` |
| Recent events (cluster-wide) | `kubectl get events --all-namespaces --sort-by='.lastTimestamp' --field-selector type=Warning` |
| CronJob status | `kubectl get cronjobs -n aineff-system` |
| PVC utilization | `kubectl get pvc --all-namespaces -l managed-by=aineff` |
| Node status | `kubectl get nodes -o wide` |
| Node resource pressure | `kubectl describe nodes \| grep -A 5 Conditions` |

## Related Documents

- [SOP: AINE Creation](./sop-aine-creation.md) (EMS deployment step)
- [SOP: AINE Death](./sop-aine-death.md) (MES namespace deletion step)
- [SOP: Incident Response](./sop-incident-response.md) (K8s-level debugging)
- [SOP: Authority Decay](./sop-authority-decay.md) (ADS CronJob)
- [Operations: Kubernetes](/docs/operations/kubernetes)
- [Operations: Monitoring](/docs/operations/monitoring)
- [Architecture: Kubernetes Mapping](/docs/architecture/kubernetes-mapping)
