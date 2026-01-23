import type { addTypesCategoriesData } from "../types/types-categories/addTypesCategoriesTypes";

export const TYPE_CATEGORIES_MAPPING: Record<
    addTypesCategoriesData["type"],
    keyof addTypesCategoriesData
  > = {
    "visa-type": "visaType",
    "tour-type": "tourType",
    "transport-type": "transportType",
    "pass-type": "railPassType",
    "pass-category": "railPassCategory",
    country: "country",
  };