# Frontend Architecture & Engineering Guidelines

The frontend application is constructed with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Directory Navigation

```
docs/frontend/
├── README.md                          # You are here: Frontend Architecture Overview
├── design-patterns.md                 # Master Directive: UI/UX & Creative Design System
└── work-patterns.md                   # Core Engineering: Max 120 LOC, Server Components
```

---

## The 5 Foundational Frontend Principles

1. **Max ~120 Lines Per File:** No component, hook, or utility may become a monolithic blob. If a file grows past ~120 lines, decompose it into focused sub-components or custom hooks.
2. **The "Orchestrator" Page Pattern (Pure Server Components):**
   * All `page.tsx` files **must be pure Server Components (NO `'use client'`)**.
   * Every `page.tsx` exports typed SEO `metadata: Metadata = { title, description }`.
   * Serves as an executive summary / table of contents that can be understood in 15 seconds.
3. **Interactive State Belongs in Client Component Leaves:**
   * Any interactivity (`useState`, `onClick`, `useForm`, `useMutation`, browser APIs) must be encapsulated in a dedicated Client Component leaf (`'use client'`) inside `features/<domain>/components/`.
4. **Strict Layer Separation:**
   * `utils/`: Business logic, math, fee formulas, currency formatters (pure TypeScript).
   * `hooks/`: React state, queries, mutations, form controllers.
   * `components/`: Visual presentation and styling (no direct HTTP calls).
   * `api/`: Pure HTTP functions using the centralized Axios client.
   * `schemas/`: Zod schemas mirroring backend NestJS DTOs.
5. **Aesthetic Excellence:** High-contrast dark modes, glassmorphism, subtle atmospheric glows, and micro-animations.
