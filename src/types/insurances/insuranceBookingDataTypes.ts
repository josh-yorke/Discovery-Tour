import z from "zod";

const customerSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  nationality: z.string(),
  passportNumber: z.string(),
});

const destinationSchema = z.object({
  _id: z.string(),
  country: z.string(),
  savedAt: z.string().datetime(),
  __v: z.number().optional(),
});

const travelSchema = z.object({
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
  destination: destinationSchema,
});

const insuranceSchema = z.object({
  _id: z.string(),
  country: z.string(),
  insurancePartner: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  dateAdded: z.string().datetime(),
  __v: z.number().optional(),
});

const planSchema = z.object({
  _id: z.string(),
  plan: z.string(),
  fee: z.number(),
  description: z.string(),
  currency: z.string(),
  filesAssociated: z.array(z.string()),
  visa: z.any().nullable(),
  tour: z.any().nullable(),
  railpass: z.any().nullable(),
  transport: z.any().nullable(),
  vehicle: z.any().nullable(),
  insurance: z.string(),
  dateAdded: z.string().datetime(),
  __v: z.number().optional(),
});

const insuranceBookingDataSchema = z.object({
  _id: z.string(),
  customer: customerSchema,
  travel: travelSchema,
  insurance: insuranceSchema,
  plan: planSchema,
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  dateAdded: z.string().datetime(),
  __v: z.number().optional(),
});

export type insuranceBookingData = z.infer<typeof insuranceBookingDataSchema>;
