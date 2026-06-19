/**
 * Code.gs — Gmail 자동 발송 엔진 (구글 스프레드시트 바인딩 스크립트)
 *
 * [사용법]
 * 1. 구글 스프레드시트 열기 → 확장 프로그램 → Apps Script
 * 2. 기존 내용을 모두 지우고 이 파일 전체를 붙여넣기
 * 3. TOKEN 값을 원하는 문자열로 바꾸기 (예: 'my-secret-2024')
 * 4. 저장 후 배포: 배포 → 새 배포 → 유형: 웹앱
 *    - 다음 사용자로 실행: 나(본인)
 *    - 액세스 권한: 모든 사용자
 * 5. 배포 URL을 복사해서 js/config.js 의 CONFIG.dispatch.gasUrl 에 붙여넣기
 * 6. 권한 승인 팝업이 뜨면 '허용' 클릭 (Gmail 전송 + 스프레드시트 쓰기 권한 필요)
 */

// ============================================================
// 설정 상수 — 여기만 수정하세요
// ============================================================

/**
 * 보안 토큰: 웹앱에 무단 접근을 막기 위한 비밀 문자열.
 * js/config.js 의 CONFIG.dispatch.token 과 반드시 동일하게 설정하세요.
 * 예) const TOKEN = 'my-secret-abc123';
 */
const TOKEN = 'PUT_YOUR_SECRET_TOKEN_HERE';

/**
 * 발신자 이름: Gmail에서 수신자에게 표시되는 보낸사람 이름
 */
const SENDER_NAME = '최형기';

/**
 * 시트 헤더명 상수.
 * 스프레드시트의 실제 열 제목과 정확히 일치해야 합니다.
 * CONFIG.rounds[n].columns.email / .sent 와 동일한 값입니다.
 */
const EMAIL_HEADER = '🖊️ 이메일 주소';
const SENT_HEADER = '발송완료';


// ============================================================
// 메인 핸들러
// ============================================================

/**
 * 웹앱 POST 요청 수신 → 메일 발송 + 시트 기록
 *
 * 요청 body (JSON):
 *   {
 *     token: string,       // TOKEN 과 동일한 값
 *     items: [
 *       {
 *         to:      string,  // 수신 이메일 주소
 *         subject: string,  // 메일 제목
 *         html:    string,  // HTML 본문
 *         email:   string   // 소문자 정규화된 이메일 (시트 매칭용)
 *       },
 *       ...
 *     ]
 *   }
 *
 * 응답 (JSON):
 *   { sent: number, skipped: number, failed: number, warning?: string }
 */
function doPost(e) {
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ error: 'invalid_json', message: String(err) });
  }

  // 토큰 검증
  if (payload.token !== TOKEN) {
    return json({ error: 'unauthorized' });
  }

  var items = payload.items;
  if (!Array.isArray(items) || items.length === 0) {
    return json({ error: 'no_items' });
  }

  // 시트 전체 데이터 읽기
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var allValues = sheet.getDataRange().getValues();
  var headers = allValues[0];

  // 컬럼 인덱스 찾기
  var emailCol = -1;
  var sentCol = -1;
  for (var h = 0; h < headers.length; h++) {
    var hStr = String(headers[h]).trim();
    if (hStr === EMAIL_HEADER) emailCol = h;
    if (hStr === SENT_HEADER)  sentCol  = h;
  }

  var warning = '';
  if (sentCol === -1) {
    warning = 'SENT_HEADER 컬럼을 찾지 못했습니다. 발송 후 시트 기록이 생략됩니다.';
  }

  var sent    = 0;
  var skipped = 0;
  var failed  = 0;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    try {
      var targetEmail = String(item.email || item.to).toLowerCase().trim();

      // 시트에서 이메일 매칭 행 찾기
      var matchRow = -1;
      if (emailCol !== -1) {
        for (var r = 1; r < allValues.length; r++) {
          var cellEmail = String(allValues[r][emailCol] || '').toLowerCase().trim();
          if (cellEmail === targetEmail) {
            matchRow = r;
            break;
          }
        }
      }

      // 이미 발송완료(1/2/3) 이면 건너뜀
      if (matchRow !== -1 && sentCol !== -1) {
        var sentValue = String(allValues[matchRow][sentCol] || '').trim();
        if (sentValue === '1' || sentValue === '2' || sentValue === '3') {
          skipped++;
          continue;
        }
      }

      // 메일 발송
      GmailApp.sendEmail(
        item.to,
        item.subject,
        '',
        {
          htmlBody: item.html,
          name:     SENDER_NAME
        }
      );

      // 발송완료 시트 기록
      if (matchRow !== -1 && sentCol !== -1) {
        sheet.getRange(matchRow + 1, sentCol + 1).setValue('1');
        // allValues 캐시도 갱신 (같은 이메일이 items에 중복 있을 경우 대비)
        allValues[matchRow][sentCol] = '1';
      }

      sent++;
    } catch (err) {
      // 개별 실패는 기록만 하고 계속 진행
      console.error('발송 실패 [' + (item.to || '') + ']:', String(err));
      failed++;
    }
  }

  var result = { sent: sent, skipped: skipped, failed: failed };
  if (warning) result.warning = warning;
  return json(result);
}


// ============================================================
// 헬퍼
// ============================================================

/**
 * 객체를 JSON 응답으로 반환
 */
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


// ============================================================
// 테스트 함수 (배포 전 점검용)
// ============================================================

/**
 * testSend — 본인 이메일로 테스트 메일 1통 발송
 *
 * [사용법]
 * 1. 아래 TEST_EMAIL 을 본인 이메일 주소로 변경
 * 2. 에디터 상단에서 함수 드롭다운을 'testSend' 로 선택
 * 3. ▶ 실행 버튼 클릭
 * 4. Gmail 받은편지함에서 수신 확인
 *
 * ※ 실제 배포 전에 이 함수로 메일 발송이 정상 동작하는지 반드시 확인하세요.
 */
function testSend() {
  var TEST_EMAIL = 'your-email@example.com'; // ← 본인 이메일로 변경

  GmailApp.sendEmail(
    TEST_EMAIL,
    '[테스트] GAS 발송 테스트',
    '',
    {
      htmlBody: '<p>GAS 연동 테스트 메일입니다. 이 메일이 도착했다면 정상입니다.</p>',
      name: SENDER_NAME
    }
  );

  Logger.log('테스트 메일 발송 완료: ' + TEST_EMAIL);
}
