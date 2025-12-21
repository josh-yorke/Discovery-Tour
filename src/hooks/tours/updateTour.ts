import api from "../axios/axios";

export const updateTour = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/tours/${id}`, data);
    console.log(res.data.message);
    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
