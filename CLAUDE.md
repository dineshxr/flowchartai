# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowChart AI is an open-source, AI-powered flowchart generator built with Next.js 15. It transforms natural language descriptions into professional, editable diagrams using an Excalidraw-based canvas. The codebase is split into two main directories:

- `flowchartai/` - Main Next.js application
- Root directory contains legacy/removed files (marked as deleted in git status)

## Development Commands

Run all commands from the `flowchartai/` directory:

```bash
# Development
pnpm dev                    # Start development server with content collections watch
pnpm build                  # Build for production (includes content collections build)
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Check and auto-fix with Biome
pnpm lint:fix              # Fix with unsafe transformations
pnpm format                # Format code with Biome

# Database
# Data is stored in Google Firestore (Firebase Admin SDK) — no migrations or
# schema generation step. Collections/document types live in src/db/schema.ts.

# Content & Email
pnpm docs                 # Build content collections
pnpm email                # Start email development server on port 3333

# Deployment (Cloudflare Workers)
pnpm preview             # Build and preview
pnpm deploy              # Build and deploy
pnpm upload              # Build and upload
pnpm cf-typegen          # Generate Cloudflare types
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Radix UI components  
- **Canvas**: Excalidraw integration with Mermaid support
- **AI**: OpenRouter API (multiple AI models supported)
- **Database**: Google Firestore (Firebase Admin SDK)
- **Authentication**: Firebase Authentication (Google sign-in)
- **Storage**: Firebase Cloud Storage
- **Content**: Content Collections for MDX processing
- **Email**: React Email templates
- **Deployment**: Vercel, Cloudflare Workers, or self-hosted

### Key Directory Structure
```
flowchartai/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components (UI components in ui/)
│   ├── db/                  # Firestore client (getDb) + collections/types
│   ├── lib/                 # Utility functions and configurations
│   ├── mail/                # React Email templates
│   └── config/              # Application configuration
├── content/                 # MDX content for docs/blog
├── public/                  # Static assets
└── messages/                # i18n message files
```

### Import Paths
- `@/*` maps to `./src/*`
- `@/content/*` maps to `./content/*` 
- `@/public/*` maps to `./public/*`
- `content-collections` maps to `./.content-collections/generated`

## Configuration Notes

### Environment Setup
The application requires several environment variables for full functionality:
- Firebase: `FIREBASE_SERVICE_ACCOUNT_KEY` (Admin SDK — Firestore + Auth + Storage), plus the `NEXT_PUBLIC_FIREBASE_*` client config; optional `FIREBASE_STORAGE_BUCKET`
- OpenRouter / Google AI credentials for AI features
- Optional: Resend API for email notifications

### AI Models
Default model is `google/gemini-2.5-flash` but supports multiple providers through OpenRouter. Model configuration is in `src/app/api/ai/chat/flowchart/route.ts`.

### Feature Toggles
Feature flags are configurable in `src/config/website.tsx` for docs pages, AI pages, upgrade cards, and Discord widgets.

### Usage Limits
AI generation limits are configurable in `src/lib/ai-usage.ts`:
- Free tier: 1 AI generation per day per user
- Paid tiers: 500-1000 generations per month

## Development Notes

- Uses Biome for linting and formatting (not ESLint/Prettier)
- Content Collections for MDX processing with watch mode in development
- Database operations use the Firestore Admin SDK via `getDb()` from `@/db`
- Images are unoptimized for Cloudflare Workers compatibility
- Supports both Vercel and Cloudflare Workers deployment
- Multi-language support via next-intl

## Testing & Quality

- Run `pnpm lint` before committing to ensure code quality
- Firestore is schema-less — update document shapes/collections in `src/db/schema.ts`
- Content changes trigger automatic rebuilds in development mode