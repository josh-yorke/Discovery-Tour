import z from "zod";

export const editVisaSchema = z.object({
  country: z.string().min(5, "visa country is required"),
  type: z.string().min(3, "visa type is required"),
  mainDescription: z.string().min(5, "visa description is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required"
    ),
  eligibleApplicants: z.string().min(5, "specify eligible applicants"),
});

export type editVisaData = z.infer<typeof editVisaSchema>;
