# 🎓 Alumni Connect

My final year **B.Tech IT project** - connecting students with alumni for networking, events, and jobs.

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
- 🌓 **Dark/Light theme** - toggle between modes
- 📱 **Mobile responsive** - works on all devices

**Tech Stack:**
- **Frontend**: React 19 + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB
- **Real-time**: Socket.IO
- **Auth**: JWT + bcrypt
- **Deployed**: Vercel (frontend) + Render (backend)

---

## 🛠️ How to Run Locally

Works on Windows, Mac, and Linux! ✨

### Backend Setup
```bash
cd backend
npm install

# Create .env file with:
# MONGO_URI=your_mongodb_atlas_uri
# JWT_SECRET=anything_you_want
# PORT=10000

npm start  # runs on http://localhost:10000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # runs on http://localhost:5173
```

**Test Accounts:**
```
Admin:   admin@test.com / password123
Student: student@test.com / password123
Alumni:  alumni@test.com / password123
```

---

## 📡 Main APIs I Made

Tested with Postman ✅

### Auth
```
POST   /auth/register          → Create new account
POST   /auth/login             → Login
GET    /auth/logout            → Logout
GET    /auth/me                → Get current user
POST   /auth/forgot-password   → Reset password
```

### Events
```
GET    /events                 → See all events
POST   /events                 → Admin: create event
PUT    /events/:id             → Admin: edit event
DELETE /events/:id             → Admin: delete event
POST   /events/:id/rsvp        → Student: RSVP for event
```

### Jobs
```
GET    /jobs                   → See all job postings
POST   /jobs                   → Alumni: post job
PUT    /jobs/:id               → Alumni: edit job
DELETE /jobs/:id               → Alumni: delete job
```

### Chat
```
GET    /chat/conversations     → Get your chats
POST   /chat/message           → Send message
GET    /chat/messages/:userId  → Get chat history
DELETE /chat/conversation/:userId → Delete chat
```

### Users
```
GET    /users                  → Get all users
GET    /users/alumni           → Get all alumni
GET    /users/:id              → Get specific user
PUT    /users/:id              → Update profile
```

---

## 📂 Folder Structure

```
alumni-connect/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Home, Events, Jobs, Chat, etc
│   │   ├── context/         # Auth, Theme, Socket context
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── job.controller.js
│   │   │   ├── chat.controller.js
│   │   │   └── user.controller.js
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── event.routes.js
│   │   │   ├── job.routes.js
│   │   │   ├── chat.routes.js
│   │   │   └── user.routes.js
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── Job.js
│   │   │   ├── Message.js
│   │   │   └── Gallery.js
│   │   └── app.js           # Express setup + Socket.IO
│   ├── package.json
│   └── server.js            # Start file
│
└── README.md
```

---

## 🚀 How I Deployed

### Frontend → Vercel
1. Push to GitHub
2. Connect Vercel to repo (auto-deploys on push!)
3. Set `VITE_API_BASE` environment variable
4. Done! ✅

### Backend → Render
1. Create Render account
2. Add GitHub repo
3. Set environment variables (MONGO_URI, JWT_SECRET)
4. Auto-deploys on GitHub push ✅

**Commands used:**
```bash
git push                # Both frontend and backend auto-deploy
# No manual deployment needed - just push and it's live!
```

---

## 👥 User Roles

### Admin
- Create events
- Delete events/jobs
- See all users

### Student
- View events
- RSVP for events
- Browse jobs
- Chat with alumni

### Alumni
- Post job opportunities
- Edit their jobs
- Chat with students
- Access networking features

**To test:** Login as admin → click "Publish Event" button on /events page

---

## 💡 What I Learned

Making this project, I learned:
- Full-stack MERN development
- Real-time communication with Socket.IO
- JWT authentication & role-based access
- MongoDB schema design
- Deployment on Vercel & Render
- Error handling & validation
- Responsive design with Tailwind CSS

---

## 🙌 About Me

**Samiksha Balaji Lone**
- Final year B.Tech IT student
- **Skills:** MERN, Tailwind CSS, Socket.io, Express, MongoDB, Vercel, Render

**Contact me:**
- 📧 Email: samikshalone2@gmail.com
- 💼 LinkedIn: https://www.linkedin.com/in/samiksha-lone/
- 🐙 GitHub: https://github.com/Samiksha-Lone

---

## 🌟 Feedback & Contributions

Found a bug? Want to contribute? Feel free to:
1. Open an issue
2. Submit a pull request
3. Drop me an email!

**Feedback is welcome!** ⭐ If you found this helpful, a star would be appreciated!

---

**Last Updated:** January 7, 2026  
**Version:** 1.0.0  
**Status:** Complete ✅
