import client from './apiClient';

export const eventService = {
  getEvents: async (params = {}) => {
    const response = await client.get('/events', { params });
    return response.data;
  },

  createEvent: async (payload) => {
    const response = await client.post('/events', payload);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await client.delete(`/events/${eventId}`);
    return response.data;
  },

  registerForEvent: async (eventId) => {
    const response = await client.post(`/events/${eventId}/register`);
    return response.data;
  }
};
