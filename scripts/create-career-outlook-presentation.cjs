const path = require("path");
const PptxGenJS = require("/Users/kimhuiseong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs");

const root = "/Users/kimhuiseong/Documents/onebite-log";
const outPath = path.join(root, "profiles", "FE_취업전망_발표자료_김희성.pptx");

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";
pptx.author = "Kim Huiseong";
pptx.subject = "Frontend career outlook presentation";
pptx.title = "FE 취업 전망 발표자료";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "ko-KR",
};

const C = {
  ink: "111827",
  muted: "64748B",
  soft: "F8FAFC",
  line: "E2E8F0",
  white: "FFFFFF",
  teal: "0F766E",
  blue: "2563EB",
  green: "16A34A",
  amber: "D97706",
  red: "DC2626",
  slate: "334155",
};

function footer(slide, n) {
  slide.addText("FE Career Outlook | 김희성", {
    x: 0.62,
    y: 7.05,
    w: 4.2,
    h: 0.18,
    fontSize: 7.8,
    color: "94A3B8",
    margin: 0,
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.25,
    y: 6.98,
    w: 0.45,
    h: 0.28,
    fontSize: 9,
    bold: true,
    color: C.muted,
    align: "right",
    margin: 0,
  });
}

function title(slide, text, subtitle) {
  slide.addText(text, {
    x: 0.65,
    y: 0.44,
    w: 10.6,
    h: 0.52,
    fontSize: 25,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.67,
      y: 1.0,
      w: 10.8,
      h: 0.28,
      fontSize: 10.8,
      color: C.muted,
      margin: 0,
      fit: "shrink",
    });
  }
}

