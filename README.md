# Alumni Connect

A full-stack platform connecting alumni and students through networking, events, job opportunities, and a gallery.

## Stack
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Frontend:** React + Vite + Axios
- **Auth:** JWT (JSON Web Tokens)

## Quick Start

**Prerequisites:**
- Node.js v16+
- npm
- MongoDB (local or remote)

**Backend:**
```powershell
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

**Frontend:**
```powershell
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## Environment Setup
Create a `.env` file in the root directory from `.env.example`:
```powershell
cp .env.example .env
```
Then update `.env` with your values:
```
# Backend
PORT=3000
MONGO_URI=mongodb://localhost:27017/alumni_connect
JWT_SECRET=your_strong_secret_key_here

# Admin credentials (optional) - server creates admin on startup if provided
ADMIN_NAME=Main Admin
ADMIN_EMAIL=admin@alumni.com
ADMIN_PASSWORD=your_admin_password_here

# Frontend
VITE_API_BASE=http://localhost:3000
```

**Important:** Never commit `.env` to Git. Use `.env.example` as a template and keep real secrets in your local `.env`.

## Features
- **Authentication:** Login/Register for alumni, students, and admins
- **Events:** Create, view, and delete events (admin-only delete)
- **Gallery:** Upload and manage images (admin-only delete)
- **Opportunities:** Post and manage job/internship opportunities
- **Alumni Directory:** Browse and connect with alumni
- **Profile:** Update user profile information
- **Admin Dashboard:** Manage users and content

## Project Structure
```
alumni_connect/
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── app.js
│   └── server.js
├── frontend/          # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│   └── vite.config.js
├── .env               # Environment variables (local, do not commit)
├── .env.example       # Template for environment variables
├── .gitignore
└── README.md
```

## Key Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| GET | `/users` | Get all users (admin) |
| PUT | `/users/:id` | Update user profile |
| GET/POST/DELETE | `/api/events` | Manage events |
| GET/POST/DELETE | `/api/gallery` | Manage gallery |
| GET/POST/DELETE | `/api/jobs` | Manage opportunities |

## Notes
- All sensitive configuration is in `.env` (never commit to Git)
- Admin user is created automatically on startup if `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars are set
- Admin-only operations are enforced server-side via role checks
- JWT tokens stored in localStorage (frontend)
- Console logs removed from production code for security

## Development
- Frontend linting: `npm run lint` (in `frontend/`)
- Backend: use `npx nodemon server.js` for auto-restart on file changes
- Restart dev servers after changing `.env` values
- Both backend and frontend need separate terminal sessions

## License
MIT
