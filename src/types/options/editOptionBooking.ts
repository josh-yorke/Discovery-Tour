import { z } from "zod";

export const editOptionBookingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  type: z.enum([
    "Customized Tours",
    "Airline Reservation",
    "Restaurant Bookings",
    "Hotel Bookings",
  ]),
  message: z.string().min(1, "Message is required"),
  status: z.enum([
    "pending",
    "confirmed",
    "awaiting payment",
    "paid",
    "ongoing",
    "completed",
    "cancelled",
  ]),
});

export type EditOptionBookingData = z.infer<typeof editOptionBookingSchema>;
