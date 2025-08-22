# Legacy Hooks

이 폴더에는 리팩토링 전의 기존 훅들이 포함되어 있습니다.
이들은 하위 호환성을 위해 유지되지만, 새로운 개발에서는 사용하지 마세요.

## 사용 권장사항
- 새로운 개발: `business/`, `state/`, `evaluation/` 폴더의 훅들 사용
- 기존 코드: 점진적으로 새로운 훅으로 마이그레이션

## 마이그레이션 가이드
- `useStateManagement` → `business/` + `state/` 훅들 조합
- `useEvaluationData` → `evaluation/` 훅들 조합ap
- `useModalManagement` → `state/useModalStates`
