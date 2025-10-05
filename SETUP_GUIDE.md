# 📘 Complete Setup Guide for TaskFlow

This guide will walk you through every step of setting up TaskFlow on your local machine, even if you're new to web development.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installing Prerequisites](#installing-prerequisites)
3. [Downloading TaskFlow](#downloading-taskflow)
4. [Setting Up the Backend](#setting-up-the-backend)
5. [Setting Up the Frontend](#setting-up-the-frontend)
6. [First-Time Usage](#first-time-usage)
7. [Common Commands](#common-commands)
8. [Tips and Tricks](#tips-and-tricks)

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB (8GB recommended)
- **Disk Space**: 500MB free space
- **Internet Connection**: Required for initial setup

### Software Requirements
- Node.js 18 or higher
- npm (comes with Node.js)
- A modern web browser
- A code editor (optional, but recommended: VS Code)

## Installing Prerequisites

### Step 1: Install Node.js

#### Windows
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended for most users)
3. Run the installer
4. Click "Next" through the installer, accepting defaults
5. Restart your computer after installation

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Verify Installation

Open a terminal/command prompt and run:
```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

✅ If you see version numbers, you're good to go!

### Step 3: Install Git (Optional)

#### Windows
Download from [git-scm.com](https://git-scm.com/download/win)

#### macOS
```bash
brew install git
```

#### Linux
```bash
sudo apt-get install git
```

## Downloading TaskFlow

### Option A: Using Git (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/ultimate-task-manager.git

# Navigate into the directory
cd ultimate-task-manager
```

### Option B: Download ZIP

1. Go to the GitHub repository
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to your desired location
5. Open terminal/command prompt in that folder

## Setting Up the Backend

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Install Dependencies

This will download all required packages (might take 2-3 minutes):

```bash
npm install
```

You should see a progress bar and eventually:
```
added XXX packages in XXs
```

### Step 3: Set Up Environment Variables

The backend needs a configuration file:

#### Windows (Command Prompt)
```bash
copy .env.example .env
```

#### Windows (PowerShell)
```powershell
Copy-Item .env.example .env
```

#### macOS/Linux
```bash
cp .env.example .env
```

The `.env` file contains:
```
PORT=5000
JWT_SECRET=dev-secret-key-please-change-in-production-12345
DATABASE_URL="file:./dev.db"
```

💡 **Note**: These are safe defaults for local development!

### Step 4: Initialize the Database

This creates your local database:

```bash
npm run db:push
```

You should see:
```
✔ Generated Prisma Client
✔ Database synchronized
```

### Step 5: Start the Backend Server

```bash
npm run dev
```

✅ **Success looks like this:**
```
🚀 Server running on http://localhost:5000
```

🎉 Your backend is now running! **Keep this terminal open**.

## Setting Up the Frontend

### Step 1: Open a NEW Terminal

**Important**: Don't close the backend terminal. Open a new one.

#### Windows
- Press `Ctrl + Shift + T` in your terminal
- Or open a new Command Prompt window

#### macOS
- Press `Cmd + T` in Terminal
- Or open a new Terminal window

### Step 2: Navigate to Frontend Folder

```bash
# If you're starting from the backend folder:
cd ../frontend

# Or if you're starting from the project root:
cd frontend
```

### Step 3: Install Dependencies

```bash
npm install
```

This will take 2-3 minutes. You'll see:
```
added XXX packages in XXs
```

### Step 4: Start the Frontend Server

```bash
npm run dev
```

✅ **Success looks like this:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open in Browser

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the TaskFlow login page!

## First-Time Usage

### Creating Your Account

1. Click the **"Register"** link
2. Fill in the form:
   - **Name**: Your full name
   - **Email**: Any email (doesn't need to be real for local use)
   - **Password**: At least 6 characters
3. Click **"Create account"**

### What Happens Next

1. You'll be automatically logged in
2. Three default buckets are created:
   - 🔵 Practical
   - 🟣 Self-Development
   - 🟢 Career
3. You can start adding tasks immediately!

### Adding Your First Task

1. Click **"New Task"** button
2. Fill in the details:
   - **Title**: What do you need to do? (required)
   - **Description**: More details (optional)
   - **Bucket**: Which category does it belong to?
   - **Due Date**: When is it due? (optional)
   - **Priority**: Low, Medium, or High
   - **Status**: Todo, In Progress, or Completed
3. Click **"Create"**

## Common Commands

### Starting the Application

You'll need TWO terminals open:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Stopping the Application

Press `Ctrl + C` in each terminal to stop the servers.

### Restarting After Computer Restart

Just run the start commands again:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### Viewing the Database

```bash
cd backend
npm run db:studio
```

This opens Prisma Studio in your browser where you can see all your data!

### Resetting Everything

If something goes wrong, you can reset:

```bash
# Reset backend database
cd backend
rm prisma/dev.db
npm run db:push

# Reset frontend cache
cd frontend
rm -rf node_modules
npm install
```

## Tips and Tricks

### 💡 Quick Tip: Keep Terminals Open

While developing, keep both terminal windows open and visible. This way you can see any error messages immediately.

### 💡 Browser DevTools

Press `F12` in your browser to open Developer Tools. This is helpful for debugging.

### 💡 Auto-Reload

Both the backend and frontend automatically reload when you make changes to the code. No need to restart manually!

### 💡 Testing Different Themes

Try the three themes:
- Click the theme icon in the header
- Select Light, Dark, or Game mode
- Your preference is saved automatically!

### 💡 Calendar Week Numbers

Week numbers are displayed on the left side of the calendar. They're color-coded:
- Light mode: Blue gradient
- Dark mode: Dark blue
- Game mode: Pink/yellow gradient with animation!

### 💡 AI Assistant Queries

Try these questions with the AI Assistant:
- "What's due today?"
- "Show me high-priority tasks"
- "What's overdue?"
- "How many tasks do I have?"

## Troubleshooting

### ❌ "Port already in use"

**Problem**: You see `EADDRINUSE` error

**Solution**:
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <number> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### ❌ "Command not found: npm"

**Problem**: Terminal doesn't recognize `npm`

**Solution**: Node.js isn't installed or not in PATH
1. Reinstall Node.js from nodejs.org
2. Restart your terminal
3. Try again

### ❌ White Screen in Browser

**Problem**: Browser shows blank page

**Solutions**:
1. Check if backend is running (Terminal 1)
2. Check if frontend is running (Terminal 2)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try opening in Incognito mode

### ❌ Can't Login

**Problem**: "Invalid credentials" error

**Solutions**:
1. Make sure you registered first
2. Try resetting the database:
   ```bash
   cd backend
   rm prisma/dev.db
   npm run db:push
   ```
3. Register again

### 🆘 Still Stuck?

1. Check the main [README.md](README.md) for more help
2. Look at the [Troubleshooting section](README.md#troubleshooting)
3. Open an issue on GitHub with:
   - What you were trying to do
   - What happened instead
   - Error messages (if any)
   - Screenshots (if relevant)

## Next Steps

Now that you have TaskFlow running:

1. **Explore the features** - Try out all three themes!
2. **Create custom buckets** - Organize tasks your way
3. **Use the AI Assistant** - Ask questions about your tasks
4. **Try calendar views** - Switch between 3 days, week, month, quarter
5. **Customize** - Edit the code to make it your own!

## Getting Updates

To get the latest version of TaskFlow:

```bash
git pull origin main
cd backend && npm install
cd ../frontend && npm install
```

---

**Welcome to TaskFlow! 🎉**

If you found this guide helpful, consider starring the repository on GitHub!
