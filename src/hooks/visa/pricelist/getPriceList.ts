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
export const getTourPricelist = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?tourId=${id}&type=price`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPassPricelist = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?railPassId=${id}&type=price`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransportPricelist = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?transportId=${id}&type=price`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getInsurancePricelist = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?insuranceId=${id}&type=price`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
