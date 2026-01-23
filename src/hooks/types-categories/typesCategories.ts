import type { addTypesCategoriesData } from "../../types/types-categories/addTypesCategoriesTypes";
import type { rentalSearchData } from "../../types/rental/rentalSearchTypes";
import type { typesCategoriesSearchData } from "../../types/types-categories/typesCategoriesSearchTypes";
import api from "../axios/axios";

export const addTypesCategories = async (data: addTypesCategoriesData) => {
  try {
    console.log({ sendingData: data });
    const res = await api.post(`/categories-available`, data);
    console.log(res.data.message);
    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteRental = async (id: string) => {
  try {
    const res = await api.delete(`/categories-available/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateTypesCategories = async (
  id: string,
  data: addTypesCategoriesData,
) => {
  try {
    const res = await api.put(`/categories-available/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTypesCategories = async (data: typesCategoriesSearchData) => {
  try {
    let typeArgs = "";
    if (data.service === "country" || data.service === "pass-category") {
      typeArgs = data.service;
    } else {
      typeArgs = `${data.service}-type`;
    }

    const res = await api.get(`/categories-available?type=${typeArgs}`);
    console.log(res.data.data);
    return {
      typesCategories: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTypeCategory = async (type: string | null, id?: string) => {
  try {
    let typeArgs = "";
    if (type === "country" || type === "pass-category") {
      typeArgs = type;
    } else {
      typeArgs = `${type}-type`;
    }

    const res = await api.get(
      `/categories-available/${id}?type=${typeArgs}&withType=true`,
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
