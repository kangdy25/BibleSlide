import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchVerse: (input: string) => ipcRenderer.invoke('fetch-verse', input),
  generateSlide: (data: string) => ipcRenderer.invoke('generate-slide', data),
});