import type { addCareerData } from "../../types/career/addCareerTypes";
import type { careerSearchData } from "../../types/career/careerSearchTypes";
import api from "../axios/axios";

export const addCareer = async (data: addCareerData) => {
  try {
    const res = await api.post("/careers", data);
    console.log(res.data.data);

    return res.data.data.message;
  } catch (error: any) {
    const message = error.response.data.message;
    throw new Error(message);
  }
};

export const deleteCareer = async (id: string) => {
  try {
    const res = await api.delete(id);

    return res.data.data.message;
  } catch (error: any) {
    const message = error.response.data.message;
    throw new Error(message);
  }
};

export const updateCareer = async (id: string, data: addCareerData) => {
  try {
    const res = await api.put(id, data);

    console.log(res.data.data);
    return res.data.data.message;
  } catch (error: any) {
    const message = error.res.data.data.message;
    throw new Error(message);
  }
};

export const getCareer = async (id: string) => {
  try {
    const res = await api.get(id);

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
      `careers?page=${data.page}&limit=${data.limit}&status=${data.status}&search=${data.search}&employmentType=${data.employmentType}&branch=${data.branch}`,
    );
    console.log(res.data.data);
    return res.data.data;
  } catch (error: any) {
    const message = error.res.data.data.message;
    throw new Error(message);
  }
};
