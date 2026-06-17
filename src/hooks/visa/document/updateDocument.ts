import api from "../../axios/axios";

export const updateDocument = async (id: string, data: any) => {
  try {
    const res = await api.put(`/shared-fields/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
