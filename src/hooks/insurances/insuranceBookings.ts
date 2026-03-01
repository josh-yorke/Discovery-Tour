import type { addInsuranceBookingData } from "../../types/insurances/addInsuranceBookingTypes";
import type { insuranceBookingSearchData } from "../../types/insurances/insuranceBookingSearchTypes";
import api from "../axios/axios";

export const getInsuranceBookings = async (
  data: insuranceBookingSearchData,
) => {
  try {
    const res = await api.get(
      `/insurance-bookings?page=${data.page}&limit=9&search=${data.search}&status=${data.status}&insurance=${data.insurance}&year=${data.year}&month=${data.month}&day=${data.day}`,
    );
    console.log(res.data.data);
    return {
      bookings: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addInsuranceBooking = async (
  emailCustomer: boolean,
  emailAdmin: boolean,
  data: addInsuranceBookingData,
) => {
  try {
    const res = await api.post(
      `/insurance-bookings?send_email_customer=${emailCustomer}&send_email_admin=${emailAdmin}`,
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

export const deleteInsuranceBooking = async (id: string) => {
  try {
    const res = await api.delete(`/insurance-bookings/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateInsuranceBooking = async (
  id: string,
  data: addInsuranceBookingData,
) => {
  try {
    const res = await api.put(`/insurance-bookings/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getInsuranceBooking = async (id?: string) => {
  try {
    const res = await api.get(`/insurance-bookings/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
