# 컴포넌트 아키텍처 가이드

## 전체 구조

```
src/components/
├── admin/           # 관리자 전용 컴포넌트
├── auth/           # 인증 관련 컴포넌트
├── common/         # 공통 UI 컴포넌트
├── layout/         # 레이아웃 컴포넌트
├── recruiting/     # 리쿠르팅 도메인 컴포넌트
└── pages/          # 페이지별 전용 컴포넌트
```

## 분류 기준

### 1. 공통 컴포넌트 (common/)
**목적**: 전체 앱에서 재사용되는 기본 UI 컴포넌트
**특징**:
- 비즈니스 로직과 무관한 순수 UI 컴포넌트
- 다양한 페이지와 기능에서 재사용
- 일반적이고 범용적인 기능

**포함 컴포넌트**:
- Button, Modal, Pagination
- LoadingIndicator, ErrorIndicator
- DeleteConfirmModal

**추가 기준**:
- ✅ 3개 이상의 서로 다른 기능에서 사용
- ✅ 비즈니스 로직이 포함되지 않음
- ✅ props로만 동작이 결정됨

### 2. 레이아웃 컴포넌트 (layout/)
**목적**: 앱의 전체적인 레이아웃과 구조를 담당
**특징**:
- 페이지의 전체적인 틀을 제공
- 네비게이션, 헤더, 푸터 등

**포함 컴포넌트**:
- Header, Footer, NavigationHeader
- HeroSection

**추가 기준**:
- ✅ 페이지의 구조적 요소
- ✅ 여러 페이지에서 공통으로 사용
- ✅ 전체 앱의 일관성을 위한 컴포넌트

### 3. 도메인 컴포넌트 (recruiting/)
**목적**: 특정 도메인(리쿠르팅)과 관련된 재사용 가능한 컴포넌트
**특징**:
- 도메인 지식이 포함됨
- 해당 도메인 내에서 재사용 가능
- 비즈니스 로직이 일부 포함될 수 있음

**하위 분류**:
```
recruiting/
├── applicant/      # 지원자 관련 컴포넌트
│   ├── ApplicantCard      # 지원자 카드 표시
│   ├── ApplicantFilters   # 지원자 필터링
│   └── ApplicantModal     # 지원자 상세 모달
├── evaluation/     # 평가 관련 컴포넌트
│   └── EvaluationForm     # 평가 폼
└── stats/          # 통계 관련 컴포넌트
    └── StatsSection       # 통계 표시
```

**추가 기준**:
- ✅ 리쿠르팅 도메인과 밀접한 관련
- ✅ 2개 이상의 페이지에서 사용 가능
- ✅ 도메인별 재사용성이 있음

### 4. 페이지별 컴포넌트 (pages/)
**목적**: 특정 페이지에서만 사용되는 전용 컴포넌트
**특징**:
- 해당 페이지의 특정 기능에 특화
- 재사용 가능성이 낮음
- 페이지별 비즈니스 로직 포함

**하위 분류**:
```
pages/
├── AdminLogin/           # 관리자 로그인 페이지
│   └── LoginForm
├── Main/                 # 메인 페이지
│   ├── CategoriesSection
│   ├── ContactSection
│   └── InfoSection
├── RecruitingDetail/     # 리쿠르팅 상세 페이지
│   ├── detail/          # 페이지 핵심 컴포넌트
│   └── modals/          # 페이지 전용 모달
└── RecruitingManagement/ # 리쿠르팅 관리 페이지
    ├── [메인 컴포넌트들]
    └── modals/          # 페이지 전용 모달
```

**추가 기준**:
- ✅ 특정 페이지에서만 사용
- ✅ 페이지별 특화 기능
- ✅ 재사용 가능성이 낮음

### 5. 기능별 컴포넌트 (admin/, auth/)
**목적**: 특정 기능 영역의 컴포넌트
**특징**:
- 특정 사용자 그룹이나 기능에 특화
- 해당 영역에서만 사용

**admin/**: 관리자 전용 컴포넌트
- AdminHeader: 관리자 페이지 헤더

**auth/**: 인증 관련 컴포넌트
- ProtectedRoute: 인증이 필요한 라우트 보호

## 컴포넌트 배치 결정 플로우

```
새 컴포넌트 생성 시 질문:

1. 전체 앱에서 3개 이상 사용?
   YES → common/

2. 레이아웃/구조적 요소?
   YES → layout/

3. 리쿠르팅 도메인 관련?
   YES → recruiting/
   ├── 지원자 관련? → recruiting/applicant/
   ├── 평가 관련? → recruiting/evaluation/
   └── 통계 관련? → recruiting/stats/

4. 관리자 전용?
   YES → admin/

5. 인증 관련?
   YES → auth/

6. 특정 페이지 전용?
   YES → pages/[PageName]/
```

## 폴더 구조 규칙

### 단일 컴포넌트
```
ComponentName.jsx
ComponentName.css
```

### 복잡한 컴포넌트 (하위 컴포넌트 있음)
```
ComponentName/
├── ComponentName.jsx
├── ComponentName.css
├── SubComponent.jsx
├── SubComponent.css
└── index.js
```

### 카테고리 폴더
```
Category/
├── Component1.jsx
├── Component1.css
├── Component2.jsx
├── Component2.css
└── index.js
```

## index.js 파일 규칙

### 모든 폴더에 index.js 필수
- 깔끔한 import 경로 제공
- 컴포넌트 의존성 관리

### export 방식
```javascript
// 개별 export (권장)
export { default as ComponentName } from './ComponentName';

// 전체 export (카테고리 폴더)
export * from './subfolder';
```

## 마이그레이션 가이드

### 기존 컴포넌트 이동 시 체크리스트
1. [ ] 사용처 파악 (얼마나 많은 곳에서 사용?)
2. [ ] 도메인 관련성 확인
3. [ ] 재사용 가능성 평가
4. [ ] import 경로 업데이트
5. [ ] index.js 파일 업데이트
6. [ ] 테스트 실행

### 새 컴포넌트 생성 시 체크리스트
1. [ ] 위치 결정 플로우 따르기
2. [ ] 적절한 명명 규칙 사용
3. [ ] CSS 클래스명 규칙 따르기
4. [ ] index.js 파일 업데이트
5. [ ] 문서화 (필요시)

이 가이드를 따르면 일관성 있고 확장 가능한 컴포넌트 구조를 유지할 수 있습니다.