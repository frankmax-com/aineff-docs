---
sidebar_label: "SOP: AINE Creation"
sidebar_position: 2
---

# SOP: Creating a New AI-Native Enterprise (AINE)

**Version:** v1.0.0 | **Date:** 2026-03-01 | **SOP ID:** SOP-AINE-001

## Summary

This Standard Operating Procedure defines the end-to-end process for creating (birthing) a new AI-Native Enterprise within the AINEFF ecosystem. The procedure covers genome definition, compilation, validation, gate checks, deployment, role assignment, audit activation, and operator training.

## Prerequisites

| Prerequisite | Description | Verified By |
|-------------|-------------|-------------|
| Named Liable Officer (NLO) | A human must be designated as the liable party for this AINE | IGS |
| Payment Confirmation | Deployment tier payment received ($22K Foundation / $30K Full) | IGS |
| Industry Template | A valid industry template exists in GCS template library | GCS |
| Jurisdiction Clearance | Target jurisdiction permits AI-native operations | JAL |
| K8s Cluster Capacity | Sufficient cluster resources for new namespace | EMS |
| Operator Certification | At least one LevelupMax Level 2 certified operator assigned | LevelupMax |

## Roles Involved

| Role | System | Responsibility |
|------|--------|---------------|
| Enterprise Architect | Human | Defines the Enterprise Genome |
| Named Liable Officer | Human / NLO-R | Bears legal liability for AINE actions |
| GCS Compiler | GCS | Validates and compiles the genome |
| Intake Gate | IGS | Performs compliance and payment gate checks |
| Enterprise Manager | EMS | Creates K8s namespace and deploys agents |
| Role Assigner | RAMS | Assigns initial authority matrix |
| Audit Controller | ACTS | Initializes audit trail |
| BPMN Engine | BPMN | Activates operational workflows |
| Training System | LevelupMax | Certifies operators |

## Estimated Time

| Phase | Duration |
|-------|----------|
| Genome Definition | 30-60 minutes |
| GCS Compilation | 2-5 minutes (automated) |
| IGS Gate Check | 5-15 minutes (automated + human review) |
| EMS Deployment | 10-30 minutes |
| RAMS Role Assignment | 2-5 minutes (automated) |
| ACTS Initialization | 1-2 minutes (automated) |
| BPMN Activation | 2-5 minutes (automated) |
| **Total (excluding training)** | **~1-2 hours** |
| Operator Training | 2-3 days (separate SOP) |

## Procedure

### Step 1: Define Enterprise Genome

**Actor:** Enterprise Architect (human)
**System:** GCS (Genome Compilation System)

Define the Enterprise Genome specification including:

- **Industry vertical** (e.g., manufacturing, logistics, healthcare)
- **Jurisdiction** (primary operating jurisdiction + any secondary jurisdictions)
- **Agent team composition** (Jarvis CEO + specialist agents)
- **Governance model** (authority levels, decay rates, human oversight frequency)
- **Revenue targets** (initial projections for WGE venture cells)
- **Risk parameters** (maximum acceptable risk tier, financial exposure limits)

```yaml
# Example Enterprise Genome (simplified)
apiVersion: aineff.io/v1
kind: EnterpriseGenome
metadata:
  name: acme-manufacturing-aine
spec:
  industry: manufacturing
  jurisdiction:
    primary: US-CA
    secondary: [US-TX, US-NY]
  agents:
    ceo: jarvis-ceo-v3
    specialists:
      - operations-agent-v2
      - finance-agent-v2
      - compliance-agent-v1
  governance:
    humanOversightFrequency: daily
    maxAuthorityLevel: 8
    decayRate: 0.02
  risk:
    maxTier: orange
    financialExposureLimit: 500000
```

**Approval Gate:** Enterprise Architect signs off on genome specification.

### Step 2: Submit Genome to GCS for Compilation

**Actor:** Automated (API submission)
**System:** GCS

The genome specification is submitted to the Genome Compilation System. GCS performs:

1. Schema validation against the genome specification format
2. Template matching — selects the appropriate industry template
3. Agent compatibility check — verifies requested agents exist in skill-registry
4. Resource estimation — calculates required K8s resources

**Output:** Compiled genome artifact (immutable, content-addressed hash)

### Step 3: GCS Validates Against Templates, Jurisdiction Rules, and Risk Parameters

**Actor:** GCS (automated)
**Systems:** GCS, JAL (Jurisdiction Awareness Layer), CVSS

Validation checks:

- Template completeness (all required fields populated)
- Jurisdiction rules (JAL verifies legal compliance for target jurisdiction)
- Risk parameter bounds (CVSS confirms risk levels within acceptable range)
- Agent authority ceiling (governance model respects protocol-level maximums)
- Cross-reference with existing AINEs (no namespace collision in GAAGR)

**Decision Point:** If validation fails, return to Step 1 with detailed error report.

### Step 4: IGS Gate Check

**Actor:** IGS (Intake Gate System)
**Systems:** IGS, NLO-R

The Intake Gate System performs the compliance gate:

1. **Liable party verification** — Confirm the Named Liable Officer is bound to this AINE
2. **Payment confirmation** — Verify payment has been received and cleared
3. **Background check** — Run NLO through basic compliance screening
4. **Terms acceptance** — Confirm NLO has accepted AINEFF terms of service
5. **Insurance verification** — If required by jurisdiction, verify liability insurance

**Approval Gate:** IGS issues a signed gate-pass token. This is a human-in-the-loop checkpoint; the NLO must explicitly confirm.

