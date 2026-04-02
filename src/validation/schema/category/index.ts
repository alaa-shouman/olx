export interface CategoryItem {
    id: number | string;
    name: string;
    externalID?: string;
    parent_id?: number;
    children?: CategoryItem[];
}

export interface CategoryFieldChoice {
    id: string | number;
    label: string;
    // Additional schema keys typical in OLX choices
    externalID?: string;
    parentID?: string;
}

export interface CategoryField {
    id: string;
    type: string;
    label: string;
    choices?: CategoryFieldChoice[];
    required?: boolean;
}

// CategoryFieldsResponse dynamically pairs category IDs as keys to array of fields
export type CategoryFieldsResponse = Record<string, CategoryField[]>;
