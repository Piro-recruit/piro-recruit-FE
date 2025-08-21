import apiClient from './apiClient.js';

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
          console.error('questionSummaries JSON 파싱 실패:', parseError);
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
        
        return {
          success: true,
          data: transformedData,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: "AI 요약 데이터 형식이 올바르지 않습니다."
        };
      }
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "AI 요약을 찾을 수 없습니다."
        };
      }
      throw error;
    }
  }
};