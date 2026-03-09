import { dialog } from 'electron';
import { AppUpdater, autoUpdater } from 'electron-updater';

interface WindowsUpdater extends AppUpdater {
  verifyUpdateCodeSignature: boolean;
}

export function setupAutoUpdater(): void {
  // 이 설정이 있어야 인증서(Code Signing) 없이도 GitHub Release 업데이트가 작동합니다.
  if (process.platform === 'win32') {
    (autoUpdater as WindowsUpdater).verifyUpdateCodeSignature = false;
  }

  // 1. 업데이트 다운로드 완료 시 실행 (가장 중요)
  autoUpdater.on('update-downloaded', (info) => {
    const dialogOpts = {
      type: 'info' as const,
      buttons: ['재시작 및 설치', '나중에'],
      title: '업데이트 알림',
      message: `새로운 버전(${info.version})이 준비되었습니다.`,
      detail: '앱을 재시작하여 업데이트를 적용하시겠습니까?',
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        // '재시작 및 설치' 클릭 시
        autoUpdater.quitAndInstall(false, true);
      }
    });
  });

  // 2. 에러 발생 시 로그 출력 (선택 사항: 사용자에게 알릴 수도 있음)
  autoUpdater.on('error', (message) => {
    console.error('업데이트 오류 발생:', message);
  });

  // 3. 업데이트 확인 중 (선택 사항: 디버깅용)
  autoUpdater.on('checking-for-update', () => {
    console.log('업데이트 확인 중...');
  });

  // 4. 업데이트가 가능할 때 (선택 사항)
  autoUpdater.on('update-available', () => {
    console.log('새로운 업데이트가 있습니다.');
  });
}

export function checkForUpdates(): void {
  autoUpdater.checkForUpdatesAndNotify();
}
