import { z } from "zod";

export const addRentalSchema = z.object({
  transport: z.string().min(1, "Transport ID is required"),
  plan: z.string().min(1, "Plan ID is required"),
  vehicle: z.string().min(1, "Vehicle ID is required"),
  customer: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email address is required"),
    phone: z.string().min(1, "Phone number is required"),
    nationality: z.string().min(1, "Nationality is required"),
    passportNumber: z.string().min(1, "Passport number is required"),
  }),
  rental: z.object({
    pickUpDate: z.string().min(1, "Pickup date is required"),
    pickUpTime: z.string().min(1, "Pickup time is required"),
    pickUpLocation: z.string().min(1, "Pickup location is required"),
    dropOffDate: z.string().min(1, "Dropoff date is required"),
    dropOffTime: z.string().min(1, "Dropoff time is required"),
    dropOffLocation: z.string().min(1, "Dropoff location is required"),
    specialRequests: z.string().min(1, "Special request is required"),
  }),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export type addRentalData = z.infer<typeof addRentalSchema>;
