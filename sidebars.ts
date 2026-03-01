import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  gettingStartedSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/quick-start',
        'getting-started/monorepo-setup',
        'getting-started/development-workflow',
      ],
    },
  ],

  architectureSidebar: [
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/protocol-stack',
        'architecture/closed-loop-feedback',
        'architecture/aine-lifecycle',
        'architecture/role-derivation-pipeline',
        'architecture/kubernetes-mapping',
      ],
    },
  ],

  systemsSidebar: [
    {
      type: 'category',
      label: 'Systems Overview',
      items: ['systems/overview'],
    },
    {
      type: 'category',
      label: 'Cluster 1 — Enterprise Birth',
      items: [
        'systems/cluster-1/ems',
        'systems/cluster-1/egms',
        'systems/cluster-1/pdes',
        'systems/cluster-1/gcs',
        'systems/cluster-1/igs',
        'systems/cluster-1/tis',
        'systems/cluster-1/fbs',
        'systems/cluster-1/gaagr',
      ],
    },
    {
      type: 'category',
      label: 'Cluster 2 — Governance',
      items: [
        'systems/cluster-2/rams',
        'systems/cluster-2/gbl',
        'systems/cluster-2/ogcrs',
        'systems/cluster-2/hoes',
        'systems/cluster-2/hcdi',
        'systems/cluster-2/hcl',
        'systems/cluster-2/coie',
        'systems/cluster-2/ads',
        'systems/cluster-2/ndar',
      ],
    },
    {
      type: 'category',
      label: 'Cluster 3 — Policy & Semantics',
      items: [
        'systems/cluster-3/pies',
        'systems/cluster-3/jal',
        'systems/cluster-3/cvss',
        'systems/cluster-3/midc',
        'systems/cluster-3/scs',
      ],
    },
    {
      type: 'category',
      label: 'Cluster 4 — Audit & Death',
      items: [
        'systems/cluster-4/acts',
        'systems/cluster-4/fms',
        'systems/cluster-4/tdes',
        'systems/cluster-4/npos',
        'systems/cluster-4/ecs',
        'systems/cluster-4/rps',
        'systems/cluster-4/mes',
      ],
    },
    {
      type: 'category',
      label: 'Cluster 5 — Safeguards',
      items: [
        'systems/cluster-5/shfs',
        'systems/cluster-5/nlo-r',
        'systems/cluster-5/ssdt',
        'systems/cluster-5/cefp',
        'systems/cluster-5/sei',
        'systems/cluster-5/rrls',
      ],
    },
    {
      type: 'category',
      label: 'Cluster 6 — Intelligence',
      items: [
        'systems/cluster-6/bpmn',
        'systems/cluster-6/role-engine',
        'systems/cluster-6/industry-intel',
        'systems/cluster-6/protocol-router',
        'systems/cluster-6/audit-chain',
        'systems/cluster-6/acos',
        'systems/cluster-6/telemetry',
        'systems/cluster-6/revenue-intel',
      ],
    },
    {
      type: 'category',
      label: 'Shared Packages',
      items: [
        'systems/packages/shared-types',
        'systems/packages/governance-sdk',
        'systems/packages/audit-logger',
        'systems/packages/jurisdiction-engine',
        'systems/packages/ui',
        'systems/packages/orf-sdk',
      ],
    },
  ],

  platformsSidebar: [
    {
      type: 'category',
      label: 'Platforms',
      items: [
        'platforms/overview',
        'platforms/orf-protocol',
        'platforms/aine-runtime',
        'platforms/aineg',
        'platforms/wge',
        'platforms/levelupmax',
        'platforms/frankmax',
        'platforms/lpi',
      ],
    },
    {
      type: 'category',
      label: 'Applications',
      items: [
        'apps/chokepoint-web',
        'apps/docuflow',
        'apps/operator-dashboard',
        'apps/frankmax-portal',
      ],
    },
    {
      type: 'category',
      label: 'Agents',
      items: [
        'agents/overview',
        'agents/agentcoders',
      ],
    },
    {
      type: 'category',
      label: 'Factories',
      items: [
        'factories/ai-provider',
        'factories/github-governance',
        'factories/database-governance',
        'factories/riskops',
      ],
    },
  ],

  operationsSidebar: [
    {
      type: 'category',
      label: 'Operations',
      items: [
        'operations/deployment',
        'operations/kubernetes',
        'operations/monitoring',
        'operations/ci-cd',
      ],
    },
    {
      type: 'category',
      label: 'Business',
      items: [
        'business/revenue-model',
        'business/ecosystem-map',
        'business/standalone-vs-composed',
      ],
    },
  ],
  buildingSidebar: [
    {
      type: 'category',
      label: 'Building AINEFF',
      items: [
        'building/overview',
        'building/implementation-approach',
        'building/agent-build-manifest',
        'building/system-contracts',
        'building/oss-discovery-prompt',
        'building/agentcoders-requirements',
      ],
    },
  ],
};

export default sidebars;
