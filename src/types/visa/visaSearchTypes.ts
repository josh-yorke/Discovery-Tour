import { z } from "zod";

export const visaSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
  country: z.string().default(""),
  type: z.string().default(""),
});

export type visaSearchData = z.infer<typeof visaSearchSchema>;
