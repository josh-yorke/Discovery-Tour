import z from "zod";

const customerSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  nationality: z.string(),
  passportNumber: z.string(),
});

const travelSchema = z.object({
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
  numberOfAdults: z.number(),
  numberOfChildren: z.number(),
  iteneraryDescription: z.string(),
  destinations: z.array(z.string()),
});

const railpassSchema = z
  .object({
    _id: z.string(),
    country: z.string(),
    category: z.string(),
    type: z.string(),
    title: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    dateAdded: z.string().datetime(),
    __v: z.number().optional(),
  })
  .nullable();

const planSchema = z
  .object({
    _id: z.string(),
    plan: z.string(),
    fee: z.number(),
    description: z.string(),
    currency: z.string(),
    filesAssociated: z.array(z.string()),
    visa: z.any().nullable(),
    tour: z.any().nullable(),
    railpass: z.string(),
    transport: z.any().nullable(),
    vehicle: z.any().nullable(),
    insurance: z.any().nullable(),
    dateAdded: z.string().datetime(),
    __v: z.number().optional(),
  })
  .nullable();

const bookingDataSchema = z.object({
  _id: z.string(),
  customer: customerSchema,
  travel: travelSchema,
  railpass: railpassSchema,
  plan: planSchema,
  remarks: z.string(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  dateAdded: z.string().datetime(),
  __v: z.number().optional(),
});

export type bookingData = z.infer<typeof bookingDataSchema>;
