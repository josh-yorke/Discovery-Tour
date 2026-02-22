import z from "zod";

export const addPartnerSchema = z.object({
  partnerName: z.string().min(1, "Partner name is required"),
  type: z.string().min(1, "Partner type is required"),
  websiteUrl: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Website URL is required"),
  image: z.array(z.instanceof(File)).min(1, "Image is required"),
});

export type addPartnerData = z.infer<typeof addPartnerSchema>;
