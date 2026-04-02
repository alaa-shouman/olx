import { AxiosError } from 'axios';
import { createAxiosInstance } from './axiosInstance';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const OLX_BASE_URL = 'https://www.olx.com.lb/api/';
export const SEARCH_BASE_URL = 'https://search.mena.sector.run/';

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  params?: unknown;
  baseURL?: string;
}

export const apiClient = async ({
  method,
  endpoint,
  data,
  params,
  baseURL = OLX_BASE_URL,
}: ApiOptions): Promise<unknown> => {
  try {
    const instance = createAxiosInstance(baseURL);
    const response = await instance({
      method,
      url: endpoint,
      data,
      params,
      // timeout:50000,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw error;
  }
};
