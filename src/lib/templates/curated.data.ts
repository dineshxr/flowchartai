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
    slug: 'isometric-cube-countdown',
    title: '14 Lessons From OpenAI',
    shortDescription:
      'A numbered isometric cube staircase — 14 stacked lessons crowned by a logo cube, in the style of the viral "lessons learned" infographics',
    longDescription:
      'This template stacks numbered isometric cubes into a staircase — the visual format behind the viral "N lessons from…" infographics. Each cube carries a number (or any short label you type), the staircase builds toward a white cube bearing a logo, and the big heading beside the stack states the takeaway. A soft pulse travels up the numbering order, so the exported GIF or MP4 loops cleanly while every frame stays readable.\n\nSwap the logo to any brand in the icon library, change the cube count by adding or deleting nodes, retitle the heading, and recolor the stack with one accent. Use it to package lessons, principles, milestones, or any countdown-style list as a share-ready animated visual.',
    tags: [
      'numbered list',
      'lessons learned',
      'isometric',
      'cube stack',
      'countdown',
      'infographic',
    ],
    keywords: [
      'numbered cube infographic template',
      'isometric steps diagram',
      '3d cube stack infographic',
      'lessons learned infographic template',
      'countdown infographic maker',
      'animated numbered list gif',
    ],
    layout: 'hub',
    centerLabel: '14 lessons from OpenAI',
    centerIcon: 'openai',
    satellites: [
      { label: '01', icon: 'cube3d' },
      { label: '02', icon: 'cube3d' },
      { label: '03', icon: 'cube3d' },
      { label: '04', icon: 'cube3d' },
      { label: '05', icon: 'cube3d' },
      { label: '06', icon: 'cube3d' },
      { label: '07', icon: 'cube3d' },
      { label: '08', icon: 'cube3d' },
      { label: '09', icon: 'cube3d' },
      { label: '10', icon: 'cube3d' },
      { label: '11', icon: 'cube3d' },
      { label: '12', icon: 'cube3d' },
      { label: '13', icon: 'cube3d' },
      { label: '14', icon: 'cube3d' },
    ],
    faqs: [
      {
        q: 'Can I change how many cubes the staircase has?',
        a: 'Yes — add or delete nodes in the editor and the staircase re-stacks itself automatically, from 3 cubes up to 15. The numbering order always runs along the bottom row first, then up.',
      },
      {
        q: 'Can I put words on the cubes instead of numbers?',
        a: 'Yes. Each cube face shows its node label, so type any short word — the text auto-shrinks to fit the face. Numbers just match the classic look.',
      },
      {
        q: 'Which logo can sit on the top cube?',
        a: 'Any icon in the library — real brand logos (OpenAI, Stripe, Docker…), 3D glyphs, or a plain letter tile. Select the top cube and pick a logo in the inspector.',
      },
    ],
    useCases: [
      '"N lessons learned" posts for LinkedIn and X',
      'Company principles or values as a numbered stack',
      'Milestone countdowns for launches and anniversaries',
      'Listicle summaries of talks, books, and podcasts',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
    pro: true,
    style: {
      layout: 'iso-steps',
      mode: 'pulses',
      accent: '#e2612e',
      bg: 'linear-gradient(135deg,#fff7ed 0%,#ffffff 100%)',
    },
  },
  {
    slug: 'launch-countdown-cube-stack',
    title: 'Product Launch Countdown',
    shortDescription:
      'A 10-cube isometric countdown to launch day — numbered steps stacking up to the rocket on top',
    longDescription:
      'Count down the steps to a launch as a staircase of numbered isometric cubes, capped by a rocket cube at the summit. The pulse wave climbs the stack in order, making the exported GIF read like progress in motion — while the static frame still works as a poster or slide.\n\nEvery part is editable: cube count (3–15), the label on every face, the heading beside the stack, the accent color, and the icon on the top cube. Swap the rocket for your product logo the day you ship.',
    tags: [
      'launch',
      'countdown',
      'roadmap',
      'isometric',
      'cube stack',
      'milestones',
    ],
    keywords: [
      'product launch countdown template',
      'launch checklist infographic',
      'countdown cube infographic',
      'isometric roadmap diagram',
      'animated launch gif template',
    ],
    layout: 'hub',
    centerLabel: '10 steps to launch',
    centerIcon: 'rocket3d',
    satellites: [
      { label: '01', icon: 'cube3d' },
      { label: '02', icon: 'cube3d' },
      { label: '03', icon: 'cube3d' },
      { label: '04', icon: 'cube3d' },
      { label: '05', icon: 'cube3d' },
      { label: '06', icon: 'cube3d' },
      { label: '07', icon: 'cube3d' },
      { label: '08', icon: 'cube3d' },
      { label: '09', icon: 'cube3d' },
      { label: '10', icon: 'cube3d' },
    ],
    faqs: [
      {
        q: 'Can I rename the heading next to the cubes?',
        a: 'Yes — the heading is the center node\u2019s label. Click the white top cube (or the heading itself) and edit the label in the inspector.',
      },
      {
        q: 'Does it export as an animated GIF?',
        a: 'Yes. The pulse wave loops on a fixed period, so GIF and MP4 exports loop seamlessly; PNG and SVG exports capture the full readable staircase.',
      },
    ],
    useCases: [
      'Launch-week countdown posts',
      'Release checklists as a visual',
      'Sprint or quarter milestone tracking',
      'Kickstarter / waitlist hype graphics',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
    pro: true,
    style: {
      layout: 'iso-steps',
      mode: 'pulses',
      accent: '#6366f1',
      bg: 'linear-gradient(135deg,#eef2ff 0%,#ffffff 100%)',
    },
  },
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
      // Orbit: the models/frameworks revolve around the LLM — the homepage's
      // flagship hero card shows the motion off best.
      layout: 'orbit',
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

  // ---- Orbit-style templates (revolving satellites) -------------------------
  {
    slug: 'ai-tool-ecosystem-orbit',
    title: 'AI Tool Ecosystem',
    shortDescription:
      'Your AI stack as a living orbit — models, frameworks and vector stores revolving around the product they power',
    longDescription:
      'This animated diagram shows an AI product’s ecosystem as orbiting circles: the product sits at the center while the models and infrastructure it depends on — OpenAI’s GPT models, Anthropic’s Claude, Google Gemini, Hugging Face, LangChain and Pinecone — revolve around it on two rings. The orbital motion makes dependency and gravity instantly readable: everything in the diagram exists in relation to the center.\n\nUse it to present your AI stack in a pitch deck, to document which providers a product depends on, or to compare vendor ecosystems. Every node is editable, so you can swap in the exact models, frameworks and databases your team uses — and export the result as an animated GIF or MP4 with the orbits in motion.',
    tags: [
      'ai stack',
      'ai ecosystem',
      'orbit diagram',
      'llm tools',
      'ai infrastructure',
      'animated diagram',
    ],
    keywords: [
      'ai tool ecosystem diagram',
      'ai stack diagram',
      'orbiting circles diagram',
      'ai infrastructure map',
      'llm stack visualization',
      'animated ai diagram',
    ],
    layout: 'hub',
    centerLabel: 'Your AI Stack',
    centerIcon: 'brain3d',
    satellites: [
      { label: 'OpenAI GPT', icon: 'openai' },
      { label: 'Claude', icon: 'claude' },
      { label: 'Gemini', icon: 'gemini' },
      { label: 'Hugging Face', icon: 'huggingface' },
      { label: 'LangChain', icon: 'langchain' },
      { label: 'Pinecone', icon: 'pinecone' },
    ],
    faqs: [
      {
        q: 'What is an orbit diagram?',
        a: 'An orbit diagram places one central element in the middle and animates the related elements revolving around it on rings — like planets around a sun. It communicates dependency and gravity: everything shown exists in relation to the center.',
      },
      {
        q: 'Can I export the orbiting animation?',
        a: 'Yes. Export to GIF or MP4 and the satellites keep revolving in the exported file — perfect for pitch decks, docs and social posts. PNG and SVG exports capture a clean still.',
      },
      {
        q: 'Can I change which tools appear in the orbit?',
        a: 'Every node is editable. Swap any satellite for the models, frameworks or databases your stack actually uses — brand logos are matched automatically from the label.',
      },
    ],
    useCases: [
      'AI stack slide for a pitch deck',
      'Documenting model and vendor dependencies',
      'Comparing AI provider ecosystems',
      'Animated visual for a product launch post',
      'Engineering onboarding docs',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
    style: {
      layout: 'orbit',
      mode: 'beams',
      accent: '#8b5cf6',
      bg: 'linear-gradient(135deg,#f5f3ff 0%,#eff6ff 100%)',
    },
  },
  {
    slug: 'saas-integration-orbit',
    title: 'SaaS Integration Map',
    shortDescription:
      'The integrations that revolve around your product — Slack, Notion, Stripe and more, orbiting as animated circles',
    longDescription:
      'This animated integration map shows a SaaS product at the center with its key integrations — Slack, Notion, Stripe, Salesforce, Mailchimp and Google Drive — orbiting around it. The revolving motion tells the story a static integrations grid can’t: your product is the gravitational center of a working ecosystem.\n\nUse it on an integrations page, in a partner deck, or in onboarding materials to show how your product connects to the tools customers already use. Every node is editable — swap in your actual integrations and the matching brand logos render automatically. Export as an animated GIF or MP4 with the orbits in motion, or as a clean PNG/SVG still.',
    tags: [
      'integrations',
      'saas',
      'orbit diagram',
      'partner ecosystem',
      'animated diagram',
      'product marketing',
    ],
    keywords: [
      'saas integration diagram',
      'integration map template',
      'product ecosystem diagram',
      'orbiting integrations animation',
      'partner ecosystem map',
      'integrations page visual',
    ],
    layout: 'hub',
    centerLabel: 'Your Product',
    centerIcon: 'bolt3d',
    satellites: [
      { label: 'Slack', icon: 'slack' },
      { label: 'Notion', icon: 'notion' },
      { label: 'Stripe', icon: 'stripe' },
      { label: 'Salesforce', icon: 'salesforce' },
      { label: 'Mailchimp', icon: 'mailchimp' },
      { label: 'Google Drive', icon: 'gdrive' },
    ],
    faqs: [
      {
        q: 'What should an integration map show?',
        a: 'Your product at the center and the tools it connects to around it. The orbit layout adds motion, which makes the ecosystem feel alive — ideal for marketing pages and partner decks rather than technical wiring diagrams.',
      },
      {
        q: 'Do the brand logos render automatically?',
        a: 'Yes. Label a node "Slack", "Stripe" or any of the dozens of recognized products and the real logo renders automatically — or pick a logo explicitly in the editor.',
      },
      {
        q: 'Can I use this on my website?',
        a: 'Export as an animated GIF or MP4 and embed it on your integrations or landing page. Higher resolutions and watermark-free exports are available on paid plans.',
      },
    ],
    useCases: [
      'Integrations page hero animation',
      'Partner ecosystem slide',
      'Customer onboarding materials',
      'Product launch announcement visual',
      'App marketplace listing graphic',
    ],
    category: 'product',
    categoryName: 'Product & UX',
    style: {
      layout: 'orbit',
      mode: 'dots',
      accent: '#6366f1',
      bg: 'linear-gradient(135deg,#eef2ff 0%,#faf5ff 100%)',
    },
  },
  {
    slug: 'social-media-ecosystem-orbit',
    title: 'Social Media Ecosystem',
    shortDescription:
      'Your brand at the center of its channels — Instagram, TikTok, YouTube and more orbiting in one animated view',
    longDescription:
      'This animated diagram puts a brand at the center of its social presence, with Instagram, TikTok, YouTube, WhatsApp and Meta revolving around it as orbiting circles. It reads instantly: one brand, many channels, all in motion around the same center of gravity.\n\nUse it to open a social strategy deck, to map where a brand publishes and engages, or as a share-ready animation announcing a channel strategy. Every node is editable — add or remove channels, rename the center to your brand, and the platform logos render automatically. Export as an animated GIF or MP4 with the orbit in motion.',
    tags: [
      'social media',
      'marketing',
      'orbit diagram',
      'channel strategy',
      'animated diagram',
      'brand',
    ],
    keywords: [
      'social media ecosystem diagram',
      'social channel map template',
      'brand channel strategy visual',
      'orbiting social icons animation',
      'social media strategy diagram',
      'animated marketing diagram',
    ],
    layout: 'hub',
    centerLabel: 'Your Brand',
    centerIcon: 'mega3d',
    satellites: [
      { label: 'Instagram', icon: 'instagram' },
      { label: 'TikTok', icon: 'tiktok' },
      { label: 'YouTube', icon: 'youtube' },
      { label: 'WhatsApp', icon: 'whatsapp' },
      { label: 'Meta', icon: 'meta' },
    ],
    faqs: [
      {
        q: 'What is a social media ecosystem map?',
        a: 'A single view of every channel a brand operates, arranged around the brand itself. The orbit layout animates the channels revolving around the brand, which makes the strategy read at a glance in decks and posts.',
      },
      {
        q: 'Can I add or remove channels?',
        a: 'Yes — every node is editable. Add LinkedIn, X or a newsletter, remove channels you don’t use, and the layout rebalances the orbit automatically.',
      },
      {
        q: 'What formats can I export?',
        a: 'Animated GIF and MP4 keep the orbital motion; PNG and SVG give you a clean still for documents. Free accounts export at 1080p with a small watermark.',
      },
    ],
    useCases: [
      'Social strategy deck opener',
      'Channel audit and planning workshops',
      'Agency pitch for multi-channel management',
      'Brand guidelines: where we publish',
      'Animated post announcing a new channel',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
    style: {
      layout: 'orbit',
      mode: 'pulses',
      accent: '#ec4899',
      bg: 'linear-gradient(135deg,#fdf2f8 0%,#fff7ed 100%)',
    },
  },

  // ---------------------------------------------------------------------------
  // Charts & Data — animated chart templates (bars / chart-line / donut).
  // Satellites carry `value` (+ optional `unit`) which drive bar heights, line
  // points and donut shares. Values are editable per-node in the canvas.
  // ---------------------------------------------------------------------------
  {
    slug: 'quarterly-results-bar-chart',
    title: 'Quarterly Results Bar Chart',
    shortDescription:
      'An animated bar chart of quarterly results — four editable bars with values, staggered pulse animation, ready to export as GIF or MP4',
    longDescription:
      'This animated bar chart template turns quarterly numbers into a share-ready visual. Each quarter is a bar whose height is driven by an editable value, with the figure printed above it and a subtle staggered pulse that keeps the chart alive without distracting from the data. Swap the four quarters for months, regions or products, type in your own numbers, and the bars rescale instantly.\n\nUse it to close an all-hands deck, announce results on LinkedIn, or drop a moving chart into a product update email. Like every Infogiph template you can change the accent color, animation style and speed, then export a seamless GIF or MP4 loop — or a clean PNG for print.',
    tags: [
      'bar chart',
      'quarterly results',
      'animated chart',
      'kpi',
      'revenue chart',
      'data visualization',
    ],
    keywords: [
      'animated bar chart maker',
      'quarterly results chart template',
      'bar chart gif generator',
      'animated data visualization',
      'editable bar chart template',
    ],
    layout: 'hub',
    centerLabel: '2026 Results',
    centerIcon: 'chart3d',
    satellites: [
      { label: 'Q1', icon: 'analytics', value: 42 },
      { label: 'Q2', icon: 'analytics', value: 68 },
      { label: 'Q3', icon: 'analytics', value: 55 },
      { label: 'Q4', icon: 'analytics', value: 84 },
    ],
    faqs: [
      {
        q: 'How do I change the values of the bars?',
        a: 'Open the template in the canvas and click any bar’s node — the inspector shows a Value field. Type a new number and the bar height, value label and scale update instantly.',
      },
      {
        q: 'Can I add more bars than four quarters?',
        a: 'Yes. Regenerate with AI describing your series (up to 8 bars render cleanly), or start from this template and rename the nodes to months, regions or products.',
      },
      {
        q: 'Can I export the animated bar chart as a video?',
        a: 'Yes — export a seamless GIF or MP4 loop for social and slides, or a static PNG. The pulse animation is baked into the export.',
      },
    ],
    useCases: [
      'Quarterly business reviews and all-hands decks',
      'LinkedIn posts announcing results',
      'Product update emails with a moving chart',
      'Investor updates and board slides',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'bars',
      mode: 'pulses',
      accent: '#3b82f6',
      bg: 'linear-gradient(135deg,#eff6ff 0%,#faf5ff 100%)',
    },
  },
  {
    slug: 'github-stars-growth-chart',
    title: 'GitHub Stars Growth Chart',
    shortDescription:
      'An animated trend line of GitHub stars over time — the classic up-and-to-the-right chart for launch posts and READMEs',
    longDescription:
      'The "GitHub stars over time" chart is the developer world’s favourite growth flex, and this template animates it: a smooth accent curve climbs across the years, values printed at every point, with a glowing beam that traces the line on loop. Edit the years and star counts to match your repo, or repurpose it for users, downloads, or any up-and-to-the-right metric.\n\nDrop the exported GIF into a launch tweet, a README, or a Show HN post — a moving chart stops the scroll where a static screenshot doesn’t. The chart re-renders at any aspect ratio, so the same template works for a wide blog header or a square social card.',
    tags: [
      'github stars',
      'line chart',
      'growth chart',
      'developer marketing',
      'open source',
      'trend line',
    ],
    keywords: [
      'github stars chart generator',
      'animated line chart maker',
      'star history chart',
      'growth chart gif',
      'open source growth chart',
    ],
    layout: 'hub',
    centerLabel: 'GitHub Stars',
    centerIcon: 'github',
    satellites: [
      { label: '2021', icon: 'analytics', value: 2, unit: 'k' },
      { label: '2022', icon: 'analytics', value: 9, unit: 'k' },
      { label: '2023', icon: 'analytics', value: 28, unit: 'k' },
      { label: '2024', icon: 'analytics', value: 54, unit: 'k' },
      { label: '2025', icon: 'analytics', value: 102, unit: 'k' },
      { label: '2026', icon: 'analytics', value: 180, unit: 'k' },
    ],
    faqs: [
      {
        q: 'How do I put my own repo’s numbers in?',
        a: 'Click any point’s node in the canvas and edit its label (the year) and value (the star count). The curve, area fill and value labels re-draw automatically.',
      },
      {
        q: 'Can I use this for metrics other than GitHub stars?',
        a: 'Absolutely — swap the center label and icon and it becomes a users, revenue, downloads or waitlist growth chart. Any single ascending series works.',
      },
      {
        q: 'Does the drawing animation survive the GIF export?',
        a: 'Yes. The beam that traces the curve is part of the SVG animation, so GIF and MP4 exports loop it seamlessly.',
      },
    ],
    useCases: [
      'Launch posts and Show HN threads',
      'README growth section',
      'Developer-tool marketing pages',
      'Year-in-review recap posts',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'chart-line',
      mode: 'beams',
      accent: '#8b5cf6',
      bg: 'linear-gradient(135deg,#f5f3ff 0%,#eff6ff 100%)',
    },
  },
  {
    slug: 'browser-market-share-donut',
    title: 'Browser Market Share Donut',
    shortDescription:
      'An animated donut chart of browser market share — editable segments with percentages, each slice labelled with its brand',
    longDescription:
      'This donut chart template shows how a market splits between players — here, browser market share, with Chrome’s dominant slice against Safari, Edge, Firefox and the long tail. Every segment is an editable node: change the labels and percentage values and the ring re-proportions itself, keeping the percentages printed on each slice that’s big enough to hold one.\n\nUse it any time you need a parts-of-a-whole story: market share, traffic sources, revenue mix, survey answers. The segments pulse gently in sequence so the exported GIF feels alive, and the center hole holds your subject icon so the chart stays branded.',
    tags: [
      'donut chart',
      'market share',
      'pie chart',
      'browser share',
      'percentage chart',
      'parts of whole',
    ],
    keywords: [
      'animated donut chart maker',
      'market share chart template',
      'pie chart gif generator',
      'percentage donut chart',
      'share of market visualization',
    ],
    layout: 'hub',
    centerLabel: 'Market Share',
    centerIcon: 'globe3d',
    satellites: [
      { label: 'Chrome', icon: 'chrome', value: 65, unit: '%' },
      { label: 'Safari', icon: 'safari', value: 18, unit: '%' },
      { label: 'Others', icon: 'apps', value: 9, unit: '%' },
      { label: 'Edge', icon: 'edge', value: 5, unit: '%' },
      { label: 'Firefox', icon: 'firefox', value: 3, unit: '%' },
    ],
    faqs: [
      {
        q: 'How do the donut segments get their sizes?',
        a: 'Each node carries a value; the donut divides the ring proportionally. Edit any value in the inspector and every slice re-proportions instantly.',
      },
      {
        q: 'Can the slices show real brand logos?',
        a: 'Yes — nodes labelled with real product names resolve to real logos from a 600+ brand catalog in the canvas, and you can upload a custom logo per node.',
      },
      {
        q: 'What’s the maximum number of segments?',
        a: 'Six segments render cleanly with their labels; below roughly 7% of the total, a slice keeps its label beside the ring instead of on it.',
      },
    ],
    useCases: [
      'Market share slides in pitch decks',
      'Traffic source breakdowns in marketing reports',
      'Revenue mix visuals for board updates',
      'Survey result summaries',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'donut',
      mode: 'pulses',
      accent: '#0ea5e9',
      bg: 'linear-gradient(135deg,#f0f9ff 0%,#eef2ff 100%)',
    },
  },
  {
    slug: 'ad-spend-by-channel-chart',
    title: 'Ad Spend by Channel Chart',
    shortDescription:
      'An animated bar chart of advertising spend per channel — Google, Meta, TikTok, YouTube and LinkedIn bars with dollar values',
    longDescription:
      'Where does the budget actually go? This bar chart template breaks advertising spend down by channel, one bar per platform with its logo underneath and the dollar amount above. The bars are value-driven: type the real numbers from your ad accounts and the chart rescales, formatting thousands and millions automatically ($42k, $1.2M).\n\nMarketing teams use it for monthly spend reviews and budget proposals; agencies drop it into client reports. Because the platform nodes resolve to real logos, the chart reads instantly — no legend needed. Export a looping GIF for Slack or Notion, or a PNG for the deck.',
    tags: [
      'ad spend',
      'marketing budget',
      'bar chart',
      'ppc',
      'paid media',
      'channel mix',
    ],
    keywords: [
      'ad spend chart template',
      'marketing budget visualization',
      'ppc spend by channel chart',
      'paid media report chart',
      'advertising budget breakdown',
    ],
    layout: 'hub',
    centerLabel: 'Ad Spend',
    centerIcon: 'mega3d',
    satellites: [
      { label: 'Google Ads', icon: 'google', value: 42000, unit: '$' },
      { label: 'Meta', icon: 'meta', value: 31000, unit: '$' },
      { label: 'YouTube', icon: 'youtube', value: 24000, unit: '$' },
      { label: 'TikTok', icon: 'tiktok', value: 18000, unit: '$' },
      { label: 'LinkedIn', icon: 'linkedin', value: 12000, unit: '$' },
    ],
    faqs: [
      {
        q: 'How are the dollar amounts formatted?',
        a: 'Values format themselves compactly — 42000 with a "$" unit renders as $42k, 1200000 as $1.2M — so big budgets stay readable above narrow bars.',
      },
      {
        q: 'Can I reorder the channels?',
        a: 'Yes — nodes render left to right in order. Regenerate with AI or edit labels/values so your biggest channel leads.',
      },
      {
        q: 'Can I show this as a share-of-budget donut instead?',
        a: 'Yes. Use the layout switcher in the canvas toolbar to flip the same data between bar, line and donut chart layouts.',
      },
    ],
    useCases: [
      'Monthly marketing spend reviews',
      'Agency client reports',
      'Budget proposals and reallocations',
      'CMO dashboards and updates',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'bars',
      mode: 'beams',
      accent: '#f59e0b',
      bg: 'linear-gradient(135deg,#fffbeb 0%,#fef2f2 100%)',
    },
  },
  {
    slug: 'arr-growth-line-chart',
    title: 'ARR Growth Line Chart',
    shortDescription:
      'An animated revenue growth curve — annual recurring revenue climbing year over year, with compact $ labels at every point',
    longDescription:
      'The ARR curve is the one chart every SaaS deck needs. This template animates it: a smooth line climbs from your first revenue to today, the area under it softly filled, values formatted compactly at each point ($400k, $3.5M, $14M). A traveling glow traces the curve so the exported clip draws the eye in a feed or a deck.\n\nEdit the years and amounts to match your trajectory — the curve, fill and labels re-draw around your numbers. It works just as well for MRR, GMV, or user growth; change the center label and the same template tells that story.',
    tags: [
      'arr',
      'mrr',
      'saas metrics',
      'revenue growth',
      'line chart',
      'startup metrics',
    ],
    keywords: [
      'arr growth chart template',
      'saas revenue chart maker',
      'animated revenue graph',
      'mrr growth visualization',
      'startup traction chart',
    ],
    layout: 'hub',
    centerLabel: 'ARR',
    centerIcon: 'dollar3d',
    satellites: [
      { label: '2022', icon: 'payment', value: 400000, unit: '$' },
      { label: '2023', icon: 'payment', value: 1200000, unit: '$' },
      { label: '2024', icon: 'payment', value: 3500000, unit: '$' },
      { label: '2025', icon: 'payment', value: 7800000, unit: '$' },
      { label: '2026', icon: 'payment', value: 14000000, unit: '$' },
    ],
    faqs: [
      {
        q: 'How do the revenue figures format?',
        a: 'Compactly and automatically: 400000 renders as $400k and 14000000 as $14M, so labels stay readable at every chart size.',
      },
      {
        q: 'Can I show monthly instead of annual points?',
        a: 'Yes — up to 8 points render cleanly. Relabel the nodes to months and enter MRR values.',
      },
      {
        q: 'Will the animation loop cleanly in my pitch deck?',
        a: 'Yes. GIF and MP4 exports compute the seamless loop window automatically, so the traced curve repeats without a visible cut.',
      },
    ],
    useCases: [
      'Pitch deck traction slides',
      'Investor update emails',
      'Fundraise announcement posts',
      'Internal growth all-hands',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'chart-line',
      mode: 'beams',
      accent: '#10b981',
      bg: 'linear-gradient(135deg,#ecfdf5 0%,#f0f9ff 100%)',
    },
  },
  {
    slug: 'cloud-market-share-donut',
    title: 'Cloud Market Share Donut',
    shortDescription:
      'An animated donut of cloud infrastructure market share — AWS, Azure and Google Cloud slices with real logos and percentages',
    longDescription:
      'Who owns the cloud? This donut chart template splits the infrastructure market between AWS, Microsoft Azure, Google Cloud and the long tail, with each provider’s share printed on its slice and its logo beside it. It’s a ready-made visual for platform comparisons, tech talks and analyst-style commentary.\n\nAs with every chart template, the values are editable — update the shares as the market moves, or swap the players entirely to chart your own competitive landscape. The ring animates with a gentle sequential pulse and exports as a seamless loop.',
    tags: [
      'cloud market',
      'aws',
      'azure',
      'google cloud',
      'donut chart',
      'competitive landscape',
    ],
    keywords: [
      'cloud market share chart',
      'aws vs azure vs gcp chart',
      'infrastructure market donut',
      'competitive share visualization',
      'cloud provider comparison chart',
    ],
    layout: 'hub',
    centerLabel: 'Cloud Market',
    centerIcon: 'cloud3d',
    satellites: [
      { label: 'AWS', icon: 'aws', value: 31, unit: '%' },
      { label: 'Azure', icon: 'azure', value: 25, unit: '%' },
      { label: 'Google Cloud', icon: 'gcp', value: 11, unit: '%' },
      { label: 'Others', icon: 'cloud', value: 33, unit: '%' },
    ],
    faqs: [
      {
        q: 'Are the provider logos included?',
        a: 'Yes — AWS, Azure and Google Cloud nodes resolve to their real logos automatically, and you can swap any node’s icon or upload your own.',
      },
      {
        q: 'Can I chart my own competitive landscape instead?',
        a: 'Yes. Rename the segments to your competitors, set their shares, and change the center label — the template becomes your market map.',
      },
      {
        q: 'Do the shares have to add up to 100?',
        a: 'No — the donut normalises whatever values you enter into proportional slices, so raw revenue or user counts work too.',
      },
    ],
    useCases: [
      'Tech talks and conference slides',
      'Competitive landscape sections in decks',
      'Analyst-style LinkedIn commentary',
      'Cloud strategy documents',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'donut',
      mode: 'pulses',
      accent: '#6366f1',
      bg: 'linear-gradient(135deg,#eef2ff 0%,#f0f9ff 100%)',
    },
  },
  {
    slug: 'sprint-velocity-bar-chart',
    title: 'Sprint Velocity Bar Chart',
    shortDescription:
      'An animated bar chart of story points delivered per sprint — six editable bars for retros, reviews and team health checks',
    longDescription:
      'Velocity charts live in every agile tool, but none of them export a chart you’d actually want to share. This template turns six sprints of story points into a clean animated bar chart — values above each bar, a steady baseline, and a staggered pulse that makes the retro slide feel alive.\n\nType in your team’s numbers and the bars rescale; rename the sprints to weeks or releases if that’s how you plan. Export a GIF for the retro doc or a PNG for the quarterly engineering review. It’s the fastest way to make a sprint report look like someone cared.',
    tags: [
      'sprint velocity',
      'agile',
      'scrum',
      'story points',
      'bar chart',
      'engineering metrics',
    ],
    keywords: [
      'sprint velocity chart template',
      'agile velocity visualization',
      'scrum metrics chart',
      'story points chart maker',
      'team velocity graph',
    ],
    layout: 'hub',
    centerLabel: 'Velocity',
    centerIcon: 'rocket3d',
    satellites: [
      { label: 'Sprint 1', icon: 'process', value: 21 },
      { label: 'Sprint 2', icon: 'process', value: 34 },
      { label: 'Sprint 3', icon: 'process', value: 29 },
      { label: 'Sprint 4', icon: 'process', value: 42 },
      { label: 'Sprint 5', icon: 'process', value: 38 },
      { label: 'Sprint 6', icon: 'process', value: 47 },
    ],
    faqs: [
      {
        q: 'How many sprints can the chart show?',
        a: 'Up to 8 bars render cleanly. For a longer history, switch the same data to the line chart layout for a velocity trend.',
      },
      {
        q: 'Can I track something other than story points?',
        a: 'Yes — PRs merged, bugs closed, deploys shipped: any per-sprint count works. Edit the values and the center label.',
      },
      {
        q: 'Can I match my team’s brand colors?',
        a: 'Yes — pick a custom accent in the canvas toolbar and the bars, beams and pulses recolor together.',
      },
    ],
    useCases: [
      'Sprint retros and reviews',
      'Quarterly engineering reports',
      'Team health check-ins',
      'Agile coaching workshops',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'bars',
      mode: 'pulses',
      accent: '#0ea5e9',
      bg: 'linear-gradient(135deg,#f0f9ff 0%,#ecfeff 100%)',
    },
  },
  {
    slug: 'budget-allocation-donut',
    title: 'Budget Allocation Donut',
    shortDescription:
      'An animated donut chart of budget split across departments — five editable slices with percentages for planning season',
    longDescription:
      'Budget season needs one chart everyone can read at a glance: where the money goes. This donut template splits a budget across Engineering, Marketing, Sales, Operations and everything else, each department a colored slice with its percentage printed on the ring and its icon beside it.\n\nAdjust the values as plans change and the ring re-proportions live — no redrawing slides at 11pm. It exports as a looping GIF for the planning doc or a crisp PNG for the finance deck, and the same template works for cost centers, headcount, or time allocation.',
    tags: [
      'budget',
      'allocation',
      'donut chart',
      'finance',
      'planning',
      'department split',
    ],
    keywords: [
      'budget allocation chart template',
      'budget breakdown donut',
      'department budget visualization',
      'spending split chart',
      'annual planning chart',
    ],
    layout: 'hub',
    centerLabel: '2026 Budget',
    centerIcon: 'dollar3d',
    satellites: [
      { label: 'Engineering', icon: 'code', value: 40, unit: '%' },
      { label: 'Marketing', icon: 'social', value: 25, unit: '%' },
      { label: 'Sales', icon: 'payment', value: 20, unit: '%' },
      { label: 'Operations', icon: 'automation', value: 10, unit: '%' },
      { label: 'Other', icon: 'layers', value: 5, unit: '%' },
    ],
    faqs: [
      {
        q: 'Do the percentages update if I change one value?',
        a: 'The donut always normalises the values you enter into proportional slices, so you can enter raw dollar amounts and the shares compute themselves.',
      },
      {
        q: 'Can I use dollar amounts instead of percentages?',
        a: 'Yes — enter absolute values and the ring splits proportionally; slices then show their computed share of the total.',
      },
      {
        q: 'How many departments fit on the ring?',
        a: 'Six slices render cleanly with labels. Group smaller items into an "Other" slice for readability.',
      },
    ],
    useCases: [
      'Annual and quarterly budget planning',
      'Finance review decks',
      'Headcount and cost-center splits',
      'Grant and project budget summaries',
    ],
    category: 'charts',
    categoryName: 'Charts & Data Visualization',
    style: {
      layout: 'donut',
      mode: 'pulses',
      accent: '#ec4899',
      bg: 'linear-gradient(135deg,#fdf2f8 0%,#fffbeb 100%)',
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
      // It's literally a funnel.
      layout: 'funnel',
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
      // CI/CD is a loop — commit → build → deploy → observe → commit.
      layout: 'cycle',
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
      // Factory → ERP → carriers → retail reads as milestones along a line.
      layout: 'timeline',
      mode: 'beams',
      accent: '#f59e0b',
      bg: grad('#fff7ed', '#fffbeb'),
    },
  },
};
