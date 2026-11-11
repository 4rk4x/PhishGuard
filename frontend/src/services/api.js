
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Bearer Token into requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('phishguard_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear stale token
      const currentPath = window.location.pathname;

      if (
        currentPath !== '/login' &&
        currentPath !== '/' &&
        currentPath !== '/scanner'
      ) {
        localStorage.removeItem('phishguard_token');
        localStorage.removeItem('phishguard_user');
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (fullName, email, password) => {
    const res = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password
    });

    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const scanAPI = {
  analyze: async (url) => {
    const res = await api.post('/scan/analyze', { url });
    return res.data;
  },

  getHistory: async ({
    page = 1,
    pageSize = 15,
    classification = null,
    search = null
  }) => {
    let url = `/scan/history?page=${page}&page_size=${pageSize}`;

    if (classification && classification !== 'all') {
      url += `&classification=${encodeURIComponent(classification)}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const res = await api.get(url);
    return res.data;
  },

  getScanById: async (id) => {
    const res = await api.get(`/scan/${id}`);
    return res.data;
  },

  deleteScan: async (id) => {
    const res = await api.delete(`/scan/${id}`);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/scan/stats/summary');
    return res.data;
  },
};

export const adminAPI = {
  getOverview: async () => {
    const res = await api.get('/admin/overview');
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  retrainModel: async () => {
    const res = await api.post('/admin/retrain');
    return res.data;
  },
};

export const mlAPI = {
  getMetrics: async () => {
    const res = await api.get('/ml/metrics');
    return res.data;
  },
};

export default api;
