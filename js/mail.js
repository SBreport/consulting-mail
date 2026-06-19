// mail.js - 메일 생성 로직
// ⭐ 컨설팅 문구를 수정하려면 이 파일만 편집하세요!

// ============================================================
// 1. 텍스트 변환 맵 (설문 응답 → 자연스러운 문장)
// ============================================================

const TEXT_MAP = {
    // 현재 상황 변환
    status: {
        '아직 준비 중 (창업/활동 시작 전)': '창업/활동을 준비 중',
        '이미 대행사 운영 중 (고객 유치 성공)': '이미 대행사를 운영 중',
        '원고작가/프리랜서로 활동 중': '원고작가/프리랜서로 활동 중',
        '직장 다니면서 부업으로 준비 중': '직장을 다니시면서 부업으로 준비 중'
    },
    
    // 수익화 방식 변환
    monetization: {
        '마케팅 대행사 창업 (법인/개인사업자)': '마케팅 대행사 창업',
        '원고작가로 활동 (프리랜서/외주)': '원고작가로 활동',
        '둘 다 병행하고 싶다': '대행사 창업과 원고작가 활동 병행',
        '아직 결정하지 못했다': '수익화 방향 탐색'
    },
    
    // 가장 큰 고민 변환
    concern: {
        '첫 고객(병원)을 어떻게 확보할지 모르겠다.': '첫 고객(병원) 확보',
        '서비스 구성/가격 책정이 어렵다.': '서비스 구성 및 가격 책정',
        '영업/제안 방법이 어렵다.': '영업 및 제안 방법',
        '실무 역량(글쓰기, 광고 세팅 등)이 부족하다.': '실무 역량 강화',
        '시간 관리/본업과 병행이 어렵다.': '시간 관리 및 본업과의 병행',
        '방향 자체를 못 정하겠다.': '전체적인 방향 설정'
    }
};


// ============================================================
// 2. 컨설팅 문구 템플릿
// ============================================================

