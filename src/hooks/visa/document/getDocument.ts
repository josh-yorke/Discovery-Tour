import api from "../../axios/axios";

export const getDocument = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?visaId=${id}&type=document`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourDocument = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?tourId=${id}&type=document`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPassDocument = async (id?: string) => {
  try {
    const res = await api.get(`/shared-fields/?railPassId=${id}&type=document`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransportDocument = async (id?: string) => {
  try {
    const res = await api.get(
      `/shared-fields/?transportId=${id}&type=document`,
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getInsuranceDocument = async (id?: string) => {
  try {
    const res = await api.get(
      `/shared-fields/?insuranceId=${id}&type=document`,
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTourCities = async (id: string) => {
  try {
    const res = await api.get(
      `/tour-dependent-fields/public?type=tour-city&tourId=${id}`,
    );

    const cities = [...new Set(res.data.data.map((item: any) => item.city))];
    console.log(cities);
    return {
      cities,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
