import api from "../../axios/axios";

export const deleteTerm = async (id: string) => {
  try {
    const res = await api.delete(`/shared-fields/${id}?type=terms`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
