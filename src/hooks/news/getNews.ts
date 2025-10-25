import type { newsSearchData } from "../../types/news/newsSearchTypes";
import api from "../axios/axios";

export const getNews = async (data: newsSearchData) => {
  try {
    const res = await api.get(
      `/news?page=${data.page}&limit=12&search=${data.search}&status=${data.status}`
    );
    console.log(res);
    return {
      news: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
