import z from "zod";

const companyDataSchema = z.object({
  _id: z.string(),
  name: z.string(),
  tagline: z.string(),
  about: z.string(),
  carousel: z.array(z.string()),
  mission: z.string(),
  vision: z.string(),
  coreValues: z.string(),
  services: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      _id: z.string(),
    })
  ),
  awards: z.array(
    z.object({
      date: z.string().datetime(),
      images: z.array(z.string()),
      description: z.string(),
      _id: z.string(),
    })
  ),
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

export type companyData = z.infer<typeof companyDataSchema>;
