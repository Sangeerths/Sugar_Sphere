import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    // Ensure productId is always a string
    const productIdStr = String(productId);
    const response = await api.post('/cart/add', { productId: productIdStr, quantity });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    // Ensure productId is always a string
    const productIdStr = String(productId);
    const response = await api.put('/cart/update', { productId: productIdStr, quantity });
    return response.data;
  },

  removeFromCart: async (productId) => {
    // Ensure productId is always a string
    const productIdStr = String(productId);
    const response = await api.delete(`/cart/remove/${productIdStr}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};