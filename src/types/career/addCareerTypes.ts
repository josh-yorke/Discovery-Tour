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
  images: z.array(z.string()).min(1, "atleast one image is required"),
  department: z.string().min(1, "career department is required"),
  branch: z.string().min(1, "branch is required"),
});

export type addCareerData = z.infer<typeof addCareerSchema>;
