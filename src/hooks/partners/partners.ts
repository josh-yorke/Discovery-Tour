import type { partnerSearchData } from "../../types/partners/partnerSearchTypes";
import api from "../axios/axios";

export const getPartners = async (data: partnerSearchData) => {
  try {
    const res = await api.get(
      `/partners?page=${data.page}&limit=9&search=${data.search}&type=${data.type}`,
    );
    console.log(res);
    return {
      partners: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getAllPartners = async (type: string) => {
  try {
    const res = await api.get(`/partners?type=${type}`);
    console.log(res);
    const partners = [
      ...new Set(res.data.data.map((item: any) => item.partnerName)),
    ];
    return {
      partners,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPartner = async (id?: string) => {
  try {
    const res = await api.get(`partners/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addPartner = async (data: FormData) => {
  try {
    const res = await api.post(`/partners`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updatePartner = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/partners/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deletePartner = async (id: string) => {
  try {
    const res = await api.delete(`/partners/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
