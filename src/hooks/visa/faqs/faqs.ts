import api from "../../axios/axios";

export const addFaq = async (data: FormData) => {
  try {
    const res = await api.post("/shared-fields", data);

    return res.data.data;
  } catch (err: any) {
    const message = err.res.data.data;

    throw new Error(message);
  }
};

export const updateFaq = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/shared-fields/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getFaqs = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?visaId=${id}&type=faq`);

    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteFaq = async (id: string) => {
  try {
    const res = await api.delete(`/shared-fields/${id}?type=faq`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getAllFaqs = async (idType: string, id: string) => {
  try {
    const res = await api.get(`/shared-fields/?type=faq&${idType}=${id}`);

    return res.data.data;
  } catch (err: any) {
    const message = err.res.data.message;

    throw new Error(message);
  }
};

export const getFaq = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?visaId=${id}&type=faq`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourFaq = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?tourId=${id}&type=faq`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPassFaq = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?railPassId=${id}&type=faq`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransportFaq = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?transportId=${id}&type=faq`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getInsuranceFaq = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?insuranceId=${id}&type=faq`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
