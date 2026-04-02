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
    const { categoryId, locationId, from = 0, size = 12 } = data;

    // Constructing the _msearch payload format (NDJSON)
    const header = JSON.stringify({ index: 'olx-lb-production-ads-en' });
    const query = JSON.stringify({
      from,
      size,
      track_total_hits: 200000,
      query: {
        bool: {
          must: [
            { term: { 'category.externalID': categoryId } },
            { term: { 'location.externalID': locationId } },
          ],
        },
      },
      sort: [{ timestamp: { order: 'desc' } }, { id: { order: 'desc' } }],
    });

    const payload = `${header}\n${query}\n`;

    const response = await apiClient({
      method: 'POST',
      baseURL: SEARCH_BASE_URL,
      endpoint: ENDPOINTS.Ads.Search,
      data: payload,
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
      hierarchyExternalID = '1-30',
      level = 2,
      from = 0,
      size = 10000,
    } = data;

    // Constructing the _msearch payload format (NDJSON)
    const header = JSON.stringify({ index: 'olx-lb-production-locations-en' });
    const query = JSON.stringify({
      from,
      size,
      track_total_hits: false,
      query: {
        bool: {
          must: [
            { term: { 'hierarchy.externalID': hierarchyExternalID } },
            { term: { level: level } },
          ],
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
