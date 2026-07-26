import client from './apiClient';

export const authService = {
  login: async (credentials) => {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  },

  register: async (payload) => {
    const response = await client.post('/auth/register', payload);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await client.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async ({ email, resetCode, newPassword }) => {
    const response = await client.post('/auth/reset-password', {
      email,
      resetCode,
      newPassword,
    });
    return response.data;
  },

  me: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await client.get('/auth/logout');
    return response.data;
  }
};
