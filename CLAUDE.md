# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Conquistadores App** is a Next.js 16 application for managing youth (jóvenes) in a religious organization. It handles user authentication, young person registration, group management, and PDF reporting. The app is built in Spanish and integrates with Supabase for backend services and database management.

## Tech Stack

- **Frontend**: Next.js 16.1.3, React 19.2.3, TypeScript 5.9.3
- **Styling**: Tailwind CSS 4, Radix UI components, Framer Motion
- **State Management**: TanStack React Query 5 (data fetching), React Hook Form 7 (forms), Zod 4 (validation)
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: Supabase PostgreSQL (managed)
- **Other**: jsPDF for PDF generation, recharts for data visualization

## Common Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code with ESLint
npm run lint
```

## Project Structure

```
conquistadores-app/
├── app/                           # Next.js App Router pages
│   ├── layout.tsx                 # Root layout with Providers
│   ├── providers.tsx              # React Query setup
│   ├── page.tsx                   # Home/landing page
│   ├── login/page.tsx             # User login
│   ├── registro/page.tsx          # Young person registration (public)
│   ├── recuperar-contrasena/      # Password recovery
│   ├── dashboard/                 # Protected admin/leader routes
│   │   ├── page.tsx               # Main dashboard
│   │   ├── reportes/page.tsx      # PDF reports
│   │   ├── configuracion/         # Settings
│   │   ├── layout.tsx             # Dashboard layout with nav
│   │   └── template.tsx           # Dashboard template
│   └── api/                       # Next.js API routes
│       ├── joven/registro/route.ts     # Public registration endpoint
│       ├── jovenes/route.ts            # List/filter young people
│       ├── jovenes/[id]/route.ts       # Get/update/delete individual
│       ├── grupos/route.ts             # Group management
│       └── users/                      # User management
├── components/
│   ├── dashboard/                 # Dashboard-specific components
│   └── ui/                        # Radix UI + custom components
├── hooks/                         # React hooks (auth context, etc.)
├── lib/
│   ├── supabase.ts               # Supabase client initialization
│   ├── utils.ts                  # Utility functions
│   └── globals.css               # Global Tailwind styles
├── types/                        # TypeScript definitions
├── utils/                        # Utility functions
├── supabase/
│   ├── functions/                # Deno Edge Functions (backend)
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── create-user/          # User creation
│   │   ├── jovenes/              # Young people endpoints
│   │   └── grupos/               # Group endpoints
│   └── migrations/               # Database migrations
├── types.ts                      # Central type definitions
├── tsconfig.json                 # TypeScript config with path aliases
└── next.config.ts               # Next.js config (React Compiler enabled)
```

## Key Path Aliases (TypeScript)

```
@/*              → ./*
@/app/*          → ./app/*
@/components/*   → ./components/*
@/hooks/*        → ./hooks/*
@/lib/*          → ./lib/*
@/types/*        → ./types/*
@/utils/*        → ./utils/*
@/styles/*       → ./styles/*
```

## Architecture Patterns

### Authentication Flow
1. User logs in via `/login` → POST `/app/api/auth` (proxies to Supabase Edge Function)
2. Supabase returns JWT token + refresh token
3. Access token stored in localStorage, refresh token in httpOnly cookie
4. Protected routes redirect to `/login` if no token present
5. Token included in Authorization header for all API requests

### Data Fetching
- **React Query** manages server state with automatic caching (5 min staleTime)
- Queries automatically refetch on window focus
- Mutations use `onSuccess`/`onError` callbacks for optimistic updates
- All API calls go through `app/api/*` routes (Next.js layer) which proxy to Supabase Edge Functions

### Form Handling
- **React Hook Form** + **Zod** for validation
- Validation happens both frontend (Zod schemas) and backend (Edge Functions)
- Common validation: email (RFC compliant), cedula (8-10 digits, unique), age (12-35), phone (+57 format)
- Consent checkboxes must be marked before submission

### Database Tables

Primary tables in Supabase PostgreSQL:

| Table | Purpose |
|-------|---------|
| `auth.users` | Supabase built-in auth |
| `users` | System users (admin/lider/usuario roles) |
| `jovenes` | Young people with age, cedula, status tracking |
| `grupos` | Groups with leader assignment |
| `actividad_usuarios` | Audit logging of all actions |
| `mensajes_cumpleaños` | Birthday messages |
| `plantillas_mensajes` | Message templates |
| `versiculos` | Scripture verses |
| `configuracion_sistema` | System settings |
| `historial_eliminaciones` | Deletion history |
| `notificaciones` | User notifications |

All tables have RLS (Row Level Security) policies enabled. See ARCHITECTURE.md for detailed schema.

## Important Files & Their Purpose

| File | Purpose |
|------|---------|
| `types.ts` | Central TypeScript interfaces: `Joven`, `Grupo`, `User`, `RegistroJovenFormData` |
| `lib/supabase.ts` | Supabase client singleton — always use this, never create new clients |
| `app/providers.tsx` | React Query provider — must wrap app for data fetching to work |
| `supabase/functions/auth/index.ts` | Authentication Edge Function — handles login/logout |
| `ARCHITECTURE.md` | Comprehensive system design, security model, deployment checklist |
| `DATABASE_SCHEMA.md` | Detailed table schemas with constraints |

## Common Tasks

### Adding a New Dashboard Page
1. Create file: `app/dashboard/[feature]/page.tsx`
2. Use React Query hook to fetch data: `useQuery(['key'], () => fetch(...))`
3. Import dashboard components from `components/dashboard/`
4. Page will be auto-protected by dashboard layout's auth check

### Updating Form Validation
1. Modify Zod schema in the component or create new schema file
2. Backend validation exists in Edge Function — update there too (in `supabase/functions/*/index.ts`)
3. Always validate on both sides (defense in depth)

### Adding API Endpoint
1. Create `app/api/[resource]/route.ts` for Next.js layer
2. This proxies/transforms requests to Supabase Edge Functions
3. Add Bearer token auth header from request
4. Return appropriate HTTP status codes (201 for create, 400 for validation, 401 for auth)

### Working with Edge Functions
- Located in `supabase/functions/`
- Written in Deno (TypeScript runtime)
- Use Supabase admin client or authenticated requests
- Access environment variables via `Deno.env.get('VARIABLE_NAME')`
- Deploy via Supabase CLI: `npx supabase functions deploy function-name`

## Environment Setup

Create `.env.local` (copy from `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key for public operations
- `NEXT_PUBLIC_API_URL` — API base URL (localhost:3000 for dev, production URL for prod)
- `NEXT_PUBLIC_APP_NAME` — Display name
- `NEXT_PUBLIC_APP_ENV` — "development" or "production"

