import z from "zod";

const vehicleDataSchema = z.object({
  _id: z.string(),
  vehicleName: z.string(),
  vehicleType: z.string(),
  brand: z.string(),
  model: z.string(),
  seatingCapacity: z.string(),
  luggageCapacity: z.string(),
  transmission: z.string(),
  fuelType: z.string(),
  isAvailable: z.string(),
  status: z.string(),
  images: z.array(z.string()),
  year: z.string(),
});

export type vehicleData = z.infer<typeof vehicleDataSchema>;
