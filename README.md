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
cd frontendd
npm install
npm run dev
# App runs on http://localhost:5173
```

## Environment Setup
Create a `.env` file in the root directory:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/alumni_connect
JWT_SECRET=your_secret_key

VITE_API_BASE=http://localhost:3000
```

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
├── frontendd/         # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│   └── vite.config.js
├── .env               # Environment variables
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
- Frontend uses Vite proxy to route API calls to backend
- Admin-only operations are enforced server-side
- Dates use HTML5 `type="date"` input
- Passwords should never be logged or exposed
- JWT tokens stored in localStorage (frontend)

## Development
- Frontend linting: `npm run lint` (in `frontendd/`)
- Restart dev servers after changing `.env` values

## License
MIT
