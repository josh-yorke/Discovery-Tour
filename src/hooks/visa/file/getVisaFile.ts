import api from "../../axios/axios";

export const getVisaFile = async (id?: string) => {
  try {
    const res = await api.get(`/visa-dependents/${id}?type=file`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
