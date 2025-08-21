import apiClient from './apiClient.js';

export const adminAPI = {
  getPassStatusStatistics: async () => {
    const response = await apiClient.get('/api/admin/applications/pass-status/statistics');
    return response.data;
  },

  getPassStatusStatisticsByGoogleFormId: async (googleFormId) => {
    const response = await apiClient.get(`/api/webhook/applications/google-form/${googleFormId}/pass-statistics`);
    return response.data;
  },

  updatePassStatus: async (applicationId, passStatus) => {
    const response = await apiClient.put(`/api/admin/applications/${applicationId}/pass-status`, {
      passStatus: passStatus
    });
    return response.data;
  },

  updateBulkPassStatus: async (applicationIds, passStatus) => {
    const response = await apiClient.put('/api/admin/applications/all/pass-status', {
      applicationIds: applicationIds,
      passStatus: passStatus
    });
    return response.data;
  },

  getApplicationsByPassStatus: async (status) => {
    const response = await apiClient.get(`/api/admin/applications/pass-status/${status}`);
    return response.data;
  },

  getApplicationsByGoogleFormAndPassStatus: async (googleFormId, status) => {
    const response = await apiClient.get(`/api/admin/applications/google-form/${googleFormId}/pass-status/${status}`);
    return response.data;
  }
};