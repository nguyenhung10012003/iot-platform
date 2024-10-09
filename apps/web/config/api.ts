import axios from 'axios';

function createApi() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const isServer = typeof window === 'undefined';
  const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(async (config) => {
    if (isServer) {
      const { cookies } = await import('next/headers'),
        token = cookies().get('token')?.value;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      if (response) return response.data;
      return response;
    },
    (error) => {
      if (error.response && error.response.data) throw error.response.data;
      throw error;
    },
  );

  return api;
}

const api = createApi();
export default api;
