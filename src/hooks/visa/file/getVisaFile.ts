import api from "../../axios/axios";

export const getVisaFile = async (id?: string) => {
  try {
    const res = await api.get(`shared-fields/${id}?type=file`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
