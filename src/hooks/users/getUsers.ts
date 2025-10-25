import type { userSearchData } from "../../types/users/userSearchTypes";
import api from "../axios/axios";

export const getUsers = async (data: userSearchData) => {
  try {
    const res = await api.get(
      `/users?page=${data.page}&limit=12&search=${data.search}&status=${data.status}&role=${data.role}`
    );
    console.log(res);
    return {
      users: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
