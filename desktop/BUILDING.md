# Building TaskFlow Desktop App

Complete guide for building the TaskFlow desktop application.

## Prerequisites

1. **Node.js 18+** installed
2. **All dependencies installed** in backend, frontend, and desktop directories
3. **Frontend built** for production

## Step-by-Step Build Process

### Step 1: Prepare Icons (Optional for Testing)

You can build without custom icons for testing, or generate them first:

#### Quick Icon Generation (Windows)

The easiest way is to use an online SVG to PNG converter:

1. Go to https://cloudconvert.com/svg-to-png
2. Upload `desktop/assets/icon.svg`
3. Set output size to 512x512
4. Download and save as `desktop/icon.png`

For production builds, you'll also need `.ico` (Windows) and `.icns` (macOS). See `desktop/assets/ICON_README.md` for details.

#### Skip Icons for Testing

Edit `desktop/package.json` and comment out icon paths:

```json
"win": {
  // "icon": "assets/icon.ico"  // Commented out
},
"mac": {
  // "icon": "assets/icon.icns"  // Commented out
},
"linux": {
  // "icon": "assets/icon.png"  // Commented out
}
```

### Step 2: Install Desktop Dependencies

```bash
cd desktop
npm install
```

### Step 3: Build Frontend

The desktop app needs the production build of the frontend:

```bash
cd ../frontend
npm install
npm run build
```

This creates `frontend/dist/` with the compiled React app.

### Step 4: Build Backend (Optional)

The desktop app will auto-build the backend on first run, but you can pre-build it:

```bash
cd ../backend
npm install
npm run build
```

### Step 5: Test in Development Mode

Before building installers, test the app:

```bash
cd ../desktop
npm start
```

This will:
- Start the Electron app
- Auto-start the backend server
- Load the frontend
- Open the TaskFlow window

**What to test:**
- Backend starts without errors (check console)
- Login/Register works
- Tasks can be created/edited/deleted
- Calendar view loads
- AI Assistant responds
- Theme switching works
- Minimize to system tray works
- App restarts correctly

### Step 6: Build Installers

Once testing is complete, build the installers:

#### Build for Your Current Platform

```bash
cd desktop
npm run build
```

This automatically detects your OS and builds for it.

#### Build for Specific Platforms

**Windows** (creates .exe installer + portable .exe):
```bash
npm run build:win
```

**macOS** (creates .dmg and .zip):
```bash
npm run build:mac
```
*Note: Can only be run on macOS*

**Linux** (creates .AppImage and .deb):
```bash
npm run build:linux
```

#### Build for All Platforms (Advanced)

```bash
npm run build:all
```

*Note: This requires platform-specific tools and may not work cross-platform*

### Step 7: Find Your Built Apps

After building, installers are in `desktop/dist/`:

**Windows:**
- `TaskFlow-1.0.0-win-x64.exe` - NSIS installer
- `TaskFlow-1.0.0-win-x64-portable.exe` - Portable version

**macOS:**
- `TaskFlow-1.0.0-mac.dmg` - DMG installer
- `TaskFlow-1.0.0-mac.zip` - ZIP archive

**Linux:**
- `TaskFlow-1.0.0-linux-x86_64.AppImage` - AppImage (universal)
- `TaskFlow-1.0.0-linux-amd64.deb` - Debian package

### Step 8: Test the Built App

**Windows:**
```bash
# Test portable version (no installation needed)
cd desktop/dist
./TaskFlow-1.0.0-win-x64-portable.exe
```

**Linux:**
```bash
# Make AppImage executable
chmod +x desktop/dist/TaskFlow-1.0.0-linux-x86_64.AppImage

# Run it
./desktop/dist/TaskFlow-1.0.0-linux-x86_64.AppImage
```

**macOS:**
```bash
# Mount the DMG and copy to Applications
open desktop/dist/TaskFlow-1.0.0-mac.dmg
# Then drag to Applications and run
```

