import apiClient from './apiClient.js';

export const applicationStatusAPI = {
  changeApplicationStatus: async (applicationId, passStatus) => {
    const response = await apiClient.post(`/api/webhook/applications/${applicationId}/status?passStatus=${passStatus}`);
    return response.data;
  },

  bulkChangeApplicationStatus: async (topN, passStatus) => {
    const response = await apiClient.post(`/api/webhook/applications/bulk-status?topN=${topN}&passStatus=${passStatus}`);
    return response.data;
  }
};