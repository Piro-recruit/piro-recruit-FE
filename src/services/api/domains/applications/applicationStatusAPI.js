import apiClient from '../../core/apiClient.js';

export const applicationStatusAPI = {
  changeApplicationStatus: async (applicationId, passStatus) => {
    const response = await apiClient.post(`/api/webhook/applications/${applicationId}/status?passStatus=${passStatus}`);
    return response.data;
  },

  // 구글 폼별 상위 N명 상태 변경
  bulkChangeApplicationStatus: async (googleFormId, topN, passStatus) => {
    const response = await apiClient.post(`/api/webhook/applications/google-form/${googleFormId}/bulk-status?topN=${topN}&passStatus=${passStatus}`);
    return response.data;
  },

  // 구글 폼별 하위 N명 상태 변경
  bulkChangeBottomStatus: async (googleFormId, bottomN, passStatus) => {
    const response = await apiClient.post(`/api/webhook/applications/google-form/${googleFormId}/bulk-status-bottom?bottomN=${bottomN}&passStatus=${passStatus}`);
    return response.data;
  }
};