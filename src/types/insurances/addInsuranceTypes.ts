import z from "zod";

export const addInsuranceSchema = z.object({
  country: z.string().min(1, "Country is required"),
  insurancePartner: z.string().min(1, "Insurance partner is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  images: z
    .any()
    .refine((files) => files?.length > 0, "At least one image is required")
    .refine((files) => files?.[0]?.size <= 5000000, "Max image size is 5MB"),
});

export type addInsuranceData = z.infer<typeof addInsuranceSchema>;
