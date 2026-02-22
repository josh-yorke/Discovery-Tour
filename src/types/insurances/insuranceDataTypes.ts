import z from "zod";

const insuranceDataSchema = z.object({
  _id: z.string(),
  country: z.string(),
  insurancePartner: z.any().nullable(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  dateAdded: z.string(),
  countryV2: z
    .object({
      _id: z.string(),
      country: z.string(),
      savedAt: z.string(),
    })
    .nullable(),
  insurancePartnerV2: z.any().nullable(),
});

export type insuranceData = z.infer<typeof insuranceDataSchema>;
