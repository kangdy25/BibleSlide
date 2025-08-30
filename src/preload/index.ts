import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchVerse: (input: string, version: string = 'GAE') =>
    ipcRenderer.invoke('fetch-verse', input, version),
  generateSlide: (data: string) => ipcRenderer.invoke('generate-slide', data),
});
