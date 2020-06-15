import { app, BrowserWindow, ipcMain } from 'electron';

import { format } from 'url';
const path = require('path');

const { NODE_ENV, ELECTRON_WEBPACK_WDS_PORT } = process.env;

const basePath =
  NODE_ENV !== 'production'
    ? path.join(path.resolve(__dirname), '../..')
    : app.getAppPath();

// debug
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let window;

app.on('ready', () => {
  window = new BrowserWindow({
    minWidth: 640,
    minHeight: 480,
    title: 'Test',
    webPreferences: { nodeIntegration: true }
  });

  if (NODE_ENV !== 'production') {
    window.loadURL(`http://localhost:${ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      format({
        pathname: path.join(basePath, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }

  window.once('ready-to-show', window.show);
  window.maximize();

  window.on('closed', app.quit);
});

ipcMain.on('expensive', async (e, data) => {
  const fibonacci = num => {
    if (num <= 1) return 1;

    return fibonacci(num - 1) + fibonacci(num - 2);
  };
  const solved = fibonacci(48);
  window.webContents.send('result', solved);
});
