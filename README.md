# Alumni Connect

A full-stack alumni interaction platform built to strengthen connections between alumni and current students.

## 🔗 Links

- 🚀 **Live Demo**: [https://alumni-connect-frontendd.vercel.app](https://alumni-connect-frontendd.vercel.app)
- 💻 **GitHub Repository**: [https://github.com/Samiksha-Lone/alumni-connect](https://github.com/Samiksha-Lone/alumni-connect)

## Problem Statement

Technical Education Department institutions need a centralized alumni-student engagement platform to:

- Store and update alumni records including contact details, specialization, career paths, and achievements
- Provide structured student access to alumni mentorship, career guidance, and networking
- Offer motivation through alumni role models and real-world insights
- Build a supportive network for lifelong professional collaboration

This project addresses these challenges by providing a centralized platform for alumni engagement, event participation, job opportunities, and intelligent networking.

## Problem–Solution Mapping

Alumni Connect solves key challenges by centralizing alumni data through a MongoDB-based directory, enabling real-time interactions via chat, and providing career guidance through job boards and mentorship. It enhances engagement with events and ensures platform integrity through admin moderation and profile verification.

## 🚀 Features

Core platform features include:

- 🔐 **Role-based Authentication**: Secure access for Students, Alumni, and Administrators.
- 👤 **Profile Management**: Detailed user profiles with education, career paths, and expertise.
- 👥 **Alumni Directory**: Real-time searchable directory with filtering by name, company, and course.
- 💬 **Real-time Messaging**: Instant messaging between students and alumni via Socket.IO.
- 🛡️ **Admin Dashboard**: Comprehensive management of users, events, jobs, and the gallery.
- 🛡️ **Profile Verification**: Admin-led verification process to ensure platform trust.
- 📅 **Event RSVP System**: Stay updated with campus events and track attendance.
- 💼 **Opportunities Board**: Direct access to career openings and internship postings.
- 🖼️ **Campus Gallery**: A curated visual collection of campus life and events.
- 🎨 **Modern UI/UX**: Premium glassmorphic design with full Dark/Light mode support.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Authentication**: JWT, bcrypt

## ⚙️ Installation / Setup

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
   
   Create `.env` file in the `/backend` directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/alumni-connect
   
   # Authentication
   JWT_SECRET=your-secret-key-here-min-32-chars

   # Email Configuration (Nodemailer)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```
   
   Create `.env.local` file in the `/frontend` directory:
   ```env
   VITE_API_BASE=http://localhost:3000/api
   ```

4. **Run the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

## 📸 Screenshots

### Home Page
![Home Page](outputs/Home.webp)

### Real-time Chat
![Chat Interface](outputs/Chat.webp)

### Opportunities Board
![Opportunities](outputs/Opportunities.webp)

### Admin Dashboard
![Admin Dashboard](outputs/Admin-Dashboard.webp)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credit

If you use or build upon this project, please provide attribution:

Samiksha Lone  
https://github.com/Samiksha-Lone