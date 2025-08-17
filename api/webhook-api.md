# Webhook Application API 문서

## 개요
Google Forms에서 전송된 지원서 데이터를 처리하는 Webhook API입니다. Spring Boot 애플리케이션에서 구글 폼의 제출 데이터를 받아 저장하고, 다양한 조회 및 상태 관리 기능을 제공합니다.

## 기본 정보
- **Base URL**: `/api/webhook/applications`
- **인증**: JWT 인증 필요 (일부 엔드포인트 제외)
- **응답 형식**: `ApiRes<T>` 표준 응답 형태

## 데이터 모델

### WebhookApplicationRequest
```java
{
  "formId": "string (required)",          // 구글 폼 ID
  "applicantName": "string (required)",   // 지원자 이름
  "applicantEmail": "string (required)",  // 지원자 이메일 (유효한 이메일 형식)
  "formResponseId": "string (required)",  // 구글 폼 응답 ID
  "submissionTimestamp": "datetime",      // 제출 시간
  "formData": {}                          // 폼 데이터 (JSON 객체)
}
```

### WebhookApplicationResponse
```java
{
  "id": "number",                    // 지원서 ID
  "googleFormId": "number",          // 구글 폼 엔티티 ID
  "formId": "string",                // 구글 폼 ID
  "formTitle": "string",             // 폼 제목
  "applicantName": "string",         // 지원자 이름
  "applicantEmail": "string",        // 지원자 이메일
  "formResponseId": "string",        // 폼 응답 ID
  "submissionTimestamp": "datetime", // 제출 시간
  "formData": {},                    // 폼 데이터
  "status": "string",                // 처리 상태 (PENDING, COMPLETED, FAILED)
  "errorMessage": "string",          // 오류 메시지
  "aiAnalysis": {},                  // AI 분석 결과
  "createdAt": "datetime",           // 생성 시간
  "updatedAt": "datetime"            // 수정 시간
}
```

### ProcessingStatus
- `PENDING`: 처리 대기 상태
- `COMPLETED`: 처리 완료 상태
- `FAILED`: 처리 실패 상태

## API 엔드포인트

### 1. 웹훅 지원서 수신
```http
POST /api/webhook/applications/receive
```
구글 폼에서 전송된 지원서 데이터를 받아 저장합니다.

**Request Body:**
```json
{
  "formId": "1FAIpQLSe...",
  "applicantName": "홍길동",
  "applicantEmail": "hong@example.com",
  "formResponseId": "2_ABaOnue...",
  "submissionTimestamp": "2024-01-15T10:30:00",
  "formData": {
    "질문1": "답변1",
    "질문2": "답변2"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "applicantName": "홍길동",
    "status": "PENDING",
    // ... 기타 필드
  },
  "message": "지원서가 성공적으로 저장되었습니다.",
  "status": 201
}
```

### 2. 전체 지원서 조회
```http
GET /api/webhook/applications
```
저장된 모든 지원서를 최신순으로 조회합니다.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "applicantName": "홍길동",
      // ... 지원서 정보
    }
  ],
  "message": "2개의 지원서를 조회했습니다."
}
```

### 3. 구글 폼별 지원서 조회
```http
GET /api/webhook/applications/google-form/{googleFormId}
```
특정 구글 폼의 모든 지원서를 조회합니다.

**Parameters:**
- `googleFormId` (path): 구글 폼 엔티티 ID

### 4. 폼 ID별 지원서 조회
```http
GET /api/webhook/applications/form-id/{formId}
```
특정 폼 ID의 모든 지원서를 조회합니다.

**Parameters:**
- `formId` (path): 구글 폼 식별자

### 5. 특정 지원서 조회
```http
GET /api/webhook/applications/{id}
```
ID를 기준으로 특정 지원서를 조회합니다.

**Parameters:**
- `id` (path): 지원서 ID

### 6. 이메일로 지원서 조회
```http
GET /api/webhook/applications/by-email?email={email}
```
이메일을 기준으로 지원서를 조회합니다.

**Parameters:**
- `email` (query): 지원자 이메일

### 7. 구글 폼별 + 이메일로 지원서 조회
```http
GET /api/webhook/applications/google-form/{googleFormId}/by-email?email={email}
```
특정 구글 폼에서 이메일을 기준으로 지원서를 조회합니다.

### 8. 폼 ID별 + 이메일로 지원서 조회
```http
GET /api/webhook/applications/form-id/{formId}/by-email?email={email}
```
특정 폼 ID에서 이메일을 기준으로 지원서를 조회합니다.

### 9. 처리 상태별 지원서 조회
```http
GET /api/webhook/applications/by-status?status={status}
```
처리 상태를 기준으로 지원서를 조회합니다.

**Parameters:**
- `status` (query): 처리 상태 (PENDING, COMPLETED, FAILED)

### 10. 구글 폼별 + 상태별 지원서 조회
```http
GET /api/webhook/applications/google-form/{googleFormId}/by-status?status={status}
```
특정 구글 폼에서 처리 상태를 기준으로 지원서를 조회합니다.

## 지원서 제출 확인 API

### 11. 지원서 제출 여부 확인
```http
GET /api/webhook/applications/check?email={email}
```
이메일을 기준으로 지원서 제출 여부를 확인합니다.

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "hong@example.com",
    "submitted": true,
    "status": "submitted"
  }
}
```

