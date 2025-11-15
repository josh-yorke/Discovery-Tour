import api from "../../axios/axios";

export const getPricelists = async () => {
  try {
    const res = await api.get(`/visa-dependents?type=price`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
