# WorshipSlide

WorshipSlide는 예배에 사용할 성경 구절과 찬양 가사를 편집 가능한 PowerPoint 파일로 만드는 데스크톱 앱입니다. 홈에서 **성경 (BibleSlide)** 또는 **찬양 (LyricsSlide)**을 선택하면 각각 별도의 `.pptx` 파일을 만들 수 있습니다.

## 설치

[GitHub Releases](https://github.com/kangdy25/BibleSlide/releases)에서 운영체제에 맞는 설치 파일을 확인하세요. 아래 안내는 이 저장소의 현재 코드를 기준으로 하며, 공개 릴리스의 기능은 버전에 따라 다를 수 있습니다.

PPT를 재생할 컴퓨터에도 사용한 글꼴을 설치하면 글꼴 대체로 인한 줄바꿈과 배치 변화를 줄일 수 있습니다. 앱에서 선택할 수 있는 글꼴에는 [Pretendard](https://github.com/orioncactus/pretendard), [나눔글꼴](https://hangeul.naver.com/2017/nanum), [KoPubWorld](https://www.kopus.org/biz-electronic-font2/)가 있습니다.

## 성경 (BibleSlide)

1. 홈에서 **성경**을 열고 성경 구절을 입력합니다. 한 구절은 `창1:1`, 여러 절은 `요3:16-17`처럼 입력합니다. `창세기1:1`과 `Gen1:1`도 사용할 수 있습니다.
2. 개역개정, 개역한글, 새번역, KJV, NIV 중 원하는 역본을 선택합니다.
3. 미리보기를 보면서 글꼴, 굵기, 정렬, 글자 크기, 자간과 행간을 조정합니다. 미리보기 아래 오른쪽에서 출력 형식을 선택합니다.
4. **PPT 제작하기**를 눌러 저장 위치를 선택합니다.

## 찬양 (LyricsSlide)

1. 홈에서 **찬양**을 열고 곡 제목과 전체 가사를 입력합니다.
2. 가사에서 빈 줄로 나뉜 구간이 각각 한 슬라이드가 됩니다. 구간 안의 줄바꿈은 유지됩니다.
3. 순서나 내용을 바꾸려면 전체 가사에서 해당 구간을 수정합니다. 미리보기의 이동 버튼으로 각 슬라이드를 확인합니다.
4. 글꼴과 출력 형식을 선택합니다. 가사는 검은 배경에 흰색으로 가운데 정렬됩니다. 글자가 넘칠 수 있다는 경고가 표시되면 줄바꿈과 글자 크기를 확인합니다.
5. **PPT 저장**을 눌러 현재 슬라이드 순서대로 저장합니다.

## 출력 형식

| 비율 | 성경 | 찬양 |
| --- | --- | --- |
| 16:9 | 화면에 성경 본문을 한 번 표시 | 가사를 화면 중앙에 배치 |
| 24:9 | 같은 본문을 좌우에 배치하고 중앙은 검게 비움 | 배경은 화면 전체를 채우고 가사는 중앙 16:9 영역에 배치 |

두 형식 모두 PowerPoint에서 본문을 텍스트로 편집할 수 있습니다.

## 개발

Node.js 22와 npm을 사용합니다. 앱은 Electron, React, TypeScript로 구성되며 PptxGenJS로 PowerPoint 파일을 생성합니다.

```bash
npm ci
npm run dev
npm run test:run
npm run build
```

`npm run build`는 앱을 빌드한 뒤 electron-builder로 설치 파일을 패키징합니다.

문제나 기능 제안은 [GitHub Issues](https://github.com/kangdy25/BibleSlide/issues)에 남겨 주세요.

## 라이선스

[MIT](LICENSE)
