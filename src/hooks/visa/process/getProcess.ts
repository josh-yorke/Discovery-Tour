import api from "../../axios/axios";

export const getProcess = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?visaId=${id}&type=process`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourProcess = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?tourId=${id}&type=process`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPassProcess = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?railPassId=${id}&type=process`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransportProcess = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?transportId=${id}&type=process`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
