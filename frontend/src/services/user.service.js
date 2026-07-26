import client from './apiClient';

export const userService = {
  getUser: async (userId) => {
    const response = await client.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, payload) => {
    const response = await client.put(`/users/${userId}`, payload);
    return response.data;
  },

  getAlumni: async ({ page = 1, limit = 12, search = '', company = '', location = '', graduationYear = '', mentorsOnly = false } = {}) => {
    const response = await client.get('/users/alumni', {
      params: { page, limit, search, company, location, graduationYear, mentorsOnly }
    });
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await client.get('/users', { params });
    const data = response.data;
    return Array.isArray(data) ? data : data?.data || [];
  },

  verifyUser: async (userId, isVerified) => {
    const response = await client.patch(`/users/${userId}/verify`, { isVerified });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await client.delete(`/users/${userId}`);
    return response.data;
  }
};
