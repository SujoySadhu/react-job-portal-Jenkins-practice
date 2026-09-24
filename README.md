# Job Portal App with MERN Stack

A job portal built on the MERN stack (MongoDB, Express.js, React.js, Node.js). Employers post and manage job listings; job seekers browse jobs and submit applications with a resume upload.

- **Backend docs:** [backend/README.md](backend/README.md) — architecture, env vars, scripts
- **API reference:** [backend/API.md](backend/API.md) — every endpoint, request/response shapes, auth rules
- **Frontend docs:** [frontend/README.md](frontend/README.md) — routes, state, components

## Features

- **Authentication:** JWT-based, stored as an httpOnly cookie; two roles, `Job Seeker` and `Employer`.
- **Job listings:** Employers create/edit/delete their own jobs; anyone can browse open listings.
- **Applications:** Job seekers apply with a resume (uploaded to Cloudinary); employers see applications received for their jobs, job seekers see and can withdraw their own.
- **Authorization:** Role checks plus per-resource ownership checks (an employer can only edit/delete jobs they posted; a job seeker can only delete their own applications).

## Technologies used

- **Frontend:** React 18, React Router 7, Vite, Axios
- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Auth:** JSON Web Tokens (httpOnly cookie), bcrypt for password hashing
- **File storage:** Cloudinary (resume uploads)

## Architecture

```
┌────────────┐   HTTPS + cookie   ┌────────────┐        ┌────────────┐
│  Frontend   │ ─────────────────▶ │  Backend    │ ─────▶ │  MongoDB    │
│  (Vite/React)│ ◀───────────────── │  (Express)  │        │  Atlas      │
└────────────┘     JSON API        └────────────┘        └────────────┘
                                          │
                                          ▼
                                    ┌────────────┐
                                    │  Cloudinary │  (resume files)
                                    └────────────┘
```

The two apps are independent: the frontend is a static SPA that talks to the backend's REST API at `VITE_API_URL`; the backend is a standalone Express server that talks to MongoDB and Cloudinary. They're started, deployed, and versioned separately (see [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md)).

## Repository layout

```
.
├── backend/     # Express API — see backend/README.md and backend/API.md
├── frontend/    # React SPA — see frontend/README.md
└── README.md    # you are here
```

## Getting Started

### Prerequisites

- Node.js 18+ (project is tested with Node 22)
- A MongoDB connection string (MongoDB Atlas or a local MongoDB server)
- A Cloudinary account (for resume uploads)

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/exclusiveabhi/react-job-portal.git
   cd react-job-portal
   ```
2. Install dependencies for both apps:
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Configure environment variables — copy each app's `.env.example` to `.env` and fill in real values:
   ```sh
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   See [backend/README.md](backend/README.md#environment-variables) for what each backend variable does. `.env` files are git-ignored — never commit real credentials, and if any ever leak into git history, rotate them immediately rather than just deleting the file.
4. Run the backend (from `backend/`):
   ```sh
   npm run dev
   ```
5. In a second terminal, run the frontend (from `frontend/`):
   ```sh
   npm run dev
   ```
6. Open `http://localhost:5173`. The backend's `FRONTEND_URL` and the frontend's `VITE_API_URL` must point at each other, or requests will be rejected by CORS.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Abhishek Rajput - [GitHub](https://github.com/exclusiveabhi)

Project Link: [https://github.com/exclusiveabhi/react-job-portal.git](https://github.com/exclusiveabhi/react-job-portal.git)
