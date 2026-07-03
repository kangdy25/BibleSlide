import * as fs from 'fs';
import * as path from 'path';

export interface SlideConfig {
  background: {
    imagePath: string;
    opacity: number;
    useImage: boolean;
  };
  title: {
    fontSize: number;
    color: string;
    fontFace: string;
    bold: boolean;
  };
  content: {
    fontSize: number;
    color: string;
    fontFace: string;
    bold: boolean;
    lineHeight: number;
  };
  footer: {
    fontSize: number;
    color: string;
    fontFace: string;
  };
  dividerLine: {
    color: string;
    width: number;
    dashType: string;
  };
}

// 프로젝트 루트의 config 폴더에서 설정 파일 읽기
const CONFIG_PATH = path.join(__dirname, '../../config/slide-settings.json');

export function loadSlideConfig(): SlideConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.warn(`설정 파일을 찾을 수 없습니다: ${CONFIG_PATH}`);
      return getDefaultConfig();
    }

    const configData = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config: SlideConfig = JSON.parse(configData);
    console.log('✅ 설정 파일 로드 성공:', CONFIG_PATH);
    return config;
  } catch (error) {
    console.error('⚠️ 설정 파일 읽기 오류:', error);
    return getDefaultConfig();
  }
}

function getDefaultConfig(): SlideConfig {
  return {
    background: {
      imagePath: '',
      opacity: 0.15,
      useImage: false,
    },
    title: {
      fontSize: 48,
      color: '1B3A8B',
      fontFace: '나눔바른고딕',
      bold: true,
    },
    content: {
      fontSize: 28,
      color: '000000',
      fontFace: '나눔바른고딕',
      bold: false,
      lineHeight: 1.5,
    },
    footer: {
      fontSize: 12,
      color: '666666',
      fontFace: '나눔바른고딕',
    },
    dividerLine: {
      color: 'CCCCCC',
      width: 2,
      dashType: 'dash',
    },
  };
}