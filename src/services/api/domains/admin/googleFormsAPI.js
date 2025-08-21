import apiClient from '../../core/apiClient.js';

export const googleFormsAPI = {
  getForms: async () => {
    const response = await apiClient.get('/api/google-forms');
    return response.data;
  },

  getActiveForms: async () => {
    const response = await apiClient.get('/api/google-forms/active');
    return response.data;
  },

  checkActiveFormsExists: async () => {
    const response = await apiClient.get('/api/google-forms/active/exists');
    return response.data;
  },

  createForm: async (formData) => {
    const response = await apiClient.post('/api/google-forms', formData);
    return response.data;
  },

  getFormById: async (id) => {
    const response = await apiClient.get(`/api/google-forms/${id}`);
    return response.data;
  },

  activateForm: async (id) => {
    const response = await apiClient.put(`/api/google-forms/${id}/activate`);
    return response.data;
  },

  deactivateForm: async (id) => {
    const response = await apiClient.put(`/api/google-forms/${id}/deactivate`);
    return response.data;
  },

  deleteForm: async (id) => {
    const response = await apiClient.delete(`/api/google-forms/${id}`);
    return response.data;
  },

  updateFormUrl: async (id, formUrl) => {
    const response = await apiClient.put(`/api/google-forms/${id}/form-url`, {
      formUrl: formUrl
    });
    return response.data;
  },

  updateSheetUrl: async (id, sheetUrl) => {
    const response = await apiClient.put(`/api/google-forms/${id}/sheet-url`, {
      sheetUrl: sheetUrl
    });
    return response.data;
  },

  updateGeneration: async (id, generation) => {
    const response = await apiClient.put(`/api/google-forms/${id}/generation`, {
      generation: parseInt(generation, 10)
    });
    return response.data;
  },

  getCurrentGeneration: async () => {
    const response = await apiClient.get('/api/google-forms/current-generation');
    return response.data;
  }
};