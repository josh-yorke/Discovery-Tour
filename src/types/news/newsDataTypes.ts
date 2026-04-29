import z from "zod";

const newsDataSchema = z.object({
  _id: z.string(),
  title: z.string(),
  contents: z.string(),
  tags: z.array(z.string()),
  images: z.array(z.string()),
  status: z.string(),
  savedAt: z.string(),
  slug: z.string(),
  relatedLinks: z.array(z.string().nullable()),
});

export type newsData = z.infer<typeof newsDataSchema>;
