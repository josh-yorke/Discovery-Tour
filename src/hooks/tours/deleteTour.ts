import api from "../axios/axios";

export const deleteTour = async (id: string) => {
  try {
    const res = await api.delete(`/tours/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
