# Freelance Marketplace - Frontend Application

> 📚 **Complete Documentation:** Frontend architecture specifications, design systems, and engineering patterns are centralized in [**`docs/frontend/`**](../docs/frontend/README.md).

A modern, high-performance web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🎨 Architectural & Design Directives

* **[Frontend Architecture Overview](../docs/frontend/README.md)** — App Router hierarchy, domain-driven feature slices, and state management.
* **[UI/UX Creative Design System](../docs/frontend/design-patterns.md)** — Master directive for elite visual aesthetics, glassmorphism, typography, and color chemistry.
* **[Engineering Work Patterns](../docs/frontend/work-patterns.md)** — The ~120-line file ceiling, Server Component orchestrators, and React 19 leaf patterns.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Ensure `.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Directory Structure

```
frontend/
├── app/                              # Next.js App Router (Routing, Layouts, Route Groups)
│   ├── (auth)/                       # /login, /register, /verify-email
│   ├── (public)/                     # /, /jobs, /freelancers
│   ├── (dashboard)/                  # Client & Freelancer protected dashboards
│   │   ├── client/                   # /client/jobs, /client/jobs/new
│   │   ├── freelancer/               # /freelancer/proposals, /freelancer/profile/edit
│   │   ├── contracts/                # /contracts, /contracts/[id]
│   │   ├── messages/                 # /messages
│   │   └── wallet/                   # /wallet
│   └── admin/                        # Dedicated Staff Command Center portal
├── features/                         # Domain-driven feature slices (contracts, messages, proposals)
├── components/                       # Shared UI components, AppShell, layouts
├── hooks/                            # Global custom React hooks
├── lib/                              # Axios client instance, auth store, utilities
└── types/                            # Shared TypeScript interfaces
```
