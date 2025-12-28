import api from "../../axios/axios";

export const addCity = async (data: FormData) => {
  try {
    const res = await api.post(`/tour-dependent-fields`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getCity = async (id?: string) => {
  try {
    const res = await api.get(
      `/tour-dependent-fields/?tourId=${id}&type=tour-city`
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteCity = async (id?: string) => {
  try {
    const res = await api.delete(`/tour-dependent-fields/${id}?type=tour-city`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateCity = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/tour-dependent-fields/${id}`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
