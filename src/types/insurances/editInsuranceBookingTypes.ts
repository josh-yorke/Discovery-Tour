import { z } from "zod";

export const editInsuranceBookingSchema = z.object({
  insurance: z.string().min(1, "Insurance policy is required"),
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
    destination: z.string().min(1, "Destination is required"),
    dateFrom: z.string().min(1, "Start date is required"),
    dateTo: z.string().min(1, "End date is required"),
  }),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export type editInsuranceBookingData = z.infer<
  typeof editInsuranceBookingSchema
>;
