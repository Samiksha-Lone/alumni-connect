import client from './apiClient';

export const galleryService = {
  getGallery: async (page = 1, limit = 12) => {
    const response = await client.get('/gallery', {
      params: { page, limit }
    });
    return response.data;
  },

  addImage: async ({ imageUrl, description, file }) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('imageUrl', imageUrl);
    }
    formData.append('description', description || 'Campus Life');
    const response = await client.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteImage: async (imageId) => {
    const response = await client.delete(`/gallery/${imageId}`);
    return response.data;
  }
};
