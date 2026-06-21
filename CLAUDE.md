# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PhysioOnline is a physiotherapy clinic management web app: a MERN stack split into two independently-run packages under `webapp/`:

- `project/` — React 18 + Vite frontend (clinic staff dashboard)
- `backend/` — Express 5 + Mongoose 8 REST API (ES modules)

There is no root package.json; each package is installed and run on its own.

## Commands

Frontend (`cd project`):
```bash
npm run dev       # Vite dev server (default http://localhost:5173)
npm run build     # production build
npm run preview   # serve the build
npm run lint      # ESLint over the whole project
```

Backend (`cd backend`):
```bash
npm run dev       # nodemon server.js (auto-reload)
npm start         # node server.js
```

There is **no test runner configured** in either package. The `feature-tests` skill assumes Vitest + React Testing Library, which are not installed — adding tests means adding that tooling first.

After editing a backend controller/model, the running `npm run dev` (nodemon) reloads automatically, but a fresh DB connection only happens on restart.

## Environment

Both packages read a local `.env` (not committed).

- Frontend (`project/.env`, must be `VITE_`-prefixed): `VITE_BACKEND_URL` (API base, e.g. `http://localhost:8080`), `VITE_ADMIN_EMAIL`.
- Backend (`backend/.env`): `MONGO_URI`, `JWT_SECRET`, `PORT` (defaults 8080), `ADMIN_EMAIL`.

The admin identity is config-driven on **both** sides: a logged-in employee is "admin" only if their email equals `VITE_ADMIN_EMAIL` / `ADMIN_EMAIL`. There is no admin role/flag in the DB.

## Backend architecture

Standard Express layering: `server.js` → `routes/*` → `controllers/*` → `models/*` (Mongoose). Each domain has a matching route+controller+model trio. Mounted route prefixes (see `server.js`): `/api/user`, `/api/enquiry`, `/api/patient`, `/api/assessment`, `/api/client`, `/api/report`, `/api/employee`, `/api/treatmentPlan`, `/api/attendance`. CORS is wide open (`origin: "*"`).

### Two separate auth systems — do not conflate them
- `middleware/employeeAuth.js` — verifies a JWT from the `token` header, sets `req.id` (employee id). This is the primary staff auth used by protected employee/enquiry routes.
- `middleware/auth.js` (`authUser`) — verifies a JWT from the `token` header, sets `req.contactNumber`. A separate, lighter scheme used by a few `/api/user`-style and patient-personal-details endpoints.

Auth is applied **inconsistently and per-route** — many routes are currently unauthenticated (e.g. `getEnquiry`, most `report` and `patient` reads). Check the specific route file before assuming a handler is protected.

### Core domain model
The **enquiry → patient** lifecycle is the spine of the app:
- An `enquiry` starts as `enquiryStatus: "lead"`. Converting it (`patientController.createPatient`) creates a `Patient`, flips the enquiry to `"patient"`, and links them (`enquiry.patientId` ↔ `patient.personalDetails.enquiryId`).
- Human-readable patient codes (`personalDetails.patientId`) are generated sequentially; `models/counterModel.js` (`Counter`) backs the sequence.
- `Patient` is a hub: it holds arrays of refs to `attendance`, `billing`, `treatment`, `assessment` (neuro/musculoskeletal/obesity/pilates forms), and `physioAssigned`. **`populate("patientId")` pulls all of this** — when a list view only needs `personalDetails`, always `select` it explicitly and use `.lean()` to avoid shipping/hydrating huge docs.
- `patientStatus` (active/inactive boolean) is duplicated on both `enquiry` and `patient.personalDetails`; list filtering keys off the patient copy.

The `report` domain is financial and separate from patient care: bill, expenses, inventory, rent, salary each have their own model and CRUD under `/api/report`.

### Mongoose conventions
Model registration is mixed: most use `mongoose.model("Name", schema)`; some guard against re-compile with `mongoose.models.x || mongoose.model(...)`. Note ref-name casing is **not** uniform (e.g. enquiry model name is lowercase `"enquiry"`, patient is `"Patient"`) — match the exact string when adding refs/populates. Schemas use `timestamps: true`, so `createdAt`/`updatedAt` are available for sorting.

## Frontend architecture

- Entry: `main.jsx` → `App.jsx`. All routing lives in `App.jsx` with `react-router-dom` v7; `Navbar` is always rendered.
- **Route protection is client-side only.** `routers/ProtectedRoute.jsx` redirects to `/auth` if `localStorage.webapptoken` is missing. `routers/ProtectedRouteAdmin.jsx` wraps admin-only pages (e.g. `/allEmployee`) and compares the logged-in employee email against `VITE_ADMIN_EMAIL`.
- Auth state is `localStorage`: `webapptoken` (JWT) and `loginEmployeeData` (JSON employee object). Components read these directly rather than via a context/store.
- API calls are made two ways — pick whichever the surrounding file already uses:
  - `api/fetchApi.js` — a `fetch` wrapper that prefixes `VITE_BACKEND_URL`, sets JSON headers, and adds an `Authorization: Bearer` header from `webapptoken`. Note the backend mostly expects the raw JWT in a `token` header, **not** `Authorization` — so many calls instead use raw `fetch` with `headers: { token: localStorage.getItem("webapptoken") }`.
  - Raw `fetch(`${backendURL}...`)` directly in components.
- Most screens live as flat files in `Component/` (≈32 components; pages like `AllEnquiry`, `PatientDetails`, `Reports`, `Bill`, `Attendence`). `pages/AuthPage.jsx` is the only thing under `pages/`. Subfolders group related UI: `Component/pdf/` (`@react-pdf/renderer` documents), `Component/showAssesmentDetails/`, `Component/personalDetailsSections/`, `Component/employeePersonalDetails/`.
- Export features are first-class: components generate **Excel** (`xlsx` + `utils/exportToExcel.js`) and **PDF** (`@react-pdf/renderer`, plus `jspdf`/`html2pdf` in places) client-side from already-fetched data.
- Styling is Tailwind (`tailwind.config.js`, `index.css`).

## Deployment

The frontend deploys to Vercel as an SPA; `project/vercel.json` rewrites all paths to `/index.html` so client-side routes work on refresh.
