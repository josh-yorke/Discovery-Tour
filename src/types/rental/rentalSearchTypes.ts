import z from "zod";

export const rentalSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().nullable(),
  year: z.string().nullable(),
  day: z.string().nullable(),
  month: z.string().nullable(),
  status: z.string().nullable(),
  vehicle: z.string().nullable(),
});

export type rentalSearchData = z.infer<typeof rentalSearchSchema>;