function card(slide, x, y, w, h, heading, body, accent = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
    shadow: { type: "outer", color: "CBD5E1", opacity: 0.14, blur: 1, angle: 45, distance: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.08,
    h,
    fill: { color: accent },
    line: { color: accent },
  });
  slide.addText(heading, {
    x: x + 0.28,
    y: y + 0.2,
    w: w - 0.45,
    h: 0.28,
    fontSize: 12.6,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(body, {
    x: x + 0.28,
    y: y + 0.62,
    w: w - 0.45,
    h: h - 0.76,
    fontSize: 10.2,
    color: C.muted,
    margin: 0,
    valign: "top",
    fit: "shrink",
    breakLine: false,
  });
}

function metric(slide, x, y, w, value, label, source, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 1.42,
    rectRadius: 0.06,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
  });
  slide.addText(value, {
    x: x + 0.22,
    y: y + 0.22,
    w: w - 0.44,
    h: 0.36,
    fontSize: 22,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(label, {
    x: x + 0.22,
    y: y + 0.67,
    w: w - 0.44,
    h: 0.34,
    fontSize: 9.6,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(source, {
    x: x + 0.22,
    y: y + 1.1,
    w: w - 0.44,
    h: 0.16,
    fontSize: 7.2,
    color: "94A3B8",
    margin: 0,
    fit: "shrink",
  });
}

function bullets(slide, items, x, y, w, h, opts = {}) {
  const runs = [];
  items.forEach((item) => {
    runs.push({
      text: item,
      options: {
        bullet: { indent: 13 },
        hanging: 4,
        breakLine: true,
      },
    });
  });
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontSize: opts.fontSize || 12.8,
    color: opts.color || C.ink,
    paraSpaceAfterPt: opts.space || 10,
    margin: 0,
    fit: "shrink",
    valign: "top",
  });
}

function band(slide, text, x, y, w, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.46,
    rectRadius: 0.05,
    fill: { color },
    line: { color },
  });
  slide.addText(text, {
    x,
    y: y + 0.13,
    w,
    h: 0.16,
    fontSize: 9.5,
    bold: true,
    color: C.white,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function timeline(slide, x, y, w, steps) {
  const gap = 0.32;
  const each = (w - gap * (steps.length - 1)) / steps.length;
  steps.forEach((s, i) => {
    const sx = x + i * (each + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: sx,
      y,
      w: each,
      h: 3.85,
      rectRadius: 0.06,
      fill: { color: C.white },
      line: { color: C.line, width: 1 },
    });
    slide.addText(s.month, {
      x: sx + 0.24,
      y: y + 0.24,
      w: each - 0.48,
      h: 0.28,
      fontSize: 13.5,
      bold: true,
      color: s.color,
      margin: 0,
    });
    slide.addText(s.goal, {
      x: sx + 0.24,
      y: y + 0.66,
      w: each - 0.48,
      h: 0.38,
      fontSize: 11.2,
      bold: true,
      color: C.ink,
      margin: 0,
      fit: "shrink",
    });
    bullets(slide, s.items, sx + 0.28, y + 1.22, each - 0.5, 2.1, { fontSize: 9.6, space: 6 });
  });
}

let n = 1;

{
  const slide = pptx.addSlide();
  slide.background = { color: C.soft };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.soft }, line: { color: C.soft } });
  slide.addText("FE 신입 개발자", { x: 0.85, y: 1.1, w: 5.8, h: 0.52, fontSize: 24, bold: true, color: C.teal, margin: 0 });
  slide.addText("취업 전망과 실행 전략", { x: 0.84, y: 1.72, w: 8.2, h: 0.76, fontSize: 38, bold: true, color: C.ink, margin: 0, fit: "shrink" });
  slide.addText("이력서와 포트폴리오 기반으로 정리한 시장 해석, 강점, 보완 방향", {
    x: 0.88,
    y: 2.72,
    w: 7.3,
    h: 0.38,
    fontSize: 14.5,
    color: C.muted,
    margin: 0,
  });
  band(slide, "React", 0.9, 4.05, 1.55, C.blue);
  band(slide, "TypeScript", 2.68, 4.05, 1.7, C.teal);
  band(slide, "React Query", 4.62, 4.05, 1.95, C.amber);
  band(slide, "Supabase", 6.8, 4.05, 1.7, C.green);
  card(slide, 8.35, 1.25, 3.9, 3.5, "결론", "취업 기회는 존재하지만, 신입에게는 단순 기술 나열보다 ‘실제 서비스 문제를 해결한 증거’가 더 중요해지고 있습니다.\n\n김희성님의 포지션은 서비스형 FE 구현과 AI 활용 태도를 함께 보여주는 방향이 가장 설득력 있습니다.", C.teal);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "한 장 요약", "취업 전망을 세 문장으로 압축");
  card(slide, 0.82, 1.55, 3.75, 3.65, "시장", "소프트웨어 직무는 중장기 성장 전망이 있지만, AI와 생산성 도구 확산으로 입문자의 기준은 더 높아지고 있습니다.", C.blue);
  card(slide, 4.8, 1.55, 3.75, 3.65, "개인 적합도", "React, TypeScript, Supabase, React Query로 실제 SNS를 만들고 배포/테스트한 경험은 신입 포트폴리오에서 좋은 차별점입니다.", C.green);
  card(slide, 8.78, 1.55, 3.75, 3.65, "전략", "Animal Log를 ‘서비스 운영 경험’으로 다듬고, 테스트·접근성·성능·알림 기능까지 보완하면 지원 설득력이 커집니다.", C.amber);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "채용 시장 신호", "성장은 있지만 직무 요구 역량은 빠르게 변하고 있음");
  metric(slide, 0.82, 1.55, 2.95, "15%", "미국 SW 개발/QA/테스터 직군 2024-2034 고용 성장 전망", "BLS Occupational Outlook", C.blue);
  metric(slide, 3.98, 1.55, 2.95, "129K", "연평균 채용/대체 수요 전망", "BLS Occupational Outlook", C.green);
  metric(slide, 7.14, 1.55, 2.95, "39%", "2025-2030 기존 스킬셋 변화/노후화 예상", "WEF Future of Jobs", C.amber);
  metric(slide, 10.3, 1.55, 2.15, "84%", "개발 과정에서 AI 도구 사용 또는 사용 예정", "Stack Overflow 2025", C.teal);
  bullets(slide, [
    "기회: 소프트웨어와 웹 서비스 수요는 AI, IoT, 보안, 자동화 흐름과 함께 계속 확장",
    "압박: 기업은 더 적은 인원으로 더 빠르게 만들 수 있는 개발자를 원함",
    "결론: 신입도 ‘코드 작성’보다 문제 정의, 검증, 개선, 협업 가능성을 증명해야 함",
  ], 1.05, 4.25, 11.1, 1.35, { fontSize: 13.2, space: 12 });
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "프론트엔드 기술 전망", "React/TypeScript는 여전히 좋은 기본기 신호");
  card(slide, 0.85, 1.5, 3.5, 2.25, "React", "Stack Overflow 2025 기준 Professional Developers의 46.9%가 React를 사용했습니다.\n\n프론트엔드 신입에게 React 숙련도는 여전히 강한 기본 조건입니다.", C.blue);
  card(slide, 4.9, 1.5, 3.5, 2.25, "TypeScript", "Professional Developers의 48.8%가 TypeScript를 사용했습니다.\n\n타입 설계와 props 안정성은 협업 가능한 코드의 근거가 됩니다.", C.teal);
  card(slide, 8.95, 1.5, 3.5, 2.25, "Modern Stack", "Vite, Vercel, Supabase, shadcn/ui 같은 도구는 작은 팀이 빠르게 서비스를 만드는 흐름과 맞닿아 있습니다.", C.green);
  bullets(slide, [
    "포트폴리오의 React + TypeScript + Vite + Supabase 조합은 현재 시장의 실무 도구 흐름과 잘 맞음",
    "다만 기술 이름보다 중요한 것은 ‘왜 이 도구를 선택했고 어떤 문제를 해결했는가’",
    "React Query, optimistic update, RLS/RPC 같은 구현 맥락은 면접에서 깊게 풀기 좋음",
  ], 1.0, 4.65, 11.0, 1.25, { fontSize: 13 });
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "현재 프로필 진단", "이력서/포트폴리오에서 보이는 강점");
  card(slide, 0.82, 1.45, 3.75, 3.88, "서비스 구현력", "Animal Log SNS 프로젝트에서 인증, 게시글, 이미지 업로드, 댓글, 좋아요, 무한 스크롤, 테마 기능까지 구현했습니다.\n\n단순 토이보다 서비스 흐름을 넓게 경험한 점이 강점입니다.", C.green);
  card(slide, 4.8, 1.45, 3.75, 3.88, "서버 상태 이해", "API 함수와 query/mutation hook을 역할별로 분리하고, React Query 캐시 갱신·무효화·낙관적 업데이트를 경험했습니다.\n\n프론트엔드의 데이터 일관성 역량을 보여줍니다.", C.blue);
  card(slide, 8.78, 1.45, 3.75, 3.88, "성장 태도", "사용자 테스트 피드백을 받아 알림, 이미지 상세 보기 같은 개선을 고민했고, IT 기사 스크랩과 기술 블로그로 학습 습관을 유지하고 있습니다.", C.amber);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "포트폴리오의 경쟁력", "Animal Log를 핵심 사례로 밀어야 하는 이유");
  bullets(slide, [
    "배포된 서비스: Vercel과 Supabase를 활용해 실제 접근 가능한 형태로 구현",
    "사용자 피드백: 지인 테스트를 통해 서비스 사용 시간과 알림 기능 필요성을 발견",
    "구현 깊이: React Query 서버 상태, Supabase RLS/RPC, 이미지 업로드 실패 롤백 경험",
    "설계 방향: API 계층, query/mutation hook, UI 컴포넌트의 책임 분리",
    "면접 확장성: 좋아요 optimistic update, 댓글 캐시 동기화, 타입 설계는 질문받기 좋은 소재",
  ], 0.92, 1.55, 7.1, 3.35, { fontSize: 13.3, space: 12 });
  card(slide, 8.55, 1.75, 3.65, 2.95, "추천 메시지", "“SNS 서비스를 만들며 사용자의 액션이 UI, 서버 데이터, 캐시에 어떻게 반영되어야 하는지 설계했습니다.”\n\n이 한 문장을 중심으로 발표와 면접 답변을 정리하면 좋습니다.", C.teal);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "리스크와 보완 포인트", "신입 경쟁에서 더 설득력 있게 보이기 위한 과제");
  card(slide, 0.82, 1.45, 3.72, 3.85, "증명 부족 리스크", "기능은 많지만 테스트, 접근성, 성능 수치, 에러 모니터링이 약하면 ‘실무 준비도’가 낮게 보일 수 있습니다.", C.red);
  card(slide, 4.82, 1.45, 3.72, 3.85, "AI 시대 리스크", "AI가 코드 초안을 빠르게 만들수록, 신입은 코드 해석·검증·디버깅·설계 판단으로 차별화해야 합니다.", C.amber);
  card(slide, 8.82, 1.45, 3.72, 3.85, "보완 방향", "Animal Log에 알림, 이미지 상세 보기, 테스트, 접근성 개선, 성능 측정을 추가해 ‘개선하는 개발자’ 이미지를 강화합니다.", C.green);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "취업 포지셔닝", "나를 어떤 프론트엔드 개발자로 설명할 것인가");
  slide.addText("AI를 활용해 빠르게 학습하고,\n사용자 피드백을 서비스 개선으로 연결하는\nReact/TypeScript 프론트엔드 개발자", {
    x: 0.95,
    y: 1.55,
    w: 6.6,
    h: 1.45,
    fontSize: 25,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  card(slide, 0.98, 3.62, 2.65, 1.45, "Product Mind", "사용자 테스트와 피드백 기반 개선", C.green);
  card(slide, 3.88, 3.62, 2.65, 1.45, "Data Flow", "React Query와 Supabase 데이터 흐름", C.blue);
  card(slide, 6.78, 3.62, 2.65, 1.45, "Type Safety", "TypeScript 기반 props/API 안정성", C.teal);
  card(slide, 9.68, 3.62, 2.65, 1.45, "AI Literacy", "AI 결과 검증과 코드 해석 역량", C.amber);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "지원 타깃", "처음부터 너무 좁히지 말고 ‘성장 가능한 접점’을 넓게 가져가기");
  card(slide, 0.82, 1.45, 3.72, 3.85, "1순위", "React/TypeScript 기반 웹 서비스를 운영하는 스타트업 또는 제품 조직\n\n포트폴리오와 가장 직접적으로 연결됩니다.", C.green);
  card(slide, 4.82, 1.45, 3.72, 3.85, "2순위", "B2B SaaS, 어드민, 대시보드, 예약/커뮤니티 서비스\n\nReact Query와 상태 관리 경험을 설명하기 좋습니다.", C.blue);
  card(slide, 8.82, 1.45, 3.72, 3.85, "확장 타깃", "프론트엔드 중심이지만 Supabase/Node 경험을 활용하는 풀스택 라이트 포지션\n\n작은 팀에서 강점이 될 수 있습니다.", C.teal);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "90일 실행 계획", "포트폴리오를 채용 언어로 바꾸는 작업");
  timeline(slide, 0.82, 1.55, 11.72, [
    {
      month: "1개월차",
      goal: "Animal Log 완성도 강화",
      color: C.green,
      items: [
        "알림 기능 구현",
        "이미지 상세 보기 추가",
        "접근성/로딩/에러 상태 정리",
        "README를 문제 해결 중심으로 개편",
      ],
    },
    {
      month: "2개월차",
      goal: "면접 증거 만들기",
      color: C.blue,
      items: [
        "React Query 트러블슈팅 문서화",
        "좋아요 optimistic update 회고 작성",
        "TypeScript union type 사례 정리",
        "주요 기능 짧은 시연 영상 준비",
      ],
    },
    {
      month: "3개월차",
      goal: "지원과 피드백 루프",
      color: C.amber,
      items: [
        "타깃 기업별 자기소개서 수정",
        "주 10~15개 지원",
        "면접 질문 로그 기록",
        "탈락 사유를 포트폴리오 개선으로 연결",
      ],
    },
  ]);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "면접에서 가져갈 이야기", "기능 나열보다 문제 해결 흐름으로 말하기");
  card(slide, 0.82, 1.5, 3.72, 3.9, "문제", "SNS에서 사용자는 좋아요나 댓글 같은 반응을 즉시 기대합니다.\n\n하지만 서버 응답 이후에만 UI를 바꾸면 사용감이 느려지고, 캐시가 맞지 않으면 화면마다 데이터가 달라질 수 있습니다.", C.red);
  card(slide, 4.82, 1.5, 3.72, 3.9, "해결", "React Query의 캐시와 mutation 생명주기를 활용했습니다.\n\n좋아요는 optimistic update로 즉시 반영하고, 실패하면 이전 캐시로 롤백했습니다.", C.blue);
  card(slide, 8.82, 1.5, 3.72, 3.9, "결과", "사용자 입장에서는 더 빠르게 반응하는 UI를 경험하고, 개발자 입장에서는 서버 상태와 화면 상태의 일관성을 관리하는 방법을 배웠습니다.", C.green);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "결론", "전망은 ‘가능성 있음’, 관건은 증명의 밀도");
  bullets(slide, [
    "프론트엔드 채용은 사라지는 흐름이 아니라, AI와 생산성 도구 때문에 기준이 바뀌는 흐름",
    "김희성님의 현재 포트폴리오는 React/TypeScript/Supabase 기반 서비스 구현 경험이라는 좋은 출발점이 있음",
    "앞으로는 기능 추가보다 테스트, 접근성, 성능, 사용자 피드백 반영처럼 실무형 증거를 보강하는 것이 중요",
    "최종 포지셔닝은 ‘AI를 활용하되 결과를 검증하고, 사용자 중심으로 서비스를 개선하는 FE 개발자’가 적합",
  ], 0.95, 1.55, 10.95, 2.65, { fontSize: 13.8, space: 14 });
  card(slide, 1.1, 5.1, 10.85, 0.88, "발표 한 줄", "저는 React와 TypeScript로 서비스를 구현하고, 사용자 피드백과 데이터 흐름을 바탕으로 제품을 개선하는 프론트엔드 개발자로 성장하고자 합니다.", C.teal);
  footer(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "참고 자료", "시장 전망 해석에 사용한 외부 자료");
  bullets(slide, [
    "U.S. Bureau of Labor Statistics, Software Developers, Quality Assurance Analysts, and Testers, Occupational Outlook Handbook",
    "World Economic Forum, The Future of Jobs Report 2025",
    "Stack Overflow Developer Survey 2025, Technology section",
    "Stack Overflow Developer Survey 2025, AI section",
    "개인 자료: FE 이력서/자기소개서 PDF, FE 포트폴리오 PDF",
  ], 0.95, 1.6, 11.0, 2.7, { fontSize: 13.2, space: 12 });
  slide.addText("주의: 국내 신입 프론트엔드 채용 수요는 회사 규모·지역·경기 상황에 따라 달라질 수 있어, 본 발표자료는 공개 지표와 개인 포트폴리오를 바탕으로 한 전략적 해석입니다.", {
    x: 0.98,
    y: 5.05,
    w: 11.0,
    h: 0.55,
    fontSize: 11.2,
    color: C.muted,
    margin: 0,
    fit: "shrink",
  });
  footer(slide, n++);
}

(async () => {
  await pptx.writeFile({ fileName: outPath });
})();
