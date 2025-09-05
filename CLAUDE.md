# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YenKit is a React Router v7 application with server-side rendering (SSR) enabled by default. The project uses TypeScript, TailwindCSS, and Vite as the build system.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Type checking and generation
npm run typecheck

# Start production server
npm run start
```

## Architecture

### File Structure
- `app/` - React Router application code
  - `routes.ts` - Route configuration using React Router v7 config syntax
  - `root.tsx` - Root layout with error boundaries and meta/link functions
  - `routes/` - Individual route components
  - `welcome/` - Shared components
- `react-router.config.ts` - React Router configuration (SSR enabled)
- `vite.config.ts` - Vite configuration with React Router, TailwindCSS, and TypeScript path plugins

### Key Architectural Patterns

**React Router v7**: Uses file-based routing with explicit route configuration in `app/routes.ts`. Routes export `meta`, `loader`, `action`, and default component functions.

**TypeScript Path Mapping**: Uses `~/*` alias pointing to `./app/*` for imports.

**SSR Configuration**: Server-side rendering is enabled via `react-router.config.ts` with `ssr: true`.

**Build Output**: Production builds generate `build/client/` (static assets) and `build/server/` (server code).

## Development Notes

- Uses React Router v7's new routing system with explicit route configuration
- TailwindCSS v4 is configured via Vite plugin
- TypeScript strict mode is enabled
- No linting or testing setup is currently configured
- The project uses ES modules (`"type": "module"` in package.json)

## Deployment

The project includes a multi-stage Dockerfile for containerized deployment. The production server runs on `npm run start` which serves the built application.