# 🎓 Alumni Connect

Alumni Connect is a **role-based alumni management platform** designed to strengthen interaction between **students, alumni, and administrators** of an institution.  
The platform enables secure authentication, alumni networking, job opportunity sharing, and event/gallery management.

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt
- dotenv

### Frontend
- React
- Vite
- Axios
- React Router

---

## ✅ Implemented Features

### 🔐 Authentication
- Register (Student / Alumni)
- Login & Logout
- Get current logged-in user
- JWT-based authentication (stored in cookies)

### 👥 User Management
- Get user by ID
- Update profile (Owner or Admin)
- Delete user (Admin only)
- List all users (Admin)
- List alumni users

### 📅 Events (Admin Only)
- Create events
- List events
- Update events
- Delete events

### 🖼️ Gallery (Admin Only)
- Upload images
- List images
- Delete images

### 💼 Job Opportunities
- Add job postings (Authenticated users)
- List job postings
- Update job postings (Admin)
- Delete job postings (Admin only)
- Job deletion restricted if closing date is more than 7 days away

### 🛠️ Debug & Monitoring
- `/debug/status` endpoint
  - Database connection state
  - Record counts for major collections

---

## 🖥️ Frontend Pages

Located in `frontend/src/pages`:

- Home
- About
- AuthPage (Login / Register)
- Alumni Directory
- Events
- Gallery
- Opportunities (Jobs)
- Profile

---

## 📁 Project Structure

```
alumni_connect/
│
├── backend/                              # Express API Server
│   ├── src/
│   │   ├── controllers/                  # Business logic
│   │   ├── models/                       # Mongoose schemas
│   │   ├── routes/                       # API route definitions
│   │   ├── middlewares/                  # Auth & role middleware
│   │   ├── db/                           # MongoDB connection
│   │   ├── services/                     # Utility services
│   │   └── app.js                        # Express app setup
│   │
│   ├── seed.js                           # Admin seeding
│   ├── server.js                         # Server entry point
│   └── package.json
│
├── frontend/                             # React (Vite)
│   ├── src/
│   │   ├── pages/                        # Page components
│   │   ├── components/                   # Reusable UI components
│   │   ├── context/                      # React Context (Auth, Theme)
│   │   ├── App.jsx                       # Main router
│   │   └── main.jsx                      # Vite entry point
│   │
│   ├── index.html
│   └── package.json
│
├── docs/                                 # Documentation
│   ├── screenshots/
│   └── videos/
│
├── .env                                  # Environment variables (not committed)
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm
- MongoDB (Local or Atlas)

### Start Backend
```bash
cd backend
npm install
npm start
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Optional admin seeding
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Frontend
VITE_API_BASE=http://localhost:3000
```

---

## 🌐 API Endpoints

### Auth (`/auth`)
- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/logout`
- GET `/auth/me` (protected)

### Users (`/users`)
- GET `/users` (Admin)
- GET `/users/alumni`
- GET `/users/:id`
- PUT `/users/:id` (Owner/Admin)
- DELETE `/users/:id` (Admin)

### Events (`/api/events`)
- GET `/api/events`
- POST `/api/events` (Admin)
- PUT `/api/events/:id` (Admin)
- DELETE `/api/events/:id` (Admin)

### Gallery (`/api/gallery`)
- GET `/api/gallery`
- POST `/api/gallery` (Admin)
- DELETE `/api/gallery/:id` (Admin)

### Jobs (`/api/jobs`)
- GET `/api/jobs`
- POST `/api/jobs` (Authenticated)
- PUT `/api/jobs/:id` (Admin)
- DELETE `/api/jobs/:id` (Admin with closing-date restriction)

### Debug
- GET `/debug/status`

---

## 📝 Notes

- Admin account can be auto-created at startup using environment variables.
- JWT authentication is enforced on protected routes.
- Sensitive credentials must never be committed to GitHub.

---

## 🔮 Future Enhancements

- 💬 Real-time chat between Students and Alumni (Socket.IO)
- 🔔 Notifications system
- 🧑‍🏫 Alumni mentorship feature
- 📎 Resume sharing
- 📱 Responsive UI improvements

---

## 👤 Author

**Samiksha Lone**  
Backend & Full-Stack Developer
