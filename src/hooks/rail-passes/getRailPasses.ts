import type { railSearchData } from "../../types/rail-pass/railSearchTypes";
import api from "../axios/axios";

export const getRailPasses = async (data: railSearchData) => {
  try {
    const res = await api.get(
      `/rail-passes?page=${data.page}&limit=12&search=${data.search}&country=${data.country}&type=${data.type}`
    );
    console.log(res);
    return {
      railPasses: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
