import api from "../../axios/axios";

export const getProcess = async (id?: string) => {
  try {
    const res = await api.get(`/visa-dependents/?visaId=${id}&type=process`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
