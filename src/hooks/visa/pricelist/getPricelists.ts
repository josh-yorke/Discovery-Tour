import api from "../../axios/axios";

export const getPricelists = async (visaId: string) => {
  try {
    const res = await api.get(`/visa-dependents/?type=price&visaId=${visaId}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
