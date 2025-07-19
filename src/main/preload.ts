import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  fetchVerse: (input: string) => ipcRenderer.invoke("fetch-verse", input),
  generatePpt: (input: string) => ipcRenderer.invoke("generate-ppt", input), // 기존 PPT용도
});
