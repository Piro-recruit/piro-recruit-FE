// 환경별 로깅 시스템
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    // 프로덕션에서는 ERROR와 WARN만, 개발에서는 모든 레벨
    this.currentLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
  }

  error(message, data = null) {
    if (this.currentLevel >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${this.formatMessage(message)}`, data ? data : '');
    }
  }

  warn(message, data = null) {
    if (this.currentLevel >= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${this.formatMessage(message)}`, data ? data : '');
    }
  }

  info(message, data = null) {
    if (this.currentLevel >= LOG_LEVELS.INFO) {
      console.log(`[INFO] ${this.formatMessage(message)}`, data ? data : '');
    }
  }

  debug(message, data = null) {
    if (this.currentLevel >= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${this.formatMessage(message)}`, data ? data : '');
    }
  }

  formatMessage(message) {
    const timestamp = new Date().toISOString();
    return `${timestamp} - ${message}`;
  }

  // API 요청/응답 로깅
  apiRequest(method, url) {
    this.debug(`API Request: ${method.toUpperCase()} ${url}`);
  }

  apiResponse(status, url) {
    this.debug(`API Response: ${status} ${url}`);
  }

  apiError(status, url, error) {
    this.error(`API Error: ${status} ${url}`, error);
  }

  // 훅 상태 변경 로깅
  hookStateChange(hookName, stateName, value) {
    this.debug(`Hook State Change: ${hookName}.${stateName}`, value);
  }

  // 사용자 액션 로깅
  userAction(action, data = null) {
    this.info(`User Action: ${action}`, data);
  }
}

// 싱글톤 인스턴스
const logger = new Logger();

export default logger;