import z from "zod";

export const addPricelistSchema = z.object({
  plan: z.string().min(2, "plan name is required"),
  fee: z.string().min(2, "fee is required"),
  description: z.string().min(2, "description is required"),
});

export type addPricelistData = z.infer<typeof addPricelistSchema>;
