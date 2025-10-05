# Building TaskFlow for All Platforms

## The Problem: OS-Specific Builds

Desktop applications must be built on their target OS:
- ❌ **Windows .exe** - Cannot be built on Mac/Linux (requires Windows)
- ❌ **macOS .dmg** - Cannot be built on Windows/Linux (requires macOS)
- ✅ **Linux .AppImage** - Can sometimes be built on other platforms

This is a limitation of Electron and all desktop app frameworks.

## The Solution: Automated Cross-Platform Builds

We've created a **GitHub Actions workflow** that automatically builds for **all three platforms** when you push code!

### ✅ What We Set Up

Created: [`.github/workflows/build-desktop.yml`](.github/workflows/build-desktop.yml)

This workflow:
- Builds on **macOS runner** → Creates `.dmg` and `.zip`
- Builds on **Linux runner** → Creates `.AppImage` and `.deb`
- Builds on **Windows runner** → Creates `.exe` installer and portable

All builds happen in the cloud - **100% free for public GitHub repos!**

## How to Use It

### Method 1: Create a Release (Recommended)

1. **Commit and push your code**:
```bash
git add .
git commit -m "Ready for release v1.0.0"
git push
```

2. **Create and push a version tag**:
```bash
git tag v1.0.0
git push origin v1.0.0
```

3. **Wait 10-15 minutes** - GitHub builds all platforms automatically

4. **Download installers** from GitHub:
   - Go to your repository
   - Click **"Releases"** on the right sidebar
   - Find your release (v1.0.0)
   - Download the installers:
     - `TaskFlow-1.0.0-win-x64.exe` (Windows installer)
     - `TaskFlow-1.0.0-win-x64-portable.exe` (Windows portable)
     - `TaskFlow-1.0.0-mac.dmg` (macOS installer)
     - `TaskFlow-1.0.0-mac.zip` (macOS zip)
     - `TaskFlow-1.0.0-linux-x86_64.AppImage` (Linux universal)
     - `TaskFlow-1.0.0-linux-amd64.deb` (Debian/Ubuntu)

### Method 2: Manual Trigger (No Tag Required)

1. **Push your code**:
```bash
git add .
git commit -m "Build desktop apps"
git push
```

2. **Go to GitHub**:
   - Your repository → **Actions** tab
   - Click **"Build Desktop Apps"**
   - Click **"Run workflow"** button
   - Choose branch (usually `main`)
   - Click **"Run workflow"**

3. **Wait 10-15 minutes**

4. **Download artifacts**:
   - Go to the completed workflow run
   - Scroll to **"Artifacts"** section at the bottom
   - Download:
     - `TaskFlow-macOS.zip`
     - `TaskFlow-Linux.zip`
     - `TaskFlow-Windows.zip`
   - Extract to get the installers

## Build Status

You can watch builds in real-time:
- Repository → **Actions** tab
- Click on the running workflow
- Watch the progress for each OS

Each platform takes about 5-10 minutes to build.

## What Gets Built

### Windows (built on windows-latest)
- ✅ `TaskFlow-1.0.0-win-x64.exe` - NSIS installer (~150-200 MB)
- ✅ `TaskFlow-1.0.0-win-x64-portable.exe` - Portable executable

### macOS (built on macos-latest)
- ✅ `TaskFlow-1.0.0-mac.dmg` - DMG disk image (~150-200 MB)
- ✅ `TaskFlow-1.0.0-mac.zip` - ZIP archive

### Linux (built on ubuntu-latest)
- ✅ `TaskFlow-1.0.0-linux-x86_64.AppImage` - Universal Linux app (~150-200 MB)
- ✅ `TaskFlow-1.0.0-linux-amd64.deb` - Debian package

## Local Build Instructions (If You Must)

If you need to build locally:

### Windows
**Problem**: Requires admin privileges or Developer Mode
**Solutions**: See [desktop/WINDOWS_BUILD_ISSUE.md](desktop/WINDOWS_BUILD_ISSUE.md)

