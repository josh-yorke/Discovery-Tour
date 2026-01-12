import api from "../../axios/axios";

export const getTerm = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?visaId=${id}&type=terms`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourTerm = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?tourId=${id}&type=terms`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPassTerm = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?railPassId=${id}&type=terms`);
    console.log(res);
    return {
      terms: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransportTerm = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?transportId=${id}&type=terms`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
