import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AINEFF',
  tagline: 'AI-Native Enterprise Factory Framework — Civilization-Scale Invisible Infrastructure',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://frankmax-com.github.io',
  baseUrl: '/aineff-docs/',

  organizationName: 'frankmax-com',
  projectName: 'aineff-docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'md',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/frankmax-com/AINEFF/tree/main/docs-site/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/aineff-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AINEFF',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'gettingStartedSidebar',
          position: 'left',
          label: 'Getting Started',
        },
        {
          type: 'docSidebar',
          sidebarId: 'architectureSidebar',
          position: 'left',
          label: 'Architecture',
        },
        {
          type: 'docSidebar',
          sidebarId: 'systemsSidebar',
          position: 'left',
          label: 'Systems',
        },
        {
          type: 'docSidebar',
          sidebarId: 'platformsSidebar',
          position: 'left',
          label: 'Platforms',
        },
        {
          type: 'docSidebar',
          sidebarId: 'operationsSidebar',
          position: 'left',
          label: 'Operations',
        },
        {
          type: 'docSidebar',
          sidebarId: 'buildingSidebar',
          position: 'left',
          label: 'Building',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/frankmax-com/AINEFF',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Getting Started', to: '/docs/getting-started/introduction'},
            {label: 'Architecture', to: '/docs/architecture/overview'},
            {label: 'Systems Reference', to: '/docs/systems/overview'},
            {label: 'Building AINEFF', to: '/docs/building/overview'},
          ],
        },
        {
          title: 'Products',
          items: [
            {label: 'Chokepoint Intelligence', to: '/docs/apps/chokepoint-web'},
            {label: 'LevelupMax', to: '/docs/platforms/levelupmax'},
            {label: 'Frankmax', to: '/docs/platforms/frankmax'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Blog', to: '/blog'},
            {label: 'GitHub', href: 'https://github.com/frankmax-com'},
            {label: 'Frankmax', href: 'https://frankmax.digital'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Frankmax Digital. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
