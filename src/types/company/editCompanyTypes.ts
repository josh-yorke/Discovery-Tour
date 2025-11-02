import z from "zod";

export const editDetailSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  about: z.string().min(1, "About is required"),
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
  coreValues: z.string().min(1, "Core values is required"),
});

export const editBranchSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  about: z.string().min(1, "About is required"),
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
  coreValues: z.string().min(1, "Core values is required"),
  branches: z.array(
    z.object({
      contact: z.object({
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        mapLink: z.string().url(),
      }),
      socials: z.object({
        facebook: z.string().url(),
        instagram: z.string().url(),
        twitter: z.string().url(),
        linkedin: z.string().url(),
        youtube: z.string().url(),
      }),
      branchName: z.string(),
      _id: z.string(),
    })
  ),
});

export const editServiceSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  about: z.string().min(1, "About is required"),
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
  coreValues: z.string().min(1, "Core values is required"),
  services: z.array(
    z.object({
      title: z.string().min(5, "service title is required"),
      description: z.string().min(5, "service description is required"),
    })
  ),
});

export const editCarouselSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  about: z.string().min(1, "About is required"),
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
  coreValues: z.string().min(1, "Core values is required"),
  carousel: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required"
    ),
});

export type editDetailData = z.infer<typeof editDetailSchema>;
export type editBranchData = z.infer<typeof editBranchSchema>;
export type editServiceData = z.infer<typeof editServiceSchema>;
export type editCarouselData = z.infer<typeof editCarouselSchema>;
