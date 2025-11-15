import api from "../../axios/axios";

export const addVisaFile = async (data: FormData) => {
  try {
    const res = await api.post(`/visa-dependents`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
