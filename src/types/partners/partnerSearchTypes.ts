import z from "zod";

export const partnerSearchSchema = z.object({
  search: z.string().nullable(),
  page: z.number().default(1),
  type: z.string(),
});

export type partnerSearchData = z.infer<typeof partnerSearchSchema>;
