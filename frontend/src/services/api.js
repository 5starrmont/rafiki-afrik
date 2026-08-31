import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentAPI = {
  // Impact Pulse endpoints
  getCategories: () => api.get('content/categories/'),
  getArticles: () => api.get('content/articles/'),
  getVideos: () => api.get('content/videos/'),

  // Hadithi Afrika endpoints
  getFilms: () => api.get('content/films/'),
  getFilm: (id) => api.get(`content/films/${id}/`),
  
  // FIX: Setting Content-Type to undefined forces Axios to remove the default 
  // 'application/json' and automatically set 'multipart/form-data' WITH the correct boundary.
  createFilm: (formData) => api.post('content/films/', formData, {
    headers: { 'Content-Type': undefined },
  }),
  updateFilm: (id, formData) => api.patch(`content/films/${id}/`, formData, {
    headers: { 'Content-Type': undefined },
  }),
  deleteFilm: (id) => api.delete(`content/films/${id}/`),

  // Newsletter endpoint
  subscribeNewsletter: (email) => api.post('content/newsletter/', { email }),
};

export default api;