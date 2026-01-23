import z from "zod";

const typesCategoriesDataSchema = z.object({
  _id: z.string(),
  savedAt: z.string(),
  visaType: z.string().optional(),
  tourType: z.string().optional(),
  transportType: z.string().optional(),
  railPassType: z.string().optional(),
  railPassCategory: z.string().optional(),
  country: z.string().optional(),
});

export type typesCategoriesData = z.infer<typeof typesCategoriesDataSchema>;
