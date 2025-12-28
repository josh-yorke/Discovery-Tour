import z from "zod";

export const addCitySchema = z.object({
  city: z.string().min(2, "city name is required"),
});

export const editCitySchema = z.object({
  _id: z.string(),
  city: z.string(),
});

export type addCityData = z.infer<typeof addCitySchema>;
export type editCityData = z.infer<typeof editCitySchema>;