### 12. 구글 폼별 지원서 제출 여부 확인
```http
GET /api/webhook/applications/google-form/{googleFormId}/check?email={email}
```

### 13. 폼 ID별 지원서 제출 여부 확인
```http
GET /api/webhook/applications/form-id/{formId}/check?email={email}
```

## 통계 및 개수 조회 API

### 14. 대기 중인 지원서 개수 조회
```http
GET /api/webhook/applications/pending-count
```
처리 대기 중인 지원서의 개수를 조회합니다.

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingCount": 5,
    "message": "처리 대기 중인 지원서 5개"
  }
}
```

### 15. 구글 폼별 지원서 개수 조회
```http
GET /api/webhook/applications/google-form/{googleFormId}/count
```

### 16. 폼 ID별 지원서 개수 조회
```http
GET /api/webhook/applications/form-id/{formId}/count
```

### 17. 상태별 통계 조회
```http
GET /api/webhook/applications/statistics
```
전체 지원서의 상태별 통계를 조회합니다.

**Response:**
```json
{
  "success": true,
  "data": {
    "PENDING": 3,
    "COMPLETED": 10,
    "FAILED": 1
  },
  "message": "상태별 통계를 조회했습니다."
}
```

### 18. 구글 폼별 상태별 통계 조회
```http
GET /api/webhook/applications/google-form/{googleFormId}/statistics
```

## 테스트 API

### 19. 웹훅 연결 테스트
```http
POST /api/webhook/applications/test
```
Apps Script와의 연결을 테스트하기 위한 엔드포인트입니다.

**Request Body (선택사항):**
```json
{
  "test": "data"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "message": "웹훅 연결이 정상적으로 작동합니다.",
    "timestamp": 1642234567890,
    "receivedData": {}
  },
  "message": "웹훅 테스트 성공"
}
```

## 에러 코드
- `WEBHOOK_APPLICATION_NOT_FOUND`: 지원서를 찾을 수 없음

## 주요 특징
1. **유연한 폼 데이터**: JSON 형태로 다양한 폼 필드를 저장
2. **중복 방지**: 구글 폼 ID + 이메일 조합으로 중복 지원 방지
3. **상태 관리**: 지원서 처리 상태 추적
4. **AI 분석 지원**: 향후 AI 기반 지원서 분석 결과 저장
5. **다양한 조회 옵션**: 폼별, 이메일별, 상태별 등 다양한 조건으로 조회 가능

## 사용 예시

### Google Apps Script에서 웹훅 전송
```javascript
function onFormSubmit(e) {
  const formResponse = e.response;
  const itemResponses = formResponse.getItemResponses();
  
  const formData = {};
  itemResponses.forEach(item => {
    formData[item.getItem().getTitle()] = item.getResponse();
  });
  
  const payload = {
    formId: e.source.getId(),
    applicantName: formData['이름'],
    applicantEmail: formData['이메일'],
    formResponseId: formResponse.getId(),
    submissionTimestamp: new Date().toISOString(),
    formData: formData
  };
  
  UrlFetchApp.fetch('https://your-api.com/api/webhook/applications/receive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  });
}
```