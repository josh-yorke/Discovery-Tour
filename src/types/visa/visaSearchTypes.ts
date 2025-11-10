import z from "zod";

export const visaSearchSchema = z.object({
  page: z.number().default(1),
  country: z.string().nullable(),
});

export type visaSearchData = z.infer<typeof visaSearchSchema>;
