// types/tours/itinerary/addItinerary.ts
import z from "zod";

// Activity schema
export const addActivitySchema = z.object({
  activityType: z.string().min(1, "Activity type is required"),
  information: z.string().min(1, "Information is required"),
});

// Meal schema
export const addMealSchema = z.object({
  mealType: z.string().min(1, "Meal type is required"),
  mealCount: z.string().min(1, "Meal count is required").or(z.number()),
  mealUnit: z.string().min(1, "Meal unit is required"),
  description: z.string().min(1, "Description is required"),
});

// Main itinerary schema
export const addItinerarySchema = z.object({
  title: z.string().min(2, "Title is required"),
  location: z.string().min(2, "Location is required"),
  dayOrder: z.string().min(1, "Day order is required").or(z.number()),
  activities: z
    .array(addActivitySchema)
    .min(1, "At least one activity is required"),
  meals: z.array(addMealSchema).min(1, "At least one meal is required"),
});

export const editItinerarySchema = z.object({
  _id: z.string(),
  title: z.string(),
  location: z.string(),
  dayOrder: z.string(),
  activities: z.array(addActivitySchema),
  meals: z.array(addMealSchema),
});

export type addActivityData = z.infer<typeof addActivitySchema>;
export type addMealData = z.infer<typeof addMealSchema>;
export type addItineraryData = z.infer<typeof addItinerarySchema>;
export type editItineraryData = z.infer<typeof editItinerarySchema>;
