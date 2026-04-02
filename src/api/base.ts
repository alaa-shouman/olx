import { AxiosError } from "axios";
import { createAxiosInstance } from "./axiosInstance";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

let baseURL =  "http://localhost:4001/";

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  params?: unknown;
}

export const apiClient = async ({ method, endpoint, data, params }: ApiOptions): Promise<unknown> => {
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