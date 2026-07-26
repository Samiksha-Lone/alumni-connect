import client from './apiClient';

export const dashboardService = {
  getStats: async () => {
    const response = await client.get('/dashboard/stats');
    return response.data;
  },

  getDebugStatus: async () => {
    const response = await client.get('/debug/status');
    return response.data;
  }
};
