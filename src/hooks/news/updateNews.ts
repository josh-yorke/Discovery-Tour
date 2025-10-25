import api from "../axios/axios";

export const updateNews = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/news/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
