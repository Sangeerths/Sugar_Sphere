import api from './api';

export const orderService = {
  createRazorpayOrder: async (amount) => {
    const response = await api.post('/orders/create-razorpay-order', { amount });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/orders/verify-payment', paymentData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Admin methods
  getAllOrders: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },

  getRevenueStats: async () => {
    const response = await api.get('/orders/admin/revenue');
    return response.data;
  },

  updateOrderStatus: async (orderId, status, note) => {
    const response = await api.post(`/orders/admin/${orderId}/status`, { status, note });
    return response.data;
  },
};