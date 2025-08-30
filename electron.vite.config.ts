import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {},
  preload: {
    build: {
      rollupOptions: {
        output: {
          // 프리로드 스크립트의 출력 포맷을 CommonJS로 설정
          format: 'cjs',
        },
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/'),
      },
    },
    plugins: [react()],
  },
});
