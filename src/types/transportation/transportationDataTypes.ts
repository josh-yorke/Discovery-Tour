import z from "zod";

const transportationDataSchema = z.object({
  _id: z.string(),
  country: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  typeV2: z.object({
    transportType: z.string(),
  }),
});

export type transportationData = z.infer<typeof transportationDataSchema>;
