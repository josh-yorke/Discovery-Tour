import type { editMarkupData } from "../../types/markups/editMarkupTypes";
import api from "../axios/axios";
import { getCompanyId } from "../company/getDetails";

export const getAllMarkups = async () => {
  try {
    const companyId = await getCompanyId();

    const res = await api.get(`/company/${companyId}/markups?finalRate=false`);
    console.log(res);
    return {
      markups: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getMarkups = async () => {
  try {
    const companyId = await getCompanyId();

    const res = await api.get(`/company/${companyId}/markups?finalRate=true`);
    console.log(res.data);
    return {
      markups: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateMarkup = async (data: editMarkupData[]) => {
  try {
    const companyId = await getCompanyId();

    const res = await api.put(`/company/${companyId}/markups`, {
      conversionRatesMarkUp: data,
    });

    return {
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
