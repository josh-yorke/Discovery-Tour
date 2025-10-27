import type { promotionSearchData } from "../../types/promotions/promotionSearchTypes";

import api from "../axios/axios";

export const getPromotions = async (data: promotionSearchData) => {
  try {
    const res = await api.get(
      `/promotions?page=${data.page}&limit=12&search=${data.search}&status=${data.status}`
    );
    console.log(res);
    return {
      promotions: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
