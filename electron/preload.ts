import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('openScreen', {
  sources: () => ipcRenderer.invoke('capture:sources') as Promise<Array<{ id: string; name: string; thumbnail: string }>>,
  showOverlay: (text: string) => ipcRenderer.invoke('overlay:show', text),
  hideOverlay: () => ipcRenderer.invoke('overlay:hide'),
  onOverlayText: (callback: (text: string) => void) => ipcRenderer.on('overlay:text', (_event, text) => callback(text))
});
