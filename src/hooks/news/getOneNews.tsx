import api from "../axios/axios";

export const getOneNews = async (id?: string) => {
  try {
    const res = await api.get(`/news/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
