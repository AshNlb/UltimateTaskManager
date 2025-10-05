# Windows Build Issue - Symbolic Link Permissions

## Problem

When building the TaskFlow desktop app on Windows, you may encounter this error:

```
ERROR: Cannot create symbolic link : A required privilege is not held by the client.
```

This occurs because electron-builder tries to extract code signing tools that contain symbolic links, which requires administrator privileges on Windows.

## Solutions

### Solution 1: Run Command Prompt as Administrator (Recommended)

1. **Close** all current terminals
2. Search for **"Command Prompt"** in Windows Start Menu
3. **Right-click** → **"Run as administrator"**
4. Navigate to the desktop directory:
   ```cmd
   cd C:\Users\asnal\VSCode\UltimateTaskManager\desktop
   ```
5. Run the build command:
   ```cmd
   npm run build:win:installer
   ```

### Solution 2: Enable Developer Mode (Windows 10/11)

This allows creating symbolic links without administrator privileges:

1. Open **Settings** → **Update & Security** → **For developers**
2. Toggle **"Developer Mode"** to **ON**
3. Restart your computer
4. Try building again:
   ```cmd
   cd desktop
   npm run build:win:installer
   ```

### Solution 3: Use PowerShell with Elevated Privileges

1. Search for **"PowerShell"** in Windows Start Menu
2. **Right-click** → **"Run as administrator"**
3. Navigate to desktop directory:
   ```powershell
   cd C:\Users\asnal\VSCode\UltimateTaskManager\desktop
   ```
4. Run the build:
   ```powershell
   npm run build:win:installer
   ```

### Solution 4: Build on Linux/WSL

If you have Windows Subsystem for Linux (WSL) installed:

1. **Open WSL** terminal
2. Navigate to the project:
   ```bash
   cd /mnt/c/Users/asnal/VSCode/UltimateTaskManager/desktop
   ```
3. Build for Windows from Linux:
   ```bash
   npm run build:win:installer
   ```

WSL doesn't have the same symbolic link restrictions.

### Solution 5: Use Development Mode (No Installer)

For testing purposes, you can skip building the installer and just run the app in development mode:

```cmd
cd desktop
npm start
```

This bypasses all build issues and runs the app directly.

## Why This Happens

- **electron-builder** downloads code signing tools (`winCodeSign`)
- These tools contain **symbolic links** (for macOS libraries)
- Windows requires **administrator privileges** to create symbolic links
- Even though we're not signing the app, electron-builder still downloads these tools

## Preventing This in Future

To avoid this issue entirely, you can:

1. **Always use Developer Mode** on Windows 10/11
2. **Build on CI/CD** (GitHub Actions, Azure DevOps) which run with proper permissions
3. **Build on Linux/macOS** for Windows targets (cross-compilation)

## After Fixing

Once you've applied one of the solutions above, the build should complete successfully and you'll find:

- **Installer**: `desktop/dist/TaskFlow-1.0.0-win-x64.exe`
- **Portable**: `desktop/dist/TaskFlow-1.0.0-win-x64-portable.exe`
- **Unpacked**: `desktop/dist/win-unpacked/`

## Testing Without Building

If you just want to test the app without creating an installer:

```cmd
cd desktop
npm start
```

This runs the Electron app in development mode - no build required!

## Distributing to Users

Even if you can't build on your machine:

1. **Use GitHub Actions** to build installers (free for public repos)
2. **Build on a different machine** (friend's computer, VM, etc.)
3. **Enable Developer Mode** once and build there
4. **Distribute the portable version** (doesn't require installation)

## Additional Resources

- [Windows Developer Mode Guide](https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development)
- [electron-builder Windows Signing](https://www.electron.build/code-signing#windows)
- [WSL Installation Guide](https://learn.microsoft.com/en-us/windows/wsl/install)
