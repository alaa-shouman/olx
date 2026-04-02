import { apiClient, OLX_BASE_URL } from '../api/base';
import { ENDPOINTS } from '../api/endpoints';
import { CategoryResponse, CategoryFieldsResponse } from '../validation';

export const getCategories = async (): Promise<CategoryResponse> => {
  try {
    const response = await apiClient({
      method: 'GET',
      baseURL: OLX_BASE_URL,
      endpoint: ENDPOINTS.Categories.List,
    });

    return response as CategoryResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch categories';
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getCategoryFields = async (): Promise<CategoryFieldsResponse> => {
  try {
    const response = await apiClient({
      method: 'GET',
      baseURL: OLX_BASE_URL,
      endpoint: ENDPOINTS.Categories.Fields,
      params: {
        includeChildCategories: true,
        splitByCategoryIDs: true,
        flatChoices: true,
        groupChoicesBySection: true,
        flat: true,
      },
    });

    return response as CategoryFieldsResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch category fields';
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
