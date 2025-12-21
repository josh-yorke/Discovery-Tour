import api from "../axios/axios";

export const getTour = async (id?: string) => {
  try {
    const res = await api.get(`/tours/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
