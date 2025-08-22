# 🚀 API 서비스 구조 가이드

## 📁 새로운 도메인 기반 구조

```
api/
├── 🔧 core/                    # 핵심 유틸리티
│   └── apiClient.js           # Axios 인스턴스 & 인터셉터
│
├── 📦 domains/                # 도메인별 API 분리
│   ├── admin/                 # 👨‍💼 관리자 도메인
│   │   ├── adminAPI.js        # 관리자 권한 관리
│   │   ├── googleFormsAPI.js  # 구글폼 관리
│   │   └── index.js           # 도메인 통합 내보내기
│   │
│   ├── applications/          # 📄 지원서 도메인
│   │   ├── applicationsAPI.js # 지원서 조회/관리
│   │   ├── applicationStatusAPI.js # 지원서 상태 변경
│   │   └── index.js
│   │
│   ├── evaluation/            # ⭐ 평가 도메인
│   │   ├── evaluationAPI.js   # 평가 CRUD
│   │   ├── aiSummaryAPI.js    # AI 요약 기능
│   │   └── index.js
│   │
│   └── integration/           # 🔗 통합 도메인
│       ├── integrationAPI.js  # CSV 내보내기 등
│       └── index.js
│
├── 📚 legacy/                 # 기존 파일들
│   └── api.js                 # 구 단일 API 파일
│
└── index.js                   # 전체 API 통합 내보내기
```

## 🔥 사용 방법

### ✅ 권장 방식 (도메인별)
```javascript
// 도메인별로 필요한 API만 import
import { adminAPI } from '@/services/api/domains/admin';
import { applicationsAPI } from '@/services/api/domains/applications';
import { evaluationAPI } from '@/services/api/domains/evaluation';

// 사용
const forms = await adminAPI.getPassStatusStatistics();
const apps = await applicationsAPI.getAllApplications();
const evaluations = await evaluationAPI.createEvaluation(data);
```

### ✅ 통합 방식
```javascript
// 전체 API를 한번에 import
import { 
  adminAPI, 
  googleFormsAPI,
  applicationsAPI,
  evaluationAPI 
} from '@/services/api';
```

### ❌ 레거시 방식 (사용 금지)
```javascript
// 더 이상 사용하지 마세요
import { googleFormsAPI } from '@/services/api.js';
```

## 🏗️ 도메인 분류 기준

| 도메인 | 책임 | API 예시 |
|--------|------|----------|
| **Admin** | 관리자 권한, 구글폼 관리 | 로그인, 폼 생성/활성화 |
| **Applications** | 지원서 조회/관리 | 지원서 목록, 상태 변경 |
| **Evaluation** | 평가 시스템 | 평가 CRUD, AI 요약 |
| **Integration** | 외부 연동 | CSV 내보내기, 통계 |

## 🔧 API 클라이언트 설정

```javascript
import { apiClient } from '@/services/api';

// 커스텀 요청
const customRequest = await apiClient.get('/custom/endpoint');
```

## 📈 마이그레이션 가이드

### 기존 코드 → 새로운 구조
```javascript
// Before
import { googleFormsAPI } from '../services/api';

// After  
import { googleFormsAPI } from '@/services/api/domains/admin';
// 또는
import { googleFormsAPI } from '@/services/api';
```

## 🎯 개발 가이드라인

1. **새로운 API 추가 시**: 해당 도메인 폴더에 추가
2. **도메인 경계 모호할 때**: Integration 도메인 고려
3. **공통 유틸리티**: core 폴더에 추가
4. **기존 API 수정**: 도메인별 파일에서 직접 수정

## 🚨 주의사항

- `legacy/` 폴더의 파일들은 수정하지 마세요
- 새로운 개발에서는 도메인별 구조를 사용하세요
- API 추가 시 해당 도메인의 `index.js`에 export 추가 필수