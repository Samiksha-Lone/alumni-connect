import client from './apiClient';

export const chatService = {
  getConversations: async () => {
    const response = await client.get('/chat/conversations');
    return response.data;
  },

  getMessages: async (partnerId) => {
    const response = await client.get(`/chat/messages/${partnerId}`);
    return response.data;
  },

  getUsers: async () => {
    const response = await client.get('/chat/users');
    return response.data;
  },

  sendMessage: async (payload) => {
    const response = await client.post('/chat/message', payload);
    return response.data;
  },

  uploadFile: async (formData) => {
    const response = await client.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  markRead: async (userId) => {
    const response = await client.put(`/chat/read/${userId}`);
    return response.data;
  },

  deleteConversation: async (userId) => {
    const response = await client.delete(`/chat/conversation/${userId}`);
    return response.data;
  },

  searchMessages: async (query) => {
    const response = await client.get('/chat/search', {
      params: { q: query }
    });
    return response.data;
  }
};
