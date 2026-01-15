import type { addRentalData } from "../../types/rental/addRentalTypes";
import type { rentalSearchData } from "../../types/rental/rentalSearchTypes";
import api from "../axios/axios";

export const addRental = async (
  emailCustomer: boolean,
  emailAdmin: boolean,
  data: addRentalData
) => {
  try {
    const res = await api.post(
      `/vehicle-rentals?send_email_customer=${emailCustomer}&send_email_admin=${emailAdmin}`,
      data
    );
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
    const res = await api.delete(`/vehicle-rentals/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateRental = async (id: string, data: addRentalData) => {
  try {
    const res = await api.put(`/vehicle-rentals/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getRentals = async (data: rentalSearchData) => {
  try {
    const res = await api.get(
      `/vehicle-rentals?page=${data.page}&limit=9&year=${data.year}&month=${data.month}&day=${data.day}&status=${data.status}&search=${data.search}&vehicle=${data.vehicle}`
    );
    console.log(res.data.data);
    return {
      rentals: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getRental = async (id?: string) => {
  try {
    const res = await api.get(`/vehicle-rentals/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
