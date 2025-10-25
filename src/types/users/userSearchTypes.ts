import z from "zod";

export const userSearchSchema = z.object({
  search: z.string().nullable(),
  page: z.number().default(1),
  status: z.string().nullable(),
  role: z.string().nullable(),
});

export type userSearchData = z.infer<typeof userSearchSchema>;
