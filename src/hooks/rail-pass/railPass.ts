import api from "../axios/axios";

export const addRailPass = async (data: FormData) => {
  try {
    const res = await api.post(`/rail-passes`, data);
    console.log(res.data.message);
    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteRailPass = async (id: string) => {
  try {
    const res = await api.delete(`/rail-passes/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
