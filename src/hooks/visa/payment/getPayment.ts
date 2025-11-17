import api from "../../axios/axios";

export const getPayment = async (id?: string) => {
  try {
    const res = await api.get(`/visa-dependents/?visaId=${id}&type=payment`);
    console.log(res);
    return res.data.data[0];
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
