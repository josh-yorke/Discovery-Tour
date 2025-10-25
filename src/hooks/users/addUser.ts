import type { addUserData } from "../../types/users/addUserTypes";
import api from "../axios/axios";

export const addUser = async (data: addUserData) => {
  try {
    const res = await api.post(`/users`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
