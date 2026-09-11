# Frontend Engineering & Work Pattern Guidelines

## 1. Core Engineering Philosophy

The frontend is built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. 
The golden standard for this codebase is **human-readable, modular, and maintainable code** with strict separation of concerns.

### The Golden Rules
1. **Max ~120 Lines Per File**: No component, hook, or utility should become a monolithic blob. If a file grows past ~120 lines, break it down into focused sub-components, custom hooks, or utility helpers.
2. **The "Orchestrator" Page Pattern**: Page files (`app/**/page.tsx`) must serve as an executive summary / table of contents. Anyone opening a page should understand what it renders in 15 seconds. Page files must **never** contain raw HTTP calls, complex reducers, or hundreds of lines of nested JSX.
3. **Strict Layer Separation**:
   - **Pure Utilities (`utils/*.ts`)**: Business logic, math, fee formulas, currency formatters. Zero React dependencies, 100% unit-testable.
   - **Headless Hooks (`hooks/*.ts`)**: React state, queries, mutations, form controllers, and toast triggers.
   - **Presentational Components (`components/*.tsx`)**: Visual layout, styling, and event emission. No direct API calls.
   - **API Layer (`api/*.ts`)**: Pure HTTP request functions using the centralized Axios client.
   - **Validation Schemas (`schemas/*.ts`)**: Zod schemas that mirror backend NestJS DTOs.
4. **Never Rewrite Logic**: If a component or calculation is used in more than one place, extract it into `components/ui/` or `lib/utils/`.

---

## 2. Directory Structure (Domain-Driven Feature Slices)

```
frontend/
├── app/                              # Next.js App Router (Routing, Layouts, Route Groups)
│   ├── (auth)/                       # /login, /register, /verify-email
│   ├── (public)/                     # /, /jobs, /freelancers
│   ├── (dashboard)/                  # Client & Freelancer protected dashboards
│   │   ├── client/                   # /client/jobs, /client/jobs/new, /client/jobs/[id]/proposals
│   │   ├── freelancer/               # /freelancer/proposals, /freelancer/profile/edit
│   │   ├── contracts/                # /contracts, /contracts/[id]
│   │   ├── messages/                 # /messages
│   │   ├── wallet/                   # /wallet
│   │   └── settings/                 # /settings
│   ├── payments/                     # SSLCommerz callback routes (/success, /fail, /cancel)
│   ├── layout.tsx                    # Root layout + Providers wrapper
│   └── globals.css                   # Tailwind CSS imports & theme tokens
│
├── components/
│   ├── providers/                    # QueryClientProvider, ToastProvider, etc.
│   └── ui/                           # Reusable atomic UI (Button, Input, Badge, Modal, etc.)
│
├── features/                         # Business Domain Modules
│   ├── auth/                         # api, hooks, schemas, types, components
│   ├── jobs/                         # api, hooks, schemas, types, components, utils
│   ├── proposals/                    # api, hooks, schemas, types, components, utils
│   ├── contracts/                    # api, hooks, schemas, types, components, utils
│   ├── chat/                         # api, hooks, types, components, socket hooks
│   └── wallet/                       # api, hooks, schemas, types, components, utils
│
├── lib/
│   ├── api/                          # Axios instance + Request/Response Interceptors (Token refresh)
│   ├── queryClient.ts                # TanStack Query client configuration
│   ├── socket/                       # Socket.io connection manager
│   └── utils.ts                      # cn() helper & formatting functions
│
├── stores/                           # Global Zustand Stores
│   ├── useAuthStore.ts               # Access token, user session, auth state
│   └── useUIStore.ts                 # Drawers, modals, sidebar toggles
│
├── types/                            # Shared global DTOs and entity interfaces
│   ├── api.ts                        # Standard ApiResponse, PaginatedResponse
│   └── user.ts                       # User, Role, ClientProfile, FreelancerProfile
│
└── work_pattern.md                   # This file
```

---

## 3. The 4-Tier State Management Strategy

1. **Client Global State (Zustand)**:
   - Stores user session, active 15m JWT access token, and global UI drawer/modal states.
   - Directly accessible outside React (e.g. inside Axios request interceptors).
2. **Server State & Cache (TanStack Query v5)**:
   - Manages all backend API data, queries, mutations, cache invalidation, and optimistic UI updates.
3. **URL State (useSearchParams / nuqs)**:
   - Stores search filters, categories, skills, price sliders, and pagination. Bookmarkable and reload-safe.
4. **Real-Time WebSocket State (Socket.io + Zustand)**:
   - Active chat threads, incoming real-time messages, typing indicators, and online presence.

---

## 4. API Client & Silent Token Refresh (15m JWT Lifecycle)

The backend enforces short-lived (15-min) Access Tokens and 7-day Refresh Tokens.
The frontend handles this seamlessly via Axios response interceptors:
1. When any authenticated API request returns `401 Unauthorized`:
2. The Axios interceptor buffers incoming requests and calls `POST /auth/refresh`.
3. If refresh succeeds:
   - The new access token is saved in `useAuthStore`.
   - All queued requests are replayed with the new token.
4. If refresh fails:
   - `useAuthStore.getState().logout()` is triggered.
   - User is redirected to `/login`.

---

## 5. Coding Standards & Conventions

### Component Construction
- Every component must accept a TypeScript interface for its props.
- Keep components focused on a single responsibility.
- Use the `cn()` utility (`clsx` + `tailwind-merge`) for conditional Tailwind class merging.

### Form Handling
- All forms must use `react-hook-form` paired with `@hookform/resolvers/zod`.
- Schemas must live in the feature's `schemas/` directory.

### Error Handling & User Feedback
- Use `sonner` for toast notifications.
- Every async mutation hook should provide standard `onSuccess` and `onError` toast handling.
