# CHZZK Multi Chat

여러 치지직 방송의 채팅창을 한 화면에서 모아 보는 Cloudflare Workers 앱입니다.

## 기능

- 스트리머 이름 검색 후 채널 추가
- 채널 표시 여부 선택 및 드래그 순서 변경
- 채팅창 너비, 높이 슬라이더와 확대 비율 조절
- 채팅창 모서리 드래그로 모든 채팅창 크기 실시간 통일
- 개별 채팅 또는 전체 채팅 새로고침
- 브라우저 `localStorage`에 채널 목록과 화면 설정 저장

## Cloudflare Workers 배포

이 앱은 치지직 검색 API의 브라우저 CORS 제한을 피하기 위해 Worker에서 검색 요청을 중계합니다.
정적 페이지와 API Worker는 함께 배포됩니다.

Cloudflare Workers Builds 프로젝트 설정:

| 항목 | 값 |
| --- | --- |
| Build command | 비워 두기 |
| Deploy command | `npx wrangler deploy` |
| Root directory | 비워 두기 |

배포 후 `/api/search?keyword=냐미&offset=0&size=1` 주소가 JSON을 반환하면 정상입니다.

## 로컬 개발

Wrangler가 설치되어 있다면 다음 명령으로 정적 페이지와 Worker를 함께 실행할 수 있습니다.

```bash
npx wrangler dev
```
