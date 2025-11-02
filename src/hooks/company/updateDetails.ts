import api from "../axios/axios";

export const updateDetails = async (data: FormData) => {
  try {
    const res = await api.put(`/company/68f82f7317ac671ea8917396`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
