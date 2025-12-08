import z from "zod";

const blogDataSchema = z.object({
  _id: z.string(),
  title: z.string(),
  contents: z.string(),
  tags: z.array(z.string()),
  images: z.array(z.string()),
  status: z.string(),
  readingTimeValue: z.string(),
  readingTimeUnit: z.string(),
  relatedLinks: z.array(z.string().nullable()),
});

export type blogData = z.infer<typeof blogDataSchema>;
