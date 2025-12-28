import api from "../../axios/axios";

export const deletePayment = async (id: string) => {
  try {
    const res = await api.delete(`/shared-fields/${id}?type=payment`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
