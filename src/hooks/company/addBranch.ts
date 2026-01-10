import api from "../axios/axios";

export const addBranch = async (data: FormData) => {
  try {
    const res = await api.put(`/company/69615f8fba32498f77077c23`, data);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    console.log(error);
    throw new Error(message);
  }
};
