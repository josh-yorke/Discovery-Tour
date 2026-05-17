import z from "zod";

const markupSchema = z.object({
  _id: z.string(),
  spread: z.string(),
  markUp: z.string(),
  currencyPair: z.string(),
  tts: z.string(),
  ttm: z.string(),
  ttb: z.string(),
});

export type markupData = z.infer<typeof markupSchema>;
