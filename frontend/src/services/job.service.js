import client from './apiClient';

export const jobService = {
  getJobs: async (params = { page: 1, limit: 100 }) => {
    const response = await client.get('/jobs', { params });
    const data = response.data;
    return Array.isArray(data) ? data : data?.data || [];
  },

  getJobsPaged: async (params = { page: 1, limit: 12 }) => {
    const response = await client.get('/jobs', { params });
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await client.post(`/jobs/${jobId}/save`);
    return response.data;
  },

  addJob: async (payload) => {
    const response = await client.post('/jobs', payload);
    return response.data;
  },

  updateJob: async (jobId, payload) => {
    const response = await client.put(`/jobs/${jobId}`, payload);
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await client.delete(`/jobs/${jobId}`);
    return response.data;
  }
};
