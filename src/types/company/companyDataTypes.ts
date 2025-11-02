import z from "zod";

export const companyDetailSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  about: z.string(),
  mission: z.string(),
  vision: z.string(),
  coreValues: z.string(),
});

export const companyCarouselSchema = z.object({
  carousel: z.array(z.string()),
});

export const companyServicesSchema = z.object({
  services: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      _id: z.string(),
    })
  ),
});

export const companyAwardsSchema = z.object({
  awards: z.array(
    z.object({
      date: z.string().datetime(),
      images: z.array(z.string()),
      description: z.string(),
      _id: z.string(),
    })
  ),
});

export const companyBranchesSchema = z.object({
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

export type companyDetail = z.infer<typeof companyDetailSchema>;
export type companyCarousel = z.infer<typeof companyCarouselSchema>;
export type companyServices = z.infer<typeof companyServicesSchema>;
export type companyAwards = z.infer<typeof companyAwardsSchema>;
export type companyBranches = z.infer<typeof companyBranchesSchema>;
