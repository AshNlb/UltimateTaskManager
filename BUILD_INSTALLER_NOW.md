# Building the Standalone Desktop Installer

## The Issue We Hit

When we tried to build the installer, Windows blocked it due to symbolic link permissions.

## Solutions to Build Right Now

### Solution 1: Enable Developer Mode (Recommended - One Time Setup)

1. Press `Win + I` to open Settings
2. Go to **Update & Security** → **For developers**
3. Toggle **"Developer Mode"** to **ON**
4. **Restart your computer**
5. Then run:
```bash
cd desktop
npm run build:win:installer
```

### Solution 2: Run as Administrator (Quick)

1. **Close all terminals**
2. Press `Win` key, type **"Command Prompt"**
3. **Right-click** → **"Run as administrator"**
4. Navigate to desktop folder:
```cmd
cd C:\Users\asnal\VSCode\UltimateTaskManager\desktop
```
5. Build the installer:
```cmd
npm run build:win:installer
```

### Solution 3: Use PowerShell as Admin

1. Press `Win` key, type **"PowerShell"**
2. **Right-click** → **"Run as administrator"**
3. Navigate and build:
```powershell
cd C:\Users\asnal\VSCode\UltimateTaskManager\desktop
npm run build:win:installer
```

## What You'll Get

After the build completes (takes 2-5 minutes), you'll find in `desktop/dist/`:

1. **TaskFlow-1.0.0-win-x64.exe** - Full installer (~150-200 MB)
   - Double-click to install
   - Creates Start Menu shortcut
   - Creates Desktop shortcut
   - Installs to Program Files

2. **TaskFlow-1.0.0-win-x64-portable.exe** - Portable version (~150-200 MB)
   - No installation required
   - Run directly
   - Perfect for USB drives

## After Building

Users can then:
1. **Download** the .exe file
2. **Double-click** to install
3. **Launch** TaskFlow like any app
4. **No Node.js required**
5. **No terminal required**
6. **Everything bundled inside**

That's the standalone desktop app experience we designed!

## Which Solution Should You Use?

- **One-time setup**: Use Solution 1 (Developer Mode)
- **Quick build now**: Use Solution 2 or 3 (Run as Admin)
- **Can't get admin access**: Ask someone with admin rights to run the build

Let me know which solution you want to try and I can guide you through it!
