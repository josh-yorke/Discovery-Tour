import z from "zod";

export const typesCategoriesSearchSchema = z.object({
  service: z.string(),
  page: z.number().default(1),
});

export type typesCategoriesSearchData = z.infer<typeof typesCategoriesSearchSchema>;
