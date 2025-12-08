import z from "zod";

export const addBlogSchema = z.object({
  title: z.string().min(5, "post title is required"),
  contents: z.string().min(5, "post contents is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required"
    ),
  status: z.string(),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "Minimum of 1 tag required"),
  relatedLinks: z.array(z.string()), // No .nullable(), no .optional(), no .default()
  readingTimeUnit: z.string().min(5, "this field is required"),
  readingTimeValue: z.number().min(1, "this field is required"),
});

export type addBlogData = z.infer<typeof addBlogSchema>;
