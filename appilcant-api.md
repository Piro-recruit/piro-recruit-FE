구글 폼별 지원서 일괄 상태 변경 API 명세서

  개요

  특정 구글 폼의 지원자들 중 평가 점수 기준 상위/하위 N명의 합격 상태를 일괄 변경하는 API입니다. Root 관리자 권한이 필요합니다.

  API 엔드포인트

  1. 구글 폼별 점수 상위 N명 상태 변경

  POST /api/webhook/applications/google-form/{googleFormId}/bulk-status

  특정 구글 폼의 평가 점수 상위 N명의 지원서 합격 상태를 일괄 변경합니다.

  권한

  - @RequireRoot - Root 관리자 권한 필요

  경로 파라미터

  | 파라미터         | 타입   | 필수  | 설명      | 예시  |
  |--------------|------|-----|---------|-----|
  | googleFormId | Long | ✅   | 구글 폼 ID | 1   |

  요청 파라미터

  | 파라미터       | 타입      | 필수  | 설명          | 예시         |
  |------------|---------|-----|-------------|------------|
  | topN       | Integer | ✅   | 변경할 상위 인원 수 | 20         |
  | passStatus | String  | ✅   | 변경할 합격 상태   | FIRST_PASS |

  선택 기준

  - 대상: 해당 구글 폼의 지원서 중 평균 점수(averageScore)가 존재하고 평가 개수(evaluationCount) > 0인 지원서만
  - 정렬: 평균 점수 내림차순 (ORDER BY averageScore DESC)
  - 선택: 정렬된 결과에서 상위 N개 선택 (즉, 점수가 가장 높은 N명)

  2. 구글 폼별 점수 하위 N명 상태 변경

  POST /api/webhook/applications/google-form/{googleFormId}/bulk-status-bottom

  특정 구글 폼의 평가 점수 하위 N명의 지원서 합격 상태를 일괄 변경합니다.

  권한

  - @RequireRoot - Root 관리자 권한 필요

  경로 파라미터

  | 파라미터         | 타입   | 필수  | 설명      | 예시  |
  |--------------|------|-----|---------|-----|
  | googleFormId | Long | ✅   | 구글 폼 ID | 1   |

  요청 파라미터

  | 파라미터       | 타입      | 필수  | 설명          | 예시     |
  |------------|---------|-----|-------------|--------|
  | bottomN    | Integer | ✅   | 변경할 하위 인원 수 | 10     |
  | passStatus | String  | ✅   | 변경할 합격 상태   | FAILED |

  선택 기준

  - 대상: 해당 구글 폼의 지원서 중 평균 점수(averageScore)가 존재하고 평가 개수(evaluationCount) > 0인 지원서만
  - 정렬: 평균 점수 오름차순 (ORDER BY averageScore ASC)
  - 선택: 정렬된 결과에서 상위 N개 선택 (즉, 점수가 가장 낮은 N명)

  공통 사항

  요청 헤더

  Authorization: Bearer {JWT_TOKEN}

  합격 상태 값

  | 상태         | 설명     | CSV 값 | 주요 사용 케이스  |
  |------------|--------|-------|------------|
  | PENDING    | 대기중/미정 | 0     | 상태 초기화     |
  | FAILED     | 불합격    | 0     | 하위권 불합격 처리 |
  | FIRST_PASS | 1차 합격  | 1     | 상위권 1차 통과  |
  | FINAL_PASS | 최종 합격  | 2     | 최종 합격자 선정  |

  응답 형식

  성공 응답

  HTTP Status: 200 OK

  {
    "success": true,
    "data": [
      {
        "id": 25,
        "applicantName": "김우수",
        "applicantEmail": "top@example.com",
        "school": "서울대학교",
        "department": "컴퓨터공학과",
        "grade": "3학년",
        "major": "전공자",
        "phoneNumber": "010-1234-5678",
        "formResponseId": "response_top_001",
        "submissionTimestamp": "2024-01-15T14:30:00",
        "status": "COMPLETED",
        "passStatus": "FIRST_PASS",
        "averageScore": 92.5,
        "evaluationCount": 4,
        "homepageUserId": 1025,
        "googleFormId": 1,
        "createdAt": "2024-01-15T14:30:00",
        "updatedAt": "2024-01-16T15:45:00"
      },
      {
        "id": 18,
        "applicantName": "박최고",
        "applicantEmail": "excellent@example.com",
        "school": "KAIST",
        "department": "전산학부",
        "grade": "4학년",
        "major": "전공자",
        "phoneNumber": "010-2345-6789",
        "formResponseId": "response_top_002",
        "submissionTimestamp": "2024-01-12T11:20:00",
        "status": "COMPLETED",
        "passStatus": "FIRST_PASS",
        "averageScore": 89.3,
        "evaluationCount": 3,
        "homepageUserId": 1018,
        "googleFormId": 1,
        "createdAt": "2024-01-12T11:20:00",
        "updatedAt": "2024-01-16T15:45:00"
      }
    ],
    "message": "구글 폼 1의 상위 20명의 지원서 상태가 FIRST_PASS로 변경되었습니다.",
    "status": 200,
    "code": "SUCCESS",
    "time": "2024-01-16T15:45:30"
  }

  오류 응답

  HTTP Status: 400 Bad Request - 잘못된 파라미터
  {
    "success": false,
    "data": null,
    "message": "topN 파라미터는 필수입니다",
    "status": 400,
    "code": "VALIDATION_ERROR",
    "time": "2024-01-16T15:45:30"
  }

  HTTP Status: 401 Unauthorized - 인증 필요
  {
    "success": false,
    "data": null,
    "message": "인증이 필요합니다",
    "status": 401,
    "code": "UNAUTHORIZED",
    "time": "2024-01-16T15:45:30"
  }

  HTTP Status: 403 Forbidden - 권한 부족
  {
    "success": false,
    "data": null,
    "message": "Root 권한이 필요합니다",
    "status": 403,
    "code": "ACCESS_DENIED",
    "time": "2024-01-16T15:45:30"
  }

  HTTP Status: 404 Not Found - 구글 폼 없음
  {
    "success": false,
    "data": null,
    "message": "구글 폼을 찾을 수 없습니다",
    "status": 404,
    "code": "GOOGLE_FORM_NOT_FOUND",
    "time": "2024-01-16T15:45:30"
  }

  사용 예시

  1. 25기 상위 20명을 1차 합격 처리

  curl -X POST "http://localhost:8080/api/webhook/applications/google-form/1/bulk-status?topN=20&passStatus=FIRST_PASS" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

  2. 25기 하위 15명을 불합격 처리

  curl -X POST "http://localhost:8080/api/webhook/applications/google-form/1/bulk-status-bottom?bottomN=15&passStatus=FAILED" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

  3. 26기 상위 10명을 최종 합격 처리

  curl -X POST "http://localhost:8080/api/webhook/applications/google-form/2/bulk-status?topN=10&passStatus=FINAL_PASS" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

  4. JavaScript fetch 예시 - 상위 N명 1차 합격

  const updateTopNToFirstPass = async (googleFormId, topN) => {
    try {
      const response = await fetch(`/api/webhook/applications/google-form/${googleFormId}/bulk-status?topN=${topN}&passStatus=FIRST_PASS`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      const result = await response.json();

      if (result.success) {
        console.log(`구글 폼 ${googleFormId}의 상위 ${result.data.length}명이 1차 합격 처리되었습니다.`);

        // 점수 순으로 정렬된 결과 출력
        result.data.forEach((app, index) => {
          console.log(`${index + 1}위: ${app.applicantName} (${app.averageScore}점)`);
        });
      } else {
        console.error('처리 실패:', result.message);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
    }
  };

  // 사용 예시
  updateTopNToFirstPass(1, 20); // 25기 상위 20명 1차 합격

  5. JavaScript fetch 예시 - 하위 N명 불합격

  const updateBottomNToFailed = async (googleFormId, bottomN) => {
    const confirmMessage = `정말로 구글 폼 ${googleFormId}의 하위 ${bottomN}명을 불합격 처리하시겠습니까?`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/webhook/applications/google-form/${googleFormId}/bulk-status-bottom?bottomN=${bottomN}&passStatus=FAILED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      const result = await response.json();

      if (result.success) {
        console.log(`구글 폼 ${googleFormId}의 하위 ${result.data.length}명이 불합격 처리되었습니다.`);

        // 낮은 점수 순으로 출력
        result.data.forEach((app, index) => {
          console.log(`${app.applicantName}: ${app.averageScore}점 -> 불합격`);
        });
      } else {
        console.error('처리 실패:', result.message);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
    }
  };

  // 사용 예시
  updateBottomNToFailed(1, 10); // 25기 하위 10명 불합격

  실제 운영 시나리오

  시나리오 1: 1차 전형 결과 발표

  # 1단계: 25기 상위 30명 1차 합격 처리
  POST /api/webhook/applications/google-form/1/bulk-status?topN=30&passStatus=FIRST_PASS

  # 2단계: 25기 하위 20명 불합격 처리
  POST /api/webhook/applications/google-form/1/bulk-status-bottom?bottomN=20&passStatus=FAILED

  # 3단계: 나머지는 대기 상태 유지 (별도 처리 불필요)

  시나리오 2: 최종 합격자 선정

  # 1차 합격자 중 상위 15명 최종 합격 처리
  POST /api/webhook/applications/google-form/1/bulk-status?topN=15&passStatus=FINAL_PASS

  시나리오 3: 재평가 후 상태 조정

  # 하위 5명을 다시 대기 상태로 변경 (재평가 목적)
  POST /api/webhook/applications/google-form/1/bulk-status-bottom?bottomN=5&passStatus=PENDING

  주의사항

  1. 구글 폼 단위 처리: 각 API는 지정된 구글 폼 내의 지원자들만 대상으로 합니다.
  2. 평가 완료 지원서만: 평가 점수가 없는 지원서는 대상에서 제외됩니다.
  3. Root 권한 필수: 일반 관리자는 사용할 수 없습니다.
  4. 트랜잭션 보장: 모든 지원서가 성공적으로 변경되거나 전체 롤백됩니다.
  5. N > 대상 개수: 요청한 N이 평가된 지원서 수보다 크면 실제 존재하는 모든 지원서를 처리합니다.
  6. 빈 결과: 해당 구글 폼에 평가된 지원서가 없으면 빈 배열을 반환합니다.

  관련 API

  조회용 API들

  - GET /api/webhook/applications/google-form/{googleFormId} - 구글 폼별 전체 지원자 조회
  - GET /api/webhook/applications/google-form/{googleFormId}/by-pass-status - 구글 폼별 합격 상태별 조회
  - GET /api/webhook/applications/google-form/{googleFormId}/pass-statistics - 구글 폼별 합격 통계

  기타 상태 변경 API들

  - POST /api/webhook/applications/{id}/status - 개별 지원서 상태 변경
  - POST /api/webhook/applications/batch-status - 지정된 ID 목록 일괄 변경
