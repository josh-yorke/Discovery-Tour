import z from "zod";

const markupSchema = z.object({
  _id: z.string(),
  spread: z.string(),
  markUp: z.string(),
  currencyPair: z.string(),
});

export type markupData = z.infer<typeof markupSchema>;
