import apiClient from '../../core/apiClient.js';

export const evaluationAPI = {
  createEvaluation: async (evaluationData) => {
    const response = await apiClient.post('/api/evaluations', evaluationData);
    return response.data;
  },

  updateEvaluation: async (evaluationId, evaluationData) => {
    const response = await apiClient.put(`/api/evaluations/${evaluationId}`, evaluationData);
    return response.data;
  },

  deleteEvaluation: async (evaluationId) => {
    const response = await apiClient.delete(`/api/evaluations/${evaluationId}`);
    return response.data;
  },

  getApplicationEvaluations: async (applicationId) => {
    try {
      const response = await apiClient.get(`/api/evaluations/application/${applicationId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: []
        };
      }
      throw error;
    }
  },

  getApplicationEvaluationSummary: async (applicationId) => {
    try {
      const response = await apiClient.get(`/api/evaluations/application/${applicationId}/summary`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: {
            applicationId: applicationId,
            applicantName: '알 수 없음',
            averageScore: null,
            evaluationCount: 0,
            evaluations: []
          }
        };
      }
      throw error;
    }
  }
};