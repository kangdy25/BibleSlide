import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  generatePpt: (input: string) => ipcRenderer.invoke("generate-ppt", input),
});
