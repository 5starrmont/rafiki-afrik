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

  // Hadithi Afrika endpoint
  getFilms: () => api.get('content/films/'),

  // Newsletter endpoint (POST request to match our secure Django view)
  subscribeNewsletter: (email) => api.post('content/newsletter/', { email }),
};

export default api;