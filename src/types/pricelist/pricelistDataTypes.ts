import z from "zod";

export const pricelistDataSchema = z.object({
  _id: z.string(),
  plan: z.string(),
  fee: z.string(),
  description: z.string(),
  visa: z.string(),
  filesAssociated: z.string().optional(),
});

export const editPricelistSchema = z.object({
  _id: z.string(),
  plan: z.string(),
  fee: z.number(),
  description: z.string(),
  visa: z.string(),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
});

export type pricelistData = z.infer<typeof pricelistDataSchema>;
export type editPricelistData = z.infer<typeof editPricelistSchema>;
