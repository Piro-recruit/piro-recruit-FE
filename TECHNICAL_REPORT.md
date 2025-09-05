# 피로그래밍 리크루팅 관리 시스템 기술 보고서

## 📊 프로젝트 개요
- **목적**: 대학 동아리 피로그래밍의 신입 모집 및 지원자 관리 자동화
- **규모**: 100+ 파일, 35+ React 컴포넌트, 25+ API 연동
- **사용자**: 일반 사용자(지원자), 관리자(동아리 운영진)

---

## 🛠 기술 스택
- **Core**: React 19.1.0, Vite 7.0.4, Router DOM v7
- **HTTP 클라이언트**: Axios (커스텀 인터셉터)
- **UI**: Lucide React 아이콘, CSS Modules
- **개발도구**: ESLint, TypeScript 타입 정의

---

## 🏗 아키텍처
**도메인 중심 설계**: `components/`(공통/레이아웃/도메인/페이지별), `services/api/`(도메인별 모듈), `hooks/`(비즈니스/상태/평가)

**설계 철학**: 관심사 분리, 재사용성 중심, 확장 가능한 구조

---

## ⚛️ 컴포넌트 시스템
- **common/**: 3개 이상 기능에서 재사용 (Button, Modal, Pagination)
- **layout/**: 구조적 컴포넌트 (Header, Footer, HeroSection)
- **recruiting/**: 도메인 비즈니스 로직 (지원자/평가/통계/관리)
- **pages/**: 페이지별 특화 컴포넌트

**지연 로딩**: 모든 페이지 및 모달 컴포넌트 Lazy Loading 적용

---

## 🔄 상태 관리
**Context + useReducer**: 복잡한 상태 효율적 관리

**커스텀 훅**: `state/`(모달/로딩/폼), `business/`(일괄처리/CSV/이메일), `evaluation/`(AI평가/데이터조작)

**최적화**: useCallback/useMemo, 상태 지역화, 컨텍스트 분리

---

## 🌐 API 아키텍처
**도메인 기반 구조**: `core/`(HTTP 클라이언트), `domains/`(admin/applications/evaluation/integration/mail)

**핵심 기능**: 자동 JWT 토큰 관리, 포괄적 에러 처리, 401 시 자동 로그아웃, Blob 응답 처리

**응답 표준화**: `{success, data, message, status, code, time}` 일관된 형태

---

## 🔐 인증 및 권한
**다단계 보호**: ProtectedRoute(기본 인증) → AdminRoleProtectedRoute(역할별) → RecruitingDetailProtectedRoute(상태별)

**JWT 관리**: localStorage 저장, Bearer 토큰 자동 주입, 만료 시 자동 로그아웃

**권한 레벨**: ROOT > ROOT_ADMIN > MASTER > GENERAL

---

## ⚡ 성능 최적화
**Vite 빌드**: Terser 고급 압축, 수동 청크 분할(vendor/router/utils), WebP 이미지 변환

**React**: Lazy Loading(모든 페이지/모달), useCallback/useMemo 메모이제이션

**결과**: Lighthouse 100점 달성, 렌더링 차단 제거, 이미지 크기 69% 감소

---

## 🎨 CSS 아키텍처  
**모듈형 시스템**: reset/fonts/colors/utilities 글로벌 스타일 분리

**BEM 방법론**: `.component__element--modifier` 네이밍 컨벤션

**CSS 모듈화**: 컴포넌트별 CSS 파일, 논리적 모듈 분할, 반응형 패턴

---

## 🚀 주요 기능
1. **리크루팅 관리**: 구글 폼 통합, 실시간 지원자 통계, 상태별 분류
2. **AI 평가 시스템**: AI 요약 생성, 점수 시스템, 종합 평가 및 정렬  
3. **일괄 처리**: 상위/하위 N명 상태 변경, 확인 프로세스
4. **데이터 내보내기**: UTF-8 BOM 지원 CSV, 한글 깨짐 방지
5. **이메일 시스템**: 구독자 관리, 일괄 발송, 상태 추적

---

## 👨‍💻 개발 환경
**ESLint**: React hooks, refresh 플러그인, unused vars 체크

**로깅**: 개발환경 API 요청/응답 추적, 색상 구분

**에러 처리**: ErrorBoundary, 전역 에러 캐치

---

## 🌐 배포 (Netlify)
**보안**: X-Frame-Options, X-XSS-Protection, Referrer-Policy 헤더

**캐싱**: 정적 자산 1년 캐시, 적절한 Content-Type 설정

**SPA**: 모든 라우트를 index.html로 리다이렉트

---

## ✅ 코드 품질
**네이밍**: PascalCase(컴포넌트), camelCase(훅/유틸), UPPER_SNAKE_CASE(상수)

**모듈**: 인덱스 파일 패턴, 도메인별 그룹 내보내기

**타입 안전성**: JSDoc, TypeScript 타입 정의, 런타임 검증

---

## 📈 결론

### 🎯 주요 성과
- **아키텍처**: 도메인 중심 설계로 확장 가능한 구조 구축
- **성능**: Lighthouse 100점, React 19 + Vite 7 최신 스택 활용  
- **상태 관리**: Context + 커스텀 훅으로 복잡한 비즈니스 로직 효율적 관리
- **DX**: ESLint, 로깅, 에러 바운더리로 견고한 개발 환경

### 🔧 개선 권장사항
1. **테스트**: 단위/통합/E2E 테스트 추가
2. **접근성**: ARIA, 키보드 네비게이션 강화  
3. **모니터링**: 성능 및 사용자 행동 분석 도구 통합
4. **보안**: CSP 헤더, API 레이트 제한

### 💡 비즈니스 가치
관리 자동화, 확장 가능한 설계, 직관적 UX로 **대학 동아리 관리 시스템의 표준 모델** 잠재력 보유

---

*2025년 8월 작성, 지속 업데이트*