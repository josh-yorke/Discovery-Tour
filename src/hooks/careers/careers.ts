import type { careerSearchData } from "../../types/career/careerSearchTypes";
import api from "../axios/axios";

export const addCareer = async (data: FormData) => {
  try {
    const res = await api.post("/careers", data);

    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message;
    throw new Error(message);
  }
};

export const deleteCareer = async (id: string) => {
  try {
    const res = await api.delete(`/careers/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message;
    throw new Error(message);
  }
};

export const updateCareer = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/careers/${id}`, data);

    console.log(res.data.data);
    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.res.data.message;
    throw new Error(message);
  }
};

export const getCareer = async (id?: string) => {
  try {
    const res = await api.get(`/careers/${id}`);

    console.log(res.data.data);
    return res.data.data;
  } catch (error: any) {
    const message = error.res.data.data.message;

    throw new Error(message);
  }
};

export const getAllCareers = async (data: careerSearchData) => {
  try {
    const res = await api.get(
      `careers?page=${data.page}&limit=9&status=${data.status}&search=${data.search}&employmentType=${data.employmentType}&branch=${data.branch}`,
    );
    console.log(res.data.data);
    return res.data.data;
  } catch (error: any) {
    const message = error.res.data.message;
    throw new Error(message);
  }
};
