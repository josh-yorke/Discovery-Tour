import z from "zod";

export const addBranchSchema = z.object({
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
    })
  ),
});

export const addServiceSchema = z.object({
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

export const addAwardSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  about: z.string().min(1, "About is required"),
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
  coreValues: z.string().min(1, "Core values is required"),
  awards: z.array(
    z.object({
      date: z.string().min(1, "award date is required"),
      images: z
        .any()
        .refine(
          (value) => value instanceof FileList && value.length > 0,
          "At least one image is required"
        ),
      description: z.string().min(2, "award description is required"),
    })
  ),
});

export type addBranchData = z.infer<typeof addBranchSchema>;
export type addServiceData = z.infer<typeof addServiceSchema>;
export type addAwardData = z.infer<typeof addAwardSchema>;