```bash
# Enable Developer Mode first, then:
cd desktop
npm run build:win:installer
```

### macOS (macOS only)
```bash
cd desktop
npm run build:mac
```

### Linux (Linux only)
```bash
cd desktop
npm run build:linux
```

## Why Use GitHub Actions?

### Advantages:
✅ **Free** - 2,000 minutes/month for public repos
✅ **All platforms** - Build Windows, Mac, Linux simultaneously
✅ **No local setup** - No need for admin rights or multiple machines
✅ **Automatic** - Triggered by git tags
✅ **Reliable** - Clean build environment every time
✅ **Fast** - 10-15 minutes for all platforms
✅ **Release integration** - Automatically attaches builds to GitHub Releases

### Disadvantages:
❌ Requires internet connection
❌ Must wait 10-15 minutes
❌ Requires GitHub account

## Distributing to Users

After GitHub builds your apps:

### Option 1: GitHub Releases (Recommended)
1. Users go to: `https://github.com/yourusername/repo/releases`
2. Download the installer for their OS
3. Install and run

### Option 2: Direct Download
1. Download artifacts from GitHub Actions
2. Upload to your own website/server
3. Share download links

### Option 3: Package Managers (Advanced)
- **Windows**: Submit to Microsoft Store
- **macOS**: Submit to Mac App Store
- **Linux**: Submit to Snap Store, Flathub

## First Time Setup

The GitHub Actions workflow is already configured in [`.github/workflows/build-desktop.yml`](.github/workflows/build-desktop.yml)

To use it:

1. **Make sure your repo is on GitHub**:
```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. **Enable GitHub Actions** (usually enabled by default):
   - Go to repository → Settings → Actions → General
   - Make sure "Allow all actions" is selected

3. **Create your first release**:
```bash
git tag v1.0.0
git push origin v1.0.0
```

4. **Watch it build**:
   - Go to Actions tab
   - See the workflow running
   - Wait for completion
   - Check Releases for installers

## Updating the App

When you want to release a new version:

1. **Update version** in `desktop/package.json`:
```json
{
  "version": "1.1.0"
}
```

2. **Commit and tag**:
```bash
git add .
git commit -m "Release v1.1.0"
git tag v1.1.0
git push origin main
git push origin v1.1.0
```

3. **GitHub automatically builds** all platforms

4. **New release appears** with updated installers

## Troubleshooting

### Build fails on GitHub Actions

1. Check the **Actions** tab for error logs
2. Common issues:
   - Frontend build errors → Fix TypeScript errors
   - Backend build errors → Fix Node.js errors
   - Dependency issues → Check package.json

### Artifacts not appearing

- Make sure the workflow completed successfully (green checkmark)
- Artifacts are only kept for 30 days by default
- For permanent distribution, use tagged releases

### Release not created

- Make sure you pushed a **tag** starting with `v` (e.g., `v1.0.0`)
- Check that `GITHUB_TOKEN` has permissions (enabled by default)

## Cost

**GitHub Actions is FREE for public repositories!**

- 2,000 minutes/month included
- Each full build (all 3 platforms) takes ~15 minutes
- That's **133 builds per month** - more than enough!

For private repos:
- Free tier: 2,000 minutes/month
- Typically enough for regular releases

## Summary

You **cannot** build for all platforms locally on Windows, but you **can** use GitHub Actions to build for all platforms automatically in the cloud!

**Recommended workflow:**
1. Develop locally using `npm start`
2. When ready to release, push with a version tag
3. GitHub builds all platforms automatically
4. Download and distribute the installers

---

**Next Steps:**
1. Push your code to GitHub
2. Create a tag: `v1.0.0`
3. Wait 15 minutes
4. Download installers from Releases
5. Share with users!

See [`.github/workflows/build-desktop.yml`](.github/workflows/build-desktop.yml) for the complete build configuration.
