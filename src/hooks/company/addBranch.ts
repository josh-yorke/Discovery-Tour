import api from "../axios/axios";

export const addBranch = async (data: FormData) => {
  try {
    const res = await api.put(`/company/68f82f7317ac671ea8917396`, data);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    console.log(error);
    throw new Error(message);
  }
};
