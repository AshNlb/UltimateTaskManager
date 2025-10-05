const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow = null;
let tray = null;
let backendProcess = null;
const BACKEND_PORT = 5000;
const isDev = !app.isPackaged;

// Paths
const backendPath = isDev
  ? path.join(__dirname, '..', 'backend')
  : path.join(process.resourcesPath, 'backend');

const frontendPath = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '..', 'frontend', 'dist', 'index.html')}`;

// Create user data directory for database
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'taskflow.db');

console.log('App paths:', {
  isDev,
  backendPath,
  frontendPath,
  userDataPath,
  dbPath
});

// Start backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log('Starting backend server...');

    const env = {
      ...process.env,
      PORT: BACKEND_PORT.toString(),
      DATABASE_URL: `file:${dbPath}`,
      JWT_SECRET: 'taskflow-desktop-secret-' + Date.now(),
      NODE_ENV: 'production'
    };

    // Install dependencies if needed (first run)
    const nodeModulesPath = path.join(backendPath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('Installing backend dependencies...');
      const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const install = spawn(npm, ['install'], {
        cwd: backendPath,
        env,
        shell: true
      });

      install.on('close', (code) => {
        if (code === 0) {
          console.log('Dependencies installed');
          startBackendProcess(env, resolve, reject);
        } else {
          reject(new Error('Failed to install dependencies'));
        }
      });
    } else {
      startBackendProcess(env, resolve, reject);
    }
  });
}

function startBackendProcess(env, resolve, reject) {
  const node = process.platform === 'win32' ? 'node.exe' : 'node';
  const mainFile = path.join(backendPath, 'dist', 'index.js');

  // Check if built
  if (!fs.existsSync(mainFile)) {
    console.log('Building backend...');
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const build = spawn(npm, ['run', 'build'], {
      cwd: backendPath,
      env,
      shell: true
    });

    build.on('close', (code) => {
      if (code === 0) {
        console.log('Backend built successfully');
        launchBackend(env, resolve, reject);
      } else {
        reject(new Error('Failed to build backend'));
      }
    });
  } else {
    launchBackend(env, resolve, reject);
  }
}

function launchBackend(env, resolve, reject) {
  const node = process.platform === 'win32' ? 'node.exe' : 'node';
  const mainFile = path.join(backendPath, 'dist', 'index.js');

  backendProcess = spawn(node, [mainFile], {
    cwd: backendPath,
    env,
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data.toString()}`);
    if (data.toString().includes('Server running')) {
      resolve();
    }
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data.toString()}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    backendProcess = null;
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
    reject(err);
  });

  // Give it a moment to start
  setTimeout(resolve, 3000);
}

// Stop backend
function stopBackend() {
  if (backendProcess) {
    console.log('Stopping backend server...');
    backendProcess.kill();
    backendProcess = null;
  }
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    title: 'TaskFlow',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  // Load the frontend
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create system tray
function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open TaskFlow',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'About',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'About TaskFlow',
          message: 'TaskFlow v1.0.0',
          detail: 'Ultimate Task Manager\nBuilt with Electron, React, and Node.js'
        });
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('TaskFlow - Task Manager');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

// App lifecycle
app.whenReady().then(async () => {
  try {
    console.log('Starting TaskFlow Desktop...');

    // Start backend first
    await startBackend();
    console.log('Backend started successfully');

    // Create window and tray
    createWindow();
    createTray();

    console.log('TaskFlow Desktop ready!');
  } catch (error) {
    console.error('Failed to start TaskFlow:', error);
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start TaskFlow:\n${error.message}\n\nPlease check the logs and try again.`
    );
    app.quit();
  }
});

app.on('window-all-closed', () => {
  // Don't quit on window close, keep running in tray
  if (process.platform !== 'darwin') {
    // On macOS, keep app running even when all windows are closed
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('will-quit', () => {
  stopBackend();
});

app.on('quit', () => {
  stopBackend();
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});
