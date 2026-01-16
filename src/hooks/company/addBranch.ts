import api from "../axios/axios";
import { getCompanyId } from "./getDetails";

export const addBranch = async (data: FormData) => {
  try {
    const companyId = await getCompanyId();

    const res = await api.put(`/company/${companyId}`, data);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    console.log(error);
    throw new Error(message);
  }
};
