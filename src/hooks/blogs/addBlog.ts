import api from "../axios/axios";

export const addBlog = async (data: FormData) => {
  try {
    const res = await api.post(`/blogs`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
