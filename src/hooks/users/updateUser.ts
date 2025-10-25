import type { editUserData } from "../../types/users/editUserTypes";
import api from "../axios/axios";

export const updateUser = async (id: string, data: editUserData) => {
  try {
    const res = await api.put(`/users/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
