// Basic interfaces based on Classifieds API Requirements

export interface CategoryResponse {
  data: any[]; // Replace with exact type when known
}

export interface CategoryFieldsResponse {
  [categoryId: string]: any; // Object key represents category id
}

export interface FilterChoice {
  id: number;
  label: string;
  value: string;
}

export interface DynamicFilter {
  id: number;
  name: string;
  attribute: string;
  filterType: 'multiple_choice' | 'range' | 'boolean' | string;
  valueType: string;
  choices?: FilterChoice[];
  minValue?: number | null;
  maxValue?: number | null;
}

export interface FetchAdsPayload {
  categoryId: string;
  locationId: string;
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
  language?: 'en' | 'ar';
  from?: number;
  size?: number;
}

export interface FetchAdsResponse {
  responses: any[]; // _msearch standard response array
}

export interface FetchLocationsPayload {
  hierarchyExternalID?: string;
  level?: number;
  language?: 'en' | 'ar';
  from?: number;
  size?: number;
}

export interface FetchLocationsResponse {
  responses: any[];
}
