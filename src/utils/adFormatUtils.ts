import { MetaItemData } from '../components/molecules/ListingCard';

const mapParamIcon = (key: string): string => {
  switch (key) {
    case 'year':
      return 'calendar-outline';
    case 'mileage':
      return 'speedometer-outline';
    case 'fuel':
      return 'color-fill-outline';
    case 'transmission':
      return 'settings-outline';
    case 'rooms':
      return 'bed-outline';
    case 'bathrooms':
      return 'water-outline';
    case 'area':
      return 'scan-outline';
    case 'memory':
    case 'storage':
    case 'internal_storage':
      return 'hardware-chip-outline';
    case 'ram':
      return 'server-outline';
    case 'color':
      return 'color-palette-outline';
    default:
      return 'information-circle-outline';
  }
};

const formatParamValue = (key: string, value: any): string => {
  if (key === 'mileage') return `${value} km`;
  if (key === 'area') return `${value} m²`;
  return String(value);
};

const ALLOWED_META_KEYS = [
  'year',
  'mileage',
  'fuel',
  'transmission',
  'rooms',
  'bathrooms',
  'area',
  'storage',
  'internal_storage',
  'memory',
  'ram',
  'color',
];

export const extractAdMeta = (
  parameters: any[],
  isArabic: boolean = false,
): MetaItemData[] => {
  if (!parameters || !Array.isArray(parameters)) return [];

  return parameters
    .filter(
      p =>
        ALLOWED_META_KEYS.includes(p.key) &&
        p.value !== undefined &&
        p.value !== null &&
        p.value !== '',
    )
    .map(p => {
      const rawValue = isArabic
        ? p.formattedValue_l1 || p.value_l1 || p.formattedValue || p.value
        : p.formattedValue || p.value;
      return {
        key: p.key,
        value: formatParamValue(p.key, rawValue),
        icon: mapParamIcon(p.key),
      };
    });
};
