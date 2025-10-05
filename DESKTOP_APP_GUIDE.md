# 🖥️ TaskFlow Desktop App - User Guide

## What is TaskFlow Desktop?

TaskFlow Desktop is a **standalone application** that runs on your computer. You don't need to install Node.js, run terminals, or understand programming - just download, install, and use!

### ✅ What You Get

- **One-Click Installation** - Just like any other app
- **No Terminal Required** - Everything runs automatically
- **Offline First** - Works without internet
- **System Tray Icon** - Runs in the background
- **Your Data Stays Local** - Complete privacy
- **Auto-Updates** - Get new features easily (optional)

---

## 📥 For Users: How to Download and Install

### Step 1: Download TaskFlow

Download the installer for your operating system:

#### Windows
- Download: **TaskFlow-1.0.0-win-x64.exe**
- Size: ~150 MB
- Requirements: Windows 10 or newer

#### macOS
- Download: **TaskFlow-1.0.0-mac.dmg**
- Size: ~150 MB
- Requirements: macOS 10.15 (Catalina) or newer

#### Linux
- Download: **TaskFlow-1.0.0-linux-x86_64.AppImage**
- Size: ~150 MB
- Requirements: Most modern Linux distributions

### Step 2: Install TaskFlow

#### On Windows:
1. **Double-click** `TaskFlow-1.0.0-win-x64.exe`
2. Windows might show a warning ("Windows protected your PC")
   - Click **"More info"**
   - Click **"Run anyway"**
   - *(This happens because the app isn't code-signed)*
3. Choose installation location (or use default)
4. Click **"Install"**
5. Wait for installation to complete
6. Click **"Finish"**

#### On macOS:
1. **Double-click** `TaskFlow-1.0.0-mac.dmg`
2. **Drag** TaskFlow icon to Applications folder
3. **Eject** the DMG
4. Open **Applications** folder
5. **Right-click** TaskFlow → **"Open"**
6. Click **"Open"** in the security dialog
   - *(First-time apps require this on macOS)*

#### On Linux:
1. **Right-click** the `.AppImage` file → **Properties**
2. Check **"Allow executing file as program"**
3. **Double-click** to run
4. *(Optional)* Move to `/usr/local/bin` for system-wide access

### Step 3: First Launch

1. **Windows**: Click the desktop shortcut or find in Start Menu
2. **macOS**: Open from Applications folder
3. **Linux**: Run the AppImage

**What happens:**
- A loading screen appears
- Backend server starts automatically (takes 5-10 seconds first time)
- TaskFlow window opens automatically
- You see the login/register screen

### Step 4: Create Your Account

1. Click **"Register"**
2. Enter your details:
   - **Name**: Your name
   - **Email**: Any email (not validated, just for login)
   - **Password**: At least 6 characters
3. Click **"Create account"**
4. You're in! Three default buckets are created automatically

---

## 💡 Using TaskFlow Desktop

### Main Window

- **Minimize** - Hides to system tray (app keeps running)
- **Close (X)** - Hides to system tray (app keeps running)
- **Really Quit** - Right-click tray icon → "Quit"

### System Tray Icon

Look for the TaskFlow icon in:
- **Windows**: Bottom-right corner (near clock)
- **macOS**: Top-right corner (menu bar)
- **Linux**: Top or bottom panel

**Right-click** the icon for options:
- **Open TaskFlow** - Show the main window
- **About** - Version information
- **Quit** - Close the app completely

### Your Data

Everything is stored locally on your computer at:

**Windows:**
```
C:\Users\YourName\AppData\Roaming\taskflow-desktop\taskflow.db
```

**macOS:**
```
/Users/YourName/Library/Application Support/taskflow-desktop/taskflow.db
```

**Linux:**
```
/home/yourusname/.config/taskflow-desktop/taskflow.db
```

**Backup Your Data:**
- Simply copy the `taskflow.db` file to a safe location
- To restore: Replace the file and restart TaskFlow

---

## 🔧 Troubleshooting

### App Won't Start

**Problem**: Double-clicking does nothing

**Solutions:**
1. **Windows**: Check Task Manager - TaskFlow might already be running
2. **macOS**: Check Activity Monitor
3. **Linux**: Run from terminal to see error messages:
   ```bash
   ./TaskFlow-1.0.0-linux-x86_64.AppImage
   ```

### Backend Error on Startup

**Problem**: "Failed to start backend" error

**Solutions:**
1. **First time?** Wait longer - first launch takes time to install dependencies
2. **Close** all TaskFlow windows and try again
3. **Restart** your computer
4. **Reinstall** the application

### Can't Login

**Problem**: "Invalid credentials" error

**Solutions:**
1. Make sure you **registered** first
2. Check your **email** and **password**
3. Try **registering again** with a different email

### Window is Blank/White

**Problem**: App window shows nothing

**Solutions:**
1. Wait 30 seconds - backend might still be starting
2. Press `Ctrl+R` (Windows/Linux) or `Cmd+R` (Mac) to reload
3. Restart the application

### Port Already in Use

**Problem**: "Port 5000 already in use"

**Solutions:**
1. Another TaskFlow instance might be running - check system tray
2. Another app using port 5000 - close it or restart computer
3. The old process is stuck - restart computer

### Antivirus Blocking

**Problem**: Antivirus flags the app

**This is a false positive!** The app is safe, but:
1. Add TaskFlow to your antivirus **exceptions**
2. Or temporarily **disable** antivirus during installation

---

## 🔄 Updating TaskFlow

### Manual Update

1. Download the new version
2. Install over the old version
3. Your data is preserved!

### Auto-Update (If enabled)

- App checks for updates on startup
- Notification appears when update available
- Click "Download" to update
- Restart to apply

---

## 🗑️ Uninstalling TaskFlow

### Windows

1. **Settings** → **Apps** → **Apps & features**
2. Find **"TaskFlow"**
3. Click **"Uninstall"**
4. *Optional:* Manually delete data folder to remove all traces

### macOS

1. Open **Applications** folder
2. **Drag** TaskFlow to **Trash**
3. *Optional:* Delete `~/Library/Application Support/taskflow-desktop`

### Linux

1. **Delete** the AppImage file
2. *Optional:* Delete `~/.config/taskflow-desktop`

---

## ⚡ Quick Tips

### Keyboard Shortcuts

- `Ctrl+R` / `Cmd+R` - Reload window
- `F11` - Fullscreen
- `F12` - Developer tools (for debugging)

### Performance Tips

- **Close unused tabs** - Keep only TaskFlow open for best performance
- **Regular backups** - Copy your database file weekly
- **Updates** - Install updates for bug fixes

### Privacy

- ✅ All data stays on your computer
- ✅ No internet required after installation
- ✅ No tracking or analytics
- ✅ No data sent to servers

---

## 🆘 Getting Help

### Still Having Issues?

1. **Check** the [Troubleshooting section](#-troubleshooting) above
2. **Look** for similar issues on GitHub
3. **Create** a new issue with:
   - What happened
   - What you expected
   - Your operating system
   - Screenshots (if relevant)

### Feature Requests

Have an idea? Open a GitHub issue with the "enhancement" label!

---

## 📊 System Requirements

### Minimum Requirements

**Windows:**
- Windows 10 64-bit or newer
- 4GB RAM
- 500MB free disk space

**macOS:**
- macOS 10.15 (Catalina) or newer
- 4GB RAM
- 500MB free disk space

**Linux:**
- 64-bit distribution
- GLIBC 2.17 or newer
- 4GB RAM
- 500MB free disk space

### Recommended Requirements

- 8GB RAM
- SSD for faster performance
- 1GB free disk space

---

## 🎉 Enjoy TaskFlow!

You now have a fully functional task manager running on your desktop. No servers, no subscriptions, no complexity - just you and your tasks!

**Happy organizing!** ✨

---

*Made with 💙 by the TaskFlow team*
