import z from "zod";

export const addAccomodationSchema = z.object({
  accommodationName: z.string().min(1, "Accommodation name is required"),
  accommodationStar: z.string().min(1, "Star rating is required"),
  accommodationDescription: z.string().min(1, "Description is required"),
  accommodationWebsite: z.string().min(2, "website is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required"
    ),
});

export const editAccommodationSchema = z.object({
  _id: z.string(),
  tour: z.string(),
  accommodationName: z.string(),
  accommodationStar: z.number(),
  accommodationDescription: z.string(),
  accommodationWebsite: z.string(),
  accommodationImages: z.array(z.string()),
  dateAdded: z.string().optional(),
  __v: z.number().optional(),
});

export type addAccomodationData = z.infer<typeof addAccomodationSchema>;
export type editAccommodationData = z.infer<typeof editAccommodationSchema>;
