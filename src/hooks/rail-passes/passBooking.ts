import type { addRailBookingData } from "../../types/rail-pass/addBookingTypes";
import type { bookingSearchData } from "../../types/rail-pass/bookingSearchTypes";
import api from "../axios/axios";

export const addPassBooking = async (
  emailCustomer: boolean,
  emailAdmin: boolean,
  data: addRailBookingData,
) => {
  try {
    const res = await api.post(
      `/railpass-bookings?send_email_customer=${emailCustomer}&send_email_admin=${emailAdmin}`,
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

export const deleteBooking = async (id: string) => {
  try {
    const res = await api.delete(`/railpass-bookings/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateBooking = async (id: string, data: addRailBookingData) => {
  try {
    const res = await api.put(`/railpass-bookings/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getBookings = async (data: bookingSearchData) => {
  try {
    const res = await api.get(
      `/railpass-bookings?page=${data.page}&limit=9&search=${data.search}&status=${data.status}&railpass=${data.railpass}&year=${data.year}&month=${data.month}&day=${data.day}`,
    );
    console.log(res.data.data);
    return {
      booking: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getBooking = async (id?: string) => {
  try {
    const res = await api.get(`/railpass-bookings/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
