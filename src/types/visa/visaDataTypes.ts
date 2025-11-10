import z from "zod";

export const visaDataSchema = z.object({
  _id: z.string(),
  type: z.string(),
  mainDescription: z.string(),
  eligibleApplicants: z.string(),
  country: z.string(),
  images: z.array(z.string()),
});

export type visaData = z.infer<typeof visaDataSchema>;
