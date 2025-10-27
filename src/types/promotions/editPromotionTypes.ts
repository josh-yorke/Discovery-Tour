import z from "zod";

export const editPromotionSchema = z.object({
  title: z.string().min(5, "promotion title is required"),
  contents: z.string().min(5, "promotion contents is required"),
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
});

export type editPromotionData = z.infer<typeof editPromotionSchema>;
