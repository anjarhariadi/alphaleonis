# AGENTS.md

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is a personal portfolio website for Anjar Hariadi built with Next.js 16, Prisma, Tailwind CSS, tRPC, and Supabase. It features a public-facing blog and portfolio, with a protected admin dashboard for content management.

### Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS v4 with Shadcn UI components
- **Database**: PostgreSQL via Supabase with Prisma ORM
- **Authentication**: Supabase Auth
- **CMS**: Notion (used as backend for blog posts)
- **API**: tRPC

### Features

- Public blog with Notion as content source
- Public portfolio showcase
- Protected admin dashboard for managing profile, portfolio, experience, certificates, and blog posts

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack

# Building
npm run build            # Production build
npm run preview          # Build and preview production

# Linting & Type Checking
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run check            # Run lint + typecheck
npm run typecheck        # TypeScript type checking only

# Formatting
npm run format:check     # Check Prettier formatting
npm run format:write     # Fix Prettier formatting

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run Prisma migrations
npm run db:push         # Push schema to database
npm run db:studio       # Open Prisma Studio
```

**No test framework is currently configured.** If adding tests, use Vitest with React Testing Library.

## Code Style Guidelines

### General

- Use TypeScript with strict mode enabled
- Prefer `ESNext` modules with `Bundler` module resolution
- Use `server-only` package for server-side code
- All paths use the `@/*` alias pointing to `./src/*`

### Imports

- Use path aliases: `@/components/...`, `@/lib/...`, `@/server/...`
- Use inline type imports (enforced by ESLint):
  ```typescript
  import { z } from "zod"; // for types only
  import type { BlogPost } from "..."; // explicit type imports
  ```
- Order: external libs → internal aliases → relative paths
- Use `import type` for type-only imports

### Naming Conventions

- **Files**: kebab-case for utilities (`katex-util.ts`), PascalCase for components (`Button.tsx`)
- **Components**: PascalCase (`DashboardSidebar`)
- **Hooks**: camelCase with `use` prefix (`useMobile`)
- **Utilities**: camelCase (`cn`, `extractNotionPage`)
- **Constants**: UPPER_SNAKE_CASE for env keys, camelCase for others

### TypeScript

- Enable `strict` and `noUncheckedIndexedAccess`
- Use `zod` for runtime validation (especially API inputs)
- Define DTOs in `features/*/dto.ts` or `schema.ts`
- Avoid `any`; use `unknown` when type is truly unknown

### React Components

- Use `"use client"` directive for client components
- Use `function` declarations for components, not arrow functions
- Co-locate form schemas with their components in `features/*/form/`
- Use ShadCN with Radix UI primitives for interactive components
- Use `class-variance-authority` (cva) for component variants
- Export both component and its variants

### Forms

- Use `react-hook-form` with `zod` resolver
- Define schemas in `features/*/schema.ts`
- Use the shadcn/ui `Form` component pattern
- Display errors via `FormMessage` component

### tRPC

- Define routers in `src/server/api/routers/`
- Use `publicProcedure` for public endpoints, `protectedProcedure` for auth-required
- Input validation via `zod` schemas in `.input()`
- Return typed responses; handle errors in the procedure

### Styling

- Use Tailwind CSS v4
- Use `cn()` utility from `@/lib/utils` for class merging
- Prefer Tailwind classes over custom CSS
- Use shadcn/ui component patterns

### Error Handling

- Use `try/catch` in server actions and tRPC procedures
- Return error objects for recoverable errors
- Throw descriptive errors for auth/permission issues
- Use `sonner` (`toast`) for user-facing notifications

### Environment Variables

- All env vars validated via `@t3-oss/env-nextjs` in `src/env.js`
- Add new vars to `.env.example` and document
- Never commit `.env` files

### Database

- Use Prisma with the `db` instance from `@/server/db`
- Define schemas in `prisma/schema.prisma`
- Run `db:generate` after schema changes
- Use proper migrations for schema changes

### File Organization

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   └── dashboard/    # Protected admin pages
├── components/       # Shared UI components
│   └── ui/           # shadcn/ui components
├── features/         # Feature-based modules
│   └── */           # (e.g., blog/, portfolio/)
│       ├── form/     # Form components
│       ├── component/ # Feature-specific components
│       └── schema.ts # Zod schemas
├── hooks/           # Custom React hooks
├── lib/             # Utilities
│   ├── supabase/    # Supabase client
│   └── notion/      # Notion client
└── server/          # Server-side code
    ├── api/         # tRPC routers
    └── db.ts        # Prisma client
```
