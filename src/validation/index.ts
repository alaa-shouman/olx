// Basic interfaces based on Classifieds API Requirements

export interface CategoryResponse {
  data: any[]; // Replace with exact type when known
}

export interface CategoryFieldsResponse {
  [categoryId: string]: any; // Object key represents category id
}

export interface FetchAdsPayload {
  categoryId: string;
  locationId: string;
  from?: number;
  size?: number;
}

export interface FetchAdsResponse {
  responses: any[]; // _msearch standard response array
}

export interface FetchLocationsPayload {
  hierarchyExternalID?: string;
  level?: number;
  from?: number;
  size?: number;
}

export interface FetchLocationsResponse {
  responses: any[];
}
