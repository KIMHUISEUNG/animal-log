const path = require("path");
const PptxGenJS = require("/Users/kimhuiseong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs");

const root = "/Users/kimhuiseong/Documents/onebite-log";
const outPath = path.join(root, "onebite-log-project-presentation.pptx");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Kim Huiseong";
pptx.company = "Onebite Log";
pptx.subject = "SNS project presentation";
pptx.title = "Onebite Log Project Presentation";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "ko-KR",
};
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";

const C = {
  ink: "171717",
  muted: "6B7280",
  line: "E5E7EB",
  panel: "F8FAFC",
  white: "FFFFFF",
  green: "16A34A",
  teal: "0F766E",
  sky: "0284C7",
  amber: "D97706",
  red: "DC2626",
};

function addFooter(slide, index) {
  slide.addText("Onebite Log | React + TypeScript SNS Project", {
    x: 0.62,
    y: 7.05,
    w: 5.2,
    h: 0.18,
    fontSize: 7.8,
    color: "94A3B8",
    margin: 0,
  });
  slide.addText(String(index).padStart(2, "0"), {
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
    x: 0.62,
    y: 0.42,
    w: 8.6,
    h: 0.52,
    fontSize: 25,
    bold: true,
    color: C.ink,
    breakLine: false,
    fit: "shrink",
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.64,
      y: 0.98,
      w: 8.8,
      h: 0.28,
      fontSize: 10.5,
      color: C.muted,
      margin: 0,
    });
  }
}

function tag(slide, text, x, y, color = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: 1.55,
    h: 0.35,
    rectRadius: 0.04,
    fill: { color },
    line: { color },
  });
  slide.addText(text, {
    x,
    y: y + 0.075,
    w: 1.55,
    h: 0.16,
    fontSize: 8.5,
    bold: true,
    color: C.white,
    align: "center",
    margin: 0,
  });
}

function card(slide, x, y, w, h, heading, body, accent = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.07,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
    shadow: { type: "outer", color: "CBD5E1", opacity: 0.16, blur: 1, angle: 45, distance: 1 },
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
    h: 0.25,
    fontSize: 12,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(body, {
    x: x + 0.28,
    y: y + 0.58,
    w: w - 0.45,
    h: h - 0.72,
    fontSize: 9.6,
    color: C.muted,
    breakLine: false,
    fit: "shrink",
    valign: "top",
    margin: 0,
  });
}

function featureCard(slide, x, y, w, h, heading, body, accent = C.teal) {
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
    w: 0.1,
    h,
    fill: { color: accent },
    line: { color: accent },
  });
  slide.addText(heading, {
    x: x + 0.34,
    y: y + 0.26,
    w: w - 0.56,
    h: 0.34,
    fontSize: 15.2,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(body, {
    x: x + 0.34,
    y: y + 0.78,
    w: w - 0.58,
    h: h - 0.94,
    fontSize: 12.2,
    color: C.muted,
    breakLine: false,
    fit: "shrink",
    valign: "top",
    margin: 0,
  });
}

function compactCallout(slide, x, y, w, h, heading, body, accent = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
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
    x: x + 0.25,
    y: y + 0.16,
    w: w - 0.45,
    h: 0.22,
    fontSize: 10.8,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(body, {
    x: x + 0.25,
    y: y + 0.47,
    w: w - 0.45,
    h: h - 0.6,
    fontSize: 9.2,
    color: C.muted,
    fit: "shrink",
    valign: "top",
    margin: 0,
    breakLine: false,
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
    fontSize: opts.fontSize || 12.5,
    color: opts.color || C.ink,
    breakLine: false,
    fit: "shrink",
    margin: 0,
    paraSpaceAfterPt: opts.space || 10,
    valign: "top",
  });
}

function addCode(slide, code, x, y, w, h) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  slide.addText(code, {
    x: x + 0.22,
    y: y + 0.22,
    w: w - 0.44,
    h: h - 0.44,
    fontFace: "Menlo",
    fontSize: 8.4,
    color: "E2E8F0",
    fit: "shrink",
    valign: "top",
    margin: 0,
    breakLine: false,
  });
}

