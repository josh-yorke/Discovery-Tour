import z from "zod";

export const insuranceSearchSchema = z.object({
  search: z.string().nullable(),
  page: z.number().default(1),
});

export type insuranceSearchData = z.infer<typeof insuranceSearchSchema>;
