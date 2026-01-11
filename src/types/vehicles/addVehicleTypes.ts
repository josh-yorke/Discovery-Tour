import z from "zod";

export const addVehicleSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle name is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required"),
  seatingCapacity: z.string().min(1, "Seating capacity is required"),
  luggageCapacity: z.string().min(1, "Luggage capacity is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  isAvailable: z.string().min(1, "Availability status is required"),
  status: z.string().min(1, "Status is required"),
  images: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one image is required"
    ),
});

export type addVehicleData = z.infer<typeof addVehicleSchema>;
