import api from "../../axios/axios";

export const searchVisa = async (search: string) => {
  try {
    const res = await api.get(`/visas?search=${search}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
