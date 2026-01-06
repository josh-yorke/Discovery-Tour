import z from "zod";

const railPassDataSchema = z.object({
  _id: z.string(),
  country: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  typeV2: z.object({
    railPassType: z.string(),
  }),
});

export type RailPassData = z.infer<typeof railPassDataSchema>;