const MAIL_TEMPLATES_V2 = {

    // ----------------------------------------------------------
    // 1️⃣ 방향 제안 (수익화 방식별)
    // ----------------------------------------------------------
    direction: {
        '대행사 창업': (name) => `${name}님, 대행사 창업 택하셨네요! 잘 고르셨어요.

수익 천장이 높아서 키우는 만큼 벌 수 있고, 하다 보면 그게 다 내 사업 자산으로 남거든요. 순서는 이렇게 잡으시면 돼요 —

1) 사업자 등록부터 (아마겟돈 수강생 세무상담 이용하세요)
2) 핵심 서비스 1~2개 먼저 패키지로 묶고
3) 타겟 병원 리스트 뽑아서 영업 시작!
4) 첫 고객 확보 후 레퍼런스 차곡차곡 쌓기

한 가지만 기억하세요. 병원 원장님을 단순 고객으로 모집하려 하면 어렵고요, 블로그 마케팅을 포함해서 병원이 겪고 있는 마케팅 문제를 함께 풀어준다는 마인드로 접근하는 게 핵심이에요.`,

        '원고작가': (name) => `${name}님, 원고작가 활동 선택하셨군요. 초기 투자 없이 바로 시작할 수 있어서 리스크 없이 실력 쌓으면서 돈도 버는 구조예요.

순서는 이렇게 가보세요 —

1) 포트폴리오용 샘플 원고 2~3개 써두고 (자체 블로그에 타겟 원장님 이름으로 비공개 업로드)
2) 노션으로 포트폴리오 페이지 하나 만들어두고
3) 모집 공고 나오면 레퍼런스 전달, 또는 마케팅 대행사에 직접 포트폴리오 보내고
4) 첫 프로젝트 수주해서 기획~작성~발행 전 과정 경험해보고
5) 클라이언트랑 담당 업무 조금씩 넓혀가기`,

        '병행': (name) => `${name}님, 병행 선택하셨군요. 솔직히 제일 현실적인 방법이에요.

처음부터 대행사로 확 뛰어드는 건 부담스럽잖아요. 이렇게 가보시면 돼요 —

1) 일단 원고작가로 먼저 시작하고 (리스크 최소화)
2) 3~6개월 동안 실무 경험 쌓으면서 포트폴리오 만들고
3) 수익이 어느 정도 안정되면 그때 사업자 등록 검토하고
4) 기존 클라이언트 외에 추가 대행사로 업무 전환`,

        '병행_운영중': (name) => `${name}님, 병행 선택하셨군요. 지금 대행사 운영 중이시니까 글 작성부터 클라이언트 관리까지 이미 다 경험하고 계신 거잖아요. 그 경험 자체가 엄청난 자산이에요.

지금 이 흐름으로 가보세요 —

1) 지금 실무 경험 바탕으로 포트폴리오 정리하고
2) 인근 지역 분석 보고서 만들어서 배포하고
3) 방문 영업 후 미팅 제안하고
4) 신규 계약 따내면서 상품 업셀링도 노려보세요 (최적블 or 플레이스)`,

        '병행_활동중': (name) => `${name}님, 병행 선택하셨군요. 지금 원고작가로 활동 중이시니까 업종별 글쓰기, 키워드 기획, 배포까지 이미 감이 잡혀 있을 거예요. 그게 곧 대행사 창업의 베이스가 돼요.

이 흐름으로 가보세요 —

1) 지금까지 써온 원고들로 포트폴리오 정리하고
2) 원고별 성과도 별도 페이지에 기록해두고
3) 인근 지역 병원 분석 보고서 만들어서 배포하고
4) 방문 영업 후 미팅 제안하고
5) 신규 계약 따내면서 업셀링도 노려보세요 (최적블 or 플레이스)`,

        '미정': (name) => `아직 방향을 못 정하셨군요. 그럼 두 가지를 한번 비교해볼게요.

• 초기 투자: 창업(사업자 등록 필요) vs 원고작가(거의 없음)
• 수익 구조: 창업(월 계약) vs 원고작가(건당 수익)
• 시간 투입: 창업(주 20시간+) vs 원고작가(주 5~10시간)

일단 원고작가로 먼저 시작해서 시장 감 잡고 나서 창업 여부 결정하는 게 제일 안전한 방법이에요.`
    },

    // ----------------------------------------------------------
    // 2️⃣ 시작점 안내 (현재 상황별)
    // ----------------------------------------------------------
    startPoint: {
        '준비 중': (name) => `아직 준비 단계시군요. 기초부터 차근차근 가면 돼요.

지금 당장 해야 할 것은 딱 하나예요 —
• (창업 루트) 첫 고객 확보를 위한 서비스 구성과 가격 책정부터 정리하기
• (원고작가 루트) 샘플 원고 2~3개 쓰고, 잘 쓴 블로그 글 필사 50건 이상 채우기

완벽하게 준비한 뒤 시작하려 하면 계속 미뤄져요. 일단 실행하면서 보완해나가는 게 훨씬 빨리 성과 납니다.`,

        '운영 중': (name) => `이미 대행사 운영 중이시니까 기초 단계는 건너뛰셔도 돼요.

지금 집중하셔야 할 건 이 세 가지예요 —
• 기존 고객 잘 유지하면서 레퍼런스 깔끔하게 정리하고
• 신규 고객 들어오는 채널도 한두 개 더 열어두고
• 서비스 패키지도 한 단계 업그레이드해보기`,

        '활동 중': (name) => `이미 원고작가/프리랜서로 활동 중이시니까 실무 감은 충분히 있으세요.

지금 이 부분들 챙겨보시면 좋겠어요 —
• 단가 협상력 높이려면 포트폴리오부터 정비하고
• 클라이언트 한 곳에만 의존하면 위험하니까 다각화해두고
• 창업 생각 있으시면 대행사에서 쓰는 시스템을 내 것으로 흡수해놓고
• 원고작가 이력 살려서 1:1 케어 맞춤형 서비스를 무기로 영업 시작해보세요`,

        '부업': (name) => `직장 다니면서 준비 중이시니까 시간 효율이 제일 중요해요.

억지로 많이 하려 하지 말고, 이렇게 현실적으로 가보세요 —
• 주 5~10시간 범위 안에서 시작하고
• 인근 지역 병원 마케팅 문제랑 아쉬운 점 분석해두고
• "내가 맡으면 어떻게 바꿀 수 있을지?" 분석보고서 한 장 만들어서
• 인근 병원에 제안서 배포해보세요
• 퇴근 후/주말 활용한 루틴 먼저 만드는 게 핵심이에요`,

        '기본': (name) => `일단 '작게 시작하는 것'이 제일 중요해요.

첫 단계는 이 정도면 충분해요 —
• 샘플 원고 1개 써보고
• 타겟 병원 10곳 리스트업하고
• "내가 맡으면 어떻게 바꿀 수 있을지?" 분석보고서 하나 만들어서
• 인근 병원에 제안서 배포하고 미팅 일정 잡아보세요`
    },

    // ----------------------------------------------------------
    // 3️⃣ 핵심 솔루션 (고민별)
    // ----------------------------------------------------------
    solution: {
        '첫 고객': (name) => `첫 고객 잡는 가장 현실적인 방법은 '마케팅(블로그) 작업이 중단된 곳'을 노리는 거예요.

왜 중단된 곳이냐면 — 기존 대행사에 불만이 쌓여서 끊었거나, 직접 운영하다가 막힌 경우가 많거든요. 내부 업무 부하도 크고, 성과도 안 나오고 있는 타이밍이라 제안이 잘 먹혀요.

이렇게 접근해보세요 —
1) 네이버/카카오맵에서 병원(업종) 검색하고
2) 해당 병원 SNS 보면서 마케팅 상태 진단하고
3) 무료 진단 리포트 제안해보고
4) 미팅 후 저가 패키지로 첫 계약 잡거나
5) 아니면 무료 1개월 마케팅 실행해주고 그다음 계약 제안해보세요`,

        '서비스/가격': (name) => `서비스 구성은 '3단계 패키지'로 잡는 걸 추천해요.

참고할 만한 패키지 예시예요 —
• Basic (월 100~150만원): 브랜드 블로그 관리 10~15건/월
• Standard (월 200~300만원): 브랜드 블로그 + 플레이스
• Premium (월 300만원~): 브랜드 블로그 + 최적 블로그 + 플레이스

첫 업체 가격은 이렇게 잡으세요 —
1) 경쟁사 대비 10~20% 낮게 시작하고
2) 레퍼런스 쌓이면 3개월 후 가격 올리는 거예요
3) 단, 그냥 올리면 안 되고 고객이 납득할 수 있는 이유가 있어야 해요. 예를 들면 원고 작업 외에 디자인 작업을 추가로 해주거나, 플레이스 관리나 악플 관리 업무를 추가로 얹어주는 식으로요`,

        '영업/제안': (name) => `병원 영업은 '가치 선제공' 방식이 제일 잘 먹혀요.

이렇게 접근해보세요 —
1) 타겟 병원 먼저 정하고
2) 마케팅 현황 무료로 진단해서 1페이지짜리 리포트 만들고
3) "개선점 공유드리고 싶다"는 식으로 가볍게 연락하고
4) 관심 보이면 그때 미팅 제안하는 거예요

핵심은 "팔려고 한다"가 아니라 "도와주려 한다"는 포지셔닝이에요. 이게 다예요.`,

        '실무 역량': (name) => `실무가 아직 부족하게 느껴지신다면, 원고작가로 먼저 시작하는 게 맞아요.

왜냐하면 — 대행사 밑에서 피드백 받으면서 실력이 올라가고, 돈 받으면서 배우는 구조거든요. 다양한 병원 업종도 경험해볼 수 있어서 나중에 창업할 때 정말 큰 자산이 돼요.

6개월 정도 활동하고 나면 직접 고객 받을 역량이 돼있을 거예요.`,

        '시간 관리': (name) => `본업이랑 병행하신다면, '주 단위 루틴'을 먼저 만드는 게 핵심이에요.

시간 배분 예시 (주 15시간) —
• 평일 저녁: 2시간 × 5일 = 10시간 (원고 작성)
• 주말: 2.5시간 × 2일 = 5시간 (영업/관리)

처음 3개월은 성과보다 '습관 만들기'에 집중하세요. 루틴이 자리잡히면 그다음부터는 생각보다 빠르게 굴러가요.`,

        '방향': (name) => `아직 방향이 안 잡히셨군요. 이 두 가지 질문에 먼저 답해보세요.

Q1. 주당 투입 가능한 시간은?
• 20시간 이상 → 창업 가능해요
• 10시간 내외 → 원고작가가 맞아요
• 5시간 이하 → 지금은 학습 단계 유지가 맞아요

Q2. 리스크 감수 성향은?
• 도전적인 편 → 창업 / 안정적인 편 → 원고작가

대부분의 경우, 원고작가로 시작해서 경험 쌓고 창업으로 전환하는 게 제일 안전한 경로예요.`,

        '기본': (name) => `핵심 원칙 세 가지만 기억하세요.

1) 작게 시작하기 — 완벽한 준비보다 빠른 실행이 훨씬 중요해요
2) 피드백 받기 — 혼자 고민하지 말고 시장에 직접 부딪혀 보세요
3) 레퍼런스 쌓기 — 첫 1건이 정말 모든 것의 시작이에요`
    },

    // ----------------------------------------------------------
    // 4️⃣ 실행 플랜 (목표 시점별)
    // ----------------------------------------------------------
    actionPlan: {
        '1개월': (name) => `1개월 내 시작 목표시군요. 주 단위로 빠르게 움직여야 해요.

한 가지 꼭 명심하세요 — 완벽하게 준비하다 보면 계속 늦어져요. 일단 실행하면서 맞춰가는 게 답이에요.

• 1주차: 서비스 패키지랑 가격 확정하고
• 2주차: 타겟 병원 20곳 리스트업하고
• 3주차: 분석 보고서 및 제안서 배포하고 (돌방 추천)
• 4주차: 미팅 진행 + 첫 계약 목표로 달려보세요`,

        '3개월': (name) => `3개월 내 시작 목표시군요. 월 단위로 나눠서 진행하면 돼요.

• 1개월 차: 강의 수강하면서 서비스·포트폴리오·리서치 기반 구축하고
• 2개월 차: 영업 시작 (타겟 30곳, 방문 후 제안서 배포 추천)
• 3개월 차: 첫 고객 확보!`,

        '6개월': (name) => `6개월 내 시작 목표시군요. 시간이 충분하니 제대로 준비해볼 수 있어요.

• 1~2개월 차: 강의 재수강하면서 역량 강화 (필사 50건 강력 추천!)
• 3~4개월 차: 노션 서비스 패키지랑 포트폴리오 기반 구축하고
• 5~6개월 차: 영업 시작해서 계약 잡기`,

        '기본': (name) => `아래 단계 순서대로 따라가보세요.

• 1단계: 루트부터 결정하고 (창업 vs 원고작가)
• 2단계: 서비스 구성하고 포트폴리오 준비하고
• 3단계: 영업 시작해서 첫 고객 잡고
• 4단계: 레퍼런스 구축하면서 서서히 확장`
    },

    // ----------------------------------------------------------
    // 5️⃣ 후속 지원 (지원 형태별)
    // ----------------------------------------------------------
    closing: {
        '혼자 실행': (name) => `자료만 있으면 혼자 해보시겠다고 하셨네요!
위 내용 참고해서 진행해보시고, 막히는 부분 생기면 편하게 연락 주세요.
• 최형기 대표 1:1 채널: https://open.kakao.com/o/sm0Cf1Kh
`,

        '피드백': (name) => `실행하면서 피드백 받고 싶으시다고 하셨네요.
진행 상황 공유해 주시면 바로 피드백 드릴게요.
• 최형기 대표 1:1 채널: https://open.kakao.com/o/sm0Cf1Kh
`,

        '대행': (name) => `일부 대행 서비스 이용을 원하신다고 하셨네요.
필요하신 부분 연락 주시면 바로 안내해 드릴게요.

🔑 스마트브랜딩 솔루션 가이드 (스마트브랜딩이 직접 실행사가 되어주는 솔루션) 
https://www.notion.so/25ba4049aa2080089b0dc689913bcc62?pvs=21

`,

        '커뮤니티': (name) => `함께 성장할 커뮤니티를 원하신다고 하셨네요.
수강생 네트워크 그룹 안내해 드릴게요.

🔑 스마트브랜딩 협력사 네트워크 (스마트브랜딩 외 실행사 공유)
https://www.notion.so/241a4049aa2080aeaff1ef40f429e82a?pvs=21


🔑 광고대행 소통 카톡방

온라인광고대행/실행사
https://open.kakao.com/o/gZcjDAhb

광고홍보 대행사
https://open.kakao.com/o/g67piF1b

자유대화_전문업체대행
https://open.kakao.com/o/gK6nkfVb

블로그 건바이건 의뢰
https://open.kakao.com/o/guidpi4

정보교류방
https://open.kakao.com/o/gizyTg9g

블로그연구소
https://open.kakao.com/o/gSF98uMd

데이터랩툴즈
https://open.kakao.com/o/gWzwc51e

블로그 푸쉬업
https://open.kakao.com/o/gB8Z8bbf

병원마케팅협회
https://open.kakao.com/o/gLEFUWxc

`,

        '기본': (name) => `위 내용 참고해서 진행해보시고, 궁금한 점 있으면 언제든 편하게 연락 주세요.`
    }
};


