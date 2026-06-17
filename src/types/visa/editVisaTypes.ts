import z from "zod";

export const editVisaSchema = z.object({
  country: z.string().min(2, "visa country is required"),
  type: z.string().min(2, "visa type is required"),
  mainDescription: z.string().optional(),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required",
    ),
});

export type editVisaData = z.infer<typeof editVisaSchema>;
