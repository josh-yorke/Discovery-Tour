import z from "zod";

export const searchVisaSchema = z.object({
  search: z.string().nullable(),
});

export type searchVisaData = z.infer<typeof searchVisaSchema>;
