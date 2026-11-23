import type { SlideDataType } from '../../types/electron';
import type { LyricsExport } from '../shared/lyrics';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  fetchVerse: (input: string, version: string = 'GAE') =>
    ipcRenderer.invoke('fetch-verse', input, version),
  generateSlide: (data: SlideDataType) => ipcRenderer.invoke('generate-slide', data),
  chooseLyricsBackground: () => ipcRenderer.invoke('choose-lyrics-background'),
  releaseLyricsBackground: (id: string) => ipcRenderer.invoke('release-lyrics-background', id),
  generateLyrics: (data: LyricsExport) => ipcRenderer.invoke('generate-lyrics-slide', data),
  showAlert: (message: string, type: 'info' | 'warning' | 'error' = 'info') =>
    ipcRenderer.invoke('show-alert', message, type),
});
