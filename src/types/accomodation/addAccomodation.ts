import z from "zod";

export const addAccomodationSchema = z.object({
  accommodationName: z.string().min(1, "Accommodation name is required"),
  accommodationDescription: z.string().optional(),
  accommodationStar: z.string().optional(),
  accommodationWebsite: z.string().url().optional().or(z.literal("")),
  images: z.any().optional(),
});

export const editAccommodationSchema = z.object({
  _id: z.string(),
  tour: z.string(),
  accommodationName: z.string(),
  accommodationStar: z.number().optional(),
  accommodationDescription: z.string().optional(),
  accommodationWebsite: z.string().optional(),
  accommodationImages: z.array(z.string()).optional(),
  dateAdded: z.string().optional(),
  __v: z.number().optional(),
});

export type addAccomodationData = z.infer<typeof addAccomodationSchema>;
export type editAccommodationData = z.infer<typeof editAccommodationSchema>;
