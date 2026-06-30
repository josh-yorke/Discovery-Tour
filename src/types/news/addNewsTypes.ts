import z from "zod";

export const addNewsSchema = z.object({
  title: z.string().min(2, "post title is required"),
  contents: z.string().min(2, "post contents is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required",
    ),
  status: z.string(),
  relatedLinks: z.array(z.string()),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag cannot be empty")
        .max(20, "Tag cannot exceed 20 characters"),
    )
    .min(1, "Minimum of 1 tag required")
    .max(2, "Maximum of 2 tags allowed"),
});

export type addNewsData = z.infer<typeof addNewsSchema>;
