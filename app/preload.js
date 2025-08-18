"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    fetchVerse: function (input) { return electron_1.ipcRenderer.invoke("fetch-verse", input); },
    ping: function () { return electron_1.ipcRenderer.invoke("ping"); },
    generatePpt: function (input) { return electron_1.ipcRenderer.invoke("generate-ppt", input); }, // 기존 PPT용도
});
