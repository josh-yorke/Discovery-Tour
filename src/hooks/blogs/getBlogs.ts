import type { blogsSearchData } from "../../types/blogs/blogsSearchTypes";
import api from "../axios/axios";

export const getBlogs = async (data: blogsSearchData) => {
  try {
    const res = await api.get(
      `/blogs?page=${data.page}&limit=12&search=${data.search}&status=${data.status}`
    );
    console.log(res);
    return {
      blogs: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
