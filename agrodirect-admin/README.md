# AgroDirect Admin Dashboard

Admin + UI/UX + QA module for the AgroDirect college project.
Built with React + Vite + Tailwind CSS + React Router.

## Setup
```
npm install
npm run dev
```
Open http://localhost:5173 — you'll be redirected to /login.

**Demo credentials (mock auth):**
- Email: `admin@agrodirect.dev`
- Password: `Admin@123`

## Status
- IMPLEMENTED & TESTED (build verified): Auth flow, protected routing, layout shell, design system, Dashboard.
- SCAFFOLDED, NOT YET BUILT: Users, Products, Orders, Analytics, Settings (placeholder pages, real routes).
- MOCKED: All data (`src/mock/`). Swap for real API calls once backend endpoints exist — see comments in each mock file.

## Folder structure
```
src/
  components/ui/       Reusable design-system primitives (Button, Input, Table, etc.)
  components/layout/   Sidebar, Header, AdminLayout shell
  context/              AuthContext (session + login/logout)
  routes/               ProtectedRoute guard
  pages/                One folder per admin section
  mock/                 Isolated mock data — replace when backend is ready
  lib/                  useMockQuery — simulated async fetch w/ loading & error states
```

## Security note
Frontend route protection here is a UX gate only. Per the project's security
requirements, every real API call must also be authorized server-side —
this scaffold does not implement that (no backend exists yet).
