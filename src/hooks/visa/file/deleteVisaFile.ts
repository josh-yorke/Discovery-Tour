import api from "../../axios/axios";

export const deleteVisaFile = async (id: string) => {
  try {
    const res = await api.delete(`/visa-dependents/${id}?type=file`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
