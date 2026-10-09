import api from './api';

export const orderService = {
  placeOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
  
  getPayment: async (orderId) => {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },
  
  updatePaymentStatus: async (id, status) => {
    const response = await api.put(`/payments/${id}/status`, { status });
    return response.data;
  },
  
  getTracking: async (orderId) => {
    const response = await api.get(`/tracking/order/${orderId}`);
    return response.data;
  }
};

export default orderService;
