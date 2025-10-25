import api from "../axios/axios";

export const getUser = async (id?: string) => {
  try {
    const res = await api.get(`/users/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
