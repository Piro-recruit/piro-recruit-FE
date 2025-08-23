 🔄 GoogleForm API 변경사항 - 프론트엔드 마이그레이션 가이드

  📋 변경 개요

  GoogleForm의 상태 관리가 Boolean isActive에서 FormStatus enum으로 전면 변경되었습니다.

  변경 범위

  - ✅ 응답 필드 변경: isActive → status
  - ✅ 새로운 API: 마감 기능 추가
  - ✅ 상태 체계: 3단계 상태 관리 (ACTIVE/INACTIVE/CLOSED)
  - ✅ 비즈니스 로직: 강화된 검증 및 에러 처리

  ---
  🔍 Breaking Changes 상세 분석

  1. 응답 데이터 구조 변경

  ❌ 기존 응답

  {
    "success": true,
    "data": {
      "id": 1,
      "formId": "1A2B3C4D",
      "title": "25기 리쿠르팅",
      "isActive": true,  // ← 이 필드가 제거됨
      "generation": 25,
      // ... 기타 필드들
    }
  }

  ✅ 새로운 응답

  {
    "success": true,
    "data": {
      "id": 1,
      "formId": "1A2B3C4D",
      "title": "25기 리쿠르팅",
      "status": "ACTIVE",  // ← 새로 추가된 필드
      "generation": 25,
      // ... 기타 필드들
    }
  }

  ---
  🛠️ 프론트엔드 수정 가이드

  1. 상태 체크 로직 변경

  ❌ 기존 코드

  interface GoogleForm {
    id: number;
    title: string;
    isActive: boolean;  // 제거된 필드
    generation: number;
  }

  // 상태 체크
  if (googleForm.isActive) {
    showActiveFormUI();
  } else {
    showInactiveFormUI();
  }

  ✅ 새로운 코드

  // 새로운 타입 정의
  type FormStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

  interface GoogleForm {
    id: number;
    title: string;
    status: FormStatus;  // 새로 추가된 필드
    generation: number;
  }

  // 새로운 상태 체크
  switch (googleForm.status) {
    case 'ACTIVE':
      showActiveFormUI();
      break;
    case 'INACTIVE':
      showInactiveFormUI();
      break;
    case 'CLOSED':
      showClosedFormUI();  // 새로운 상태
      break;
  }
  ---
  🆕 새로운 API 엔드포인트

  1. 마감 API 추가

  PUT /api/google-forms/{id}/close

  JavaScript 예시

  // 새로운 마감 함수 추가
  const closeGoogleForm = async (formId) => {
    try {
      const response = await fetch(`/api/google-forms/${formId}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('마감 처리 실패');
      }

      const result = await response.json();
      console.log('마감 완료:', result.data);

      // UI 업데이트
      updateFormStatus(formId, 'CLOSED');
      showNotification('구글 폼이 마감되었습니다.');

    } catch (error) {
      console.error('마감 처리 오류:', error);
      showErrorNotification('마감 처리 중 오류가 발생했습니다.');
    }
  };

  ---
  📊 API 응답 변경사항 전체 목록

  1. 전체 구글 폼 조회 - GET /api/google-forms

  변경 전후 비교

  // 기존
  {
    "data": [
      {
        "id": 1,
        "isActive": true,
        "title": "25기 리쿠르팅"
      }
    ]
  }

  // 변경 후
  {
    "data": [
      {
        "id": 1,
        "status": "ACTIVE",  // isActive → status
        "title": "25기 리쿠르팅"
      }
    ]
  }

  2. 활성 구글 폼 조회 - GET /api/google-forms/active

  - 내부적으로 status = 'ACTIVE' 조건으로 조회
  - 응답 구조는 동일하게 status 필드 포함

  3. 구글 폼 통계 - GET /api/google-forms/{id}/statistics

  변경 전후 비교

  // 기존
  {
    "data": {
      "googleFormId": 1,
      "isActive": true,
      "statusStatistics": { ... }
    }
  }

  // 변경 후
  {
    "data": {
      "googleFormId": 1,
      "status": "ACTIVE",  // isActive → status
      "statusStatistics": { ... }
    }
  }

  ---
  🔧 프론트엔드 마이그레이션 체크리스트

  ✅ 필수 변경사항

  1. 타입/인터페이스 수정

  // 기존 타입 제거
  - isActive: boolean;

  // 새로운 타입 추가
  + status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';

  2. 상태 체크 로직 변경

  // 기존 조건문 변경
  - if (form.isActive)
  + if (form.status === 'ACTIVE')

  - if (!form.isActive)
  + if (form.status === 'INACTIVE')

  3. 새로운 마감 상태 처리

  // 마감 상태 UI 추가
  + if (form.status === 'CLOSED') {
  +   showClosedFormUI();
  + }

  4. API 호출 함수 추가

  // 마감 API 함수 추가
  + const closeForm = async (formId) => {
  +   await fetch(`/api/google-forms/${formId}/close`, { method: 'PUT' });
  + };

  ✅ 선택사항 (권장)

  1. 상태별 스타일링

  .status-active { color: #22c55e; }   /* 초록색 */
  .status-inactive { color: #6b7280; } /* 회색 */
  .status-closed { color: #ef4444; }   /* 빨간색 */

  2. 상태 변경 알림

  const showStatusChangeNotification = (status) => {
    const messages = {
      'ACTIVE': '구글 폼이 활성화되었습니다.',
      'INACTIVE': '구글 폼이 비활성화되었습니다.',
      'CLOSED': '구글 폼이 마감되었습니다.'
    };
    showNotification(messages[status]);
  };

  3. 권한별 버튼 제어

  const getAvailableActions = (status, userRole) => {
    const actions = [];

    if (userRole === 'ROOT') {
      if (status === 'INACTIVE') {
        actions.push('activate', 'close', 'delete');
      } else if (status === 'ACTIVE') {
        actions.push('deactivate', 'close');
      } else if (status === 'CLOSED') {
        actions.push('activate');
      }
    }

    return actions;
  };

  ---
  ⚠️ 주의사항

  1. 삭제 정책 변경

  // 이제 ACTIVE 또는 CLOSED 상태에서는 삭제 불가
  if (form.status !== 'INACTIVE') {
    showError('현재 상태에서는 삭제할 수 없습니다.');
    return;
  }

  2. 에러 처리 강화

  // 더 구체적인 에러 메시지
  catch (error) {
    if (error.response?.data?.message) {
      showError(error.response.data.message);
    } else {
      showError('작업 처리 중 오류가 발생했습니다.');
    }
  }

  3. 상태 변경 후 UI 업데이트

  // 상태 변경 후 즉시 UI 반영
  const updateFormInList = (formId, newStatus) => {
    setForms(prevForms =>
      prevForms.map(form =>
        form.id === formId
          ? { ...form, status: newStatus }
          : form
      )
    );
  };
