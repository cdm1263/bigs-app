# BIGS 게시판 애플리케이션

## 프로젝트 구조

```
bigs-app/
├── app/                      # Next.js App Router
│   ├── actions/             # Server Actions
│   │   ├── auth.ts         # 인증 관련 액션
│   │   └── boards.ts       # 게시판 관련 액션
│   ├── api/                # API 클라이언트 및 타입
│   │   ├── auth.ts         # 인증 API
│   │   ├── boards.ts       # 게시판 API
│   │   ├── client.ts       # Axios 인스턴스
│   │   └── types.ts        # TypeScript 타입 정의
│   ├── boards/             # 게시판 라우트
│   │   ├── [id]/          # 게시글 상세 및 수정
│   │   ├── new/           # 새 게시글 작성
│   │   ├── error.tsx      # 에러 바운더리
│   │   └── page.tsx       # 게시글 목록
│   ├── login/             # 로그인 페이지
│   ├── signup/            # 회원가입 페이지
│   ├── providers/         # React 컨텍스트 프로바이더
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── MainPageButtons.tsx
│   └── UserInfo.tsx      # 사용자 정보 표시
├── lib/                  # 유틸리티 함수
│   ├── auth.ts          # 인증 유틸리티
│   ├── schemas.ts       # Zod 스키마
│   └── utils.ts         # 공통 유틸리티
└── public/              # 정적 파일
```

## 시작하기

### 설치

1. 의존성 패키지 설치:

```bash
npm install
```

2. 개발 서버 실행:

```bash
npm run dev
```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드 및 배포

프로덕션 빌드:

```bash
npm run build
npm start
```

## 주요 기능 상세

### 인증 플로우

1. **회원가입**

   - 이메일, 이름, 비밀번호 입력
   - Zod를 통한 실시간 유효성 검사
   - 비밀번호 확인 및 강도 검증

2. **로그인**

   - JWT Access Token 및 Refresh Token 발급
   - 쿠키에 토큰 저장
   - 자동 토큰 갱신

### 게시판 기능

1. **게시글 목록**

   - 카테고리별 필터링 (URL 쿼리 기반)
   - 서버 사이드 데이터 프리페칭
   - 무한 스크롤 또는 페이지네이션

2. **게시글 작성**

   - 제목, 내용, 카테고리 선택
   - 파일 첨부 (이미지 등)
   - React Hook Form + Zod 검증
   - Mutation을 통한 API 호출

3. **게시글 수정**

   - 기존 데이터 자동 로드
   - Server Action을 통한 업데이트
   - 캐시 무효화 및 리프레시

4. **게시글 삭제**
   - 권한 확인
   - 낙관적 업데이트

### 에러 처리

- **Error Boundary**: Next.js error.tsx를 활용한 전역 에러 처리
- **인증 에러**: 자동으로 로그인 페이지로 리다이렉트
- **일반 에러**: 사용자 친화적인 에러 메시지 표시
- **폼 에러**: React Hook Form을 통한 실시간 검증 및 에러 표시

## 스타일 가이드

### 컴포넌트 구조

- **서버 컴포넌트 우선**: 기본적으로 서버 컴포넌트 사용
- **클라이언트 컴포넌트 최소화**: 인터랙션이 필요한 부분만 "use client" 사용
- **코드 분리**: 로직과 UI를 명확히 분리

### 폼 패턴

모든 폼은 동일한 패턴 사용:

- React Hook Form으로 상태 관리
- Zod로 스키마 정의 및 검증
- shadcn/ui Form 컴포넌트 사용
- 에러를 throw하여 Error Boundary에서 처리

### API 호출

- **클라이언트**: TanStack Query의 `useMutation`, `useQuery` 사용
- **서버**: Server Actions 또는 직접 API 호출
