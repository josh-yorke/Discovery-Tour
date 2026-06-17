import z from "zod";

export const addTransportationSchema = z.object({
  country: z.string().min(2, "country is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required",
    ),
  description: z.string().optional(),
  title: z.string().min(2, "title is required"),
  type: z.string().min(2, "transport type is required"),
});

export type addTransportationData = z.infer<typeof addTransportationSchema>;
