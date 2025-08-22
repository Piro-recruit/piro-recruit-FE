# CSS 명명 규칙 가이드

## 기본 원칙

### 1. BEM 기반 명명 (Block__Element--Modifier)
```css
.component-name {}           /* Block */
.component-name__element {}  /* Element */
.component-name--modifier {} /* Modifier */
```

### 2. 컴포넌트별 Prefix 사용
- 각 컴포넌트는 고유한 prefix를 가짐
- kebab-case 사용
- 최대 3단어까지 권장

## 카테고리별 명명 규칙

### 공통 컴포넌트 (common/)
```css
.btn {}                    /* 간단한 이름 허용 */
.modal {}
.pagination {}
.error-indicator {}
```

### 레이아웃 컴포넌트 (layout/)
```css
.header {}
.footer {}
.hero-section {}
.navigation-header {}
```

### 페이지별 컴포넌트 (pages/)
```css
/* AdminLogin */
.login-form {}
.login-form__input {}
.login-form--loading {}

/* Main */
.categories-section {}
.contact-section {}
.info-section {}

/* RecruitingDetail */
.recruiting-header {}
.recruiting-info {}
.applicant-list {}
```

### 도메인 컴포넌트 (recruiting/)
```css
/* applicant/ */
.applicant-card {}
.applicant-card__header {}
.applicant-card__content {}
.applicant-card--expanded {}

.applicant-filters {}
.applicant-modal {}

/* evaluation/ */
.evaluation-form {}

/* stats/ */
.stats-section {}
```

## 현재 상태 vs 권장 상태

### ❌ 현재 (일관성 부족)
```css
.btn                           /* 짧음 */
.main-page-categories          /* 매우 긺 */
.applicant-controls            /* 중간 */
```

### ✅ 권장 (일관성 있음)
```css
.btn                           /* 공통: 간단 허용 */
.categories-section            /* 페이지: 적절한 길이 */
.applicant-filters             /* 도메인: 기능 중심 */
```

## 우선순위

### Phase 1: 즉시 적용 (새 컴포넌트)
- 새로 만드는 모든 컴포넌트는 이 규칙 적용

### Phase 2: 점진적 개선 (기존 컴포넌트)
- 수정이 필요한 컴포넌트부터 순차적으로 적용
- 너무 긴 클래스명 우선 수정

### Phase 3: 전체 통일 (장기)
- 모든 기존 컴포넌트를 새 규칙으로 변경