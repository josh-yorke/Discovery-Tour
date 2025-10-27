import api from "../axios/axios";

export const addPromotion = async (data: FormData) => {
  try {
    const res = await api.post(`/promotions`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
