// Curated, hand-authored "key example" templates and rich overrides.
//
// WHY THIS FILE EXISTS: the auto-generated catalog (catalog.data.ts) only knows
// the 13 plain concept icons, so its diagrams render as generic lucide glyphs.
// The homepage showcase, on the other hand, uses real brand logos + chunky 3D
// icons. That mismatch made users feel the template they clicked didn't match
// the thumbnail. This file is the SINGLE SOURCE OF TRUTH for the showcased,
// real-world templates: the homepage, the /templates detail page and the
// /canvas editor all derive their diagram from here, so they're identical.
//
// Two exports:
//  - curatedTemplates : brand-new full templates (e.g. "How LLMs Work").
//  - curatedOverrides : swap the diagram + pinned style of an existing catalog
//                       template (keeps its SEO copy), keyed by slug.
//
// Icon keys reference the shared registry (icon-registry.tsx): brand keys
// ("openai", "claude", "stripe", "aws", "fedex"…), 3D keys ("brain3d",
// "terminal3d", "box3d"…), or concept keys ("database", "cloud"…).

import type { RawTemplate, TemplateStyle } from './types';

export interface CuratedOverride {
  layout?: 'hub' | 'tree';
  centerLabel?: string;
  centerIcon?: string;
  satellites?: { label: string; icon: string }[];
  treeChildren?: {
    label: string;
    icon: string;
    children?: { label: string; icon: string }[];
  }[];
  style?: TemplateStyle;
}

// ---------------------------------------------------------------------------
// Brand-new "real world" example templates (the ones users recognise).
// ---------------------------------------------------------------------------

