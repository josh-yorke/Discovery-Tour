import api from "../axios/axios";

export const getDetails = async () => {
  try {
    const res = await api.get(`/company/69615f8fba32498f77077c23`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
