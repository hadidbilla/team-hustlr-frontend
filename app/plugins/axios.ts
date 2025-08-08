
    import axios from 'axios';
    import type { AxiosInstance, CreateAxiosDefaults } from 'axios';

    export default defineNuxtPlugin((nuxtApp) => {
      const { public: { apiBaseUrl } } = useRuntimeConfig();

      const defaultAxiosConfig: CreateAxiosDefaults = {
        baseURL: apiBaseUrl ,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const customAxios: AxiosInstance = axios.create(defaultAxiosConfig);
      customAxios.interceptors.request.use(config => {
        return config;
      });

      customAxios.interceptors.response.use(response => {
        return response;
      }, error => {
        // Handle errors globally
        return Promise.reject(error);
      });

      // Provide the Axios instance to the Nuxt app
      return {
        provide: {
          axios: customAxios,
        },
      };
    });