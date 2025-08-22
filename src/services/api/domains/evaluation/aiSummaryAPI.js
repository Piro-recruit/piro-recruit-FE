import apiClient from '../../core/apiClient.js';
import logger from '../../../../utils/logger.js';

export const aiSummaryAPI = {
  getApplicationSummary: async (webhookApplicationId) => {
    try {
      const response = await apiClient.get(`/api/ai-summary/webhook-application/${webhookApplicationId}`);
      
      if (response.data?.success && response.data?.data?.items) {
        const items = response.data.data.items;
        
        let questionSummaries = [];
        try {
          if (items.questionSummaries) {
            questionSummaries = JSON.parse(items.questionSummaries);
          }
        } catch (parseError) {
          logger.error('questionSummaries JSON 파싱 실패', parseError);
          questionSummaries = [];
        }
        
        const transformedData = {
          scoreOutOf100: parseInt(items.scoreOutOf100) || 0,
          scoreReason: items.scoreReason || '',
          questionSummaries: questionSummaries,
          processingStatus: response.data.data.processingStatus,
          createdAt: response.data.data.createdAt,
          updatedAt: response.data.data.updatedAt
        };
        
        logger.debug('AI Summary 데이터 변환 완료', { webhookApplicationId, score: transformedData.scoreOutOf100 });
        
        return {
          success: true,
          data: transformedData,
          message: response.data.message
        };
      } else {
        logger.warn('AI 요약 데이터 형식 오류', response.data);
        return {
          success: false,
          message: "AI 요약 데이터 형식이 올바르지 않습니다."
        };
      }
    } catch (error) {
      if (error.response?.status === 404) {
        logger.debug('AI 요약 없음', { webhookApplicationId });
        return {
          success: false,
          message: "AI 요약을 찾을 수 없습니다."
        };
      }
      logger.error('AI 요약 조회 실패', { webhookApplicationId, error: error.message });
      throw error;
    }
  }
};