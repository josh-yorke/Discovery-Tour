import z from "zod";

export const railSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().nullable(),
  country: z.string().nullable(),
  category: z.string().nullable(),
  // type: z.string().nullable(),
});

export type railSearchData = z.infer<typeof railSearchSchema>;
