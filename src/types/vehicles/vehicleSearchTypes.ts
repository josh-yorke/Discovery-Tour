import z from "zod";

export const vehicleSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().nullable(),
  status: z.string().nullable(),
  isAvailable: z.string().nullable(),
});

export type vehicleSearchData = z.infer<typeof vehicleSearchSchema>;
