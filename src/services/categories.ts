import { apiClient, OLX_BASE_URL } from '../api/base';
import { ENDPOINTS } from '../api/endpoints';
import {
  CategoryResponse,
  CategoryFieldsResponse,
  DynamicFilter,
} from '../validation';

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

/**
 * Validates and maps the raw API response for a specific category ID into generic UI filters.
 * Ideal for rendering dynamic forms for Vehicles, Mobiles, Properties, etc.
 */
export const mapCategoryFieldsToFilters = (
  response: CategoryFieldsResponse,
  categoryId: string | number,
): DynamicFilter[] => {
  const categoryData = response[String(categoryId)];
  if (!categoryData || !categoryData.flatFields) {
    return [];
  }

  return categoryData.flatFields
    .filter((field: any) => field.roles?.includes('filterable'))
    .map((field: any): DynamicFilter => {
      const isChoice = field.filterType === 'multiple_choice';

      return {
        id: field.id,
        name: field.name || '',
        attribute: field.attribute,
        valueType: field.valueType,
        filterType: field.filterType || 'unknown',
        minValue: field.minValue ?? null,
        maxValue: field.maxValue ?? null,
        choices:
          isChoice && Array.isArray(field.choices)
            ? field.choices.map((c: any) => ({
                id: c.id,
                label: c.label || c.value,
                value: c.value,
              }))
            : undefined,
      };
    });
};
