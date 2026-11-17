# ITE5425 — Mastery Assignment 2: My Art Explorer

A guided full-stack Next.js 15 application extended from the instructor's **ArtExplorer_A2_Guided_Starter.zip**, using the supplied **A2-01 to A2-20** code blocks. The existing Home, Browse, Advanced Search, About, and artwork detail pages remain available.

## What is implemented

- Public museum artwork search and detail pages using The Met Collection API (`/v1.1/search` and `/v1/objects/[id]`).
- MongoDB Atlas connection health endpoint and demo-user seed script with hashed passwords.
- JWT login, current-user lookup, and logout using an HttpOnly cookie.
- Shared AuthContext with instant Navbar updates and session restoration after refresh.
- Shared FavoritesContext: save/remove artwork on browse cards or detail screens, live Navbar count, and per-account persistence in Atlas.
- My Favourites page with artwork previews, remove action, editable notes (maximum 250 characters), and error/success messages.
- Profile page with Light/Dark theme selection, Atlas persistence, and site-wide theme update.
- Admin-only directory navigation and read-only directory with backend 401/403/200 permission checks.
- Customised `student-config.js` and responsive visual styling.

## Important: what requires your own setup

This source ZIP deliberately **does not include a real MongoDB Atlas connection, `.env.local`, accounts in your Atlas database, actual Postman screenshots, a repository URL, a Vercel URL, or a narrated video**. These require your own credentials and access. All application source files are present, but it is **not verified end-to-end against your Atlas account** until you perform the steps below. Do not submit invented screenshots or claim a deployment that did not happen.

## 1. Requirements

- Node.js 20+ (recommended Node.js 22), npm, and a MongoDB Atlas cluster.
- An Atlas database user and a network access rule appropriate to your environment.
- Postman (desktop or VS Code extension) for the backend test evidence.

## 2. Install and configure

```bash
npm install
```

Create `.env.local` in the project root by copying `.env.example` and replace all sample values:

```dotenv
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=art_explorer_YOUR_STUDENT_ID
JWT_SECRET=REPLACE_WITH_A_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
```

Use your own database name. On macOS/Linux you can generate a random JWT secret using `openssl rand -hex 32`; on Windows PowerShell, use a secure random generator (never paste a secret into the browser or this assignment ZIP). The Atlas URI and JWT_SECRET are server-side values, not `NEXT_PUBLIC_` variables.

**Never commit or upload `.env.local`.** The `.gitignore` excludes it. The instructor's demo credentials are shown only in the supplied seed script; use throwaway demo accounts and replace credentials before any public deployment.

## 3. Seed, run and verify

```bash
npm run seed
npm run dev
```

Open `http://localhost:3000`. Test public pages first, then `http://localhost:3000/api/health` (expected: `connected: true`). Sign in using the **temporary** classroom user records created by `scripts/seed-users.mjs`; the script shows the demo emails and passwords. Do not reuse any personal account password. Verify the login cookie is HttpOnly in the browser or Postman.

Run source wiring checks:

```bash
npm test
npm run build
```

`npm test` is a source-wiring check; it is **not** a substitute for database, browser, or API integration tests. After setting up your own Atlas connection, carry out the Postman and UI checks in `docs/POSTMAN_TESTS_AND_CAPTIONS.md`.

## 4. Project architecture

```text
app/
  page.jsx, about/, artwork/, search/    Public browsing pages (preserved)
  login/, favorites/, profile/, admin/    Student-facing A2 screens
  api/health/                           Atlas connection check
  api/auth/{login,me,logout}/           Session and identity APIs
  api/favorites/ and [id]/              Protected favourites CRUD
  api/preferences/                      Saved light/dark preference
  api/admin/users/                      Admin-only redacted directory
components/
  AuthProvider.jsx                      Shared signed-in user
  FavoritesProvider.jsx                 Shared favourites and count
  FavoriteButton.jsx                   Reusable artwork action
  AccountNav.jsx                       Role-aware Navbar
  ArtworkCard.jsx                       Museum artwork card
lib/mongodb.js, lib/auth.js            Instructor-provided server helpers
scripts/seed-users.mjs                 Instructor-provided demo seed
student-config.js                      Individualised collection info
```

**Where data lives:** The Met API owns artwork metadata; Atlas owns users, saved artwork IDs, notes, and theme preferences. A verified session identifies the current user. React Context shares server-returned UI state, but does **not** replace Atlas persistence or backend permission checks.

## 5. Vercel deployment

1. Confirm `npm run build` succeeds with your own configuration.
2. Push the project to a private or instructor-approved GitHub repository **without `.env.local`**.
3. Import the repository into Vercel. Set `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET` as server-side environment variables in Project Settings.
4. Configure Atlas network access for the deployment using the least permissive practical rule.
5. Re-test login, count, notes, theme persistence and admin restrictions on the deployed site.
6. Treat the classroom seed accounts as disposable. The sample auth implementation is instructional; it lacks production-grade CSRF protections, rate limiting and comprehensive session controls.

## 6. Submission items

See `docs/SUBMISSION_CHECKLIST.md` for the remaining student-owned evidence, screenshots and 5–7 minute video. The required AI disclosure is in `ai-use.md`; read and personalise it before submitting. Fill in your own name, student ID and date in academic integrity declarations only after reviewing the work.

For the instructor's original backend source mapping, see `BLOCK_INDEX.md`. For Postman test instructions and caption drafts, see `docs/POSTMAN_TESTS_AND_CAPTIONS.md`.
