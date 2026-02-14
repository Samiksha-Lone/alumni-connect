# 🎓 Alumni Connect

My Third year project - connecting students with alumni for networking, events, and jobs.

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
- 📸 **Gallery** - browse campus photos and memories

**Tech Stack:**
- **Frontend**: React 19 + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB
- **Real-time**: Socket.IO
- **Auth**: JWT + bcrypt
- **Deployed**: Vercel (frontend) + Render (backend)

---

## ⚙️ System Requirements

- **Node.js** 20.x or higher
- **npm** or yarn
- **MongoDB Atlas** account (free tier available)
- **Google AI Studio** API key (for Gemini AI features - optional)
- **Git** for version control

---

## 🛠️ How to Run Locally

Works on Windows, Mac, and Linux! ✨

### Backend Setup

```bash
cd backend
npm install

# Create .env file and copy from .env.example
# Fill in your credentials:
# MONGO_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_secret_key_here
# PORT=10000
# GEMINI_API_KEY=your_google_ai_key (optional, for AI chat)

npm start     # runs on http://localhost:10000
npm run dev   # runs with auto-reload (uses nodemon)
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:5173
```

## 🔐 Environment Variables Setup

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection URI: `mongodb+srv://username:password@cluster.mongodb.net/alumni_connect`
4. Add your IP to IP Whitelist (use 0.0.0.0 for development)

### JWT Secret
Generate a secure random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Gemini API Key (Optional)
1. Visit https://aistudio.google.com/app/apikeys
2. Create new API key (free tier available)
3. Add to `.env` as `GEMINI_API_KEY`

### Backend `.env` Example
```dotenv
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/alumni_connect?retryWrites=true&w=majority
JWT_SECRET=your_generated_secret_key_here
PORT=10000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
GEMINI_API_KEY=your_google_ai_key_optional
```

See `backend/.env.example` for complete template.

---

## 📡 Complete API Documentation

Tested with Postman ✅ | Base URL: `http://localhost:10000`

### Authentication Routes
```
POST   /auth/register              → Create new account
POST   /auth/login                 → Login
GET    /auth/logout                → Logout
GET    /auth/me                    → Get current user
POST   /auth/forgot-password       → Send password reset email
POST   /auth/reset-password/:token → Complete password reset
```

### Events Routes
```
GET    /events                     → See all events
POST   /events                     → Admin: create event
PUT    /events/:id                 → Admin: edit event
DELETE /events/:id                 → Admin: delete event
POST   /events/:id/rsvp            → Student: RSVP for event
```

### Jobs Routes
```
GET    /jobs                       → See all job postings
POST   /jobs                       → Alumni: post job
PUT    /jobs/:id                   → Alumni: edit job
DELETE /jobs/:id                   → Alumni: delete job
```

### Chat Routes
```
GET    /chat/conversations         → Get your conversations
POST   /chat/message               → Send message
GET    /chat/messages/:userId      → Get chat history with user
DELETE /chat/conversation/:userId  → Delete conversation
```

### Users Routes
```
GET    /users                      → Get all users (paginated)
GET    /users/alumni               → Get all alumni
GET    /users/:id                  → Get specific user
PUT    /users/:id                  → Update profile
POST   /users/:id/upload-resume    → Upload resume file
```

### Gallery Routes
```
GET    /gallery                    → Get all gallery images
POST   /gallery                    → Add image (requires auth)
DELETE /gallery/:id                → Delete image (requires auth)
```

---

## 📂 Folder Structure

```
alumni-connect/
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   └── ui/               # Button, Card, inputs
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Opportunities.jsx (Jobs)
│   │   │   ├── Gallery.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/              # React Context
│   │   │   ├── AuthContext.jsx   # User authentication
│   │   │   ├── SocketContext.jsx # Real-time updates
│   │   │   ├── ThemeContext.jsx  # Dark/Light mode
│   │   │   └── ToastContext.jsx  # Notifications
│   │   ├── styles/               # CSS files
│   │   ├── api.js                # Axios configuration
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/          # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── job.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── gallery.controller.js
│   │   │   └── ai.controller.js  # Gemini AI integration
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── event.routes.js
│   │   │   ├── job.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── gallery.routes.js
│   │   │   └── docs.routes.js    # Swagger documentation
│   │   ├── models/               # MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   ├── event.model.js
│   │   │   ├── job.model.js
│   │   │   ├── message.model.js
│   │   │   ├── gallery.model.js
│   │   │   └── index.js
│   │   ├── middlewares/          # Express middlewares
│   │   │   ├── auth.middleware.js      # JWT verification
│   │   │   ├── role.middleware.js      # Role-based access
│   │   │   ├── error.middleware.js     # Error handling
│   │   │   └── validation.middleware.js # Input validation
│   │   ├── db/
│   │   │   └── db.js             # MongoDB connection
│   │   ├── utils/                # Utility functions
│   │   │   ├── logger.js         # Winston logger
│   │   │   ├── swagger.js        # API documentation
│   │   │   └── storage.service.js
│   │   └── app.js                # Express + Socket.IO setup
│   ├── server.js                 # Start file
│   ├── seed.js                   # Database seeding
│   ├── jest.config.js            # Test configuration
│   ├── package.json
│   ├── .env.example              # Environment template
│   └── uploads/                  # File uploads (resumes, etc)
│
├── .gitignore
├── package.json
├── README.md
└── README_ANALYSIS.md            # Analysis & recommendations
```