// ============================================================
// 2-1. 1차 컨설팅 문구 템플릿 (v1)
// ============================================================

const MAIL_TEMPLATES_V1 = {
    direction: {
        '대행사 창업': (name) => `${name}님께서 선택하신 대행사 창업은 수익의 천장이 높고, 장기적으로 사업 자산을 쌓을 수 있는 방식입니다.

권장 진행 순서:
1) 사업자 등록 (아마겟돈 수강생 세무상담 추천)
2) 핵심 서비스 1~2개 먼저 패키지화
3) 타겟 병원 리스트업 및 영업 시작
4) 첫 고객 확보 후 레퍼런스 구축
핵심은 병원 원장님을 단순 고객으로 모집하기 보다,
블로그 마케팅을 포함한 병원에서 필요로 하는 마케팅 문제를 풀어주는 것입니다.`,

        '원고작가': (name) => `${name}님께서 선택하신 원고작가 활동은 초기 투자 없이 바로 시작할 수 있고, 실무 역량을 쌓으면서 수익을 만들 수 있는 방식입니다.

권장 진행 순서:
1) 포트폴리오용 샘플 원고 2~3개 작성 (자체 블로그에 타겟 원장님 이름으로 비공개 업로드)
2) 대행사 또는 플랫폼에 공유할 포트폴리오 페이지 제작(노션 페이지 추천)
3) 모집 공고시 레퍼런스 전달 또는 마케팅 대행사에 포트폴리오 전달
4) 첫 프로젝트 수주 및 원고 기획~작성~발행 전 과정 경험(!)
5) 클라이언트 및 담당 업무 확장`,

        '병행': (name) => `${name}님께서 선택하신 병행 방식은 가장 현실적인 접근입니다.

권장 진행 순서:
1) 원고작가로 먼저 시작 (리스크 최소화)
2) 3~6개월간 실무 경험 및 포트폴리오 축적
3) 안정적 수익 확보 후 사업자 등록 검토
4) 기존 클라이언트 외 추가 대행사로 업무 전환`,

        '병행_운영중': (name) => `${name}님께서 선택하신 병행 방식은 가장 현실적인 접근입니다.
현재 대행사를 운영하신다면 글을 작성하는 과정과 클라이언트를 관리하는 업무 모두 맡고 계실테지요. 제가 권장드리는 진행 순서는 다음과 같습니다.

권장 진행 순서:
1) 실무 경험을 기반으로 한 포트폴리오 축적
2) 포트폴리오를 쌓으면서 인근 지역 분석 보고서 배포
3) 방문 영업 후 미팅 제안
4) 신규 계약 및 상품 업셀링 제안 (최적블 or 플레이스)`,

        '병행_활동중': (name) => `${name}님께서 선택하신 병행 방식은 가장 현실적인 접근입니다.
현재 원고작가로 활동하고 계신다면 업종별로 어떤 글을 써야 할 지, 키워드 기획과 작성, 배포에 관련된 경험은 충분히 쌓였을거라 생각됩니다. 제가 권장드리는 진행 순서는 다음과 같습니다.

권장 진행 순서:
1) 원고 포트폴리오 축적
2) 별도 페이지로 원고별 성과 기록
3) 인근 지역 병원의 분석 보고서 제작&배포
4) 방문 영업 후 미팅 제안
5) 신규 계약 및 상품 업셀링 제안 (최적블 or 플레이스)`,

        '미정': (name) => `두 가지 방식을 비교해 드립니다.

• 초기 투자: 창업(사업자 등록 필요) vs 원고작가(거의 없음)
• 수익 구조: 창업(월 계약) vs 원고작가(건당 수익)
• 시간 투입: 창업(주 20시간+) vs 원고작가(주 5~10시간)

먼저 원고작가로 시작하시면서 시장을 파악 후 창업 여부를 결정하시길 권장드립니다.`
    },

    startPoint: {
        '준비 중': (name) => `현재 준비 단계이시므로, 기초부터 차근차근 진행하시면 됩니다.

가장 먼저 해야 할 일:
• (창업 루트) 첫 고객 확보를 위한 서비스 구성과 가격 책정부터 정리
• (원고작가 루트) 샘플 원고 2~3개 작성, 잘 쓴 블로그 글 필사 50건 이상

일단 시작하세요.
먼저 실행 후 보완한다는 방식으로 접근하셔야 성과가 나옵니다.`,

        '운영 중': (name) => `이미 대행사를 운영 중이시므로, 기초 단계는 건너뛰셔도 됩니다.

지금 집중할 것:
• 기존 고객 유지 + 레퍼런스 정리
• 신규 고객 확보 채널 다각화
• 서비스 패키지 고도화`,

        '활동 중': (name) => `현재 원고작가/프리랜서로 활동 중이시므로, 실무 경험은 이미 갖추고 계십니다.

지금 집중할 것:
• 단가 협상력 강화 (포트폴리오 정비)
• 클라이언트 다각화 (1곳 의존 탈피)
• (창업 희망 시) 대행사에서 관리하는 시스템을 내 것으로 확보
• 원고작가 이력을 바탕으로 1:1 케어 맞춤형 서비스를 무기로 영업 시작`,

        '부업': (name) => `직장을 다니시면서 준비 중이시므로, 시간 효율이 가장 중요합니다.

현실적인 접근법:
• 주 5~10시간 투입 가능한 범위에서 시작
• 인근 지역 병원의 마케팅 문제, 아쉬운 점 분석
• "만약 내가 맡아서 한다면 어떻게 바꿀 수 있을지?" 분석보고서 제작
• 인근 병원 제안서 배포
• 퇴근 후/주말 활용한 루틴 만들기`,

        '기본': (name) => `가장 먼저 해야 할 일은 '작은 시작'입니다.

권장 첫 단계:
• 샘플 원고 1개 작성
• 타겟 병원 10곳 리스트업
• "만약 내가 맡아서 한다면 어떻게 바꿀 수 있을지?" 분석보고서 제작
• 인근 병원에 제안서 배포 후 미팅 일정 잡기`
    },

    solution: {
        '첫 고객': (name) => `첫 고객을 잡는 가장 현실적인 방법은 '마케팅(블로그) 작업이 중단된 곳'을 타겟으로 잡는겁니다.

왜 중단된 곳이 최선인가?
• 기존 마케팅에 대한 불만족으로 중단될 가능성이 높음
• 대행사가 없이 직접 운영하면서 시행착오를 겪는중
• 내부 업무 부하가 크고, 성과가 나오지 않는 시점

액션 플랜:
1) 네이버/카카오맵에서 병원(업종) 검색
2) 해당 병원 SNS 확인 (마케팅 상태 진단)
3) 무료 진단 리포트 제안
4) 미팅 후 저가 패키지로 첫 계약
5) 또는 무료 1개월 마케팅 실행 후 계약 제안`,

        '서비스/가격': (name) => `서비스 구성은 '3단계 패키지'를 권장드립니다.

패키지 예시:
• Basic (월 100~150만원): 브랜드 블로그 관리 10~15건/월
• Standard (월 200~300만원): 브랜드 블로그 + 플레이스
• Premium (월 300만원~): 브랜드 블로그 + 최적 블로그 + 플레이스

첫 업체 가격 책정 원칙:
1) 경쟁사 대비 10~20% 낮게 시작
2) 성과를 기반으로 레퍼런스 쌓이면 추가 업체 계약 시 3개월 후 레퍼런스 쌓이면 가격 인상
3) 단순 가격 상승보다, 가격이 올라간 이유를 상대도 납득할 수 있는 이유 필요
예시) 기존 원고작업 외 디자인 작업을 무료로 진행 or 플레이스 관리, 악플 관리 업무를 추가로 진행`,

        '영업/제안': (name) => `병원 영업은 '가치 선제공' 방식이 효과적입니다.

영업 프로세스:
1) 타겟 병원 선정
2) 마케팅 현황 무료 진단 (1페이지 리포트)
3) "개선점을 공유드립니다" 식으로 접근
4) 관심 보이면 미팅 제안

"팔려고 한다"보다 "도와주려 한다" 포지셔닝이 중요합니다.`,

        '실무 역량': (name) => `실무 역량이 부족하시다면, 원고작가로 먼저 시작하세요.

이유:
• 대행사 밑에서 피드백 받으며 실력 향상
• 돈 받으면서 배우는 구조
• 다양한 병원 업종 경험 가능

6개월 정도 활동하시면 직접 고객을 받을 역량이 됩니다.`,

        '시간 관리': (name) => `본업과 병행하신다면, '주 단위 루틴'이 핵심입니다.

시간 배분 예시 (주 15시간):
• 평일 저녁: 2시간 × 5일 = 10시간 (원고 작성)
• 주말: 2.5시간 × 2일 = 5시간 (영업/관리)

처음 3개월은 '습관 만들기'에 집중하세요.`,

        '방향': (name) => `아직 방향을 못 정하셨다면, 아래 질문에 답해 보세요.

Q1. 주당 투입 가능한 시간은?
• 20시간 이상 → 창업 가능
• 10시간 내외 → 원고작가 권장
• 5시간 이하 → 학습 단계 유지

Q2. 리스크 감수 성향은?
• 도전적 → 창업 / 안정적 → 원고작가

대부분의 경우, 원고작가로 시작 → 경험 축적 → 창업 전환이 가장 안전한 경로입니다.`,

        '기본': (name) => `핵심 원칙을 말씀드립니다.

1) 작게 시작하기 - 완벽한 준비보다 빠른 실행
2) 피드백 받기 - 혼자 고민하지 말고 시장에 부딪히기
3) 레퍼런스 쌓기 - 첫 1건이 가장 중요`
    },

    actionPlan: {
        '1개월': (name) => `1개월 내 시작 목표이시므로, 주 단위로 빠르게 실행하세요.

(중요!) 일단 먼저 실행하셔야 합니다.
완벽하게 준비하고 실행하면 계속 늦어지실거예요.

• 1주차: 서비스 패키지 및 가격 확정
• 2주차: 타겟 병원 20곳 리스트업
• 3주차: 분석 보고서 및 제안서 배포 (돌방 추천)
• 4주차: 미팅 진행 + 첫 계약 목표`,

        '3개월': (name) => `3개월 내 시작 목표이시므로, 월 단위로 진행하세요.

• 1개월 차: 강의 수강 및 기반 구축 (서비스, 포트폴리오, 리서치)
• 2개월 차: 영업 시작 (타겟 30곳, 방문 후 제안서 배포 추천)
• 3개월 차: 첫 고객 확보`,

        '6개월': (name) => `6개월 내 시작 목표이시므로, 충분히 준비하면서 진행하세요.

• 1~2개월 차: 강의 재수강 및 역량 강화 (필사 50건 추천!)
• 3~4개월 차: 기반 구축 (노션 서비스 패키지, 포트폴리오 제작)
• 5~6개월 차: 영업 및 계약`,

        '기본': (name) => `아래 단계를 참고하세요.

• 1단계: 루트 결정 (창업 vs 원고작가)
• 2단계: 서비스 구성, 포트폴리오 준비
• 3단계: 영업 시작, 첫 고객 확보
• 4단계: 레퍼런스 구축, 확장`
    },

    closing: {
        '혼자 실행': (name) => `자료만 있으면 혼자 실행 가능하다고 하셨습니다.
위 내용 참고하시고, 막히는 부분 있으면 언제든 연락 주세요.
• 최형기 대표 1:1 채널: https://open.kakao.com/o/sm0Cf1Kh
`,

        '피드백': (name) => `실행 중 피드백을 원하신다고 하셨습니다.
진행 상황 공유해 주시면 피드백 드리겠습니다.
• 최형기 대표 1:1 채널: https://open.kakao.com/o/sm0Cf1Kh
`,

        '대행': (name) => `일부 대행 서비스 이용을 희망하신다고 하셨습니다.
필요하신 부분 연락 주시면 안내해 드리겠습니다.

🔑 스마트브랜딩 솔루션 가이드 (스마트브랜딩이 직접 실행사가 되어주는 솔루션)
https://www.notion.so/25ba4049aa2080089b0dc689913bcc62?pvs=21

`,

        '커뮤니티': (name) => `함께 성장할 커뮤니티를 원하신다고 하셨습니다.
수강생 네트워크 그룹을 안내해 드리겠습니다.

🔑 스마트브랜딩 협력사 네트워크 (스마트브랜딩 외 실행사 공유)
https://www.notion.so/241a4049aa2080aeaff1ef40f429e82a?pvs=21


🔑 광고대행 소통 카톡방

온라인광고대행/실행사
https://open.kakao.com/o/gZcjDAhb

광고홍보 대행사
https://open.kakao.com/o/g67piF1b

자유대화_전문업체대행
https://open.kakao.com/o/gK6nkfVb

블로그 건바이건 의뢰
https://open.kakao.com/o/guidpi4

정보교류방
https://open.kakao.com/o/gizyTg9g

블로그연구소
https://open.kakao.com/o/gSF98uMd

데이터랩툴즈
https://open.kakao.com/o/gWzwc51e

블로그 푸쉬업
https://open.kakao.com/o/gB8Z8bbf

병원마케팅협회
https://open.kakao.com/o/gLEFUWxc

`,

        '기본': (name) => `위 내용 참고하시고, 궁금한 점 있으시면 언제든 연락 주세요.`
    }
};


