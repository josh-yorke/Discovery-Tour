import api from "../axios/axios";
import { getCompanyId } from "./getDetails";

export const updateDetails = async (data: FormData) => {
  try {
    const companyId = await getCompanyId();

    const res = await api.put(`/company/${companyId}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
