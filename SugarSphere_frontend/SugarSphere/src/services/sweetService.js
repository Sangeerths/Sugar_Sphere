import api from './api';

export const sweetService = {
  getAllSweets: async () => {
    const response = await api.get('/sweets');
    return response.data;
  },

  getSweetById: async (id) => {
    const response = await api.get(`/sweets/${id}`);
    return response.data;
  },

  searchSweets: async (searchTerm, category, minPrice, maxPrice) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    const response = await api.get(`/sweets/search?${params.toString()}`);
    return response.data;
  },

  createSweet: async (sweetData) => {
    const response = await api.post('/sweets', sweetData);
    return response.data;
  },

  updateSweet: async (id, sweetData) => {
    // Convert id to string to handle both MongoDB _id and numeric id
    const response = await api.put(`/sweets/${String(id)}`, sweetData);
    return response.data;
  },

  deleteSweet: async (id) => {
    // Convert id to string to handle both MongoDB _id and numeric id
    await api.delete(`/sweets/${String(id)}`);
  },

  purchaseSweet: async (id) => {
    // Convert id to string to handle both MongoDB _id and numeric id
    const response = await api.post(`/sweets/${String(id)}/purchase`);
    return response.data;
  },

  restockSweet: async (id, quantity) => {
    // Convert id to string to handle both MongoDB _id and numeric id
    const response = await api.post(`/sweets/${String(id)}/restock`, { quantity });
    return response.data;
  },
};