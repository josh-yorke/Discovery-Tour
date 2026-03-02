import z from "zod";

export const careerSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  branch: z.string(),
  employmentType: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ]),
  department: z.string(),
  status: z.enum(["open", "closed", "draft"]),
  images: z.array(z.string()),
});

export type careerData = z.infer<typeof careerSchema>;
