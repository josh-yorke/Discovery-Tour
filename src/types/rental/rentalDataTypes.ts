import z from "zod";

const rentalDataSchema = z.object({
  _id: z.string(),
  customer: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    nationality: z.string(),
    passportNumber: z.string(),
  }),
  rental: z.object({
    pickUpDate: z.string().datetime(),
    pickUpTime: z.string(),
    pickUpLocation: z.string(),
    dropOffDate: z.string().datetime(),
    dropOffTime: z.string(),
    dropOffLocation: z.string(),
    specialRequests: z.string(),
  }),
  transport: z
    .object({
      _id: z.string(),
      title: z.string(),
      description: z.string(),
      images: z.array(z.string()),
    })
    .nullable(),
  vehicle: z
    .object({
      _id: z.string(),
      vehicleName: z.string(),
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      vehicleType: z.string(),
      images: z.array(z.string()),
    })
    .nullable(),
  plan: z
    .object({
      _id: z.string(),
      plan: z.string(),
      fee: z.number(),
      description: z.string(),
    })
    .nullable(),
  status: z.enum([
    "pending",
    "confirmed",
    "awaiting payment",
    "paid",
    "ongoing",
    "completed",
    "cancelled",
  ]),
  dateAdded: z.string().datetime(),
});

export type rentalData = z.infer<typeof rentalDataSchema>;
