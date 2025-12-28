import api from "../../axios/axios";

export type AddItineraryPayload = {
  type: string;
  tour: string;
  title: string;
  location: string;
  dayOrder: number;
  activities: Array<{
    activityType: string;
    information: string;
  }>;
  meals: Array<{
    mealType: string;
    mealCount: string; // Keep as string
    mealUnit: string;
    description: string;
  }>;
};

export const addItinerary = async (
  payload: AddItineraryPayload
): Promise<string> => {
  try {
    console.log("📤 Sending itinerary payload to API:", payload);
    const response = await api.post("/tour-dependent-fields", payload);
    console.log("✅ Itinerary added successfully:", response.data);
    return response.data._id;
  } catch (error: any) {
    console.error("❌ Failed to add itinerary:", error);
    throw new Error(error.response?.data?.message || "Failed to add itinerary");
  }
};

export const getItinerary = async (id?: string) => {
  try {
    const res = await api.get(
      `/tour-dependent-fields/?tourId=${id}&type=tour-itinerary`
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteItinerary = async (id?: string) => {
  try {
    const res = await api.delete(
      `/tour-dependent-fields/${id}?type=tour-itinerary`
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateItinerary = async (
  id: string,
  payload: AddItineraryPayload
): Promise<string> => {
  try {
    console.log("📤 Sending itinerary payload to API:", payload);
    const response = await api.put(`/tour-dependent-fields/${id}`, payload);
    console.log("✅ Itinerary added successfully:", response.data);
    return response.data._id;
  } catch (error: any) {
    console.error("❌ Failed to add itinerary:", error);
    throw new Error(error.response?.data?.message || "Failed to add itinerary");
  }
};