export const curatedTemplates: RawTemplate[] = [
  {
    slug: 'how-llms-work-diagram',
    title: 'How LLMs Work',
    shortDescription:
      'A clear map of how large language models turn a prompt into an answer — and the models and hardware behind them',
    longDescription:
      'This diagram explains how a large language model (LLM) actually works. A prompt is broken into tokens, turned into embeddings, and passed through a stack of transformer layers whose attention mechanism weighs every token against every other one. The model then samples the next token, again and again, to generate a response. Around that core sit the real players that make it possible: foundation models from OpenAI, Anthropic and Google, open models from Meta and Hugging Face, and the NVIDIA GPUs and PyTorch frameworks used to train and serve them.\n\nUse it to teach how generative AI works, to brief a non-technical team before an AI project, or as the opening slide of an LLM talk. Every node is editable, so you can swap in the exact models and tooling your stack uses.',
    tags: [
      'llm',
      'large language model',
      'generative ai',
      'transformer',
      'openai',
      'anthropic',
      'ai explained',
    ],
    keywords: [
      'how llms work',
      'how large language models work',
      'llm architecture diagram',
      'transformer architecture diagram',
      'generative ai explained diagram',
      'llm diagram template',
    ],
    layout: 'hub',
    centerLabel: 'LLM',
    centerIcon: 'brain3d',
    satellites: [
      { label: 'OpenAI GPT', icon: 'openai' },
      { label: 'Anthropic Claude', icon: 'claude' },
      { label: 'Google Gemini', icon: 'gemini' },
      { label: 'Meta Llama', icon: 'meta' },
      { label: 'Hugging Face', icon: 'huggingface' },
      { label: 'NVIDIA GPUs', icon: 'nvidia' },
      { label: 'PyTorch', icon: 'pytorch' },
    ],
    faqs: [
      {
        q: 'How does a large language model work?',
        a: 'An LLM splits your prompt into tokens, converts them to embeddings, and runs them through many transformer layers that use attention to relate every token to every other. It then predicts the next token over and over to produce an answer.',
      },
      {
        q: 'What is the transformer in an LLM?',
        a: 'The transformer is the neural-network architecture behind modern LLMs. Its self-attention mechanism lets the model weigh the relevance of all tokens at once, which is what makes long-range understanding and fluent generation possible.',
      },
      {
        q: 'Which companies build the major LLMs?',
        a: 'OpenAI (GPT), Anthropic (Claude) and Google (Gemini) build leading closed models, while Meta (Llama) and the Hugging Face community lead open models. They are trained and served largely on NVIDIA GPUs using frameworks like PyTorch.',
      },
      {
        q: 'Can I customise this LLM diagram?',
        a: 'Yes. Rename any node, swap in the exact models or hardware your team uses, change the animation style, and export to PNG, SVG, GIF or MP4.',
      },
    ],
    useCases: [
      'Explaining generative AI to a non-technical team',
      'Opening slide for an LLM or AI talk',
      'Onboarding docs for an AI product team',
      'Course or tutorial on how LLMs work',
      'Internal AI strategy briefings',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
    style: {
      layout: 'radial',
      mode: 'beams',
      accent: '#6366f1',
      bg: 'linear-gradient(135deg,#eef2ff 0%,#faf5ff 100%)',
    },
  },
  {
    slug: 'claude-code-architecture-diagram',
    title: 'Claude Code Architecture',
    shortDescription:
      'How Claude Code reads your repository, calls tools through MCP, and edits code from the terminal',
    longDescription:
      'This diagram shows how Claude Code — Anthropic’s agentic coding tool — fits together. At the center is the terminal agent. It is powered by a Claude model, reads and writes the files in your Git repository, and runs commands in your shell. It reaches the outside world through MCP (Model Context Protocol) servers and your installed tooling, and integrates with your editor so changes show up live in VS Code.\n\nUse it to explain agentic coding to your team, to document how an AI assistant is wired into your developer workflow, or to plan which MCP servers and tools to expose. Every node is editable, so you can map it to your exact setup.',
    tags: [
      'claude code',
      'anthropic',
      'ai coding agent',
      'mcp',
      'developer tools',
      'agentic coding',
      'cli',
    ],
    keywords: [
      'claude code architecture',
      'claude code diagram',
      'how claude code works',
      'ai coding agent architecture',
      'mcp architecture diagram',
      'agentic coding workflow diagram',
    ],
    layout: 'hub',
    centerLabel: 'Claude Code',
    centerIcon: 'terminal3d',
    satellites: [
      { label: 'Claude Model', icon: 'claude' },
      { label: 'Your Repo', icon: 'github' },
      { label: 'VS Code', icon: 'vscode' },
      { label: 'MCP Servers', icon: 'cpu3d' },
      { label: 'CLI Tools', icon: 'npm' },
      { label: 'Workspace Files', icon: 'layers3d' },
    ],
    faqs: [
      {
        q: 'What is Claude Code?',
        a: 'Claude Code is Anthropic’s agentic coding tool that runs in your terminal. It uses a Claude model to read your codebase, run commands, call tools and edit files directly, acting like a pair programmer that can take actions.',
      },
      {
        q: 'How does Claude Code connect to other tools?',
        a: 'It uses MCP (Model Context Protocol) servers plus your installed CLI tooling. MCP gives the agent a standard way to access data sources and external services such as databases, issue trackers and browsers.',
      },
      {
        q: 'Does Claude Code work with my editor?',
        a: 'Yes. It integrates with editors like VS Code so the agent’s edits appear in your IDE, while still running from the terminal against your real repository.',
      },
      {
        q: 'Can I adapt this diagram to my setup?',
        a: 'Absolutely. Rename nodes, add the specific MCP servers and tools you use, change the look, and export to PNG, SVG, GIF or MP4.',
      },
    ],
    useCases: [
      'Explaining agentic coding to your team',
      'Documenting an AI developer workflow',
      'Planning which MCP servers to expose',
      'Onboarding engineers to AI tooling',
      'Conference talk on AI coding agents',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
    style: {
      layout: 'radial',
      mode: 'beams',
      accent: '#d97757',
      bg: 'linear-gradient(135deg,#fff7ed 0%,#fef2f2 100%)',
    },
  },
  {
    slug: 'codex-architecture-diagram',
    title: 'Codex Architecture',
    shortDescription:
      'How an AI coding agent like Codex plans, writes and tests code inside a secure sandbox',
    longDescription:
      'This diagram maps how a Codex-style AI coding agent works. A model from OpenAI drives an agent loop that plans a task, writes code, and runs it. The agent operates inside an isolated sandbox — typically a Docker container with a Python (and other) runtime — so it can execute and test changes safely. It pulls context from your GitHub repository, opens pull requests with its results, and surfaces work in your editor and shell.\n\nUse it to explain how autonomous coding agents work, to design guardrails and sandboxing for an internal agent, or to compare agentic coding approaches. Everything is editable so you can match it to your own pipeline.',
    tags: [
      'codex',
      'openai',
      'ai coding agent',
      'sandbox',
      'autonomous agent',
      'devtools',
      'software engineering',
    ],
    keywords: [
      'codex architecture',
      'codex diagram',
      'openai codex architecture',
      'ai coding agent diagram',
      'autonomous coding agent architecture',
      'agent sandbox diagram',
    ],
    layout: 'hub',
    centerLabel: 'Codex Agent',
    centerIcon: 'bot3d',
    satellites: [
      { label: 'OpenAI Model', icon: 'openai' },
      { label: 'Repo & PRs', icon: 'github' },
      { label: 'VS Code', icon: 'vscode' },
      { label: 'Python Runtime', icon: 'python' },
      { label: 'Docker Sandbox', icon: 'docker' },
      { label: 'Shell', icon: 'terminal3d' },
    ],
    faqs: [
      {
        q: 'What is Codex?',
        a: 'Codex refers to OpenAI’s code-generation models and the agents built on them. A Codex-style agent can plan a software task, write the code, run it and iterate — operating more autonomously than a chat assistant.',
      },
      {
        q: 'Why does a coding agent need a sandbox?',
        a: 'Running AI-generated code is risky, so agents execute inside an isolated sandbox — usually a Docker container with the needed runtimes. The sandbox lets the agent test and verify changes without touching your real machine.',
      },
      {
        q: 'How does the agent use my repository?',
        a: 'It reads your GitHub repo for context, makes changes on a branch, runs tests in the sandbox, and opens a pull request with the result for you to review.',
      },
      {
        q: 'Can I edit this Codex diagram?',
        a: 'Yes. Rename nodes, add your own runtimes and guardrails, restyle it, and export to PNG, SVG, GIF or MP4.',
      },
    ],
    useCases: [
      'Explaining autonomous coding agents',
      'Designing sandbox and guardrail strategy',
      'Comparing agentic coding tools',
      'Engineering team onboarding',
      'AI safety and review discussions',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
    style: {
      layout: 'radial',
      mode: 'beams',
      accent: '#10a37f',
      bg: 'linear-gradient(135deg,#ecfdf5 0%,#eff6ff 100%)',
    },
  },
];

// ---------------------------------------------------------------------------
// Rich overrides for existing catalog templates. These keep the original SEO
// copy but replace the diagram with real brand logos + 3D icons and pin the
// exact visual style — so the homepage thumbnail, the detail page hero and the
// canvas all show the same polished diagram.
// ---------------------------------------------------------------------------

const grad = (a: string, b: string) =>
  `linear-gradient(135deg,${a} 0%,${b} 100%)`;

export const curatedOverrides: Record<string, CuratedOverride> = {
  'ai-agent-architecture-diagram': {
    centerLabel: 'AI Agent',
    centerIcon: 'spark3d',
    satellites: [
      { label: 'LLM', icon: 'openai' },
      { label: 'Vector DB', icon: 'pinecone' },
      { label: 'Reasoning', icon: 'brain3d' },
      { label: 'Tools', icon: 'github' },
      { label: 'Knowledge', icon: 'notion' },
      { label: 'Memory', icon: 'redis' },
    ],
    style: {
      layout: 'radial',
      mode: 'beams',
      accent: '#6366f1',
      bg: grad('#eef2ff', '#faf5ff'),
    },
  },

  'microservices-architecture-diagram': {
    centerLabel: 'API Gateway',
    centerIcon: 'cube3d',
    satellites: [
      { label: 'Auth', icon: 'auth0' },
      { label: 'Database', icon: 'postgres' },
      { label: 'Cache', icon: 'redis' },
      { label: 'CI/CD', icon: 'github' },
      { label: 'CDN / Edge', icon: 'cloudflare' },
      { label: 'Payments', icon: 'stripe' },
    ],
    style: {
      layout: 'hub-lr',
      mode: 'beams',
      accent: '#8b5cf6',
      bg: grad('#faf5ff', '#f5f3ff'),
    },
  },

  'etl-pipeline-diagram': {
    centerLabel: 'Warehouse',
    centerIcon: 'db3d',
    satellites: [
      { label: 'Snowflake', icon: 'snowflake' },
      { label: 'dbt', icon: 'dbt' },
      { label: 'ML Models', icon: 'openai' },
      { label: 'Tableau', icon: 'tableau' },
    ],
    style: {
      layout: 'pipeline',
      mode: 'arrows',
      accent: '#14b8a6',
      bg: grad('#f0fdfa', '#ecfeff'),
    },
  },

  'org-chart-template': {
    layout: 'tree',
    centerLabel: 'CEO',
    centerIcon: 'users3d',
    treeChildren: [
      { label: 'CMO', icon: 'mega3d' },
      {
        label: 'CTO',
        icon: 'cpu3d',
        children: [
          { label: 'Eng Lead', icon: 'terminal3d' },
          { label: 'Engineer', icon: 'code' },
        ],
      },
      { label: 'COO', icon: 'gear3d' },
    ],
    style: {
      layout: 'tree',
      mode: 'pulses',
      accent: '#f97316',
      bg: grad('#fff7ed', '#fffbeb'),
    },
  },

  'zero-trust-architecture-diagram': {
    centerLabel: 'Zero Trust',
    centerIcon: 'shield3d',
    satellites: [
      { label: 'Identity', icon: 'auth0' },
      { label: 'Edge / WAF', icon: 'cloudflare' },
      { label: 'Repos', icon: 'github' },
      { label: 'Database', icon: 'postgres' },
      { label: 'Policy Engine', icon: 'bolt3d' },
      { label: 'Sessions', icon: 'redis' },
    ],
    style: {
      layout: 'radial',
      mode: 'pulses',
      accent: '#06b6d4',
      bg: grad('#ecfeff', '#eff6ff'),
    },
  },

  'marketing-funnel-diagram': {
    centerLabel: 'Campaign',
    centerIcon: 'mega3d',
    satellites: [
      { label: 'Instagram', icon: 'instagram' },
      { label: 'TikTok', icon: 'tiktok' },
      { label: 'YouTube', icon: 'youtube' },
      { label: 'Email', icon: 'mailchimp' },
      { label: 'Analytics', icon: 'googleanalytics' },
      { label: 'Search', icon: 'algolia' },
    ],
    style: {
      layout: 'hub-lr',
      mode: 'dots',
      accent: '#ec4899',
      bg: grad('#fdf2f8', '#fff1f2'),
    },
  },

  'kubernetes-architecture-diagram': {
    centerLabel: 'Cluster',
    centerIcon: 'cloud3d',
    satellites: [
      { label: 'Pods', icon: 'docker' },
      { label: 'Control Plane', icon: 'gear3d' },
      { label: 'Ingress', icon: 'cloudflare' },
      { label: 'StatefulSet', icon: 'postgres' },
      { label: 'Cache', icon: 'redis' },
      { label: 'Monitoring', icon: 'grafana' },
    ],
    style: {
      layout: 'radial',
      mode: 'beams',
      accent: '#22c55e',
      bg: grad('#f0fdf4', '#ecfeff'),
    },
  },

  'ci-cd-pipeline-diagram': {
    centerLabel: 'Deploy',
    centerIcon: 'rocket3d',
    satellites: [
      { label: 'Commit', icon: 'github' },
      { label: 'Build & Test', icon: 'gear3d' },
      { label: 'Edge / CDN', icon: 'cloudflare' },
      { label: 'Observe', icon: 'grafana' },
    ],
    style: {
      layout: 'pipeline',
      mode: 'arrows',
      accent: '#16a34a',
      bg: grad('#f0fdf4', '#f7fee7'),
    },
  },

  'payment-processing-flow-diagram': {
    centerLabel: 'Payments',
    centerIcon: 'dollar3d',
    satellites: [
      { label: 'Gateway', icon: 'stripe' },
      { label: 'Checkout', icon: 'shopify' },
      { label: 'Orders', icon: 'bag3d' },
      { label: 'Ledger', icon: 'postgres' },
      { label: 'Reporting', icon: 'googleanalytics' },
      { label: 'Fraud Check', icon: 'lock3d' },
    ],
    style: {
      layout: 'radial',
      mode: 'pulses',
      accent: '#10b981',
      bg: grad('#ecfdf5', '#f0fdfa'),
    },
  },

  'learning-path-diagram': {
    layout: 'tree',
    centerLabel: 'Start Here',
    centerIcon: 'brain3d',
    treeChildren: [
      {
        label: 'Python Basics',
        icon: 'python',
        children: [
          { label: 'Syntax', icon: 'code' },
          { label: 'Practice', icon: 'terminal3d' },
        ],
      },
      { label: 'Data Science', icon: 'chart3d' },
      { label: 'Build Projects', icon: 'rocket3d' },
    ],
    style: {
      layout: 'tree',
      mode: 'beams',
      accent: '#3b82f6',
      bg: grad('#eff6ff', '#eef2ff'),
    },
  },

  'serverless-architecture-template': {
    centerLabel: 'Serverless',
    centerIcon: 'cloud3d',
    satellites: [
      { label: 'Lambda', icon: 'aws' },
      { label: 'Auth', icon: 'auth0' },
      { label: 'Database', icon: 'postgres' },
      { label: 'Edge Fns', icon: 'vercel' },
      { label: 'Repo', icon: 'github' },
      { label: 'Billing', icon: 'stripe' },
    ],
    style: {
      layout: 'hub-lr',
      mode: 'dots',
      accent: '#0ea5e9',
      bg: grad('#f0f9ff', '#ecfeff'),
    },
  },

  'sales-pipeline-diagram': {
    centerLabel: 'Pipeline',
    centerIcon: 'funnel3d',
    satellites: [
      { label: 'Leads (CRM)', icon: 'salesforce' },
      { label: 'Nurture', icon: 'mailchimp' },
      { label: 'Revenue', icon: 'stripe' },
      { label: 'Reporting', icon: 'googleanalytics' },
    ],
    style: {
      layout: 'pipeline',
      mode: 'dots',
      accent: '#ef4444',
      bg: grad('#fef2f2', '#fff7ed'),
    },
  },

  'patient-journey-map': {
    centerLabel: 'Care',
    centerIcon: 'heart3d',
    satellites: [
      { label: 'Discover', icon: 'globe3d' },
      { label: 'Book', icon: 'whatsapp' },
      { label: 'Coordinate', icon: 'slack' },
      { label: 'Follow-up', icon: 'chart3d' },
    ],
    style: {
      layout: 'pipeline',
      mode: 'dots',
      accent: '#e11d48',
      bg: grad('#fff1f2', '#fdf2f8'),
    },
  },

  'aws-cloud-architecture-diagram': {
    centerLabel: 'AWS Cloud',
    centerIcon: 'cloud3d',
    satellites: [
      { label: 'Compute', icon: 'aws' },
      { label: 'Containers', icon: 'docker' },
      { label: 'EKS', icon: 'kubernetes' },
      { label: 'Infra as Code', icon: 'terraform' },
      { label: 'RDS', icon: 'postgres' },
      { label: 'ElastiCache', icon: 'redis' },
      { label: 'CDN', icon: 'cloudflare' },
    ],
    style: {
      layout: 'radial',
      mode: 'beams',
      accent: '#ff9900',
      bg: grad('#fff7ed', '#fffbeb'),
    },
  },

  'supply-chain-diagram': {
    centerLabel: 'Supply Chain',
    centerIcon: 'box3d',
    satellites: [
      { label: 'Manufacturing', icon: 'factory3d' },
      { label: 'ERP (SAP)', icon: 'sap' },
      { label: 'Planning', icon: 'oracle' },
      { label: 'FedEx', icon: 'fedex' },
      { label: 'DHL', icon: 'dhl' },
      { label: 'Amazon', icon: 'amazon' },
      { label: 'Walmart', icon: 'walmart' },
    ],
    style: {
      layout: 'radial',
      mode: 'beams',
      accent: '#f59e0b',
      bg: grad('#fff7ed', '#fffbeb'),
    },
  },
};
