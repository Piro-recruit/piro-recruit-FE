import apiClient from '../../core/apiClient.js';

export const integrationAPI = {
  exportApplicantsCSV: async (googleFormId) => {
    const url = googleFormId 
      ? `/api/integration/export/applicants/csv?googleFormId=${googleFormId}`
      : '/api/integration/export/applicants/csv';
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv, application/octet-stream, */*'
      }
    });
    
    return {
      success: true,
      data: response.data,
      headers: response.headers
    };
  },

  previewApplicantsCSV: async (googleFormId, limit = 10) => {
    const params = new URLSearchParams();
    if (googleFormId) params.append('googleFormId', googleFormId);
    params.append('limit', limit.toString());
    
    const response = await apiClient.get(`/api/integration/preview/applicants?${params}`);
    return response.data;
  },

  getExportStatistics: async (googleFormId) => {
    const url = googleFormId 
      ? `/api/integration/export/statistics?googleFormId=${googleFormId}`
      : '/api/integration/export/statistics';
    
    const response = await apiClient.get(url);
    return response.data;
  },

  exportAdminsCSV: async () => {
    const response = await apiClient.get('/api/integration/export/admins/csv', {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    });
    
    return {
      success: true,
      data: response.data,
      headers: response.headers
    };
  }
};