function diagramNode(slide, text, x, y, w, color) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.66,
    rectRadius: 0.06,
    fill: { color },
    line: { color },
  });
  slide.addText(text, {
    x,
    y: y + 0.21,
    w,
    h: 0.17,
    fontSize: 10,
    bold: true,
    color: C.white,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function arrow(slide, x1, y1, x2, y2) {
  slide.addShape(pptx.ShapeType.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: { color: "94A3B8", width: 1.2, beginArrowType: "none", endArrowType: "triangle" },
  });
}

let n = 1;

{
  const slide = pptx.addSlide();
  slide.background = { color: "F8FAFC" };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: "F8FAFC" }, line: { color: "F8FAFC" } });
  slide.addText("Onebite Log", { x: 0.82, y: 1.9, w: 6.2, h: 0.7, fontSize: 38, bold: true, color: C.ink, margin: 0 });
  slide.addText("React + TypeScript 기반 SNS 프로젝트", { x: 0.86, y: 2.72, w: 5.8, h: 0.32, fontSize: 16, bold: true, color: C.teal, margin: 0 });
  slide.addText("게시글, 댓글, 좋아요, 프로필, 이미지 업로드를 포함한 서비스형 프론트엔드 구현 경험", {
    x: 0.86,
    y: 3.24,
    w: 6.1,
    h: 0.68,
    fontSize: 13.5,
    color: C.muted,
    fit: "shrink",
    margin: 0,
  });
  tag(slide, "React", 0.86, 4.34, C.sky);
  tag(slide, "TypeScript", 2.58, 4.34, C.teal);
  tag(slide, "Supabase", 4.3, 4.34, C.green);
  tag(slide, "React Query", 6.02, 4.34, C.amber);
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.0, y: 0.62, w: 4.42, h: 5.78, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.line } });
  slide.addImage({ path: path.join(root, "src/assets/thumbnail.png"), x: 8.27, y: 0.95, w: 3.88, h: 2.35 });
  card(slide, 8.34, 3.65, 3.75, 1.92, "발표 키워드", "서비스형 UI 구조화\n서버 상태 관리\n타입 안정성\n사용자 경험 중심 mutation", C.teal);
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "프로젝트 개요", "동물 일상을 기록하고 소통하는 SNS 서비스");
  card(slide, 0.72, 1.62, 3.6, 2.0, "문제 정의", "사진과 글을 함께 남기고, 다른 사용자의 게시글에 댓글과 좋아요로 반응할 수 있는 작은 SNS 경험을 구현했습니다.", C.teal);
  card(slide, 4.86, 1.62, 3.6, 2.0, "핵심 목표", "인증 사용자 기반으로 게시글, 댓글, 프로필, 좋아요 상태가 일관되게 동작하는 프론트엔드 구조를 만드는 것이 목표였습니다.", C.sky);
  card(slide, 9.0, 1.62, 3.6, 2.0, "결과물", "Vite 기반 React 앱에 Supabase 인증/DB/Storage를 연결하고, React Query로 서버 상태를 관리했습니다.", C.green);
  bullets(slide, [
    "회원가입, 로그인, 비밀번호 재설정 등 사용자 인증 흐름 구현",
    "게시글 CRUD, 이미지 업로드, 댓글/대댓글, 좋아요 토글 기능 구현",
    "React Query 캐시 전략과 TypeScript 타입 모델링으로 유지보수성 강화",
  ], 0.96, 4.42, 11.1, 1.25, { fontSize: 13.2 });
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "주요 기능", "SNS 서비스에서 기대되는 핵심 상호작용 구현");
  const features = [
    ["인증", "회원가입, 로그인, OAuth, 비밀번호 재설정 흐름"],
    ["피드", "무한 스크롤 기반 게시글 목록과 상세 페이지"],
    ["게시글", "텍스트와 이미지 업로드를 포함한 작성/수정/삭제"],
    ["댓글", "댓글과 대댓글 작성, 수정, 삭제"],
    ["좋아요", "RPC 기반 토글과 즉각적인 UI 반응"],
    ["프로필", "사용자 정보 조회와 프로필 수정"],
  ];
  features.forEach(([h, b], i) => {
    const x = 0.58 + (i % 3) * 4.2;
    const y = 1.42 + Math.floor(i / 3) * 2.22;
    featureCard(slide, x, y, 3.9, 1.82, h, b, [C.sky, C.teal, C.green, C.amber, C.red, C.teal][i]);
  });
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "기술 스택", "역할에 맞는 라이브러리 조합으로 서비스 구조 구성");
  const items = [
    ["React 19", "컴포넌트 기반 UI와 사용자 상호작용 구현"],
    ["TypeScript", "API 응답, props, mutation callback 타입 안정성 확보"],
    ["React Query", "조회, mutation, 캐시 무효화, optimistic update 관리"],
    ["Supabase", "Auth, Database, Storage, RPC를 활용한 백엔드 기능 구성"],
    ["Zustand", "모달, 세션, 테마 등 클라이언트 전역 상태 관리"],
    ["Tailwind CSS", "반응형 UI와 디자인 시스템 스타일링"],
  ];
  items.forEach(([h, b], i) => {
    const x = i < 3 ? 0.82 : 6.85;
    const y = 1.38 + (i % 3) * 1.55;
    card(slide, x, y, 5.45, 1.08, h, b, [C.sky, C.teal, C.amber, C.green, C.teal, C.sky][i]);
  });
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "아키텍처", "UI와 데이터 로직을 분리한 계층형 구조");
  diagramNode(slide, "Page / Route", 0.85, 2.0, 2.1, C.sky);
  diagramNode(slide, "Component", 3.4, 2.0, 2.1, C.teal);
  diagramNode(slide, "Custom Hook", 5.95, 2.0, 2.1, C.amber);
  diagramNode(slide, "API Layer", 8.5, 2.0, 2.1, C.green);
  diagramNode(slide, "Supabase", 11.05, 2.0, 1.7, C.ink);
  arrow(slide, 2.95, 2.33, 3.35, 2.33);
  arrow(slide, 5.5, 2.33, 5.9, 2.33);
  arrow(slide, 8.05, 2.33, 8.45, 2.33);
  arrow(slide, 10.6, 2.33, 11.0, 2.33);
  bullets(slide, [
    "컴포넌트는 렌더링과 사용자 이벤트 처리에 집중",
    "조회/변경 로직은 커스텀 훅으로 분리해 재사용성 확보",
    "Supabase 호출은 api 계층에 모아 데이터 접근 책임을 명확히 분리",
    "React Query 캐시에 post byId 데이터를 저장해 목록과 상세 화면을 연결",
  ], 1.0, 3.72, 11.2, 1.75, { fontSize: 12.8 });
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "핵심 구현 1. 게시글 작성과 이미지 업로드", "실패 시 롤백까지 고려한 작성 플로우");
  addCode(slide, `createPostWithImages({ content, images, userId })\n\nconst post = await createPost(content);\nif (images.length === 0) return post;\n\ntry {\n  const imageUrls = await Promise.all(\n    images.map((image) => uploadImage({ file: image, filePath }))\n  );\n\n  return await updatePost({\n    id: post.id,\n    image_urls: imageUrls,\n  });\n} catch (error) {\n  await deletePost(post.id);\n  throw error;\n}`, 0.78, 1.42, 5.75, 3.78);
  bullets(slide, [
    "텍스트 작성과 이미지 업로드를 하나의 사용자 플로우로 묶음",
    "이미지 업로드는 Promise.all로 병렬 처리해 대기 시간을 줄임",
    "중간 실패 시 deletePost로 롤백해 불완전한 게시글이 남지 않도록 처리",
    "작성 성공 후 post list query를 reset하여 최신 피드를 다시 가져옴",
  ], 7.0, 1.62, 5.05, 3.32, { fontSize: 14.1, space: 13 });
  compactCallout(slide, 7.0, 5.12, 5.05, 1.05, "어필 포인트", "사용자 액션 하나에 연결된 비동기 작업과 예외 처리를 서비스 흐름 관점에서 설계했습니다.", C.green);
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "핵심 구현 2. React Query 서버 상태 관리", "목록, 상세, 댓글 데이터를 캐시 중심으로 관리");
  addCode(slide, `useInfinitePostsData(authorId?)\n\nreturn useInfiniteQuery({\n  queryKey: authorId\n    ? QUERY_KEYS.post.userList(authorId)\n    : QUERY_KEYS.post.list,\n\n  queryFn: async ({ pageParam }) => {\n    const posts = await fetchPosts({ from, to, userId, authorId });\n\n    posts.forEach((post) => {\n      queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);\n    });\n\n    return posts.map((post) => post.id);\n  },\n});`, 0.76, 1.42, 5.95, 3.78);
  bullets(slide, [
    "목록 조회 결과를 post id 배열로 관리하고 상세 데이터는 byId 캐시에 저장",
    "피드, 프로필 게시글 목록, 상세 화면이 같은 게시글 캐시를 공유",
    "댓글 생성 성공 시 전체 refetch 대신 comment cache에 새 댓글을 직접 추가",
    "resetQueries와 setQueryData를 상황에 맞게 선택해 네트워크 요청을 줄임",
  ], 7.0, 1.62, 5.05, 3.32, { fontSize: 14.1, space: 13 });
  compactCallout(slide, 7.0, 5.12, 5.05, 1.05, "어필 포인트", "서버 상태를 화면별로 흩어두지 않고 React Query 캐시를 중심으로 동기화했습니다.", C.teal);
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "핵심 구현 3. 좋아요 Optimistic Update", "즉각적인 피드백과 실패 복구를 함께 처리");
  addCode(slide, `onMutate: async ({ postId }) => {\n  await queryClient.cancelQueries({ queryKey: post.byId(postId) });\n  const prevPost = queryClient.getQueryData(post.byId(postId));\n\n  queryClient.setQueryData(post.byId(postId), (post) => ({\n    ...post,\n    isLiked: !post.isLiked,\n    like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1,\n  }));\n\n  return { prevPost };\n}`, 0.76, 1.48, 6.35, 4.3);
  bullets(slide, [
    "사용자가 좋아요를 누르는 즉시 UI 상태를 먼저 변경",
    "기존 데이터를 context에 저장해 실패 시 이전 상태로 복구",
    "서버 응답을 기다리는 동안에도 자연스러운 SNS 사용감을 제공",
    "데이터 일관성과 사용자 경험 사이의 균형을 학습한 구현 사례",
  ], 7.32, 1.62, 4.95, 3.32, { fontSize: 14.1, space: 13 });
  compactCallout(slide, 7.32, 5.12, 4.95, 1.05, "어필 포인트", "빠른 반응성과 실패 복구를 함께 설계해 SNS다운 사용감을 만들었습니다.", C.amber);
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "TypeScript 활용", "잘못된 데이터 조합을 줄이는 타입 모델링");
  addCode(slide, `type CreateMode = {\n  type: "CREATE";\n  postId: number;\n};\n\ntype EditMode = {\n  type: "EDIT";\n  commentId: number;\n  initialContent: string;\n  onClose: () => void;\n};\n\ntype ReplyMode = {\n  type: "REPLY";\n  postId: number;\n  parentCommentId: number;\n  rootCommentId: number;\n  onClose: () => void;\n};`, 0.78, 1.45, 5.15, 4.65);
  bullets(slide, [
    "Supabase database.types를 기반으로 Post, Comment, Profile 타입 정의",
    "컴포넌트 props와 API 응답 타입을 명확히 연결",
    "댓글 에디터는 CREATE, EDIT, REPLY 모드를 discriminated union으로 표현",
    "모드별 필수 props가 달라지는 UI를 타입 안정적으로 구현",
  ], 6.55, 1.62, 5.55, 3.32, { fontSize: 14.1, space: 13 });
  compactCallout(slide, 6.55, 5.12, 5.55, 1.05, "성장 포인트", "TypeScript를 단순 annotation이 아니라 컴포넌트 상태 설계 도구로 활용했습니다.", C.teal);
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "상태 관리 전략", "서버 상태와 클라이언트 상태를 분리");
  card(slide, 0.92, 1.56, 5.35, 2.05, "React Query", "게시글, 댓글, 프로필처럼 서버에서 가져오고 동기화해야 하는 데이터 관리\n\n조회, mutation, cache update, refetch 전략 담당", C.sky);
  card(slide, 7.02, 1.56, 5.35, 2.05, "Zustand", "모달, 세션, 테마처럼 브라우저 안에서 유지되는 UI/클라이언트 상태 관리\n\n화면 전역에서 필요한 작은 상태를 단순하게 공유", C.teal);
  bullets(slide, [
    "서버 상태를 전역 store에 직접 넣지 않아 stale data 가능성을 줄임",
    "UI 상태는 Zustand로 단순하게 관리해 컴포넌트 간 prop drilling 완화",
    "기능별 hook과 store를 분리해 관심사를 명확하게 유지",
  ], 1.05, 4.45, 10.7, 1.18, { fontSize: 13 });
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "트러블슈팅과 의사결정", "구현 과정에서 마주친 문제를 구조로 해결");
  card(slide, 0.8, 1.42, 3.75, 3.7, "이미지 업로드 실패", "문제\n게시글은 생성됐지만 이미지 업로드가 실패하면 불완전한 데이터가 남을 수 있음\n\n해결\n업로드 실패 시 생성된 게시글을 삭제하고 에러를 다시 던져 사용자에게 실패 피드백 제공", C.red);
  card(slide, 4.82, 1.42, 3.75, 3.7, "좋아요 반응 지연", "문제\n서버 응답 이후에만 UI를 바꾸면 SNS 상호작용이 답답하게 느껴짐\n\n해결\noptimistic update로 먼저 UI를 바꾸고 실패 시 이전 캐시로 롤백", C.amber);
  card(slide, 8.84, 1.42, 3.75, 3.7, "댓글 캐시 동기화", "문제\n댓글 작성 후 전체 목록을 다시 가져오면 불필요한 네트워크 요청 발생\n\n해결\n생성된 댓글과 profile 데이터를 결합해 comment cache에 직접 반영", C.teal);
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "프로젝트를 통해 얻은 핵심 역량", "이력서와 면접에서 연결하기 좋은 성장 포인트");
  bullets(slide, [
    "React 컴포넌트를 기능 단위로 분리하고 UI와 비즈니스 로직의 책임을 나누는 설계 경험",
    "TypeScript로 API 응답, 컴포넌트 props, mutation callback의 타입 안정성 확보",
    "React Query를 활용한 서버 상태 관리, 캐시 업데이트, 무효화, optimistic update 경험",
    "Supabase Auth, Database, Storage, RPC를 연결해 실제 서비스 흐름 구현",
    "비동기 작업 실패와 데이터 일관성을 고려한 예외 처리 및 롤백 설계",
  ], 0.92, 1.55, 11.45, 3.25, { fontSize: 13.2, space: 12 });
  card(slide, 1.2, 5.25, 10.95, 0.82, "한 줄 요약", "사용자의 액션이 UI, 서버 데이터, 캐시 상태에 어떻게 반영되어야 하는지 설계하고 구현한 프로젝트입니다.", C.green);
  addFooter(slide, n++);
}

{
  const slide = pptx.addSlide();
  title(slide, "향후 개선 방향", "서비스 완성도를 높이기 위한 다음 단계");
  const improvements = [
    ["알림 기능", "좋아요와 댓글 발생 시 notification 테이블과 실시간 구독으로 알림 제공"],
    ["테스트", "mutation hook과 주요 사용자 플로우에 대한 테스트 추가"],
    ["접근성", "버튼 aria-label, 키보드 포커스, 폼 에러 메시지 개선"],
    ["성능", "이미지 최적화, skeleton UI, query prefetch 전략 도입"],
  ];
  improvements.forEach(([h, b], i) => {
    const x = 0.9 + (i % 2) * 6.0;
    const y = 1.55 + Math.floor(i / 2) * 1.9;
    card(slide, x, y, 5.3, 1.3, h, b, [C.teal, C.sky, C.amber, C.green][i]);
  });
  slide.addText("Q&A", { x: 5.58, y: 6.05, w: 2.2, h: 0.35, fontSize: 18, bold: true, color: C.ink, align: "center", margin: 0 });
  addFooter(slide, n++);
}

pptx.writeFile({ fileName: outPath });
