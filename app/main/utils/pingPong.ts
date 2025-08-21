import { ipcMain } from 'electron';

export const pingPong = () => {
  ipcMain.handle('ping', () => 'pong');
};
