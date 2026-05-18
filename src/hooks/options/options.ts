import type { AddOptionBookingData } from "../../types/options/addOptionBooking";
import type { EditOptionBookingData } from "../../types/options/editOptionBooking";
import api from "../axios/axios";

export const getOptionBookings = async (
  page: number,
  status: string,
  search: string,
) => {
  try {
    const res = await api.get(
      `/options-for-you?page=${page}&limit=10&status=${status}&search=${search}`,
    );
    console.log(res);
    return {
      bookings: res.data.data,
      totalPages: res.data.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteOptionBooking = async (id: string) => {
  try {
    const res = await api.delete(`/options-for-you/${id}`);
    console.log(res);
    return {
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getOneOptionBooking = async (id: string) => {
  try {
    const res = await api.get(`/options-for-you/${id}`);
    console.log(res);
    return {
      booking: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addOptionBooking = async (
  emailCustomer: boolean,
  emailAdmin: boolean,
  data: AddOptionBookingData,
) => {
  try {
    const res = await api.post(
      `/options-for-you?send_email_customer=${emailCustomer}&send_email_admin=${emailAdmin}`,
      data,
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

export const updateOptionBooking = async (
  id: string,
  data: EditOptionBookingData,
) => {
  try {
    const res = await api.put(`/options-for-you/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
