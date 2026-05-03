export const TYPES_CATEGORIES_MAPPING = {
  "visa-type": "visaType",
  "tour-type": "tourType",
  "transport-type": "transportType",
  "pass-type": "railPassType",
  "pass-category": "railPassCategory",
  country: "country",
} as const;

export const TYPES_CATEGORIES_KEYS = Object.keys(
  TYPES_CATEGORIES_MAPPING,
) as (keyof typeof TYPES_CATEGORIES_MAPPING)[];

export const TYPES_CATEGORIES_VALUES = Object.values(TYPES_CATEGORIES_MAPPING);

export const TYPES_CATEGORIES_OPTIONS = [
  "visa",
  "tour",
  "transportation",
  "pass",
  "pass-category",
  "country",
];
