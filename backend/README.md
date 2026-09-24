# Backend — Job Portal API

Node.js/Express REST API backed by MongoDB (Mongoose), with JWT cookie authentication and Cloudinary-hosted resume uploads.

See [API.md](API.md) for the full endpoint reference.

## Stack

- **Express** — HTTP server & routing
- **Mongoose** — MongoDB ODM
- **jsonwebtoken** + **bcrypt** — auth
- **cloudinary** + **express-fileupload** — resume storage
- **cors**, **cookie-parser**, **dotenv**

## Project layout

```
backend/
├── app.js                 # Express app: middleware, CORS, routes, error handler
├── server.js               # Entry point: loads Cloudinary config, starts the HTTP server
├── database/
│   └── dbConnection.js     # Mongoose connection
├── models/                 # Mongoose schemas (User, Job, Application)
├── controllers/             # Route handlers / business logic
├── routes/                  # Express routers, one per resource
├── middlewares/
│   ├── auth.js              # isAuthenticated — verifies the JWT cookie
│   ├── catchAsyncError.js   # Wraps async route handlers so rejections reach errorMiddleware
│   └── error.js             # Central error handler + ErrorHandler class
└── utils/
    └── jwtToken.js          # Issues a JWT and sets it as an httpOnly cookie
```

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values (see below).
3. `npm run dev` (auto-restart via nodemon) or `npm start`.

The server must be started **from the `backend/` directory** — `.env` is resolved relative to the process's working directory.

### Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (`4000` in dev) |
| `DB_URL` | MongoDB connection string (Atlas or local) |
| `FRONTEND_URL` | Origin allowed by CORS — must match where the frontend actually runs |
| `JWT_SECRET_KEY` | Secret used to sign auth tokens — use a long random value |
| `JWT_EXPIRE` | JWT lifetime, e.g. `7d` |
| `COOKIE_EXPIRE` | Cookie lifetime in days, e.g. `7` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary account for resume uploads |
| `NODE_ENV` | `development` / `production` |

`.env` is git-ignored — never commit real credentials. If credentials are ever accidentally committed, rotate them; removing the file from a later commit does not remove it from git history.

## Auth model

Login/register issue a JWT, returned in the response body **and** set as an `httpOnly` cookie named `token`. The frontend relies on the cookie (requests are made with `withCredentials: true`); the token in the body is there for non-browser clients but the API itself never reads an `Authorization` header.

`isAuthenticated` ([middlewares/auth.js](middlewares/auth.js)) verifies the cookie, loads the user, and rejects with `401` if the token is invalid/expired or the user no longer exists. Ownership checks (e.g. only the employer who posted a job can edit/delete it) live in the individual controllers, not in middleware.

## Error handling

Route handlers are wrapped in `catchAsyncErrors` so any thrown/rejected error is forwarded to `errorMiddleware` ([middlewares/error.js](middlewares/error.js)), which normalizes Mongoose `CastError`s, duplicate-key errors, and JWT errors into consistent `{ success: false, message }` responses.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run the server once (`node server.js`) |
| `npm run dev` | Run with nodemon (auto-restart on file changes) |
