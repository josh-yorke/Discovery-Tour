import api from "../../axios/axios";

export const getVisa = async (id?: string) => {
  try {
    const res = await api.get(`/visas/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
