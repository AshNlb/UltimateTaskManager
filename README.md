# TaskFlow - Ultimate Task Manager 🚀

A modern, full-stack task management application with AI-powered features, beautiful UI themes, and intelligent task organization. Perfect for personal productivity and daily task management.

![TaskFlow](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Custom%20Source%20Available-orange.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![No Sell](https://img.shields.io/badge/selling-prohibited-red.svg)

## Features

✅ **User Authentication** - Secure login and registration with JWT
✅ **Bucket Management** - Organize tasks into customizable buckets with colors
✅ **Task Management** - Create, edit, delete tasks with priorities and due dates
✅ **Task Overview** - List view with filtering by bucket, status, and priority
✅ **Calendar View** - Visual calendar with week numbers and multiple view modes (3 days, week, month, quarter)
✅ **AI Assistant** - Ask questions about your tasks (e.g., "What's due today?")
✅ **Task Enhancement** - AI-powered task description suggestions
✅ **Triple Theme System** - Switch between Light, Dark, and Game modes
✅ **Modern UI** - Sleek design with gradients, animations, and glass effects

## Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- SQLite + Prisma ORM
- JWT Authentication
- RESTful API

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Zustand (state management)
- React Router (navigation)
- React Calendar (calendar view)
- Axios (API calls)

## 🎯 Table of Contents
- [Quick Start](#quick-start)
- [Features](#features-in-detail)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ⚡ Quick Start

### Prerequisites
Before you begin, ensure you have:
- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### 🚀 One-Command Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ultimate-task-manager.git
cd ultimate-task-manager

# Install and run everything (Unix/Mac)
npm run setup && npm run start:all

# Or on Windows
npm run setup
npm run start:all
```

### 📋 Step-by-Step Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/ultimate-task-manager.git
cd ultimate-task-manager
```

Or [download the ZIP](https://github.com/yourusername/ultimate-task-manager/archive/refs/heads/main.zip) and extract it.

#### 2️⃣ Backend Setup

Open your first terminal:

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize database
npm run db:push

# Start the backend server
npm run dev
```

✅ Backend should now be running on **http://localhost:5000**

You should see:
```
🚀 Server running on http://localhost:5000
```

#### 3️⃣ Frontend Setup

Open a **new terminal** (keep the backend running):

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

✅ Frontend should now be running on **http://localhost:3000**

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

#### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage Guide

### First Time Setup

1. **Create an Account**
   - Click on "Register" button
   - Enter your name, email, and password (min 6 characters)
   - Click "Create account"

2. **Automatic Setup**
   - Three default buckets are automatically created:
     - 🔵 **Practical** - For everyday tasks
     - 🟣 **Self-Development** - For learning and growth
     - 🟢 **Career** - For professional tasks

3. **Start Adding Tasks**
   - Click "New Task" button
   - Fill in task details (title, description, due date, priority)
   - Assign to a bucket
   - Click "Create"

### Key Features

#### 🎨 Theme Switcher
Click the theme icon in the header to switch between:
- ☀️ **Light Mode** - Clean and bright
- 🌙 **Dark Mode** - Easy on the eyes
- 🎮 **Game Mode** - Fun and colorful with animations!

#### 📅 Calendar Views
Switch between different time ranges:
- **3 Days** - Focus on immediate tasks
- **Week** - See your weekly schedule
- **Month** - Monthly overview
- **Quarter** - Long-term planning

#### 🤖 AI Assistant
Click "AI Assistant" in the sidebar to:
- Ask "What's due today?"
- Ask "Show me high-priority tasks"
- Ask "Do I have overdue tasks?"
- Get smart answers about your tasks!

#### ✨ Task Enhancement
- Open any task
- Click "Enhance with AI"
- Get intelligent suggestions for better task descriptions

## Project Structure

```
UltimateTaskManager/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts            # Authentication endpoints
│   │   │   ├── buckets.ts         # Bucket CRUD endpoints
│   │   │   ├── tasks.ts           # Task CRUD endpoints
│   │   │   └── ai.ts              # AI assistant endpoints
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT authentication middleware
│   │   └── index.ts               # Express server setup
│   ├── .env                       # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                   # API client functions
│   │   ├── components/            # React components
│   │   │   ├── Layout.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── BucketModal.tsx
│   │   │   └── AIAssistant.tsx
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── CalendarView.tsx
│   │   ├── store/                 # State management
│   │   │   └── authStore.ts
│   │   ├── types.ts               # TypeScript types
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Buckets
- `GET /api/buckets` - Get all buckets
- `POST /api/buckets` - Create bucket
- `PUT /api/buckets/:id` - Update bucket
- `DELETE /api/buckets/:id` - Delete bucket

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/calendar` - Get tasks by date range
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### AI Features
- `POST /api/ai/ask` - Ask question about tasks
- `POST /api/ai/enhance-task` - Get AI suggestions for task
- `GET /api/ai/chat-history` - Get chat history

## Environment Variables

Backend `.env` file:
```
PORT=5000
JWT_SECRET=your-secret-key
DATABASE_URL="file:./dev.db"
```

Optional (for enhanced AI features):
```
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

## Development Commands

**Backend:**
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run db:push    # Push schema changes to database
npm run db:studio  # Open Prisma Studio (database GUI)
```

**Frontend:**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Default Buckets

On registration, three default buckets are created:
1. **Practical** (Blue) - For everyday tasks
2. **Self-Development** (Purple) - For learning and growth
3. **Career** (Green) - For professional tasks

You can create additional custom buckets as needed!

## AI Assistant Capabilities

The AI Assistant can answer questions like:
- "How many tasks do I have?"
- "What's due today?"
- "What's due tomorrow?"
- "What's due this week?"
- "Show me high-priority tasks"
- "Do I have overdue tasks?"

## Future Enhancements

- React Native mobile app
- Real-time sync across devices
- Task attachments
- Recurring tasks
- Subtasks/checklists
- Team collaboration
- Push notifications
- Export/import tasks
- Dark mode
- Enhanced AI with actual LLM integration

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ Backend won't start

**Problem:** `Error: Cannot find module`
```bash
# Solution: Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** `Port 5000 is already in use`
```bash
# Solution 1: Kill the process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>

# Solution 2: Change the port in backend/.env
PORT=5001
```

**Problem:** `Prisma Client did not initialize yet`
```bash
# Solution: Generate Prisma Client and push schema
cd backend
npm run db:push
npx prisma generate
```

#### ❌ Frontend won't start

**Problem:** `ECONNREFUSED` or backend connection errors
```bash
# Solution: Make sure backend is running on http://localhost:5000
# Check vite.config.ts proxy settings
```

**Problem:** `Port 3000 is already in use`
```bash
# Solution: The dev server will automatically suggest port 3001
# Or manually kill the process:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

#### ❌ Database Issues

**Problem:** `Error: SQLITE_ERROR: no such table`
```bash
# Solution: Reset the database
cd backend
rm prisma/dev.db
npm run db:push
```

**Problem:** Corrupt database or weird data
```bash
# Solution: Delete database and start fresh
cd backend
rm prisma/dev.db prisma/dev.db-journal
npm run db:push
```

#### ❌ Login/Authentication Issues

**Problem:** "Invalid token" or can't stay logged in
```bash
# Solution: Clear browser storage
# In browser DevTools (F12):
# Application > Storage > Clear site data
```

**Problem:** Can't register new user
```bash
# Solution: Check if email already exists in database
# Or reset the database (see Database Issues above)
```

#### ❌ npm install failures

**Problem:** `EACCES` permission errors
```bash
# Solution: Fix npm permissions or use sudo (not recommended)
# Better: Fix npm global directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Problem:** `npm ERR! code ERESOLVE`
```bash
# Solution: Use legacy peer deps
npm install --legacy-peer-deps
```

### 🐛 Still Having Issues?

1. **Check the logs** - Look at terminal output for error messages
2. **Clear everything** - Delete `node_modules` in both backend and frontend, reinstall
3. **Verify Node version** - Run `node --version` (should be 18+)
4. **Check .env file** - Make sure `backend/.env` exists with proper values
5. **Open an issue** - [Create an issue on GitHub](https://github.com/yourusername/ultimate-task-manager/issues)

## 📦 Building for Production

### Backend Production Build
```bash
cd backend
npm run build
npm run start
```

### Frontend Production Build
```bash
cd frontend
npm run build
npm run preview
```

The production build will be in `frontend/dist/` directory.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is licensed under a **Custom Source Available License** - see the [LICENSE](LICENSE) file for details.

**TL;DR:**
- ✅ Free to use, modify, and fork for personal/business use
- ✅ Can use internally in your company
- ✅ Open source - learn from the code
- ❌ **Cannot sell** or offer as a paid service/SaaS
- ❌ **Cannot redistribute commercially**

For commercial licensing inquiries, please contact the author.

## 👨‍💻 Author

**TaskFlow** - Built with ❤️ for personal productivity

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built with React, TypeScript, and Express
- UI inspired by modern design principles
- Icons from Lucide React
- Styled with TailwindCSS

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ultimate-task-manager&type=Date)](https://star-history.com/#yourusername/ultimate-task-manager&Date)

---

**Made with 💙 by developers, for developers**
