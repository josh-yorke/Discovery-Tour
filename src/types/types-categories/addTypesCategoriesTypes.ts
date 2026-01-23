import { z } from "zod";

const CATEGORY_TYPES = [
  "visa-type",
  "tour-type",
  "transport-type",
  "pass-type",
  "pass-category",
  "country",
] as const;

export const addTypesCategoriesSchema = z.object({
  type: z.enum(CATEGORY_TYPES),
  visaType: z.string().optional(),
  tourType: z.string().optional(),
  transportType: z.string().optional(),
  railPassType: z.string().optional(),
  railPassCategory: z.string().optional(),
  country: z.string().optional(),
});

export type addTypesCategoriesData = z.infer<typeof addTypesCategoriesSchema>;