## Troubleshooting Build Issues

### Error: "Cannot find module '../frontend/dist'"

**Solution:** Build the frontend first
```bash
cd frontend
npm run build
```

### Error: "spawn ENOENT" or "backend failed to start"

**Solution:** Ensure backend dependencies are installed
```bash
cd backend
npm install
npm run build
```

### Error: Icon file not found

**Solution:** Either:
1. Generate the required icon files (see Step 1)
2. OR comment out icon paths in `package.json`

### Error: "Application not signed" (macOS)

**Solution:** For distribution, you need to sign the app:
```bash
# Set up Apple Developer certificate first, then:
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSPHRASE=your-passphrase
npm run build:mac
```

For local testing, just right-click → Open instead of double-clicking.

### Error: "Windows protected your PC" (Windows)

**Solution:** This is normal for unsigned apps. Click "More info" → "Run anyway"

For distribution, you should code-sign the app with a certificate.

### Build is Very Slow

**Solution:** Electron-builder is slow because it bundles Node.js, Chromium, and your entire app. This is normal. First build takes longest.

### Build Fails with "ENOSPC" (Linux)

**Solution:** Increase inotify watchers
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Advanced: Automated Build Script

For convenience, you can use the provided build scripts:

**Windows:**
```bash
cd desktop
./build-app.bat
```

**Linux/macOS:**
```bash
cd desktop
chmod +x build-app.sh
./build-app.sh
```

These scripts:
1. Build the frontend
2. Install backend dependencies
3. Build backend
4. Build Electron app for your platform

## Build Configuration

Build settings are in `desktop/package.json` under the `"build"` key:

- **appId**: Unique app identifier
- **productName**: App display name
- **artifactName**: Output file naming pattern
- **files**: Which files to include in the app
- **extraResources**: Backend files bundled separately
- **win/mac/linux**: Platform-specific settings

## File Size Expectations

Built apps will be approximately:
- **Windows .exe**: ~150-200 MB
- **macOS .dmg**: ~150-200 MB
- **Linux .AppImage**: ~150-200 MB

This is normal - Electron bundles an entire Chromium browser and Node.js runtime.

## Distribution Checklist

Before distributing to users:

- [ ] Test on clean machine (without dev tools installed)
- [ ] Verify database creation in user directory
- [ ] Test first launch (dependency installation)
- [ ] Test login/register flow
- [ ] Test all features (tasks, calendar, AI, themes)
- [ ] Test minimize to tray
- [ ] Test quit and restart
- [ ] Create checksums for downloads
- [ ] (Optional) Code sign for Windows/macOS
- [ ] Write release notes
- [ ] Upload to GitHub Releases or website

## Code Signing (Production)

For production distribution, you should code-sign your apps:

### Windows

1. Purchase code signing certificate
2. Export as .pfx file
3. Build with signing:
```bash
export WIN_CSC_LINK=/path/to/cert.pfx
export WIN_CSC_KEY_PASSWORD=password
npm run build:win
```

### macOS

1. Enroll in Apple Developer Program ($99/year)
2. Create certificates in Xcode
3. Build with signing:
```bash
export APPLE_ID=your@email.com
export APPLE_ID_PASSWORD=app-specific-password
npm run build:mac
```

### Linux

Linux apps typically don't require code signing.

## Auto-Updates (Advanced)

To enable auto-updates via GitHub Releases:

1. Add to `package.json`:
```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "yourusername",
    "repo": "ultimate-task-manager"
  }
}
```

2. Add auto-updater code to `main.js`
3. Generate GitHub token
4. Build with publish flag:
```bash
GH_TOKEN=your-token npm run build -- --publish always
```

## Getting Help

- Check console logs in DevTools (View → Toggle Developer Tools)
- Review `desktop/README.md` for architecture details
- Check electron-builder docs: https://www.electron.build/
- Open GitHub issue with build error details
