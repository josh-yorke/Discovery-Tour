import z from "zod";

export const addTourSchema = z.object({
  country: z.string().min(2, "tour country is required"),
  type: z.string().min(2, "tour type is required"),
  title: z.string().min(2, "title is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required",
    ),
  mainDescription: z.string().optional(),
  category: z.string().min(2, "category is required"),
  mainLocationImages: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required",
    ),
  mainLocationName: z.string().min(2, "location name is required"),
  mainLocationDescription: z
    .string()
    .min(2, "location description is required"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "Minimum of 1 tag required"),
});

export type addTourData = z.infer<typeof addTourSchema>;
