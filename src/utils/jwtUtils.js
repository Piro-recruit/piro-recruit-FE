// JWT 토큰에서 사용자 정보 추출하는 유틸리티 함수
export const getCurrentUserFromToken = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('토큰이 없습니다');
      return null;
    }
    
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('유효하지 않은 JWT 형식:', parts.length, '개 부분');
      return null;
    }
    
    const payload = parts[1];
    
    // Base64 디코딩 (URL-safe base64)
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const userInfo = JSON.parse(decoded);
    
    console.log('JWT에서 추출한 사용자 정보:', userInfo);
    console.log('사용자 ID 후보들:', {
      id: userInfo.id,
      sub: userInfo.sub,
      userId: userInfo.userId,
      username: userInfo.username,
      email: userInfo.email,
      adminId: userInfo.adminId
    });
    
    return userInfo;
  } catch (error) {
    console.error('JWT 토큰 파싱 실패:', error);
    return null;
  }
};