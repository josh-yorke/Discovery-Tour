import api from "../axios/axios";

export const getBlog = async (id?: string) => {
  try {
    const res = await api.get(`/blogs/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
