import z from "zod";

const partnerDataSchema = z.object({
  _id: z.string(),
  partnerName: z.string(),
  type: z.string(),
  logoImage: z.string(),
  websiteUrl: z.string(),
  dateAdded: z.string(),
  __v: z.number(),
  typeV2: z
    .object({
      _id: z.string(),
      partnerType: z.string(),
      savedAt: z.string(),
      __v: z.number(),
    })
    .optional(),
});

export type partnerData = z.infer<typeof partnerDataSchema>;
