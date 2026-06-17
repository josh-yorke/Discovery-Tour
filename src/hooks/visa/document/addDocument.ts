import api from "../../axios/axios";

export const addDocument = async (data: any) => {
  try {
    const res = await api.post(`/shared-fields`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
