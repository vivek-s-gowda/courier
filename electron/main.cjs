const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { fork } = require('child_process');

const PORT = process.env.PORT || 5001;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow = null;
let serverProcess = null;

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Check if backend HTTP server is responding
function checkServerReady(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1200, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Poll until backend server is ready
async function waitForServer(port, maxRetries = 50, interval = 200) {
  for (let i = 0; i < maxRetries; i++) {
    const ready = await checkServerReady(port);
    if (ready) return true;
    await new Promise((r) => setTimeout(r, interval));
  }
  return false;
}

// Locate server script across dev and packaged environments
function getServerScriptPath() {
  const localPath = path.join(__dirname, '../server/server.js');
  if (fs.existsSync(localPath)) return localPath;

  if (app.isPackaged) {
    const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'server', 'server.js');
    if (fs.existsSync(unpackedPath)) return unpackedPath;

    return path.join(app.getAppPath(), 'server', 'server.js');
  }

  return localPath;
}

// Ensure the Express backend engine is running
async function ensureBackendServer() {
  const alreadyRunning = await checkServerReady(PORT);
  if (alreadyRunning) {
    console.log(`[Courier Electron] Backend already active at http://localhost:${PORT}`);
    return;
  }

  const serverScript = getServerScriptPath();
  const userDataDir = path.join(app.getPath('userData'), 'data');
  const distDir = app.isPackaged
    ? path.join(app.getAppPath(), 'dist')
    : path.join(__dirname, '../dist');

  console.log(`[Courier Electron] Starting backend server: ${serverScript}`);
  console.log(`[Courier Electron] Storage directory: ${userDataDir}`);

  serverProcess = fork(serverScript, [], {
    env: {
      ...process.env,
      PORT: String(PORT),
      COURIER_DATA_DIR: userDataDir,
      COURIER_DIST_DIR: distDir,
      ELECTRON_RUN_AS_NODE: '1'
    },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc']
  });

  if (serverProcess.stdout) {
    serverProcess.stdout.on('data', (d) => {
      console.log(`[Server] ${d.toString().trim()}`);
    });
  }

  if (serverProcess.stderr) {
    serverProcess.stderr.on('data', (d) => {
      console.error(`[Server ERR] ${d.toString().trim()}`);
    });
  }

  serverProcess.on('exit', (code, signal) => {
    console.log(`[Courier Electron] Backend server exited (code: ${code}, signal: ${signal})`);
    serverProcess = null;
  });

  const ready = await waitForServer(PORT);
  if (!ready) {
    console.error('[Courier Electron] Warning: Backend server took longer than expected to report healthy.');
  }
}

// Stop backend server on app exit
function stopBackendServer() {
  if (serverProcess) {
    try {
      serverProcess.send('shutdown');
    } catch (_) {}
    setTimeout(() => {
      if (serverProcess) {
        try {
          serverProcess.kill('SIGTERM');
        } catch (_) {}
      }
    }, 400);
  }
}

// Build Application Menu
function createApplicationMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Request',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu:new-request');
            }
          }
        },
        {
          label: 'Send Request',
          accelerator: 'CmdOrCtrl+Enter',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu:send-request');
            }
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Courier',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Courier',
              message: 'Courier — Standalone API Testing Platform',
              detail: 'Version 1.0.0\nA lightweight, modern, and aesthetic Postman-style API testing application.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Create Main Application Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    title: 'Courier',
    icon: path.join(__dirname, 'assets/icon.png'),
    backgroundColor: '#fff9fa',
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  const devUrl = 'http://localhost:5173/app';
  const prodUrl = `http://localhost:${PORT}/app`;

  if (isDev) {
    // Try Vite dev server first, fall back to backend URL
    const req = http.get(devUrl, () => {
      console.log(`[Courier Electron] Loading Vite Dev Server: ${devUrl}`);
      mainWindow.loadURL(devUrl);
    });
    req.on('error', () => {
      console.log(`[Courier Electron] Loading Backend App Server: ${prodUrl}`);
      mainWindow.loadURL(prodUrl);
    });
  } else {
    console.log(`[Courier Electron] Loading Production App Server: ${prodUrl}`);
    mainWindow.loadURL(prodUrl);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('open-external', (_, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle('get-app-info', () => ({
  name: 'Courier',
  version: '1.0.0',
  isPackaged: app.isPackaged,
  platform: process.platform
}));

// App Lifecycle
app.whenReady().then(async () => {
  createApplicationMenu();
  await ensureBackendServer();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('before-quit', stopBackendServer);
app.on('will-quit', stopBackendServer);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
