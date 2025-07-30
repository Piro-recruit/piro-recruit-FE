// 라우팅 경로 상수
export const ROUTES = {
  // Public routes
  HOME: '/',
  APPLICATION: '/application',
  
  // Admin routes
  ADMIN_LOGIN: '/admin',
  ADMIN_RECRUITING: '/admin/recruiting',
  ADMIN_RECRUITING_DETAIL: '/admin/recruiting/:id',
  
  // External routes
  PIROGRAMMING: {
    HOME: 'https://www.pirogramming.com/',
    ABOUT: 'https://www.pirogramming.com/about/',
    PORTFOLIO: 'https://www.pirogramming.com/portfolio/',
    INTERVIEW: 'https://www.pirogramming.com/interview/',
    GALLERY: 'https://www.pirogramming.com/gallery/',
  },
  
  SOCIAL: {
    INSTAGRAM: 'https://www.instagram.com/pirogramming_official/',
    KAKAO: 'https://pf.kakao.com/_xdHxdXK',
    GITHUB: 'https://github.com/pirogramming',
    EMAIL: 'mailto:pirogramming.official@gmail.com',
  },
};