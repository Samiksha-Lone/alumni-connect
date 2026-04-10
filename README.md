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

Alumni Connect solves key challenges by centralizing alumni data through a MongoDB-based directory, enabling real-time interactions via chat and forums, and providing career guidance through job boards and mentorship matching. It enhances engagement with events and combats misuse through authentication and moderation.

## System Architecture

- **Frontend**: React-based user interface with responsive design
- **Backend**: Node.js and Express.js for REST APIs and server logic
- **Database**: MongoDB for data storage and management
- **Real-time Features**: Socket.IO for live chat and notifications
- **Authentication**: JWT-based security for role-based access

## 🚀 Features

Core platform features include:

- 🔐 Role-based authentication (Student, Alumni, Admin)
- 👤 Profile management with education, career details, and resume uploads
- 👥 Alumni directory with search functionality
- 📊 Weighted matching algorithm for personalized alumni recommendations
- 💬 Real-time messaging with Socket.IO
- 🗣️ Discussion forum with threads and comments
- 🤝 Mentorship network with mentor search and requests
- 🛡️ Profile verification and fraud screening
- 🧹 Content moderation for posts and requests
- 📅 Event creation and RSVP system
- 💼 Job board for career opportunities
- 🖼️ Gallery for image uploads
- 🤖 AI-powered chatbot for user assistance
- ❄️ AI-generated icebreaker suggestions for conversations

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Authentication**: JWT, bcrypt
- **AI**: AI Inegration

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
   - Copy `backend/.env.example` to `backend/.env`
   - Add your MongoDB URI and JWT secret

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

![Home Screen](outputs/home-section.webp)

![Discussion Forum](outputs/discussion-forum-section.webp)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credit

If you use or build upon this project, please provide attribution:

Samiksha Lone  
https://github.com/Samiksha-Lone