import api from "../../axios/axios";

export const addPriceList = async (data: FormData) => {
  try {
    const res = await api.post(`/shared-fields`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
