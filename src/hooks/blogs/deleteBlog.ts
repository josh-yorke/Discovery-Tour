import api from "../axios/axios";

export const deleteBlog = async (id: string) => {
  try {
    const res = await api.delete(`/blogs/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
