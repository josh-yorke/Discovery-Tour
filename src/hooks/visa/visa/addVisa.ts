import api from "../../axios/axios";

export const addVisa = async (data: FormData) => {
  try {
    const res = await api.post(`/visas`, data);

    return res.data.data._id;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
