import { contextBridge, ipcRenderer } from 'electron';

console.log(1 + 2);

contextBridge.exposeInMainWorld('electronAPI', {
  fetchVerse: (input: string) => ipcRenderer.invoke('fetch-verse', input),
  ping: () => ipcRenderer.invoke('ping'),
  generatePpt: (input: string) => ipcRenderer.invoke('generate-ppt', input), // 기존 PPT용도
});
