import api from "../../axios/axios";

export const getDocument = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?visaId=${id}&type=document`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourDocument = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?tourId=${id}&type=document`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
