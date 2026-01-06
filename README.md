# Alumni Connect

A full-stack web application that connects alumni with current students, facilitates networking, event management, and opportunities sharing.

## 🎯 Project Overview

Alumni Connect is a comprehensive platform designed to bridge the gap between alumni and students. It provides features for networking, event management, gallery sharing, job opportunities posting, and real-time chat capabilities. Built with modern web technologies, it offers a seamless user experience across desktop and mobile devices.

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration and login with JWT-based authentication
- Role-based access control (Admin, Alumni, Student)
- Secure password hashing with bcrypt
- Cookie-based session management

### 👥 User Management
- User profiles with customizable information
- Role-based user filtering
- User discovery for networking

### 📅 Event Management
- Create, read, update, and delete events
- Event listing and filtering
- Real-time event updates

### 🎨 Gallery
- Image/media upload and sharing
- Gallery management capabilities
- Media organization

### 💼 Job Opportunities
- Post and browse job opportunities
- Opportunity management
- Career resource sharing

### 💬 Real-Time Chat
- One-on-one messaging between users
- Real-time notifications with Socket.IO
- Typing indicators
- Conversation management
- Message search functionality
- Unread message tracking

### 🌓 Additional Features
- Dark/Light theme support
- Responsive design (Mobile, Tablet, Desktop)
- Secure API endpoints
- CORS enabled
- Database validation and error handling

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB (Mongoose 8.19.2)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Real-time Communication**: Socket.IO 4.8.3
- **Security**: bcrypt 6.0.0, CORS, Cookie-Parser
- **HTTP Client**: Axios 1.13.2
- **Environment Management**: dotenv 17.2.3

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Styling**: Tailwind CSS 3.4.3
- **HTTP Client**: Axios 1.13.2
- **Real-time**: Socket.IO Client 4.8.3
- **Routing**: React Router DOM 6.14.1
- **Linting**: ESLint 9.39.1
- **PostCSS**: 8.4.39

## 📁 Project Structure

```
alumni_connect/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup & Socket.IO config
│   │   ├── controllers/           # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── gallery.controller.js
│   │   │   ├── job.controller.js
│   │   │   └── user.controller.js
│   │   ├── models/               # MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   ├── event.model.js
│   │   │   ├── gallery.model.js
│   │   │   ├── job.model.js
│   │   │   ├── message.model.js
│   │   │   └── index.js
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── event.routes.js
│   │   │   ├── gallery.routes.js
│   │   │   ├── job.routes.js
│   │   │   └── chat.routes.js
│   │   ├── middlewares/          # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── services/             # Business services
│   │   │   └── storage.service.js
│   │   └── db/
│   │       └── db.js             # Database connection
│   ├── server.js                 # Server entry point
│   ├── seed.js                   # Database seeding
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Global styles
│   │   ├── App.css               # App styles
│   │   ├── components/           # Reusable components
│   │   │   ├── NavBar.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Modal.css
│   │   ├── context/              # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── useTheme.jsx
│   │   └── pages/                # Page components
│   │       ├── Home.jsx
│   │       ├── About.jsx
│   │       ├── AuthPage.jsx
│   │       ├── Profile.jsx
│   │       ├── Alumni.jsx
│   │       ├── Events.jsx
│   │       ├── Gallery.jsx
│   │       ├── Gallery.css
│   │       ├── ChatPage.jsx
│   │       └── Opportunities.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── eslint.config.js
│   └── package.json
│
├── docs/
│   ├── screenshots/
│   └── videos/
│
├── .env                          # Environment variables
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/alumni_connect.git
cd alumni_connect
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file with your MongoDB URI and JWT secret
# Example:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/alumni_connect
# JWT_SECRET=your_secret_key_here
# ADMIN_NAME=Main Admin
# ADMIN_EMAIL=admin@alumni.com
# ADMIN_PASSWORD=admin123

# Start the backend server
npm start
```

