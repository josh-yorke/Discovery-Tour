import z from "zod";

export const typesCategoriesSearchSchema = z.object({
  service: z.string(),
});

export type typesCategoriesSearchData = z.infer<typeof typesCategoriesSearchSchema>;
