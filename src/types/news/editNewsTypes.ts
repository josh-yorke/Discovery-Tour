import z from "zod";

export const editNewsSchema = z.object({
  title: z.string().min(2, "news title is required"),
  contents: z.string().min(2, "news contents is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required",
    ),
  status: z.string(),
  relatedLinks: z.array(z.string()),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "Minimum of 1 tag required"),
});

export type editNewsData = z.infer<typeof editNewsSchema>;
