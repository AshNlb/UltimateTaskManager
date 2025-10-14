# How to Check Build Status

## Step 1: Go to Actions Tab

1. Go to your GitHub repository
2. Click the **"Actions"** tab at the top
   ```
   < > Code    Issues    Pull requests    Actions    Projects    Wiki    Security
                                           ^^^^^^^^
   ```

## Step 2: Find Your Workflow

You should see:
- **"Build Desktop Apps"** workflow
- Status indicator:
  - 🟡 **Yellow/Orange** = Currently running
  - ✅ **Green checkmark** = Completed successfully
  - ❌ **Red X** = Failed (check logs)

## Step 3: Click on the Running Workflow

Click on the workflow run to see details:
- You'll see 3 parallel jobs:
  - **build (macos-latest)** - Building macOS installers
  - **build (ubuntu-latest)** - Building Linux installers
  - **build (windows-latest)** - Building Windows installers

## Step 4: Watch the Progress

Each job shows:
- ⏳ Queued (waiting to start)
- 🔄 In progress (currently building)
- ✅ Success (completed)
- ❌ Failure (error occurred)

**Typical timeline:**
- 0-2 min: Setup and checkout code
- 2-5 min: Install dependencies and build frontend/backend
- 5-10 min: Build Electron app
- 10-15 min: Upload artifacts and create release

## Step 5: View Build Logs (Optional)

To see detailed logs:
1. Click on any job (e.g., "build (windows-latest)")
2. Expand steps to see output
3. Look for:
   - ✅ "packaging" - Creating the app bundle
   - ✅ "building" - Compiling installers
   - ✅ "Upload artifacts" - Uploading to GitHub

## Step 6: Download Installers

### If You Pushed a Tag (v1.0.0)

**After build completes:**
1. Go to main repository page
2. Click **"Releases"** on the right sidebar
   ```
   About
   No description, website, or topics provided.

   Releases
   ^^^^^^^^
   ```
3. Click on **v1.0.0**
4. Scroll to **"Assets"**
5. Download:
   - `TaskFlow-1.0.0-win-x64.exe` (~150-200 MB)
   - `TaskFlow-1.0.0-win-x64-portable.exe` (~150-200 MB)
   - `TaskFlow-1.0.0-mac.dmg` (~150-200 MB)
   - `TaskFlow-1.0.0-mac.zip`
   - `TaskFlow-1.0.0-linux-x86_64.AppImage` (~150-200 MB)
   - `TaskFlow-1.0.0-linux-amd64.deb`

### If You Didn't Push a Tag

**After build completes:**
1. Stay in **Actions** tab
2. Click the completed workflow run
3. Scroll to bottom → **"Artifacts"** section
4. Download:
   - `TaskFlow-Windows.zip` (contains .exe files)
   - `TaskFlow-macOS.zip` (contains .dmg and .zip)
   - `TaskFlow-Linux.zip` (contains .AppImage and .deb)
5. Extract the zip files to get installers

## Quick Links

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values:

**Actions Tab:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

**Releases Page:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases
```

**Latest Release (direct download):**
```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest
```

## Troubleshooting

### Build is Taking Too Long (>20 minutes)
- GitHub Actions can sometimes queue jobs
- Check if jobs show "Queued" status
- Usually resolves within a few minutes

### Build Failed ❌

1. Click on the failed job
2. Look for red ❌ marks in the steps
3. Common issues:
   - **Frontend build error**: Check TypeScript errors
   - **Backend build error**: Check Node.js errors
   - **Packaging error**: Check electron-builder logs

### No Release Created

Make sure you pushed a tag starting with `v`:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Without a tag, builds create **Artifacts** only (not Releases).

### Can't Find Artifacts

- Artifacts are only kept for **30 days**
- For permanent distribution, use tagged releases
- Artifacts appear at bottom of workflow run page

## Example: What You'll See

**In Actions Tab:**
```
All workflows

✅ Build Desktop Apps #1
   Initial commit: TaskFlow - Ultimate Task Manager
   v1.0.0 pushed by you 5 minutes ago

   Jobs:
   ✅ build (macos-latest)    5m 23s
   ✅ build (ubuntu-latest)   4m 56s
   ✅ build (windows-latest)  6m 12s
```

**In Releases:**
```
v1.0.0
Latest

Assets (6)
▼ Show all assets

📦 TaskFlow-1.0.0-win-x64.exe              187 MB
📦 TaskFlow-1.0.0-win-x64-portable.exe     187 MB
📦 TaskFlow-1.0.0-mac.dmg                  192 MB
📦 TaskFlow-1.0.0-mac.zip                  188 MB
📦 TaskFlow-1.0.0-linux-x86_64.AppImage    184 MB
📦 TaskFlow-1.0.0-linux-amd64.deb          123 MB
```

## Success! What Now?

Once builds complete and installers are ready:

### Test the Installers
1. Download the installer for your OS
2. Install it
3. Verify the app works
4. Test all features

### Share with Users
1. Share the release URL
2. Point them to [DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md)
3. They download and install - that's it!

### Update Your README
Add a download badge:
```markdown
## Download

[Download Latest Release](https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest)

**Platforms:**
- Windows: `TaskFlow-1.0.0-win-x64.exe`
- macOS: `TaskFlow-1.0.0-mac.dmg`
- Linux: `TaskFlow-1.0.0-linux-x86_64.AppImage`
```

---

## TL;DR - Quick Check

1. **Go to**: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
2. **Look for**: "Build Desktop Apps" workflow
3. **Wait for**: Green checkmarks (10-15 minutes)
4. **Download from**: Releases tab (if you pushed a tag) or Artifacts (if not)

That's it! 🎉
