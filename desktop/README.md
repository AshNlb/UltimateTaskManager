# TaskFlow Desktop Application

This is the Electron-based desktop application for TaskFlow. It packages the backend and frontend into a single executable application.

## For Users

### Download and Install

1. Download the appropriate installer for your OS:
   - **Windows**: `TaskFlow-1.0.0-win-x64.exe`
   - **macOS**: `TaskFlow-1.0.0-mac.dmg`
   - **Linux**: `TaskFlow-1.0.0-linux-x86_64.AppImage`

2. Double-click the installer and follow the prompts

3. Launch TaskFlow from:
   - **Windows**: Start Menu or Desktop shortcut
   - **macOS**: Applications folder
   - **Linux**: Applications menu

### First Launch

When you first launch TaskFlow:
1. The backend server will start automatically
2. A browser window will open with TaskFlow
3. Register your account to get started
4. The system tray icon (bottom-right on Windows, top-right on Mac) allows you to minimize/restore the app

### Data Location

Your tasks and data are stored in:
- **Windows**: `C:\Users\YourName\AppData\Roaming\taskflow-desktop\taskflow.db`
- **macOS**: `~/Library/Application Support/taskflow-desktop/taskflow.db`
- **Linux**: `~/.config/taskflow-desktop/taskflow.db`

### Uninstall

- **Windows**: Use "Add/Remove Programs" in Settings
- **macOS**: Drag TaskFlow.app to Trash
- **Linux**: Delete the AppImage file

## For Developers

### Prerequisites

```bash
cd desktop
npm install
```

### Development

```bash
# Make sure backend and frontend are running separately:
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

# Then start Electron in dev mode:
cd desktop
npm start
```

### Building Installers

First, build the frontend for production:

```bash
cd ../frontend
npm run build
```

Then build the desktop app:

```bash
cd ../desktop

# Build for current platform
npm run build

# Or build for specific platforms:
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux

# Build for all platforms (requires platform-specific tools)
npm run build:all
```

The installers will be in `desktop/dist/`:
- Windows: `.exe` (installer) and `.exe` (portable)
- macOS: `.dmg` and `.zip`
- Linux: `.AppImage` and `.deb`

### Project Structure

```
desktop/
├── main.js          # Electron main process (backend startup, window management)
├── preload.js       # Preload script for security
├── package.json     # Electron dependencies and build config
├── assets/          # App icons
└── dist/            # Built installers (after build)
```

### How It Works

1. **Main Process (`main.js`)**:
   - Starts the Node.js backend server
   - Creates the Electron window
   - Sets up system tray
   - Manages app lifecycle

2. **Backend**:
   - Runs on `localhost:5000`
   - Database stored in user data directory
   - Auto-installs dependencies on first run

3. **Frontend**:
   - Loaded from `frontend/dist`
   - Connects to backend via proxy

### Build Configuration

The `electron-builder` configuration in `package.json` handles:
- Bundling backend and frontend
- Creating platform-specific installers
- Setting app metadata
- Configuring auto-updates (optional)

### Platform-Specific Notes

**Windows**:
- Requires Visual Studio Build Tools for some dependencies
- Creates both installer and portable versions
- Code signing recommended for production (prevents Windows SmartScreen warnings)

**macOS**:
- Requires Xcode Command Line Tools
- Code signing and notarization required for distribution
- Can only be built on macOS

**Linux**:
- AppImage works on most distributions
- .deb for Debian/Ubuntu-based systems
- Can be built on any platform

### Troubleshooting

**Backend won't start**:
- Check console logs in DevTools (View → Toggle Developer Tools)
- Verify backend dependencies installed
- Check database file permissions

**Build fails**:
- Ensure frontend is built first: `cd frontend && npm run build`
- Install platform-specific build tools
- Check Node.js version (18+ required)

**App won't launch**:
- Check antivirus isn't blocking
- Try portable version (Windows)
- Check application logs

### Distribution

For distribution to users:

1. **Build for all platforms** (if you have access to them)
2. **Code sign** the apps (important for macOS/Windows)
3. **Upload** to GitHub Releases or your website
4. **Create checksums** for verification
5. **Provide** installation instructions

### Auto-Updates (Optional)

To add auto-updates:

1. Set up update server or use GitHub Releases
2. Add `autoUpdater` code to `main.js`
3. Configure in `package.json`:

```json
"publish": {
  "provider": "github",
  "owner": "yourusername",
  "repo": "ultimate-task-manager"
}
```

## Security Notes

- Backend runs locally (not exposed to network)
- Database is user-specific
- No data sent to external servers
- Code signing recommended for production releases

## License

See parent LICENSE file. Remember: this app cannot be sold or offered as a paid service.
