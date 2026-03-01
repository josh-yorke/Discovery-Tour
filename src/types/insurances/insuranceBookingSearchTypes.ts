import z from "zod";

export const insuranceBookingSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().nullable(),
  year: z.string().nullable(),
  day: z.string().nullable(),
  month: z.string().nullable(),
  status: z.string().nullable(),
  insurance: z.string().nullable(),
});

export type insuranceBookingSearchData = z.infer<
  typeof insuranceBookingSearchSchema
>;
