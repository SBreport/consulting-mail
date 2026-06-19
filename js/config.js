// config.js - 설정값 모음
// 이 파일에서 스프레드시트 URL, 발신자 정보 등을 관리합니다.

const CONFIG = {
    // 발신자 정보 (공통)
    sender: {
        name: '최형기',
        company: '스마트브랜딩',
        phone: '010-2824-1794',
        title: '대표'
    },

    // 메일 제목 템플릿 (공통)
    mailSubjectTemplate: '[스마트브랜딩] {name}님을 위한 병원 마케팅 1:1 컨설팅 리포트',

    // 컨설팅 완료 표시 값 (공통)
    consultingValues: {
        email: '1',      // 이메일 컨설팅만
        coffee: '2',     // 커피챗만
        both: '3'        // 둘 다 완료
    },

    // 수강생 명단 컬럼명 (공통)
    studentColumns: {
        number: '순번',
        name: '성명',
        grade: '등급',
        email: '이메일',
        phone: '연락처',
        refund: '환불여부'
    },

    // 환불 인식값 (이 값이 입력되면 환불로 처리) (공통)
    refundValue: '환불',

    // 차수별 설정
    rounds: {
        1: {
            label: '1차',
            sheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYS5282LtYxo2yDd2mJPCZP6XvsECsrRrp2bsNM2i9Gw4OyXm-iESv7pBtbo1v1QrzvAxTFBVbZivJ/pub?gid=1253956561&single=true&output=csv',
            studentListUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYS5282LtYxo2yDd2mJPCZP6XvsECsrRrp2bsNM2i9Gw4OyXm-iESv7pBtbo1v1QrzvAxTFBVbZivJ/pub?gid=775943904&single=true&output=csv',
            columns: {
                name: '📌 수강생 이름',
                email: '🖊️ 이메일 주소',
                phone: '📞 연락처 (ex: 010-0000-0000)',
                course: '🎈 수강 과정',
                timestamp: '타임스탬프',
                status: '강의 후 현재 상황은 어떻게 되시나요?',
                monetization: '어떤 방식으로 수익화를 계획하고 계신가요?',
                target: '주로 타겟하고 싶은 병원 진료과목은 무엇인가요?',
                concern: '현재 가장 큰 고민은 무엇인가요?',
                timeline: '본격적인 활동 시작 목표는 언제인가요?',
                revenue: '목표 월 수익은 얼마인가요?',
                experience: "'병원 마케팅', '대행사 창업'과 관련하여 경험이 있으신가요?",
                support: '앞으로 어떤 형태의 지원을 받고 싶으신가요?',
                sent: '발송완료'
            },
            templateVersion: 'v1'
        },
        2: {
            label: '2차',
            sheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBZHEyHtm_9IOd5gntNr9d1X10wKgnZsqqiBR7iuwQXYMqKx35H4PeHYshw1r3kf460d0YFJbT3pIB/pub?output=csv',
            studentListUrl: '',
            columns: {
                name: '📌 수강생 이름',
                email: '🖊️ 이메일 주소',
                phone: '📞 연락처 (ex: 010-0000-0000)',
                course: '🎈 수강 과정',
                timestamp: '타임스탬프',
                status: '강의 후 현재 상황은 어떻게 되시나요?',
                monetization: '현재 어떤 방식으로 수익화를 계획하고 계신가요?',
                target: '주로 타겟하고 싶은 병원 진료과목은 무엇인가요?',
                concern: '현재 가장 큰 고민은 무엇인가요?',
                timeline: '본격적인 활동 시작 목표는 언제인가요?',
                revenue: '목표 월 수익은 얼마인가요?',
                experience: "'병원 마케팅', '대행사 창업'과 관련하여 경험이 있으신가요?",
                support: '앞으로 어떤 형태의 지원을 받고 싶으신가요?',
                sent: '발송완료'
            },
            templateVersion: 'v2',
            excludeSentEmailsFromRound: 1
        }
    },

    // Gmail 자동 발송 설정
    dispatch: {
        gasUrl: '',   // GAS 웹앱 배포 URL — 배포 후 여기에 붙여넣기
                      // 예) 'https://script.google.com/macros/s/AKfycb.../exec'
        token: 'PUT_YOUR_SECRET_TOKEN_HERE'  // Code.gs의 TOKEN과 같은 값으로 설정
    },

    // 아래 필드는 setRound()가 동적으로 채움 (직접 수정 금지)
    sheetUrl: '',
    studentListUrl: '',
    columns: {},
    _templateVersion: '',
    _round: null
};

// 현재 활성 차수
let currentRound = 2;

/**
 * 활성 차수를 전환하고 CONFIG의 공통 접근 필드를 갱신한다.
 * @param {number} round - 차수 번호 (1 또는 2)
 */
function setRound(round) {
    currentRound = round;
    const r = CONFIG.rounds[round];
    CONFIG.sheetUrl = r.sheetUrl;
    CONFIG.studentListUrl = r.studentListUrl;
    CONFIG.columns = r.columns;
    CONFIG._templateVersion = r.templateVersion;
    CONFIG._round = round;
}

// 초기 상태를 2차로 세팅
setRound(2);
