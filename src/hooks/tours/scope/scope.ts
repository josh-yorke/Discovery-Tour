import api from "../../axios/axios";

export const addScope = async (data: FormData) => {
  try {
    const res = await api.post(`/tour-dependent-fields`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getScope = async (id?: string) => {
  try {
    const res = await api.get(
      `/tour-dependent-fields/?tourId=${id}&type=tour-scope`
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deleteScope = async (id?: string) => {
  try {
    const res = await api.delete(
      `/tour-dependent-fields/${id}?type=tour-scope`
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updateScope = async (id: string, data: FormData) => {
  try {
    const res = await api.put(`/tour-dependent-fields/${id}`, data);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
