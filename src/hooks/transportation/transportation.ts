import type { transportSearchData } from "../../types/transportation/transportSearchTypes";
import api from "../axios/axios";

export const addTransportation = async (data: FormData) => {
  try {
    const res = await api.post(`/transports`, data);
    console.log(res.data.message);
    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteTransport = async (id: string) => {
  try {
    const res = await api.delete(`/transports/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateTransport = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/transports/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransport = async (id?: string) => {
  try {
    const res = await api.get(`/transports/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransports = async (data: transportSearchData) => {
  try {
    const res = await api.get(
      `/transports?page=${data.page}&limit=9&search=${data.search}&country=${data.country}&type=${data.type}`
    );
    console.log(res);
    return {
      transports: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getAllTransports = async (search: string) => {
  try {
    const res = await api.get(`/transports?search=${search}`);
    console.log(res);
    return {
      transports: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransportPricelists = async (id: string) => {
  try {
    const res = await api.get(`/shared-fields/?type=price&transportId=${id}`);
    console.log(res.data.data);
    return {
      pricelists: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
