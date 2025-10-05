# TaskFlow Desktop - Quick Start Guide

Get the desktop app running in 5 minutes!

## For Developers: Testing the App

### Quick Test (Development Mode)

```bash
# 1. Install dependencies
cd desktop
npm install

# 2. Build the frontend first
cd ../frontend
npm install
npm run build

# 3. Go back and start the app
cd ../desktop
npm start
```

The app will open automatically. The backend starts in the background.

**First launch takes 30-60 seconds** while dependencies install.

## For Developers: Building Installers

### Simplest Build (Your Platform Only)

```bash
# Make sure you're in the desktop directory
cd desktop

# Build for your current OS
npm run build
```

Find your installer in `desktop/dist/`:
- Windows: `.exe` file
- macOS: `.dmg` file
- Linux: `.AppImage` file

### Quick Build Script

**Windows:**
```cmd
cd desktop
build-app.bat
```

**Linux/Mac:**
```bash
cd desktop
chmod +x build-app.sh
./build-app.sh
```

This automatically:
1. Builds the frontend
2. Builds the backend
3. Creates the desktop installer

## For Users: Installing the App

See `DESKTOP_APP_GUIDE.md` in the root directory for complete installation instructions.

### Windows
1. Download `TaskFlow-1.0.0-win-x64.exe`
2. Double-click to install
3. Click "More info" → "Run anyway" if Windows Defender appears
4. Follow installer prompts

### macOS
1. Download `TaskFlow-1.0.0-mac.dmg`
2. Open the DMG
3. Drag TaskFlow to Applications
4. Right-click → Open (first time only)

### Linux
1. Download `TaskFlow-1.0.0-linux-x86_64.AppImage`
2. Make executable: `chmod +x TaskFlow-1.0.0-linux-x86_64.AppImage`
3. Double-click to run

## Common Issues

### "Cannot find module '../frontend/dist'"

You forgot to build the frontend:
```bash
cd frontend
npm run build
```

### "Backend failed to start"

Wait longer on first launch (up to 60 seconds). Backend is installing dependencies.

If it still fails, check console (View → Toggle Developer Tools).

### Windows: "Windows protected your PC"

This is normal for unsigned apps. Click **"More info"** → **"Run anyway"**

### macOS: "Cannot be opened because the developer cannot be verified"

**Right-click** the app → **"Open"** instead of double-clicking.

### Linux: AppImage won't run

Make it executable first:
```bash
chmod +x TaskFlow-1.0.0-linux-x86_64.AppImage
```

## File Locations

Your data is stored at:

**Windows:**
```
C:\Users\YourName\AppData\Roaming\taskflow-desktop\
```

**macOS:**
```
~/Library/Application Support/taskflow-desktop/
```

**Linux:**
```
~/.config/taskflow-desktop/
```

## Need More Details?

- **Building:** See `BUILDING.md` for complete build instructions
- **Users:** See `../DESKTOP_APP_GUIDE.md` for user installation guide
- **Architecture:** See `README.md` for technical details

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm start` | Run app in development mode |
| `npm run build` | Build installer for your OS |
| `npm run build:win` | Build for Windows |
| `npm run build:mac` | Build for macOS |
| `npm run build:linux` | Build for Linux |
| `npm run build:all` | Build for all platforms |

## Distribution Tip

When sharing the app:

1. Upload installers to GitHub Releases
2. Share the download link
3. Point users to `DESKTOP_APP_GUIDE.md` for installation help
4. Create checksums for security:
   ```bash
   # Windows
   certutil -hashfile TaskFlow-1.0.0-win-x64.exe SHA256

   # Linux/Mac
   shasum -a 256 TaskFlow-1.0.0-linux-x86_64.AppImage
   ```

## Happy Building! 🚀

Questions? Open an issue on GitHub.
