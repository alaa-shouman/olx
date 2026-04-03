import axios from 'axios';
import i18n from '../../i18n';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    config => {
      config.headers['Accept-Language'] = i18n?.language === 'ar' ? 'ar' : 'en';
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.floor(
        Math.random() * 1000,
      )}`;
      config.headers['X-Request-Time'] = new Date().toISOString();

      console.log('Full Request Details:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        params: config.params,
        data: config.data,
      });

      return config;
    },
    error => {
      // console.error("Request Error Interceptor:", error);
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    response => {
      console.log('Response Success:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        data: response.data,
        headers: response.headers,
        requestData: response.config.data,
        requestParams: response.config.params,
      });
      return response;
    },
    async error => {
      const originalRequest = error.config;
      console.error('Response Error:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        requestData: error.config?.data,
        requestParams: error.config?.params,
        message: error.message,
      });

      // Fix: Safely access error.response.data
      const errorMessage = error.response?.data?.error
        ? JSON.stringify(error.response.data.error)
        : error.message || 'An error occurred';

      return Promise.reject(error);
    },
  );

  return instance;
};
