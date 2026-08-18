import { app, BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
let overlay: BrowserWindow | undefined;

function makeWindow(): void {
  const window = new BrowserWindow({
    width: 460, height: 680, minWidth: 400, minHeight: 520,
    webPreferences: { preload: path.join(directory, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) void window.loadURL(devUrl); else void window.loadFile(path.join(directory, '../dist/index.html'));
}

function showOverlay(text: string): void {
  if (!overlay) {
    const bounds = screen.getPrimaryDisplay().workArea;
    overlay = new BrowserWindow({
      x: bounds.x + Math.round(bounds.width * 0.2), y: bounds.y + Math.round(bounds.height * 0.2), width: Math.round(bounds.width * 0.6), height: 180,
      transparent: true, frame: false, alwaysOnTop: true, skipTaskbar: true, focusable: false,
      webPreferences: { preload: path.join(directory, 'preload.js'), contextIsolation: true, nodeIntegration: false }
    });
    overlay.setIgnoreMouseEvents(true, { forward: true });
    void overlay.loadFile(path.join(directory, '../dist/overlay.html'));
    overlay.on('closed', () => { overlay = undefined; });
  }
  overlay.webContents.once('did-finish-load', () => overlay?.webContents.send('overlay:text', text));
  if (!overlay.webContents.isLoading()) overlay.webContents.send('overlay:text', text);
}

app.whenReady().then(() => {
  makeWindow();
  ipcMain.handle('capture:sources', async () => (await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 320, height: 180 } })).map(s => ({ id: s.id, name: s.name, thumbnail: s.thumbnail.toDataURL() })));
  ipcMain.handle('overlay:show', (_event, text: string) => showOverlay(text));
  ipcMain.handle('overlay:hide', () => overlay?.hide());
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) makeWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
