import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${BACKEND_URL}`,
  withCredentials: true,
});

export default api;

export const apiService = {
  startSession: (tableId: string, tableToken: string) => api.post('/session', { tableId, tableToken }),

  getProducts: (search?: string) => api.get('public/products', { params: { search } }),
  getProductById: (id: string) => api.get(`/public/products/${id}`),
  getCategories: (search?: any) => api.get('public/categories', { params: search }),

  createOrder: (items: any[], note?: string | null) => api.post('guest/orders', { items, note: note ?? null }),
  getOrder: () => api.get('guest/orders'),
  updateOrder: (payload: any) => api.patch("guest/orders", payload),
}