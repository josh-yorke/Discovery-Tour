import z from "zod";

export const promotionDataSchema = z.object({
  _id: z.string(),
  title: z.string(),
  contents: z.string(),
  tags: z.array(z.string()),
  images: z.array(z.string()),
  status: z.string(),
  savedAt: z.string(),
});

export type promotionData = z.infer<typeof promotionDataSchema>;
