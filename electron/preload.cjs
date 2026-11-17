const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer
contextBridge.exposeInMainWorld('courierDesktop', {
  isElectron: true,
  platform: process.platform,
  version: '1.0.0',
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  onNewRequest: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('menu:new-request', handler);
    return () => ipcRenderer.removeListener('menu:new-request', handler);
  },
  onSendRequest: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('menu:send-request', handler);
    return () => ipcRenderer.removeListener('menu:send-request', handler);
  }
});

// Set desktop class on document when loaded
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-electron-app');
});
