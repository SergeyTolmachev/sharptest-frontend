import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

const publicPaths = [
  '/auth',
];

axios.interceptors.response.use(data => {
  return data;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    if (publicPaths.indexOf(window.location.pathname) === -1) {
      window.location.replace('/auth');
    }
  }

  return Promise.reject(error);
});
