import z from "zod";

const tourDataSchema = z.object({
  _id: z.string(),
  title: z.string(),
  country: z.string(),
  typeV2: z.object({
    _id: z.string(),
    tourType: z.string(),
    savedAt: z.string(),
    __v: z.number(),
  }),
  category: z.string(),
  tags: z.array(z.string()),
  mainDescription: z.string(),
  images: z.array(z.string()),
  mainLocationImages: z.array(z.string()),
  mainLocationName: z.string(),
  mainLocationDescription: z.string(),
  dateAdded: z.string(),
  countryV2: z.object({
    _id: z.string(),
    country: z.string(),
    savedAt: z.string(),
    __v: z.number(),
  }),
});

export type tourData = z.infer<typeof tourDataSchema>;
