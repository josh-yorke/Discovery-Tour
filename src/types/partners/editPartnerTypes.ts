import z from "zod";

export const editPartnerSchema = z.object({
  partnerName: z.string().min(1, "Partner name is required"),
  type: z.string().min(1, "Partner type is required"),
  websiteUrl: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Website URL is required"),
  image: z.array(z.instanceof(File)).optional(),
});

export type editPartnerData = z.infer<typeof editPartnerSchema>;
