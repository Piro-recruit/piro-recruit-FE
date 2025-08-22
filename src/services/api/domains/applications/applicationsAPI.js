import apiClient from '../../core/apiClient.js';

export const applicationsAPI = {
  getAllApplications: async () => {
    const response = await apiClient.get('/api/webhook/applications');
    return response.data;
  },

  getApplicationsByGoogleFormId: async (googleFormId) => {
    const response = await apiClient.get(`/api/webhook/applications/google-form/${googleFormId}`);
    return response.data;
  },

  getApplicationsByGoogleFormIdAndStatus: async (googleFormId, passStatus) => {
    const response = await apiClient.get(`/api/webhook/applications/google-form/${googleFormId}/by-pass-status?passStatus=${passStatus}`);
    return response.data;
  },

  getApplicationsByFormId: async (formId) => {
    const response = await apiClient.get(`/api/webhook/applications/form-id/${formId}`);
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await apiClient.get(`/api/webhook/applications/id/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/api/webhook/applications/statistics');
    return response.data;
  },

  getStatisticsByGoogleFormId: async (googleFormId) => {
    const response = await apiClient.get(`/api/webhook/applications/google-form/${googleFormId}/statistics`);
    return response.data;
  },

  getPassStatusStatisticsByGoogleFormId: async (googleFormId) => {
    const response = await apiClient.get(`/api/webhook/applications/google-form/${googleFormId}/pass-statistics`);
    return response.data;
  }
};