The backend will run on `http://localhost:3000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables in .env
# VITE_API_BASE=http://localhost:3000

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user
- `GET /auth/me` - Get current user info (Protected)

### User Routes (`/users`)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile (Protected)
- `DELETE /users/:id` - Delete user (Protected)

### Event Routes (`/api/events`)
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Protected)
- `PUT /api/events/:id` - Update event (Protected)
- `DELETE /api/events/:id` - Delete event (Protected)

### Gallery Routes (`/api/gallery`)
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Upload to gallery (Protected)
- `PUT /api/gallery/:id` - Update gallery item (Protected)
- `DELETE /api/gallery/:id` - Delete gallery item (Protected)

### Job Routes (`/api/jobs`)
- `GET /api/jobs` - Get all job opportunities
- `POST /api/jobs` - Post job opportunity (Protected)
- `PUT /api/jobs/:id` - Update job posting (Protected)
- `DELETE /api/jobs/:id` - Delete job posting (Protected)

### Chat Routes (`/api/chat`)
- `POST /api/chat/message` - Send a message (Protected)
- `GET /api/chat/messages/:userId` - Get messages with user (Protected)
- `GET /api/chat/conversations` - Get user conversations (Protected)
- `GET /api/chat/users` - Get users for chat discovery (Protected)
- `PUT /api/chat/read/:userId` - Mark conversation as read (Protected)
- `DELETE /api/chat/conversation/:userId` - Delete conversation (Protected)
- `GET /api/chat/search` - Search messages (Protected)

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGO_URI=mongodb+srv://event_user:event_user@cluster0.9okzyvg.mongodb.net/alumni_connect?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
VITE_API_BASE=https://alumni-connect-backend-hrsc.onrender.com
FRONTEND_URL=https://alumni-connect-frontend-delta.vercel.app
ALLOWED_ORIGINS=https://alumni-connect-frontend-delta.vercel.app,http://localhost:5173,http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (.env / Vercel Environment Variables)
```env
VITE_API_BASE=https://alumni-connect-backend-hrsc.onrender.com
```

**Important**: For Vercel deployment, add `VITE_API_BASE` environment variable:
1. Vercel Dashboard → Project Settings → Environment Variables
2. Add: `VITE_API_BASE` = `https://alumni-connect-backend-hrsc.onrender.com`
3. Select "Production", "Preview", and "Development" environments

## 🔒 Authentication

The application uses JWT (JSON Web Token) based authentication:

1. **Registration**: Users create an account with email and password
2. **Login**: Users receive a JWT token on successful login
3. **Protected Routes**: Requests to protected endpoints require a valid JWT token
4. **Token Storage**: Tokens are stored in cookies for persistence
5. **Socket.IO Auth**: Real-time connections authenticate via JWT tokens

## 📖 Available Scripts

### Backend
```bash
npm start          # Start the server
npm test           # Run tests (if configured)
```

### Frontend
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🗄️ Database Schema

### User Model
- Email (unique)
- Password (hashed)
- Name
- Role (admin, alumni, student)
- Profile information
- Timestamps

### Event Model
- Title
- Description
- Date & Time
- Location
- Creator (User reference)
- Attendees
- Timestamps

### Message Model
- Sender & Receiver references
- Content
- Read status
- Timestamps

### Gallery Model
- Title
- Description
- Media URL
- Uploader reference
- Timestamps

### Job Model
- Title
- Description
- Company
- Location
- Requirements
- Posted by reference
- Timestamps

## 🌐 Real-Time Features

### Socket.IO Events
- **connection**: User connects to the server
- **joinChat**: User joins a chat conversation
- **typing**: Broadcasting typing status
- **message**: Real-time message delivery
- **disconnect**: User disconnects

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Navigation**: Easy navigation with React Router
- **Context API**: Global state management for auth, themes, and socket
- **Tailwind CSS**: Modern, utility-first styling
- **Modal Components**: Interactive modals for user actions

## 🚨 Error Handling

The application includes comprehensive error handling:
- JWT validation errors
- MongoDB connection errors
- CORS handling
- API error responses with meaningful messages
- Client-side error boundaries

## 🌐 Deployment

### Live URLs
- **Frontend**: https://alumni-connect-frontend-delta.vercel.app
- **Backend API**: https://alumni-connect-backend-hrsc.onrender.com

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

**Last Updated**: January 6, 2026  
**Version**: 1.0.0
