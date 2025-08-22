"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    fetchVerse: function (input) { return electron_1.ipcRenderer.invoke('fetch-verse', input); },
    generateSlide: function (data) { return electron_1.ipcRenderer.invoke('generate-slide', data); },
});
