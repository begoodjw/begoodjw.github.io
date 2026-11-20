# Begood 앱 컬렉션

GitHub Pages에서 제공하는 HTML·CSS·JavaScript 기반 앱 목록입니다.

## 앱 등록

`apps.example.json`의 구조를 참고해 `apps.json` 배열에 실제 앱을 추가합니다.

| 필드 | 입력 방법 |
| --- | --- |
| `id` | 앱마다 고정된 영문 ID. 다른 앱에서 `from`으로 전달합니다. |
| `name`, `description` | `{"ko":"한국어", "en":"English"}` 형식. `default`에 공통 문구를 입력할 수 있습니다. 한 언어만 등록해도 표시합니다. |
| `namesByCountry`, `descriptionsByCountry` | 선택 항목입니다. `{"KR":"한국 표시 문구", "JP":"日本の表示文言"}` 형식으로 등록하면 선택된 국가에 해당하는 이름이나 소개가 우선 표시됩니다. |
| `icon` | 선택 항목입니다. `./icons/my-app.png`처럼 저장소 내 경로를 쓸 수 있습니다. |
| `stores.ios`, `stores.android` | 플랫폼별 공개 스토어 주소 `url`과 출시 국가 `countries`를 넣습니다. 출시하지 않은 플랫폼은 생략합니다. |
| `countries` | `["KR", "US"]`처럼 ISO 두 글자 국가 코드를 사용합니다. 모든 국가에서 제공할 때만 `"*"`를 입력합니다. |

`?country=KR&platform=ios&lang=ko&from=my-app`을 붙이면 한국 iOS 목록에서 현재 앱을 숨깁니다. 국가와 언어는 독립적입니다. 플랫폼을 생략하면 두 스토어를 모두 표시하고, 국가를 생략하면 브라우저 지역을 사용합니다. 지역 정보가 없거나 `country=global`을 지정하면 전 세계 공통 앱만 표시합니다.

## 미리보기와 배포

이 폴더에서 `python3 -m http.server 8765 --bind 127.0.0.1`을 실행한 후 `http://127.0.0.1:8765/?demo=1&country=KR`을 엽니다. 예시 화면에는 스토어로 이동하는 링크가 없습니다.

실제 앱을 등록한 뒤 GitHub 저장소의 Settings → Pages에서 현재 배포 브랜치와 폴더를 확인합니다. 그 위치에 `index.html`, `catalog.css`, `catalog.js`, `filters.js`, `apps.json`과 사용한 아이콘을 커밋합니다. 예시 미리보기를 배포하려면 `apps.example.json`도 같은 위치에 둡니다. 기존 `app-ads.txt`는 루트에 둡니다. Actions에서 Pages 배포를 확인하고 홈페이지와 `/app-ads.txt`를 각각 엽니다.
