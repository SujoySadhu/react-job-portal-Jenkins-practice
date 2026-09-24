# Frontend — Job Portal

React 18 SPA (Vite) for the Job Portal. Talks to the [backend API](../backend/API.md) over cookie-based auth.

## Stack

- **React 18** + **React Router 7** — UI & routing
- **Vite** — dev server / build
- **Axios** — HTTP client (`withCredentials: true` everywhere, since auth is a cookie)
- **react-hot-toast** — notifications
- **ESLint** (`eslint:recommended` + `react`/`react-hooks`/`react-refresh` plugins)

## Project layout

```
frontend/
├── src/
│   ├── main.jsx              # Entry point; defines Context (auth/user state) and mounts <App />
│   ├── App.jsx                # Routes + fetches the logged-in user on load
│   ├── App.css                # Global styles
│   └── components/
│       ├── Auth/              # Login, Register
│       ├── Home/               # Landing page sections (Hero, Categories, Companies, How It Works)
│       ├── Job/                 # Job listing, job details, post/edit job, "my jobs"
│       ├── Application/         # Apply-to-job form, list of applications, resume preview modal
│       ├── Layout/               # Navbar, Footer
│       └── NotFound/             # 404 page
└── public/                    # Static assets served as-is (logos, sample CVs, etc.)
```

## State & auth

`Context` (from `src/main.jsx`) holds `{ isAuthorized, setIsAuthorized, user, setUser }` and is provided at the app root. `App.jsx` calls `GET /user/getuser` on mount to restore the session from the auth cookie; components read `isAuthorized`/`user` via `useContext(Context)` to gate routes and branch UI by role (`"Job Seeker"` vs `"Employer"`).

Routing (`App.jsx`):

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Public landing page |
| `/login`, `/register` | `Login`, `Register` | Redirect to `/` if already authorized |
| `/job/getall` | `Jobs` | All open jobs |
| `/job/:id` | `JobDetails` | Single job; "Apply Now" link for job seekers |
| `/job/post` | `PostJob` | Employer only |
| `/job/me` | `MyJobs` | Employer only — inline edit/delete of your own jobs |
| `/application/:id` | `Application` | Job seeker only — apply form |
| `/applications/me` | `MyApplications` | Role-dependent: your applications (seeker) or received applications (employer) |
| `*` | `NotFound` | 404 |

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and point `VITE_API_URL` at your running backend (default `http://localhost:4000/api/v1`).
3. `npm run dev` — starts Vite on `http://localhost:5173`.

The backend's `FRONTEND_URL` env var must match this origin, or CORS will reject requests.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint (`--max-warnings 0`) |
