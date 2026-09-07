# 운동 타이머 (20분 카운트다운)

운동할 때 쓰는 단순한 카운트다운 타이머입니다. `index.html` 파일 하나로 동작하며 외부 라이브러리나 별도 파일이 전혀 필요 없습니다.

## 기능

- 기본 20분 카운트다운, 큰 숫자 표시 + 원형 진행 표시
- 시작 / 일시정지 / 리셋 버튼 (숫자 영역을 탭해도 시작·일시정지)
- 운동 시간(분) 변경 입력칸 (1~180분, 마지막 설정값 자동 저장)
- 종료 시 Web Audio API로 생성한 알림음 + 화면이 붉게 깜빡임 + 진동(지원 기기)
- 동작 중 Screen Wake Lock API로 화면 꺼짐 방지 (탭 복귀 시 자동 재요청)
- 타임스탬프 기반 카운트다운이라 백그라운드 전환 후에도 시간이 밀리지 않음
- 모바일 세로 화면 기준 다크 모드 디자인
- 키보드: `Space` 시작/일시정지, `R` 리셋

## 로컬에서 열기

`index.html`을 브라우저에서 바로 열면 됩니다. 단, 화면 꺼짐 방지(Wake Lock)는 **HTTPS 또는 localhost**에서만 동작하므로 실제 사용은 아래 GitHub Pages 배포를 권장합니다.

## GitHub Pages 배포 방법

### 1. 저장소에 파일 올리기

`index.html`과 `README.md`가 저장소 루트에 있는 상태로 기본 브랜치(예: `main`)에 푸시합니다.

```bash
git add index.html README.md
git commit -m "Add workout timer"
git push -u origin main
```

### 2. Pages 설정 켜기

1. GitHub에서 저장소 페이지로 이동 → 상단 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 선택
3. **Build and deployment** 항목에서
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (또는 배포할 브랜치) / 폴더는 `/ (root)`
4. **Save** 클릭

### 3. 접속하기

1~2분 정도 지나면 아래 주소에서 열립니다.

```
https://<GitHub 사용자명>.github.io/<저장소 이름>/
```

예: 사용자명이 `skyinthesea10`, 저장소가 `Code`라면 `https://skyinthesea10.github.io/Code/`

Settings → Pages 화면 상단에 실제 배포 주소가 표시되니 그 링크를 확인하면 됩니다.

### 4. 휴대폰 홈 화면에 추가 (선택)

- **iOS Safari**: 공유 버튼 → "홈 화면에 추가"
- **Android Chrome**: 메뉴(⋮) → "홈 화면에 추가"

앱처럼 전체 화면으로 열려서 운동 중 쓰기 편합니다.

## 브라우저 지원 참고

| 기능 | 지원 |
| --- | --- |
| 카운트다운, 알림음, 화면 색 변화 | 모든 최신 브라우저 |
| Screen Wake Lock | Chrome/Edge(Android 포함), Safari 16.4+ (iOS 포함), Firefox 126+ |
| 진동 | Android Chrome 등 (iOS는 미지원) |

Wake Lock을 지원하지 않는 브라우저에서는 화면 하단에 안내 문구가 표시되며, 타이머 자체는 정상 동작합니다.

## 라이선스

MIT
