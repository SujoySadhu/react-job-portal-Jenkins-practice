# API Reference

Base URL (local dev): `http://localhost:4000/api/v1`

All request/response bodies are JSON unless noted otherwise. Authenticated routes require the `token` cookie set by `/user/login` or `/user/register` (`withCredentials: true` on the client). There is no `Authorization: Bearer` header support — auth is cookie-only.

## Conventions

- Every response is `{ "success": boolean, ... }`.
- Errors are `{ "success": false, "message": string }` with a matching HTTP status code (see [error.js](middlewares/error.js)).
- Routes marked **Auth** require a valid `token` cookie ([auth.js](middlewares/auth.js)). Routes marked **Role** additionally require the logged-in user to have that role.
- `id` route params are MongoDB ObjectIds; an invalid one returns `400`/`404`, not a crash.

---

## User

| Method | Path             | Auth | Role | Description |
|--------|------------------|------|------|-------------|
| POST   | `/user/register` | –    | –    | Create an account |
| POST   | `/user/login`    | –    | –    | Log in, sets the `token` cookie |
| POST   | `/user/logout`   | ✅   | –    | Clears the `token` cookie |
| GET    | `/user/getuser`  | ✅   | –    | Return the logged-in user's profile |

### POST `/user/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "1234567890",
  "password": "at-least-8-chars",
  "role": "Job Seeker" // or "Employer"
}
```
Response `200`: `{ success, message, user, token }` (also sets the `token` cookie). `400` if a field is missing or the email is already registered.

### POST `/user/login`
```json
{ "email": "jane@example.com", "password": "at-least-8-chars", "role": "Job Seeker" }
```
`role` must match the account's stored role. Response `200` on success (sets cookie), `400`/`404` on bad credentials or role mismatch.

### POST `/user/logout`
No body. Response `200`: `{ success, message }`.

### GET `/user/getuser`
Response `200`: `{ success, user: { _id, name, email, phone, role } }` (password never included).

---

## Jobs

| Method | Path               | Auth | Role     | Description |
|--------|--------------------|------|----------|-------------|
| GET    | `/job/getall`      | –    | –        | List all non-expired jobs |
| GET    | `/job/:id`         | ✅   | –        | Get a single job by id |
| POST   | `/job/post`        | ✅   | Employer | Create a job |
| GET    | `/job/getmyjobs`   | ✅   | Employer | List jobs posted by the current user |
| PUT    | `/job/update/:id`  | ✅   | Employer, owner | Update a job you posted |
| DELETE | `/job/delete/:id`  | ✅   | Employer, owner | Delete a job you posted |

Update/delete return `403` if the job exists but was posted by a different employer.

### POST `/job/post`
```json
{
  "title": "Frontend Engineer",
  "description": "At least 30 characters describing the role.",
  "category": "Frontend Web Development",
  "country": "USA",
  "city": "Remote",
  "location": "At least 20 characters describing the location.",
  "fixedSalary": 5000
}
```
Provide either `fixedSalary` **or** `salaryFrom`/`salaryTo` (both a fixed and a ranged salary at once is rejected with `400`). Response `200`: `{ success, message, job }`.

---

## Applications

| Method | Path                        | Auth | Role       | Description |
|--------|-----------------------------|------|------------|-------------|
| POST   | `/application/post`         | ✅   | Job Seeker | Apply to a job (multipart form, includes a resume file) |
| GET    | `/application/employer/getall`  | ✅ | Employer   | List applications received for your jobs |
| GET    | `/application/jobseeker/getall` | ✅ | Job Seeker | List applications you submitted |
| DELETE | `/application/delete/:id`   | ✅   | Job Seeker, owner | Withdraw your own application |

Delete returns `403` if the application exists but belongs to a different job seeker.

### POST `/application/post`
`multipart/form-data` fields: `name`, `email`, `coverLetter`, `phone`, `address`, `jobId`, `resume` (file — PNG/JPEG/WEBP only, uploaded to Cloudinary). Response `200`: `{ success, message, application }`.

---

## Error codes you'll actually see

| Status | Meaning |
|--------|---------|
| 400 | Validation failure, missing fields, role mismatch |
| 401 | Missing/invalid/expired auth cookie |
| 403 | Authenticated, but not the resource's owner, or wrong role |
| 404 | Resource (job/application/user) not found |
| 500 | Unexpected server error (Cloudinary/DB failure, etc.) |
