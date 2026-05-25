import type { addTypesCategoriesData } from "../../types/types-categories/addTypesCategoriesTypes";
import type { typesCategoriesSearchData } from "../../types/types-categories/typesCategoriesSearchTypes";
import { getFormattedTypeCategory } from "../../utils/getFormattedTypeCategory";
import api from "../axios/axios";

export const addTypesCategories = async (data: addTypesCategoriesData) => {
  try {
    const res = await api.post(`/categories-available`, data);
    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    let initialErrorMessage = error.response.data.message;
    let finalErrorMessage = null;

    if (initialErrorMessage === "Server error") {
      initialErrorMessage = error.response.data.error;
      if (initialErrorMessage.includes("E11000")) {
        finalErrorMessage = `The name for this ${data.type.toUpperCase()} already exists!`;
      }
    }

    throw new Error(finalErrorMessage || initialErrorMessage);
  }
};

export const deleteTypesCategories = async (id: string, type: string) => {
  try {
    let typeArgs = getFormattedTypeCategory(type);
    const res = await api.delete(
      `/categories-available/${id}?type=${typeArgs}`,
    );
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
    let initialErrorMessage = error.response.data.message;
    let finalErrorMessage = null;

    if (initialErrorMessage === "Server error") {
      initialErrorMessage = error.response.data.error;
      if (initialErrorMessage.includes("E11000")) {
        finalErrorMessage = `The name for this ${data.type.toUpperCase()} already exists!`;
      }
    }

    throw new Error(finalErrorMessage || initialErrorMessage);
  }
};

export const getTypesCategories = async (data: typesCategoriesSearchData) => {
  try {
    let typeArgs = getFormattedTypeCategory(data.service);
    const res = await api.get(
      `/categories-available?type=${typeArgs}&enablePagination=true&page=${data.page}&limit=9`,
    );
    console.log(res.data.data);
    return {
      typesCategories: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTypeCategory = async (type: string | null, id?: string) => {
  try {
    let typeArgs = getFormattedTypeCategory(type);
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
