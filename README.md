# Alumni Connect

A full-stack MERN platform that enables students and alumni to connect, share opportunities, attend events, and communicate in real-time through an interactive and scalable system.

## 🔗 Links

- 🚀 Live Demo: https://alumni-connect-frontendd.vercel.app
- 💻 GitHub Repository: https://github.com/Samiksha-Lone/alumni-connect

## Problem Statement

After graduation, students often lose touch with their alma mater and fellow graduates. There's no easy way to maintain professional connections, discover career opportunities, or stay updated with campus events.

## Solution

Alumni Connect bridges this gap by providing a centralized platform where students can network with alumni, attend events, explore job opportunities, and communicate in real-time.

## Project Highlights

- Built a real-time communication system using Socket.IO
- Implemented role-based access control (Student, Alumni, Admin)
- Designed scalable REST APIs with Node.js and Express
- Integrated AI features for smart networking assistance
- Developed a responsive and modern UI using React + Tailwind CSS

## Features

- 🔐 Role-based authentication (Student, Alumni, Admin)
- 💬 Real-time chat using Socket.IO
- 📅 Event creation and RSVP system
- 💼 Job board for posting and exploring opportunities
- 🔍 Alumni directory with search functionality
- 👤 Profile management with resume upload
- 🖼️ Gallery for sharing campus memories
- 🤖 AI-powered message suggestions (Gemini API)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Real-time:** Socket.IO
- **Authentication:** JWT, bcrypt
- **AI:** Google Gemini API (optional)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Samiksha-Lone/alumni-connect.git
   cd alumni-connect
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Add your MongoDB URI, JWT secret, and other required variables

4. **Run the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

---

## Key Learnings

- Developed scalable full-stack architecture using MERN stack
- Implemented real-time communication using WebSockets (Socket.IO)
- Designed secure authentication and role-based authorization
- Integrated third-party APIs (Gemini AI) into production workflow
- Built responsive and user-friendly UI with modern frontend tools

---

## Future Improvements

- Advanced search and filtering for alumni/jobs
- Email notifications for events and messages
- Video chat integration for networking
- Mobile application development
- Analytics dashboard for engagement tracking

## Contact

**Samiksha Balaji Lone**  
📧 samikshalone2@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/samiksha-lone) | [Portfolio](https://samiksha-lone.vercel.app/)