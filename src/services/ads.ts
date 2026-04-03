import { apiClient, SEARCH_BASE_URL } from '../api/base';
import { ENDPOINTS } from '../api/endpoints';
import {
  FetchAdsPayload,
  FetchAdsResponse,
  FetchLocationsPayload,
  FetchLocationsResponse,
} from '../validation';

export const fetchAds = async (
  data: FetchAdsPayload,
): Promise<FetchAdsResponse> => {
  try {
    const {
      categoryId,
      locationId,
      priceMin,
      priceMax,
      searchTerm,
      language = 'en',
      from = 0,
      size = 12,
    } = data;

    // Index selection based on language
    const indexName =
      language === 'ar'
        ? 'olx-lb-production-ads-ar'
        : 'olx-lb-production-ads-en';
    const header = JSON.stringify({ index: indexName });

    // Must array contains the guaranteed query terms
    const mustConditions: any[] = [];

    if (categoryId) {
      mustConditions.push({ term: { 'category.externalID': categoryId } });
    }

    if (locationId && locationId !== '1-30') {
      // Hierarchy filter mapping as observed in realistic Classifieds implementations
      mustConditions.push({
        term: { 'location.hierarchy.externalID': locationId },
      });
    }

    // Term search text query
    if (searchTerm) {
      mustConditions.push({
        multi_match: {
          query: searchTerm,
          fields: ['title^3', 'description'],
          fuzziness: 'AUTO',
        },
      });
    }

    // Building Filters
    const filterConditions: any[] = [];

    if (priceMin !== undefined || priceMax !== undefined) {
      const rangeCondition: any = {};
      if (priceMin !== undefined) rangeCondition.gte = priceMin;
      if (priceMax !== undefined) rangeCondition.lte = priceMax;
      filterConditions.push({ range: { 'price.value': rangeCondition } });
    }

    const query = JSON.stringify({
      from,
      size,
      track_total_hits: 200000, // Matching realistic classifieds requests
      query: {
        bool: {
          must: mustConditions,
          filter: filterConditions,
        },
      },
      sort: [{ timestamp: { order: 'desc' } }, { id: { order: 'desc' } }],
    });

    // NDJSON formatting
    const payload = `${header}\n${query}\n`;

    const response = await apiClient({
      method: 'POST',
      baseURL: SEARCH_BASE_URL,
      endpoint: ENDPOINTS.Ads.Search,
      data: payload,
      headers: {
        'Content-Type': 'application/x-ndjson',
        Authorization:
          'Basic b2x4LWxiLXByb2R1Y3Rpb24tc2VhcmNoOj5zK08zPXM5QEk0REYwSWEldWc/N1FQdXkye0RqW0Zy',
      },
    });

    return response as FetchAdsResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch ads';
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const fetchLocations = async (
  data: FetchLocationsPayload = {},
): Promise<FetchLocationsResponse> => {
  try {
    const {
      hierarchyExternalID,
      level = 2,
      language = 'en',
      from = 0,
      size = 10000,
    } = data;

    const indexName =
      language === 'ar'
        ? 'olx-lb-production-locations-ar'
        : 'olx-lb-production-locations-en';
    const header = JSON.stringify({ index: indexName });

    const mustConditions: any[] = [{ term: { level: level } }];

    if (hierarchyExternalID) {
      mustConditions.push({ term: { 'hierarchy.externalID': hierarchyExternalID } });
    }

    const query = JSON.stringify({
      from,
      size,
      track_total_hits: false,
      query: {
        bool: {
          must: mustConditions,
        },
      },
      sort: [{ name: { order: 'asc' } }],
      timeout: '5s',
    });

    const payload = `${header}\n${query}\n`;

    const response = await apiClient({
      method: 'POST',
      baseURL: SEARCH_BASE_URL,
      endpoint: ENDPOINTS.Locations.Search,
      data: payload,
      headers: {
        'Content-Type': 'application/x-ndjson',
        Authorization:
          'Basic b2x4LWxiLXByb2R1Y3Rpb24tc2VhcmNoOj5zK08zPXM5QEk0REYwSWEldWc/N1FQdXkye0RqW0Zy',
      },
    });

    return response as FetchLocationsResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch locations';
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
