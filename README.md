# Animal Log

Animal Log는 동물 친구들의 일상을 기록하고 공유하는 SNS 서비스입니다. 사용자는 계정을 만들고, 게시글과 이미지를 올리고, 다른 사용자의 글에 좋아요와 댓글을 남기며, 프로필 페이지에서 자신의 활동과 소개를 관리할 수 있습니다.

## 주요 기능

- 이메일/비밀번호 기반 회원가입 및 로그인
- OAuth 로그인 연동 구조
- 비밀번호 재설정 메일 발송 및 비밀번호 변경
- 게시글 작성, 수정, 삭제
- 게시글 이미지 업로드
- 무한 스크롤 기반 게시글 피드
- 게시글 좋아요 토글
- 게시글 상세 페이지와 댓글/대댓글 작성
- 댓글 수정 및 삭제
- 사용자 프로필 조회
- 닉네임, 소개글, 아바타 이미지 수정
- 라이트/다크 테마 전환
- 인증 상태에 따른 게스트/회원 전용 라우팅

## 기술 스택

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Supabase Auth, Database, Storage
- Tailwind CSS
- Radix UI
- lucide-react

## 프로젝트 구조

```text
src/
  api/                 Supabase와 통신하는 API 함수
  assets/              로고, 기본 이미지 등 정적 에셋
  components/          공통 UI, 레이아웃, 게시글/댓글/프로필 컴포넌트
  hooks/               TanStack Query 기반 query/mutation 훅
  lib/                 Supabase 클라이언트, 상수, 유틸리티
  pages/               라우트 단위 페이지
  provider/            세션, 모달 등 전역 Provider
  store/               Zustand 전역 상태
  database.types.ts    Supabase 타입 생성 결과
supabase/
  config.toml          Supabase 로컬/프로젝트 설정
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 Supabase 프로젝트 정보를 설정합니다.

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_PUBLIC_URL=http://localhost:5173
```

### 3. 개발 서버 실행

```bash
npm run dev
```

기본 개발 서버는 Vite 설정에 따라 로컬 주소에서 실행됩니다.

## 사용 가능한 스크립트

```bash
npm run dev       # 개발 서버 실행
npm run build     # TypeScript 빌드 및 Vite 프로덕션 빌드
npm run lint      # ESLint 검사
npm run preview   # 프로덕션 빌드 미리보기
npm run type-gen  # Supabase public schema 타입 생성
```

## 데이터와 인증

Animal Log는 Supabase를 백엔드로 사용합니다.

- `auth`: 사용자 회원가입, 로그인, OAuth, 비밀번호 재설정
- `profile`: 사용자 닉네임, 소개글, 아바타 관리
- `post`: 게시글 본문과 이미지 URL 관리
- `comment`: 게시글 댓글과 대댓글 관리
- `like`: 게시글 좋아요 상태 관리
- `uploads` bucket: 게시글 이미지와 프로필 이미지 저장

클라이언트는 `src/lib/supabase.ts`에서 생성하며, 환경 변수의 Supabase URL과 publishable key를 사용합니다.

## 라우팅

- `/sign-in`: 로그인
- `/sign-up`: 회원가입
- `/forget-password`: 비밀번호 재설정 메일 요청
- `/`: 게시글 피드
- `/post/:postId`: 게시글 상세
- `/profile/:userId`: 사용자 프로필
- `/reset-password`: 새 비밀번호 설정

게스트 전용 페이지와 회원 전용 페이지는 각각 `GuestOnlyLayout`, `MemberOnlyLayout`에서 접근을 제어합니다.

## 개발 메모

- 서버 상태는 TanStack Query로 관리합니다.
- 모달, 세션, 테마 같은 클라이언트 상태는 Zustand store로 분리되어 있습니다.
- Supabase 타입은 `npm run type-gen`으로 갱신할 수 있습니다.
- 이미지 업로드는 Supabase Storage의 `uploads` bucket을 사용합니다.
