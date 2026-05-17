import z from "zod";

const scrapedDataSchema = z.object({
  _id: z.string(),
  currencyPair: z.string(),
  ttb: z.number(),
  tts: z.number(),
  ttm: z.number(),
  createdAt: z.string(),
  __v: z.number().optional(),
});

export type ScrapedData = z.infer<typeof scrapedDataSchema>;
