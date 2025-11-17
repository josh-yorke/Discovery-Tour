import type { visaSearchData } from "../../../types/visa/visaSearchTypes";
import api from "../../axios/axios";

export const getVisas = async (data: visaSearchData) => {
  try {
    const res = await api.get(
      `/visas?page=${data.page}&limit=12&search=${data.search}`
    );
    console.log(res);
    return {
      visas: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