### Step 5: EMS Creates K8s Namespace and Deploys Agents

**Actor:** EMS (Enterprise Management System)
**Systems:** EMS, GAAGR

Upon receiving the signed gate-pass:

1. Create dedicated K8s namespace: `aine-{genome-hash-short}`
2. Apply network policies (PEP boundaries)
3. Deploy agent pods per genome specification
4. Configure service mesh (inter-agent communication)
5. Register the AINE in GAAGR (Global AINE Agent Governance Registry)
6. Set initial state: `PROVISIONING`

```bash
# Example namespace creation (automated by EMS)
kubectl create namespace aine-a1b2c3d4
kubectl apply -f compiled-genome-a1b2c3d4.yaml -n aine-a1b2c3d4
```

### Step 6: RAMS Assigns Initial Authority Matrix

**Actor:** RAMS (Role & Authority Management System)
**Systems:** RAMS, ADS

RAMS configures the authority matrix:

1. Assign authority levels to each agent based on genome spec
2. Set decay rates per the governance model
3. Configure K8s RBAC to enforce authority boundaries
4. Initialize decay timers in ADS (Authority Decay System)
5. Record initial authority grants in ACTS

```
Agent: jarvis-ceo-v3     | Authority: 8 | Decay: 0.02/day | Expiry: 90 days
Agent: operations-v2     | Authority: 6 | Decay: 0.03/day | Expiry: 60 days
Agent: finance-v2        | Authority: 6 | Decay: 0.03/day | Expiry: 60 days
Agent: compliance-v1     | Authority: 5 | Decay: 0.04/day | Expiry: 45 days
```

### Step 7: ACTS Begins Audit Trail

**Actor:** ACTS (Audit & Compliance Tracking System)
**Systems:** ACTS, ECS

The audit trail is initialized:

1. Create audit ledger for the new AINE
2. Record birth event with full genome hash, gate-pass token, and timestamp
3. Enable continuous audit logging for all ORF-wrapped actions
4. Configure retention policy per jurisdiction requirements
5. Link to ECS (Evidence Custody System) for long-term archival

**Audit Event:**
```json
{
  "event": "governance.aine.birth",
  "aineId": "aine-a1b2c3d4",
  "genomeHash": "sha256:abc123...",
  "nloId": "nlo-jane-doe-001",
  "gatePassToken": "igsp-xyz789",
  "timestamp": "2026-03-01T10:30:00Z",
  "state": "PROVISIONING → ACTIVATING"
}
```

### Step 8: BPMN Workflows Activated

**Actor:** BPMN Engine
**Systems:** BPMN, Industry Intelligence

The BPMN system activates operational workflows:

1. Load industry-specific BPMN templates
2. Configure workflow parameters from genome spec
3. Activate health monitoring workflows
4. Activate revenue tracking workflows
5. Activate authority decay monitoring workflows
6. Set AINE state: `ACTIVATING`

### Step 9: Operator Training via LevelupMax

**Actor:** Human Operator
**System:** LevelupMax

Before the AINE can enter full `OPERATING` state, at least one operator must complete certification:

- **Level 1 (Observer):** Required for read-only monitoring access
- **Level 2 (Operator):** Required for action approval and agent management

See [SOP: LevelupMax Certification](./sop-levelupmax-certification.md) for full training details.

**Approval Gate:** LevelupMax issues certification token. AINE cannot enter OPERATING state without at least one Level 2 certified operator.

### Step 10: AINE Enters OPERATING State

**Actor:** EMS (automated)
**Systems:** EMS, GAAGR, ACTS

Once all prerequisites are satisfied:

1. EMS transitions AINE state: `ACTIVATING → OPERATING`
2. GAAGR registry updated with operational status
3. ACTS logs the state transition
4. WGE (Work Generation Engine) enabled — venture cells can now be created
5. Telemetry dashboards go live
6. NLO receives notification: "Your AINE is operational"

## Rollback Procedures

| Step | Rollback Action | System |
|------|----------------|--------|
| Step 5 (EMS Deploy) | Delete K8s namespace, remove GAAGR entry | EMS |
| Step 6 (RAMS Roles) | Revoke all authority grants, remove RBAC | RAMS |
| Step 7 (ACTS Audit) | Mark audit trail as "birth-aborted", seal records | ACTS |
| Step 8 (BPMN) | Deactivate all workflows | BPMN |
| Full Rollback | Execute AINE Death SOP with reason "birth-failed" | See [SOP: AINE Death](./sop-aine-death.md) |

## Post-Procedure Verification

- [ ] AINE appears in GAAGR with state `OPERATING`
- [ ] All agents are running (pod health checks green)
- [ ] ACTS audit trail is active with birth event logged
- [ ] Authority matrix is configured in RAMS
- [ ] BPMN workflows are executing
- [ ] At least one Level 2 certified operator is assigned
- [ ] NLO has confirmed receipt of operational notification
- [ ] Telemetry dashboard is accessible

## Related Documents

- [BPMN: AINE Lifecycle](./bpmn-aine-lifecycle.md)
- [SOP: AINE Death](./sop-aine-death.md)
- [SOP: Authority Decay](./sop-authority-decay.md)
- [Architecture: AINE Lifecycle](/docs/architecture/aine-lifecycle)
- [Systems: EMS](/docs/systems/cluster-1/ems)
- [Systems: GCS](/docs/systems/cluster-1/gcs)
- [Systems: IGS](/docs/systems/cluster-1/igs)
