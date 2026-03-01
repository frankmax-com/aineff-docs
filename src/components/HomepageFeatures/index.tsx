import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Standalone Revenue Engines',
    emoji: '1',
    description: (
      <>
        Each of the 85 repos deploys independently as a revenue-generating
        product. From governance SaaS to audit trail APIs, every system has
        its own monetization path.
      </>
    ),
  },
  {
    title: 'Compounding Composition',
    emoji: '2',
    description: (
      <>
        When composed in the AINEFF monorepo via git submodules, systems
        interact through closed feedback loops. Revenue compounds.
        Intelligence compounds. Each AINE generation improves from all
        previous generations.
      </>
    ),
  },
  {
    title: 'Civilization-Scale Governance',
    emoji: '3',
    description: (
      <>
        Every action binds obligation and responsibility through the ORF
        protocol. Authority decays by design. Enterprises have mortality.
        Humans remain accountable. Court-grade audit trails log everything.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md" style={{paddingTop: '2rem'}}>
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{emoji}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

        <div className="stats-grid" style={{marginTop: '3rem'}}>
          <div className="stat-card">
            <div className="stat-number">43</div>
            <div className="stat-label">Core Systems</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">7</div>
            <div className="stat-label">Platforms</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">6</div>
            <div className="stat-label">Shared Packages</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">7</div>
            <div className="stat-label">Feedback Loops</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5</div>
            <div className="stat-label">Protocol Layers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">85</div>
            <div className="stat-label">Total Components</div>
          </div>
        </div>
      </div>
    </section>
  );
}