---

## 🚀 How I Deployed

### Frontend → Vercel
1. Push to GitHub repository
2. Connect Vercel to your GitHub repo (auto-deploys on push!)
3. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE` = `https://your-backend-url.onrender.com`
4. Done! ✅

### Backend → Render
1. Create Render account
2. Connect GitHub repo
3. Create new Web Service
4. Set environment variables:
   - `MONGO_URI` = your MongoDB URI
   - `JWT_SECRET` = your secret
   - `GEMINI_API_KEY` = your API key
   - `PORT` = 10000
   - `NODE_ENV` = production
5. Deploy! ✅

**Commands used:**
```bash
git push             # Both auto-deploy on push - no manual deployment needed!
```

---

## 👥 User Roles & Permissions

### Admin
- ✅ Create, edit, delete events
- ✅ Add & Manage college pictures to gallery
- ✅ Delete inappropriate jobs/content
- ✅ See all users
- ✅ View platform analytics
- ✅ Manage user roles

### Student
- ✅ View all events
- ✅ RSVP for events
- ✅ Browse jobs posted by alumni
- ✅ Chat with alumni for guidance
- ✅ Update profile and resume
- ✅ View gallery

### Alumni
- ✅ Post job opportunities
- ✅ Edit their own jobs
- ✅ Chat with students
- ✅ Access networking features
- ✅ Browse other alumni
- ✅ Update profile

**To test:** Login as admin@test.com → Navigate to Events page → Click "Create Event" button

---

## 🆘 Troubleshooting

### Backend Connection Issues

**Problem:** `ECONNREFUSED` error when connecting to MongoDB
- **Solution:** 
  - Verify `MONGO_URI` is correct
  - Add your IP to MongoDB Atlas whitelist (0.0.0.0 for dev)
  - Check credentials are URL-encoded

**Problem:** Backend runs but frontend can't connect
- **Solution:**
  - Ensure `ALLOWED_ORIGINS` in backend includes frontend URL
  - Check `API_BASE` in frontend matches backend URL
  - Clear browser cache and try again

**Problem:** Socket.IO connection fails
- **Solution:**
  - Check CORS configuration in app.js
  - Verify both frontend and backend URLs in allowedOrigins
  - Ensure Socket.IO version matches on client and server

### Frontend Issues

**Problem:** `VITE_API_BASE` undefined
- **Solution:**
  - On Vercel, add environment variable in project settings
  - For local dev, set in `.env.local` or just use empty string

**Problem:** Chat messages not loading
- **Solution:**
  - Check network tab in DevTools (look for 401/403 errors)
  - Verify authentication token is being sent
  - Check Backend logs for errors

---

## 💡 What I Learned

Making this project, I learned:
- Full-stack MERN development workflow
- Real-time communication with Socket.IO
- JWT authentication and role-based access control (RBAC)
- MongoDB schema design and indexing
- Deployment strategies (Vercel, Render)
- Error handling and API validation
- Responsive design with Tailwind CSS
- Testing with Jest and Supertest
- Security best practices (CORS, rate limiting, bcrypt)

---

## 🙌 About Me

**Samiksha Balaji Lone**
- Final year B.Tech IT student
- **Skills:** MERN Stack, Tailwind CSS, Socket.IO, Express.js, MongoDB, Vercel, Render, REST APIs

**Contact & Social:**
- 📧 Email: samikshalone2@gmail.com
- 💼 LinkedIn: https://www.linkedin.com/in/samiksha-lone/
- 🐙 GitHub: https://github.com/Samiksha-Lone

---

## 🌟 Feedback & Contributions

Found a bug? Want to contribute? Feel free to:
1. Open a GitHub issue
2. Submit a pull request
3. Send me an email with suggestions

**Support:** If this project helped you, consider giving it a ⭐ on GitHub!

---

## 📜 License

This project is open source and available under the ISC License.

---

**Last Updated:** February 14, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
