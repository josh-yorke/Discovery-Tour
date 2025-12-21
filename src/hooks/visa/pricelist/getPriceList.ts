import api from "../../axios/axios";

export const getPricelist = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?visaId=${id}&type=price`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
