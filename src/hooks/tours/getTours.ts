import type { tourSearchData } from "../../types/tours/tourSearchTypes";
import api from "../axios/axios";

export const getTours = async (data: tourSearchData) => {
  try {
    const res = await api.get(
      `/tours?page=${data.page}&limit=12&search=${data.search}&country=${data.country}`
    );
    console.log(res);
    return {
      tours: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourTypes = async () => {
  try {
    const res = await api.get(`/categories-available?type=tour-type`);

    const tourTypes = [
      ...new Set(res.data.data.map((item: any) => item.tourType)),
    ];
    return {
      tourTypes,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourTypesId = async () => {
  try {
    const res = await api.get(`/categories-available?type=tour-type`);

    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
