# CRM Platform — Frontend

A modern Customer Relationship Management frontend built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. It connects to a REST API backend for authentication, contact management, and activity logging.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Notifications | Sonner (toast) |
| Themes | next-themes (dark / light) |

---

## Features

- **Authentication** — Login and Register with HTTP-only cookie sessions. Auth state is persisted in `localStorage` for instant hydration on reload.
- **Contacts** — Full CRUD: create, view, edit, and delete contacts. Server-side pagination, loading skeleton, and per-row delete confirmation.
- **Activity Log** — Feed-style log of all contact actions (ADD / EDIT / DELETE) with colour-coded badges, timestamps, and server-side pagination.
- **Protected Routes** — Dashboard routes redirect unauthenticated users to `/login`. Auth routes redirect authenticated users to `/dashboard`.
- **Dark Mode** — Fully supported via `next-themes`.

---

## Project Structure

```
app/
  (auth)/           # Login & Register pages (public)
  (dashboard)/      # Protected pages — Dashboard, Contacts, Activity Log
  page.tsx          # Landing page  redirects to /login
components/
  auth/             # LoginForm, RegisterForm, AuthErrorAlert
  contacts/         # ContactsClient, AddContactDialog
  activity/         # ActivityLogsClient
  layout/           # Sidebar, Topbar, DashboardShell, nav-items
  ui/               # shadcn/ui primitives
lib/
  api.ts            # Axios instance with error normaliser interceptor
  types.ts          # Shared TypeScript types
  services/
    auth.service.ts
    contact.service.ts
    activity.service.ts
  validations/
    contact.ts      # Zod schemas
providers/
  AuthProvider.tsx  # Global auth context (localStorage-backed)
  ThemeProvider.tsx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see environment variables below)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace the value with your deployed API URL when running in production.

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## API Expectations

The frontend expects the following endpoints on `NEXT_PUBLIC_API_URL`:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, sets HTTP-only cookie |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/contacts?page&limit` | Paginated contact list |
| POST | `/api/contacts` | Create contact |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Delete contact |
| GET | `/api/activity?page&limit` | Paginated activity log |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
