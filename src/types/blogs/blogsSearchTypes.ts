import z from "zod";

export const blogsSearchSchema = z.object({
  search: z.string().nullable(),
  page: z.number().default(1),
  status: z.string().nullable(),
});

export type blogsSearchData = z.infer<typeof blogsSearchSchema>;
