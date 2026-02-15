import z from "zod";

export const addPricelistSchema = z.object({
  plan: z.string().min(2, "plan name is required"),
  fee: z.number().optional(),
  description: z.string().min(2, "description is required"),
  priceCurrency: z.string().min(2, "currency is required"),
});

export const addTransportPricelistSchema = z.object({
  plan: z.string().min(2, "plan name is required"),
  fee: z.number().optional(),
  description: z.string().min(2, "description is required"),
  vehicle: z.string().min(2, "vehicle is required"),
  priceCurrency: z.string().min(2, "currency is required"),
});

export type addPricelistData = z.infer<typeof addPricelistSchema>;
export type addTransportPricelistData = z.infer<
  typeof addTransportPricelistSchema
>;
