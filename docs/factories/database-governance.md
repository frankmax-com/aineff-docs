---
sidebar_position: 3
title: "Database Governance Factory"
description: "Data layer governance for MongoDB, PostgreSQL, Redis, Cosmos DB, and Blob Storage --- schema enforcement, access control, audit trails, and data lifecycle management."
---

# Database Governance Factory

The **Database Governance Factory** enforces governance policies across all AINEFF data stores. It manages schema enforcement, access control, query auditing, data lifecycle policies, and encryption requirements for MongoDB, PostgreSQL, Redis, Cosmos DB, and Blob Storage. Every data operation in AINEFF is governed by this factory.

## Factory Identity

| Field | Value |
|-------|-------|
| Factory ID | `database-governance-factory` |
| Supported Stores | MongoDB, PostgreSQL, Redis, Cosmos DB, Blob Storage |
| Enforcement | Middleware layer + policy engine |
| Integration | AINE Runtime, ORF Protocol, Audit Logger |

## Supported Data Stores

| Store | Use Case | Governance Features |
|-------|----------|-------------------|
| **MongoDB** | Document storage, agent memory, event logs | Schema validation, field-level encryption, TTL indexes |
| **PostgreSQL** | Relational data, billing, authority matrices | Row-level security, audit triggers, schema migrations |
| **Redis** | Caching, session state, real-time metrics | Key namespace isolation, TTL enforcement, memory quotas |
| **Cosmos DB** | Globally distributed data, multi-region AINEs | Partition key governance, RU budgets, consistency policies |
| **Blob Storage** | Documents, models, Knowledge Vault files | Encryption at rest, lifecycle policies, access logging |

## Architecture

### Governance Middleware Layer

```
Application / Agent
    │
    v
┌──────────────────────────────────────────────────────────┐
│              Database Governance Factory                   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Access       │→ │ Schema       │→ │ Query          │  │
│  │ Controller   │  │ Validator    │  │ Auditor        │  │
│  └──────────────┘  └──────────────┘  └────────┬───────┘  │
│                                                │          │
│  ┌─────────────────────────────────────────────v───────┐  │
│  │              Data Lifecycle Manager                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │  │Retention │ │Encryption│ │ Backup   │ │ Purge  │ │  │
│  │  │ Policies │ │ Manager  │ │ Scheduler│ │ Engine │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
    │
    v
Data Store (MongoDB / PostgreSQL / Redis / Cosmos DB / Blob)
```

### Access Control

Every data access is evaluated against the authority matrix:

```typescript
interface DataAccessPolicy {
  policyId: string;
  store: 'mongodb' | 'postgresql' | 'redis' | 'cosmosdb' | 'blob';
  resource: string;          // Collection, table, key pattern, or container
  operations: DataOperation[];
  requiredAuthority: number; // Minimum authority level
  tenantIsolation: boolean;  // Enforce tenant boundary
  audit: boolean;            // Log this access
}

type DataOperation = 'read' | 'write' | 'delete' | 'admin' | 'export';

// Example policies
const policies: DataAccessPolicy[] = [
  {
    policyId: 'billing-read',
    store: 'postgresql',
    resource: 'billing.*',
    operations: ['read'],
    requiredAuthority: 2,
    tenantIsolation: true,
    audit: true,
  },
  {
    policyId: 'agent-memory-write',
    store: 'mongodb',
    resource: 'agent_memory',
    operations: ['read', 'write'],
    requiredAuthority: 1,     // Agents can access their own memory
    tenantIsolation: true,
    audit: false,             // Too frequent to audit every write
  },
  {
    policyId: 'authority-matrix-admin',
    store: 'postgresql',
    resource: 'authority_matrix',
    operations: ['read', 'write', 'delete', 'admin'],
    requiredAuthority: 5,     // Only architects
    tenantIsolation: true,
    audit: true,
  },
];
```

### Schema Governance

#### MongoDB Schema Validation

```typescript
interface MongoSchemaGovernance {
  // Schema validation rules per collection
  collections: {
    [name: string]: {
      validator: JSONSchema;
      validationLevel: 'strict' | 'moderate';
      validationAction: 'error' | 'warn';
      indexes: IndexSpec[];
      ttlField?: string;
      ttlSeconds?: number;
    };
  };
}

// Example: Agent memory collection
const agentMemorySchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['agentId', 'tenantId', 'createdAt'],
      properties: {
        agentId: { bsonType: 'string' },
        tenantId: { bsonType: 'string' },
        memoryType: { enum: ['working', 'long-term', 'episodic'] },
        content: { bsonType: 'object' },
        createdAt: { bsonType: 'date' },
        expiresAt: { bsonType: 'date' },
      },
    },
  },
  validationLevel: 'strict',
  validationAction: 'error',
  indexes: [
    { key: { agentId: 1, tenantId: 1 }, unique: false },
    { key: { tenantId: 1 }, unique: false },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
  ],
};
```

#### PostgreSQL Schema Governance

```sql
-- Row-level security for tenant isolation
ALTER TABLE venture_cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON venture_cells
  USING (tenant_id = current_setting('app.tenant_id'));

-- Audit trigger for authority matrix changes
CREATE OR REPLACE FUNCTION audit_authority_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    table_name, operation, old_data, new_data,
    changed_by, changed_at
  ) VALUES (
    TG_TABLE_NAME, TG_OP,
    row_to_json(OLD), row_to_json(NEW),
    current_setting('app.operator_id'), NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER authority_matrix_audit
  AFTER INSERT OR UPDATE OR DELETE ON authority_matrix
  FOR EACH ROW EXECUTE FUNCTION audit_authority_changes();
```

