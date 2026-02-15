import z from "zod";

export const bookingSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().nullable(),
  year: z.string().nullable(),
  day: z.string().nullable(),
  month: z.string().nullable(),
  status: z.string().nullable(),
  railpass: z.string().nullable(),
});

export type bookingSearchData = z.infer<typeof bookingSearchSchema>;
