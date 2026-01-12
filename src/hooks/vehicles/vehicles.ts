import type { vehicleSearchData } from "../../types/vehicles/vehicleSearchTypes";
import api from "../axios/axios";

export const getAllVehicles = async (search: string) => {
  try {
    const res = await api.get(
      `/vehicles?search=${search}&isAvailable=true&status=active`
    );
    console.log(res);
    return {
      vehicles: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVehicles = async (data: vehicleSearchData) => {
  try {
    const res = await api.get(
      `/vehicles?page=${data.page}&limit=9&search=${data.search}&isAvailable=${data.isAvailable}&status=${data.status}`
    );
    console.log(res);
    return {
      vehicles: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVehicle = async (id?: string) => {
  try {
    const res = await api.get(`/vehicles/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    const res = await api.delete(`/vehicles/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addVehicle = async (data: FormData) => {
  try {
    const res = await api.post(`/vehicles`, data);
    console.log(res.data.message);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateVehicle = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/vehicles/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
