// types/tours/itinerary/addItinerary.ts
import z from "zod";

// Activity schema
export const addActivitySchema = z.object({
  activityType: z.string().min(1, "Activity type is required"),
  information: z.string().min(1, "Information is required"),
});

// Meal schema - all fields optional but if any is filled, all must be filled
export const addMealSchema = z.object({
  mealType: z.string().optional(),
  mealCount: z.string().or(z.number()).optional(),
  mealUnit: z.string().optional(),
  description: z.string().optional(),
});

// Main itinerary schema
export const addItinerarySchema = z.object({
  title: z.string().min(2, "Title is required"),
  location: z.string().min(2, "Location is required"),
  dayOrder: z.string().min(1, "Day order is required").or(z.number()),
  activities: z
    .array(addActivitySchema)
    .min(1, "At least one activity is required"),
  meals: z.array(addMealSchema).optional(), // Make meals optional
});

export const editItinerarySchema = z.object({
  _id: z.string(),
  title: z.string(),
  location: z.string(),
  dayOrder: z.string(),
  activities: z.array(addActivitySchema),
  meals: z.array(addMealSchema).optional(),
});

export type addActivityData = z.infer<typeof addActivitySchema>;
export type addMealData = z.infer<typeof addMealSchema>;
export type addItineraryData = z.infer<typeof addItinerarySchema>;
export type editItineraryData = z.infer<typeof editItinerarySchema>;
