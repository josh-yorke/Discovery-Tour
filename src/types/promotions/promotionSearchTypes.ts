import z from "zod";

export const promotionSearchSchema = z.object({
  search: z.string().nullable(),
  page: z.number().default(1),
  status: z.string().nullable(),
});

export type promotionSearchData = z.infer<typeof promotionSearchSchema>;
