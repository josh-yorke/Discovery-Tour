import api from "../axios/axios";

export const getAllInsurances = async () => {
  try {
    const res = await api.get(`/insurances`);
    console.log(res);
    return {
      insurances: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getInsurances = async (page: number, search: string) => {
  try {
    const res = await api.get(
      `/insurances?page=${page}&limit=9&search=${search}`,
    );
    console.log(res);
    return {
      insurances: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getInsurance = async (id?: string) => {
  try {
    const res = await api.get(`/insurances/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addInsurance = async (data: FormData) => {
  try {
    const res = await api.post(`/insurances`, data);

    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateInsurance = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/insurances/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteInsurance = async (id: string) => {
  try {
    const res = await api.delete(`/insurances/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
