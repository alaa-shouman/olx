export interface FetchAdsParams {
    categoryExternalID?: string;
    locationExternalID?: string;
    from?: number;
    size?: number;
}

export interface AdItem {
    id: string;
    title: string;
    description?: string;
    price?: {
        value: {
            display: string;
        }
    };
    category?: {
        externalID: string;
    };
    location?: {
        externalID: string;
    };
    timestamp?: string;
}

export interface AdsSearchResponse {
    responses: Array<{
        hits: {
            total: { value: number };
            hits: Array<{ _source: AdItem }>;
        }
    }>;
}
