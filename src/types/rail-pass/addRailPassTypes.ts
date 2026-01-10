import z from "zod";

export const addRailPassSchema = z.object({
  country: z.string().min(2, "tour country is required"),
  // type: z.string().min(2, "tour type is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required"
    ),
  description: z.string().min(2, "description is required"),
  category: z.string().min(2, "category is required"),
  title: z.string().min(2, "title is required"),
  type: z.string().min(2, "pass type is required"),
});

export type addRailPassData = z.infer<typeof addRailPassSchema>;
