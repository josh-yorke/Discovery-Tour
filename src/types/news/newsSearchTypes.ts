import z from "zod";

export const newsSearchSchema = z.object({
  search: z.string().nullable(),
  page: z.number().default(1),
  status: z.string().nullable(),
  //   role: z.string().nullable(),
});

export type newsSearchData = z.infer<typeof newsSearchSchema>;
