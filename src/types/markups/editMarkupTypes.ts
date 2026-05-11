import { z } from "zod";

export const editMarkupSchema = z.object({
  currencyPair: z.string().min(1, "Currency pair is required"),
  spread: z.string().min(1, "Spread is required"),
  markUp: z.string().min(1, "Markup is required"),
});

export type editMarkupData = z.infer<typeof editMarkupSchema>;
