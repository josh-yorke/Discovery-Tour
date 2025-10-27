import api from "../axios/axios";

export const getDetails = async () => {
  try {
    const res = await api.get(`/company/68f82f7317ac671ea8917396`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
