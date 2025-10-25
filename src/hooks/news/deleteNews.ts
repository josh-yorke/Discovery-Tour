import api from "../axios/axios";

export const deleteNews = async (id: string) => {
  try {
    const res = await api.delete(`/news/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
