import z from "zod";

export const pricelistDataSchema = z.object({
  _id: z.string(),
  plan: z.string(),
  fee: z.string(),
  priceCurrency: z.string(),
  description: z.string(),
  visa: z.string(),
  filesAssociated: z.string().optional(),
});

export const editPricelistSchema = z.object({
  _id: z.string(),
  plan: z.string(),
  fee: z.number().optional(),
  description: z.string(),
  visa: z.string(),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
  priceCurrency: z.string(),
});

export const editTransportPricelistSchema = z.object({
  _id: z.string(),
  plan: z.string(),
  fee: z.number().optional(),
  description: z.string(),
  visa: z.string(),
  vehicle: z.object({
    _id: z.string(),
  }),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
  priceCurrency: z.string(),
});

export type pricelistData = z.infer<typeof pricelistDataSchema>;
export type editPricelistData = z.infer<typeof editPricelistSchema>;
export type editTransportPricelistData = z.infer<
  typeof editTransportPricelistSchema
>;