// ============================================================
// 3. 메일 생성 함수
// ============================================================

/**
 * 메일 제목 생성
 */
function generateMailSubject(name) {
    return CONFIG.mailSubjectTemplate.replace('{name}', name);
}

/**
 * 전체 메일 본문 생성
 * @param {object} data - 설문 데이터
 * @param {string} [version='v2'] - 'v1': 1차 문구, 'v2': 2차 문구
 */
function generateMailBody(data, version = 'v2') {
    const name = data[CONFIG.columns.name];
    const status = data[CONFIG.columns.status];
    const monetization = data[CONFIG.columns.monetization];
    const target = data[CONFIG.columns.target];
    const concern = data[CONFIG.columns.concern];
    const timeline = data[CONFIG.columns.timeline];
    const support = data[CONFIG.columns.support];

    // 텍스트 변환
    const statusText = TEXT_MAP.status[status] || status || '준비 중';
    const monetizationText = TEXT_MAP.monetization[monetization] || monetization || '수익화';
    const targetText = target || '';
    const concernText = TEXT_MAP.concern[concern] || concern || '사업 추진';

    // 메일 조립
    let mail = '';

    // 인사말 + 현황 진단
    mail += generateIntro(name, statusText, monetizationText, targetText, concernText, version);

    // 1️⃣ 방향 제안
    mail += generateSection('1️⃣ 방향 제안', getDirectionContent(name, monetization, status, version));

    // 2️⃣ 시작점 안내
    mail += generateSection('2️⃣ 시작점 안내', getStartPointContent(name, status, version));

    // 3️⃣ 핵심 솔루션
    mail += generateSection('3️⃣ 핵심 솔루션', getSolutionContent(name, concern, version));

    // 4️⃣ 실행 플랜
    mail += generateSection('4️⃣ 실행 플랜', getActionPlanContent(name, timeline, version));

    // 📞 후속 지원
    mail += generateSection('📞 후속 지원', getClosingContent(name, support, version));

    // 서명
    mail += generateSignature();

    return mail;
}

