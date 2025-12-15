import type { visaSearchData } from "../../../types/visa/visaSearchTypes";
import api from "../../axios/axios";

export const getVisas = async (data: visaSearchData) => {
  try {
    const res = await api.get(
      `/visas?page=${data.page}&limit=12&search=${data.search}&country=${data.country}&type=${data.type}`
    );
    console.log(res);
    return {
      visas: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaCountries = async () => {
  try {
    const res = await api.get(`/global-fields?type=country`);

    const countries = [
      ...new Set(res.data.data.map((item: any) => item.country)),
    ];
    return {
      countries,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaTypes = async () => {
  try {
    const res = await api.get(`/global-fields?type=visa-type`);

    const visaTypes = [
      ...new Set(res.data.data.map((item: any) => item.visaType)),
    ];
    return {
      visaTypes,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