#### Redis Governance

```typescript
interface RedisGovernance {
  // Namespace isolation per tenant
  keyPattern: `tenant:{tenantId}:{namespace}:{key}`;

  // Memory quotas
  quotas: {
    maxMemoryPerTenantMb: number;    // Default: 512
    maxKeysPerTenant: number;        // Default: 100000
    defaultTtlSeconds: number;       // Default: 86400 (24h)
    maxTtlSeconds: number;           // Default: 604800 (7d)
  };

  // Blocked commands
  blockedCommands: [
    'FLUSHALL',    // Never flush all data
    'FLUSHDB',     // Never flush entire DB
    'CONFIG',      // No runtime config changes
    'DEBUG',       // No debug commands
    'KEYS',        // Use SCAN instead
  ];
}
```

### Query Auditing

```typescript
interface QueryAuditEntry {
  auditId: string;
  timestamp: Date;
  store: string;
  operation: string;
  resource: string;
  actor: {
    id: string;
    type: 'agent' | 'operator' | 'system';
    authorityLevel: number;
  };
  tenant: string;
  query: string;            // Sanitized (no values, just structure)
  rowsAffected: number;
  durationMs: number;
  result: 'success' | 'denied' | 'error';
  denialReason?: string;
}
```

### Data Lifecycle Management

```typescript
interface DataLifecyclePolicy {
  policyId: string;
  store: string;
  resource: string;
  retention: {
    period: string;            // e.g., '90d', '1y', '7y'
    action: 'archive' | 'delete' | 'anonymize';
    archiveDestination?: string;
  };
  backup: {
    frequency: 'hourly' | 'daily' | 'weekly';
    retention: string;         // e.g., '30d'
    encrypted: boolean;
    crossRegion: boolean;
  };
  encryption: {
    atRest: boolean;
    algorithm: 'AES-256' | 'AES-128';
    keyRotationDays: number;   // Default: 90
  };
}
```

## Configuration

```typescript
interface DatabaseGovernanceConfig {
  // Store connections
  stores: {
    mongodb?: {
      uri: string;
      schemaEnforcement: 'strict' | 'moderate' | 'off';
    };
    postgresql?: {
      connectionString: string;
      rowLevelSecurity: boolean;     // Default: true
      auditTriggers: boolean;        // Default: true
    };
    redis?: {
      url: string;
      namespaceIsolation: boolean;   // Default: true
      memoryQuotasMb: number;        // Default: 512
    };
    cosmosdb?: {
      endpoint: string;
      key: string;
      consistencyLevel: 'strong' | 'bounded-staleness' | 'session' | 'eventual';
      ruBudgetPerTenant: number;     // Default: 400
    };
    blob?: {
      connectionString: string;
      encryptionEnabled: boolean;    // Default: true
      lifecyclePolicies: boolean;    // Default: true
    };
  };

  // Global policies
  global: {
    tenantIsolation: boolean;        // Default: true
    queryAudit: boolean;             // Default: true
    encryptionAtRest: boolean;       // Default: true
    backupEnabled: boolean;          // Default: true
    maxQueryDurationMs: number;      // Default: 30000
  };
}
```

## Events

### Emitted Events

| Event | Payload | Trigger |
|-------|---------|---------|
| `db-governance.access.denied` | `{ actor, resource, reason }` | Unauthorized data access attempted |
| `db-governance.schema.violation` | `{ store, resource, violation }` | Schema validation failed |
| `db-governance.quota.exceeded` | `{ tenant, resource, limit }` | Tenant quota exceeded |
| `db-governance.lifecycle.executed` | `{ policy, action, records }` | Retention/purge policy executed |
| `db-governance.backup.completed` | `{ store, resource, size }` | Backup completed |
| `db-governance.encryption.rotated` | `{ store, newKeyId }` | Encryption key rotated |

### Consumed Events

| Event | Source | Action |
|-------|--------|--------|
| `aineff-rams.authority.changed` | RAMS | Update data access policies |
| `aineff-aine-runtime.agent.terminated` | AINE Runtime | Clean up agent-specific data |
| `aineff-tdes.death.initiated` | TDES | Execute data archival for dying AINE |

## Data Store Topology

```
┌──────────────────────────────────────────────────────────────┐
│                    AINE Runtime Instance                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Database Governance Factory              │    │
│  └──────────────────┬───────────────────────────────────┘    │
│                     │                                        │
│    ┌────────────────┼────────────────┬──────────────────┐    │
│    │                │                │                  │    │
│  ┌─v────────┐ ┌────v───────┐ ┌─────v──────┐ ┌────────v─┐  │
│  │ MongoDB  │ │ PostgreSQL │ │   Redis    │ │   Blob   │  │
│  │          │ │            │ │            │ │ Storage  │  │
│  │ ■ Agent  │ │ ■ Billing  │ │ ■ Cache   │ │ ■ Docs   │  │
│  │   Memory │ │ ■ Authority│ │ ■ Session │ │ ■ Models │  │
│  │ ■ Events │ │ ■ Audit    │ │ ■ Metrics │ │ ■ Vault  │  │
│  │ ■ Config │ │ ■ Cells    │ │ ■ Queues  │ │ ■ Backup │  │
│  └──────────┘ └────────────┘ └───────────┘ └──────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Monetization

| Model | Details |
|-------|---------|
| **Standalone** | Database governance service for any enterprise. Provides tenant isolation, schema enforcement, and audit trails for multi-database environments. |
| **Composed** | Every AINE instance requires governed data stores. The factory ensures data isolation between tenants, compliance with retention policies, and auditability of all data operations --- critical for enterprise trust and regulatory compliance. |
