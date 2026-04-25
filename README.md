# Alumni Connect — Student and Alumni Networking Platform

> A full-stack MERN application built to strengthen connections between alumni and current students through mentorship and opportunities.

## 🔗 Links
- **Live Demo**: [https://alumni-connect-frontendd.vercel.app](https://alumni-connect-frontendd.vercel.app)
- **GitHub Repository**: [https://github.com/Samiksha-Lone/alumni-connect](https://github.com/Samiksha-Lone/alumni-connect)

## Overview

Alumni Connect is a centralized platform designed to bridge the gap between educational institutions, current students, and alumni. It facilitates networking, career guidance, and campus engagement through a unified and interactive portal.

## Problem Statement

- **Fragmented Communication**: Lack of a centralized system for students and alumni to interact and share opportunities.
- **Limited Mentorship Access**: Students struggle to find structured guidance from experienced alumni in their respective fields.
- **Outdated Alumni Records**: Institutions face challenges in tracking alumni career progression and achievements.

## Solution

Alumni Connect solves these challenges by offering a centralized directory, real-time messaging, and an opportunities board. It enables students to easily seek mentorship and apply for jobs, while allowing institutions to efficiently manage alumni data and organize events.

## Key Features

- 🔐 **Role-Based Authentication** — Secure, specialized access for Students, Alumni, and Admins
- 👥 **Dynamic Alumni Directory** — Searchable profiles with advanced filtering by course and company
- 💬 **Real-Time Chat** — Instant messaging via Socket.IO for immediate networking and mentorship
- 💼 **Opportunities Board** — Dedicated section for posting and applying to jobs and internships
- 📅 **Event Management** — Built-in RSVP system to track campus events and attendance
- 🖼️ **Campus Gallery** — A centralized repository for sharing and viewing photos from campus life and alumni events
- ⚙️ **Admin Dashboard** — Comprehensive moderation tools for managing users, events, and opportunities
- 📱 **Responsive UI** — Mobile-optimized layout with a modern design system

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Real-time** | Socket.IO |
| **Auth & Security** | JWT, bcryptjs, Helmet.js, express-rate-limit |
| **Email** | Nodemailer (SMTP) |
| **Deployment** | Vercel (frontend), Render (backend) |

## Architecture / Flow

```text
User → React Frontend → Axios → Express API → MongoDB
                                      ↓
                           JWT Auth · Rate Limiting
                           Socket.IO · Nodemailer
```

## My Contribution

**I independently designed and built this entire project from scratch**, including:

- 🖥️ **Frontend** — All React components, routing, state management, and responsive UI
- ⚙️ **Backend** — Express server, RESTful APIs, MongoDB schemas, and business logic
- 💬 **Real-time System** — Architecting and implementing WebSocket communication for the chat feature
- 🔐 **Authentication** — Secure user authentication flows and role-based access control
- 🚀 **Deployment** — Environment setup, MongoDB Atlas integration, and full-stack deployment

## Setup

### Prerequisites
Node.js 18+, npm, MongoDB Atlas account

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb+srv://<your-cluster>
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
API_URL=http://localhost:3000
```

```bash
npm run dev   # http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
VITE_API_BASE=http://localhost:3000/api
```

```bash
npm run dev   # http://localhost:5173
```

## Screenshots

### Home Page
![Home Page](outputs/Home.webp)

### Chat Interface
![Chat Interface](outputs/Chat.webp)

### Opportunities
![Opportunities](outputs/Opportunities.webp)

### Admin Dashboard
![Admin Dashboard](outputs/Admin-Dashboard.webp)

## Future Improvements

- [ ] Video calling feature for direct 1-on-1 mentorship sessions
- [ ] Intelligent recommendation system to match students with relevant alumni
- [ ] LinkedIn OAuth integration for faster profile setup

## License

ISC License — see [LICENSE](LICENSE) for details.

## Credits

**Developed by [Samiksha Lone](https://github.com/Samiksha-Lone)**