## Security Considerations

1. **Never commit** `.env.local` or actual Supabase keys (use example file)
2. **RLS is active** on all database tables — verify policies before operations
3. **Age validation** must check birth date, not just input age (birthdays cross year boundaries)
4. **Cedula uniqueness** enforced both by database constraint and Edge Function validation
5. **Consent tracking** is required — 4 checkboxes (`datos_personales`, `whatsapp`, `procesamiento`, `terminos`)
6. **Activity logging** auto-captures user actions via database triggers in `actividad_usuarios` table

## Testing Approach

- **Manual testing**: Use the app in dev mode, verify forms and API responses
- **Validation testing**: Check edge cases (invalid email, age < 12, duplicate cedula)
- **Postman**: Collection available (`Conquistadores_API.postman_collection.json`) for API testing
- **Browser DevTools**: Network tab shows Edge Function logs, Console shows frontend errors

## Performance Notes

- React Query staleTime is 5 minutes — adjust if real-time updates needed
- Tailwind CSS is used for styling (no separate CSS files)
- React Compiler is enabled in next.config.ts for auto-memoization
- Image optimization via Next.js `<Image>` component when displaying media
- PDF generation uses jsPDF + jsPDF-autotable for reports

## Known Patterns & Conventions

1. **API responses** from Edge Functions follow pattern: `{ success: boolean, data?, error?, message? }`
2. **Dates stored as ISO strings** in database (UTC), converted to local in frontend
3. **Phone numbers** use Colombian format: `+57XXXXXXXXXX`
4. **Estado field** is enum-like: `activo | inactivo | eliminado`
5. **Component naming**: PascalCase for React components, kebab-case for filenames
6. **Hooks** for complex logic (auth, data fetching) go in `hooks/` directory

## Deployment

- **Frontend**: Deploy Next.js build via Vercel or similar (create production build with `npm run build`)
- **Backend**: Edge Functions deployed to Supabase via `npx supabase functions deploy`
- **Database**: Managed by Supabase (auto-backups, replicas configured)
- See ARCHITECTURE.md for pre-production checklist (HTTPS, rate limiting, RLS review, etc.)

## References

- **ARCHITECTURE.md** — Full system design, auth flow diagrams, security model
- **DATABASE_SCHEMA.md** — Table definitions with all columns and constraints
- **API_DOCUMENTATION.md** — Edge Function endpoints and request/response formats
- **Supabase Docs**: https://supabase.com/docs — for SDK usage, Edge Functions, RLS, etc.
- **Next.js 16 Docs**: https://nextjs.org/docs — for App Router, API routes, deployment

## Supabase Integration Notes

This project requires **Supabase connector authentication** if using the MCP server. Enable via:
- Claude.ai: Connector settings for Supabase
- Claude Code CLI: `/mcp` to authorize the server

Without authentication, Supabase-specific MCP tools will be unavailable. See the project's Supabase setup in `.env.local.example` for connection details.

## Recent Work (Last 20 commits)

The app recently:
- Fixed birthday calculations using UTC dates (birthday cross-year issue)
- Enhanced PDF report generation
- Removed calendar widget from UI
- Improved young person registration validation and error handling
- Achieved production-ready build status

See `git log` for detailed commit history.
