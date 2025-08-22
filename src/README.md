# 프로젝트 폴더 구조 가이드

## 📁 정리된 폴더 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트들
│   ├── common/          # 전역적으로 사용되는 기본 컴포넌트
│   ├── layout/          # 레이아웃 관련 컴포넌트
│   ├── recruiting/      # 리쿠르팅 도메인 컴포넌트
│   └── index.js         # 컴포넌트 통합 내보내기
│
├── features/            # 기능별 컴포넌트 (도메인 특화)
│   ├── admin/          # 관리자 기능 컴포넌트
│   ├── auth/           # 인증 관련 컴포넌트
│   └── recruiting/     # 리쿠르팅 기능 컴포넌트
│
├── hooks/              # 커스텀 훅들 (새로운 아키텍처)
│   ├── business/       # 비즈니스 로직 훅
│   ├── evaluation/     # 평가 관련 훅
│   ├── state/          # 상태 관리 훅
│   ├── legacy/         # 기존 훅들 (하위 호환성)
│   └── index.js        # 훅 통합 내보내기
│
├── services/           # API 및 외부 서비스
│   ├── api/           # API 도메인별 분리
│   └── *.js           # 기타 서비스들
│
├── contexts/          # React Context 들
├── constants/         # 상수 정의
├── utils/            # 유틸리티 함수들
├── styles/           # 글로벌 스타일
└── pages/            # 페이지 컴포넌트들
```

## 🔧 사용 가이드

### 컴포넌트 import
```javascript
// 개별 import
import { Button, Modal } from '@/components';

// 또는 직접 import
import Button from '@/components/common/Button';
```

### 훅 import
```javascript
// 새로운 아키텍처 사용 (권장)
import { useModalStates, useLoadingStates } from '@/hooks';

// 기존 훅 사용 (레거시)
import { useStateManagement } from '@/hooks/legacy/useStateManagement';
```

### API 서비스 import
```javascript
import { googleFormsAPI, applicationsAPI } from '@/services/api';
```

## 📋 마이그레이션 가이드

### 기존 → 새로운 훅 구조
- `useStateManagement` → `business/` + `state/` 훅들 조합
- `useEvaluationData` → `evaluation/` 훅들 조합
- `useModalManagement` → `state/useModalStates`

### 폴더 변경사항
- `components/ui/` → `components/common/` 통합
- 중복 컴포넌트 제거 (Pagination)
- 기존 훅들 `hooks/legacy/`로 이동