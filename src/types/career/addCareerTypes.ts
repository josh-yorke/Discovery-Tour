import z from "zod";

export const addCareerSchema = z.object({
  title: z.string().min(1, "career title is required"),
  description: z.string().min(1, "career description is required"),
  status: z.enum(["open", "closed", "draft"]),
  employmentType: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ]),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required",
    ),
  department: z.string().min(1, "career department is required"),
  branch: z.string().min(1, "branch is required"),
});

export type addCareerData = z.infer<typeof addCareerSchema>;