/**
 * 한글 조사 자동 선택 (받침 유무에 따라 을/를, 이/가 등)
 * @param {string} word - 앞 단어
 * @param {string} withJong - 받침 있을 때 (예: '을')
 * @param {string} withoutJong - 받침 없을 때 (예: '를')
 */
function attachJosa(word, withJong, withoutJong) {
    if (!word) return withoutJong;
    const code = word.charCodeAt(word.length - 1);
    // 마지막 글자가 한글 음절이 아니면 받침 없는 조사로 처리
    if (code < 0xAC00 || code > 0xD7A3) return withoutJong;
    const hasJong = (code - 0xAC00) % 28 !== 0;
    return hasJong ? withJong : withoutJong;
}

/**
 * 인트로 (인사말 + 현황 진단) 생성
 * @param {string} name
 * @param {string} status
 * @param {string} monetization
 * @param {string} target
 * @param {string} concern
 * @param {string} [version='v2'] - 'v1': 1차 문구, 'v2': 2차 문구
 */
function generateIntro(name, status, monetization, target, concern, version = 'v2') {
    // 타겟 조건 체크
    const isTargetUndecided = !target || target.includes('아직') || target.includes('정하지') || target === '전체';

    // 고민 조건 체크
    const isConcernUndecided = !concern || concern.includes('아직') || concern.includes('정하지');

    let greeting, diagnosisLine, targetSentence;

    if (version === 'v1') {
        // --- v1: 1차 옛 문구 ---
        greeting =
`안녕하세요, ${name}님. ${CONFIG.sender.name}입니다.

'병원 마케팅 대행사 노하우' 과정을 함께해 주셔서 감사합니다.
설문에 응답해 주신 내용을 바탕으로, ${name}님만을 위한 맞춤 컨설팅 리포트를 준비했습니다.`;

        diagnosisLine = `${name}님께서는 현재 ${status}이시고, ${monetization}을 계획하고 계십니다.`;

        if (isTargetUndecided && isConcernUndecided) {
            targetSentence = '타겟 진료과목과 구체적인 고민은 앞으로 함께 정리해 나가면 좋겠습니다.';
        } else if (isTargetUndecided) {
            targetSentence = `아직 타겟 진료과목은 정하지 않으셨고, ${concern}을 가장 큰 과제로 꼽으셨습니다.`;
        } else if (isConcernUndecided) {
            targetSentence = `${target}을 타겟으로 하시며, 구체적인 고민은 앞으로 함께 정리해 나가면 좋겠습니다.`;
        } else {
            targetSentence = `${target}을 타겟으로 하시며, ${concern}을 가장 큰 과제로 꼽으셨습니다.`;
        }
    } else {
        // --- v2: 2차 새 문구 ---
        greeting =
`안녕하세요, ${name}님. ${CONFIG.sender.name}입니다.

'병원 마케팅 대행사 노하우' 과정 함께해 주셔서 정말 감사합니다.
설문에 남겨주신 내용을 꼼꼼히 읽고, ${name}님만을 위한 맞춤 컨설팅 리포트를 준비했어요.`;

        diagnosisLine = `${name}님은 현재 ${status}이시고, ${monetization}${attachJosa(monetization, '을', '를')} 계획하고 계세요.`;

        if (isTargetUndecided && isConcernUndecided) {
            targetSentence = '타겟 진료과목이랑 구체적인 고민은 앞으로 같이 정리해나가 봐요.';
        } else if (isTargetUndecided) {
            targetSentence = `아직 타겟 진료과목은 정하지 않으셨고, ${concern}${attachJosa(concern, '을', '를')} 지금 가장 큰 과제로 보고 계시는군요.`;
        } else if (isConcernUndecided) {
            targetSentence = `${target}${attachJosa(target, '을', '를')} 타겟으로 생각하고 계시고, 구체적인 고민은 앞으로 같이 정리해나가 봐요.`;
        } else {
            targetSentence = `${target}${attachJosa(target, '을', '를')} 타겟으로 하시면서, ${concern}${attachJosa(concern, '을', '를')} 지금 가장 큰 과제로 보고 계시네요.`;
        }
    }

    return `${greeting}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ${name}님 현황 진단
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${diagnosisLine}
${targetSentence}

`;
}

