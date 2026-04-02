export interface FetchLocationsParams {
    hierarchyExternalID?: string;
    level?: number;
    from?: number;
    size?: number;
}

export interface LocationItem {
    id: string;
    name: string;
    level: number;
    hierarchy?: {
        externalID: string;
    };
}

export interface LocationsSearchResponse {
    responses: Array<{
        hits: {
            total: { value: number };
            hits: Array<{ _source: LocationItem }>;
        }
    }>;
}
