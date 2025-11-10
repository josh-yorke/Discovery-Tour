import z from "zod";

export const addVisaSchema = z.object({
  country: z.string().min(5, "post title is required"),
  type: z.string().min(5, "post contents is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required"
    ),
  mainDescription: z.string(),
  eligibleApplicants: z.string(),
});

export type addVisaData = z.infer<typeof addVisaSchema>;