/**
 * 섹션 생성
 */
function generateSection(title, content) {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${content}

`;
}

/**
 * 서명 생성
 */
function generateSignature() {
    return `궁금한 거 생기면 언제든 연락 주세요. 응원합니다!

${CONFIG.sender.name} 드림
${CONFIG.sender.company} ${CONFIG.sender.title}
${CONFIG.sender.phone}`;
}


// ============================================================
// 4. 컨텐츠 선택 함수 (조건에 따라 적절한 템플릿 선택)
// ============================================================

function getDirectionContent(name, monetization, status, version = 'v2') {
    const T = version === 'v1' ? MAIL_TEMPLATES_V1 : MAIL_TEMPLATES_V2;
    if (monetization && monetization.includes('대행사 창업')) {
        return T.direction['대행사 창업'](name);
    } else if (monetization && monetization.includes('원고작가')) {
        return T.direction['원고작가'](name);
    } else if (monetization && monetization.includes('병행')) {
        // 현재 상황에 따라 다른 병행 템플릿 선택
        if (status && status.includes('운영')) {
            return T.direction['병행_운영중'](name);
        } else if (status && (status.includes('원고작가') || status.includes('프리랜서') || status.includes('활동'))) {
            return T.direction['병행_활동중'](name);
        } else {
            return T.direction['병행'](name);
        }
    } else {
        return T.direction['미정'](name);
    }
}

function getStartPointContent(name, status, version = 'v2') {
    const T = version === 'v1' ? MAIL_TEMPLATES_V1 : MAIL_TEMPLATES_V2;
    if (status && status.includes('준비 중')) {
        return T.startPoint['준비 중'](name);
    } else if (status && status.includes('대행사 운영')) {
        return T.startPoint['운영 중'](name);
    } else if (status && (status.includes('원고작가') || status.includes('프리랜서'))) {
        return T.startPoint['활동 중'](name);
    } else if (status && status.includes('부업')) {
        return T.startPoint['부업'](name);
    } else {
        return T.startPoint['기본'](name);
    }
}

function getSolutionContent(name, concern, version = 'v2') {
    const T = version === 'v1' ? MAIL_TEMPLATES_V1 : MAIL_TEMPLATES_V2;
    if (concern && concern.includes('첫 고객')) {
        return T.solution['첫 고객'](name);
    } else if (concern && (concern.includes('서비스') || concern.includes('가격'))) {
        return T.solution['서비스/가격'](name);
    } else if (concern && (concern.includes('영업') || concern.includes('제안'))) {
        return T.solution['영업/제안'](name);
    } else if (concern && concern.includes('실무 역량')) {
        return T.solution['실무 역량'](name);
    } else if (concern && (concern.includes('시간') || concern.includes('병행'))) {
        return T.solution['시간 관리'](name);
    } else if (concern && concern.includes('방향')) {
        return T.solution['방향'](name);
    } else {
        return T.solution['기본'](name);
    }
}

function getActionPlanContent(name, timeline, version = 'v2') {
    const T = version === 'v1' ? MAIL_TEMPLATES_V1 : MAIL_TEMPLATES_V2;
    if (timeline && timeline.includes('1개월')) {
        return T.actionPlan['1개월'](name);
    } else if (timeline && timeline.includes('3개월')) {
        return T.actionPlan['3개월'](name);
    } else if (timeline && timeline.includes('6개월')) {
        return T.actionPlan['6개월'](name);
    } else {
        return T.actionPlan['기본'](name);
    }
}

function getClosingContent(name, support, version = 'v2') {
    const T = version === 'v1' ? MAIL_TEMPLATES_V1 : MAIL_TEMPLATES_V2;
    if (support && support.includes('혼자 실행')) {
        return T.closing['혼자 실행'](name);
    } else if (support && (support.includes('질문') || support.includes('피드백'))) {
        return T.closing['피드백'](name);
    } else if (support && support.includes('대행')) {
        return T.closing['대행'](name);
    } else if (support && (support.includes('커뮤니티') || support.includes('네트워크'))) {
        return T.closing['커뮤니티'](name);
    } else {
        return T.closing['기본'](name);
    }
}


// ============================================================
// 5. HTML 메일 생성 함수
// ============================================================

/**
 * 텍스트를 HTML로 변환하는 헬퍼
 * - HTML 특수문자 이스케이프 (먼저 처리)
 * - https:// URL → <a> 링크
 * - 빈 줄(문단 구분) → <p> 마무리 + 시작
 * - 일반 줄바꿈 → <br>
 */
function textToHtml(text) {
    if (!text) return '';

    // 1. HTML 특수문자 이스케이프
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 2. https:// URL → <a> 링크 (이스케이프 후 처리)
    html = html.replace(/(https?:\/\/[^\s　、，．《》]+)/g, function(url) {
        return '<a href="' + url + '" style="color:#1a73e8;text-decoration:underline;">' + url + '</a>';
    });

    // 3. 빈 줄(연속 줄바꿈) → 문단 여백 (margin-bottom 포함 <br>로 처리)
    html = html.replace(/\n{2,}/g, '<br><br>');

    // 4. 남은 단일 줄바꿈 → <br>
    html = html.replace(/\n/g, '<br>');

    return html;
}

/**
 * HTML 섹션 생성
 */
function generateSectionHtml(title, content) {
    return (
        '<hr style="border:none;border-top:1px solid #ddd;margin:24px 0;">' +
        '<h2 style="font-size:18px;font-weight:700;color:#111;margin:28px 0 12px;">' + title + '</h2>' +
        '<p style="margin:0;">' + textToHtml(content) + '</p>'
    );
}

/**
 * HTML 인트로 생성
 * @param {string} name
 * @param {string} status
 * @param {string} monetization
 * @param {string} target
 * @param {string} concern
 * @param {string} [version='v2'] - 'v1': 1차 문구, 'v2': 2차 문구
 */
function generateIntroHtml(name, status, monetization, target, concern, version = 'v2') {
    const isTargetUndecided = !target || target.includes('아직') || target.includes('정하지') || target === '전체';
    const isConcernUndecided = !concern || concern.includes('아직') || concern.includes('정하지');

    let introParagraph, diagnosisParagraph;

    if (version === 'v1') {
        // --- v1: 1차 옛 문구 ---
        let targetSentence;
        if (isTargetUndecided && isConcernUndecided) {
            targetSentence = '타겟 진료과목과 구체적인 고민은 앞으로 함께 정리해 나가면 좋겠습니다.';
        } else if (isTargetUndecided) {
            targetSentence = '아직 타겟 진료과목은 정하지 않으셨고, ' + concern + '을 가장 큰 과제로 꼽으셨습니다.';
        } else if (isConcernUndecided) {
            targetSentence = target + '을 타겟으로 하시며, 구체적인 고민은 앞으로 함께 정리해 나가면 좋겠습니다.';
        } else {
            targetSentence = target + '을 타겟으로 하시며, ' + concern + '을 가장 큰 과제로 꼽으셨습니다.';
        }

        introParagraph =
            '안녕하세요, ' + name + '님. ' + CONFIG.sender.name + '입니다.<br><br>' +
            '\'병원 마케팅 대행사 노하우\' 과정을 함께해 주셔서 감사합니다.<br>' +
            '설문에 응답해 주신 내용을 바탕으로, ' + name + '님만을 위한 맞춤 컨설팅 리포트를 준비했습니다.';

        diagnosisParagraph =
            name + '님께서는 현재 ' + status + '이시고, ' + monetization + '을 계획하고 계십니다.<br>' +
            targetSentence;
    } else {
        // --- v2: 2차 새 문구 ---
        let targetSentence;
        if (isTargetUndecided && isConcernUndecided) {
            targetSentence = '타겟 진료과목이랑 구체적인 고민은 앞으로 같이 정리해나가 봐요.';
        } else if (isTargetUndecided) {
            targetSentence = '아직 타겟 진료과목은 정하지 않으셨고, ' + concern + attachJosa(concern, '을', '를') + ' 지금 가장 큰 과제로 보고 계시는군요.';
        } else if (isConcernUndecided) {
            targetSentence = target + attachJosa(target, '을', '를') + ' 타겟으로 생각하고 계시고, 구체적인 고민은 앞으로 같이 정리해나가 봐요.';
        } else {
            targetSentence = target + attachJosa(target, '을', '를') + ' 타겟으로 하시면서, ' + concern + attachJosa(concern, '을', '를') + ' 지금 가장 큰 과제로 보고 계시네요.';
        }

        introParagraph =
            '안녕하세요, ' + name + '님. ' + CONFIG.sender.name + '입니다.<br><br>' +
            '\'병원 마케팅 대행사 노하우\' 과정 함께해 주셔서 정말 감사합니다.<br>' +
            '설문에 남겨주신 내용을 꼼꼼히 읽고, ' + name + '님만을 위한 맞춤 컨설팅 리포트를 준비했어요.';

        diagnosisParagraph =
            name + '님은 현재 ' + status + '이시고, ' + monetization + attachJosa(monetization, '을', '를') + ' 계획하고 계세요.<br>' +
            targetSentence;
    }

    return (
        '<p style="margin:0 0 16px;">' + introParagraph + '</p>' +
        '<hr style="border:none;border-top:1px solid #ddd;margin:24px 0;">' +
        '<h2 style="font-size:18px;font-weight:700;color:#111;margin:28px 0 12px;">현황 진단</h2>' +
        '<p style="margin:0;">' + diagnosisParagraph + '</p>'
    );
}

/**
 * HTML 서명 생성
 */
function generateSignatureHtml() {
    return (
        '<hr style="border:none;border-top:1px solid #ddd;margin:24px 0;">' +
        '<p style="margin:0;font-size:13px;color:#666;">' +
        '궁금한 거 생기면 언제든 연락 주세요. 응원합니다!<br><br>' +
        CONFIG.sender.name + ' 드림<br>' +
        CONFIG.sender.company + ' ' + CONFIG.sender.title + '<br>' +
        CONFIG.sender.phone +
        '</p>'
    );
}

/**
 * HTML 메일 본문 생성 (서식 포함 복사용)
 * 기존 generateMailBody(plain text)는 그대로 유지됨
 * @param {object} data - 설문 데이터
 * @param {string} [version='v2'] - 'v1': 1차 문구, 'v2': 2차 문구
 */
function generateMailHtml(data, version = 'v2') {
    const name = data[CONFIG.columns.name];
    const status = data[CONFIG.columns.status];
    const monetization = data[CONFIG.columns.monetization];
    const target = data[CONFIG.columns.target];
    const concern = data[CONFIG.columns.concern];
    const timeline = data[CONFIG.columns.timeline];
    const support = data[CONFIG.columns.support];

    // 텍스트 변환 (generateMailBody와 동일한 로직)
    const statusText = TEXT_MAP.status[status] || status || '준비 중';
    const monetizationText = TEXT_MAP.monetization[monetization] || monetization || '수익화';
    const targetText = target || '';
    const concernText = TEXT_MAP.concern[concern] || concern || '사업 추진';

    let html = '';

    // 인트로
    html += generateIntroHtml(name, statusText, monetizationText, targetText, concernText, version);

    // 방향 제안
    html += generateSectionHtml('방향 제안', getDirectionContent(name, monetization, status, version));

    // 시작점 안내
    html += generateSectionHtml('시작점 안내', getStartPointContent(name, status, version));

    // 핵심 솔루션
    html += generateSectionHtml('핵심 솔루션', getSolutionContent(name, concern, version));

    // 실행 플랜
    html += generateSectionHtml('실행 플랜', getActionPlanContent(name, timeline, version));

    // 후속 지원
    html += generateSectionHtml('후속 지원', getClosingContent(name, support, version));

    // 서명
    html += generateSignatureHtml();

    return '<div style="max-width:600px;font-family:\'Apple SD Gothic Neo\',\'맑은 고딕\',sans-serif;font-size:15px;line-height:1.7;color:#222;">' + html + '</div>';
}
