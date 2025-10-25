import api from "../axios/axios";

export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`/users/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
