# 🎓 Alumni Connect

Alumni Connect is a MERN (MongoDB, Express, React, Node) full-stack application that helps students and alumni connect for networking, events, job postings, and real-time messaging. The project includes role-based authorization (admin, alumni, student), file uploads (resumes, gallery), and optional AI features.

**Live Links:**
- 🌐 **Frontend**: https://alumni-connect-frontendd.vercel.app
- 🔌 **Backend API**: https://alumni-connect-backend-hrsc.onrender.com
- 💻 **GitHub**: https://github.com/Samiksha-Lone/alumni-connect

---

## 📱 What I Built

A full-stack platform where:
- ✅ **Login/Register** with roles (admin, student, alumni)
- 📅 **Events page** - admin creates events, students RSVP
- 💼 **Jobs board** - alumni post opportunities
- 💬 **Real-time Chat** - message between users using Socket.IO
- 👤 **Profile editing** - customize your profile
# 🎓 Alumni Connect

---

## What this does (features)
- Authentication & authorization (JWT + role checks)
- Events: create, edit, delete (admin); list and RSVP (students)
- Jobs: alumni can post/edit/delete job opportunities
- Real-time chat with Socket.IO (conversations, messages)
- User profiles with resume upload and avatar
- Gallery for images (upload and moderation)
- API docs via Swagger (`/docs`) and a small AI assistant (optional)

---

## Tech stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Atlas)
- Realtime: Socket.IO
- Auth: JWT + bcrypt

---

## System requirements
- Node.js 18+ (20 recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB

---

## Local setup (recommended)
1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit .env: MONGO_URI, JWT_SECRET, FRONTEND_URL, ALLOWED_ORIGINS
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional: seed sample data

```bash
node backend/seed.js
```

Notes: backend default port is `10000`; frontend runs on Vite's port (usually `5173`).

---

## Environment variables (key ones)
See `backend/.env.example` for a full template. Important keys:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWTs
- `PORT` — backend port (default `10000`)
- `FRONTEND_URL` / `ALLOWED_ORIGINS` — for CORS and Socket.IO
- `GEMINI_API_KEY` — optional (for AI features)

---

## API quick reference (local)
Base: `http://localhost:10000`

- Auth
	- POST `/auth/register`
	- POST `/auth/login`
	- GET `/auth/me`

- Events
	- GET `/events`
	- POST `/events` (admin)
	- PUT `/events/:id` (admin)
	- DELETE `/events/:id` (admin)
	- POST `/events/:id/rsvp`

- Jobs
	- GET `/jobs`
	- POST `/jobs` (alumni)
	- PUT `/jobs/:id`
	- DELETE `/jobs/:id`

- Chat
	- GET `/chat/conversations`
	- POST `/chat/message`
	- GET `/chat/messages/:userId`

- Users
	- GET `/users`
	- GET `/users/:id`
	- PUT `/users/:id`
	- POST `/users/:id/upload-resume`

- Gallery
	- GET `/gallery`
	- POST `/gallery`

For request/response details, inspect `backend/src/controllers` or use the Swagger UI at `/docs`.

---

## Where to look in the code
- Backend entry: `server.js` and `backend/src/app.js`
- Controllers: `backend/src/controllers`
- Routes: `backend/src/routes`
- Models: `backend/src/models`
- Frontend entry: `frontend/src/main.jsx` and `frontend/src/App.jsx`
- Frontend components and pages: `frontend/src/components`, `frontend/src/pages`

---

## Project structure

```
alumni-connect/
├── frontend/
│   ├── src/
│   │   ├── api.js
	 │   ├── App.jsx
	 │   ├── main.jsx
	 │   ├── components/
	 │   ├── context/
	 │   ├── pages/
	 │   └── styles/
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── db/
│   │   └── utils/
│   ├── server.js
│   ├── seed.js
│   ├── .env.example
│   └── package.json
│
├── uploads/                # file uploads (resumes, gallery)
├── README.md
└── package.json
```

## Architecture flow (visual)

Below is a simple flow diagram showing how the frontend, backend, database and Socket.IO interact.

```mermaid
flowchart TD
	subgraph FE [Frontend (React + Vite)]
		U[User Interface]
		AC[Auth Context]
		SC[Socket Context]
	end

	subgraph BE [Backend (Express + Socket.IO)]
		API[REST API]
		SIO[Socket.IO Server]
		AUTH[Auth Service]
		UP[Upload Service]
		DOCS[Swagger / Docs]
	end

	DB[(MongoDB Atlas)]
	STORAGE[(Uploads / S3 or local storage)]
	AI[Gemini AI (optional)]

	U -->|HTTP: /auth, /events, /jobs, /users| API
	AC -->|attach JWT in headers| API
	API -->|verify token| AUTH
	API -->|read / write| DB
	API -->|store files| STORAGE
	API -->|serve docs| DOCS

	U -->|Socket connect| SIO
	SC -->|send/receive messages| SIO
	SIO -->|persist messages via API or direct DB write| DB
	SIO -->|broadcast events| U

	API -->|call for AI processing| AI
	AI -->|response / suggestions| API

	UP -->|save resumes/images| STORAGE
	AUTH -->|user info| DB

	classDef ext fill:#f9f,stroke:#333,stroke-width:1px;
	class AI ext; class STORAGE ext; class DB ext;
```

---

## Author
Samiksha Balaji Lone — Final year B.Tech IT

Contact: samikshalone2@gmail.com

---

License: ISC

Last updated: 2026-02-15
