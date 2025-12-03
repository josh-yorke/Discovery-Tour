import z from "zod";

export const visaSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().nullable(),
  country: z.string().nullable(),
  type: z.string().nullable(),
});

export type visaSearchData = z.infer<typeof visaSearchSchema>;
