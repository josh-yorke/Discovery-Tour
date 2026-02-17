import { z } from "zod";

export const addRailBookingSchema = z.object({
  railpass: z.string().min(1, "Railpass is required"),
  plan: z.string().min(1, "Plan is required"),
  customer: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    phone: z.string().min(1, "Phone number is required"),
    nationality: z.string().min(1, "Nationality is required"),
    passportNumber: z.string().min(1, "Passport number is required"),
  }),
  travel: z.object({
    dateFrom: z.string().min(1, "Start date is required"),
    dateTo: z.string().min(1, "End date is required"),
    numberOfAdults: z.number().min(1, "At least 1 adult is required"),
    numberOfChildren: z
      .number()
      .min(0, "Number of children cannot be negative"),
    destinations: z
      .array(z.string())
      .min(1, "At least one destination is required"),
    iteneraryDescription: z.string().optional(),
  }),
  remarks: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "delayed"]),
});

export type addRailBookingData = z.infer<typeof addRailBookingSchema>;
