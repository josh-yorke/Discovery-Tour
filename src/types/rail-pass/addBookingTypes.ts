import { z } from "zod";

export const addRailBookingSchema = z.object({
  railpass: z.string().min(1, "Rail pass ID is required"),
  plan: z.string().min(1, "Plan ID is required"),
  customer: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email address is required"),
    phone: z.string().min(1, "Phone number is required"),
    nationality: z.string().min(1, "Nationality is required"),
    passportNumber: z.string().min(1, "Passport number is required"),
  }),
  travel: z.object({
    dateFrom: z.string().min(1, "Start date is required"),
    dateTo: z.string().min(1, "End date is required"),
    numberOfAdults: z.number().min(1, "Number of adults must be at least 1"),
    numberOfChildren: z
      .number()
      .min(0, "Number of children cannot be negative"),
    iteneraryDescription: z.string().optional(),
    destinations: z.string().min(1, "Destinations are required"),
  }),
  remarks: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export type addRailBookingData = z.infer<typeof addRailBookingSchema>;
