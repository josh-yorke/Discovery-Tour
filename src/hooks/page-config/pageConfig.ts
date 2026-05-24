import api from "../axios/axios";

export const getAllPageConfigs = async () => {
  try {
    const res = await api.get(`/page-configs?`);

    return {
      configs: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPageConfigs = async (page: string, types: string[]) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", "10");
    params.append("page", page);

    types.forEach((type) => {
      params.append("types", type);
    });

    const res = await api.get(`/page-configs?${params.toString()}`);
    console.log(res);
    return {
      configs: res.data.data,
      totalPages: res.data.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPageConfig = async (id?: string) => {
  try {
    const res = await api.get(`/page-configs/${id}`);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addPageConfig = async (data: any) => {
  try {
    const res = await api.post(`/page-configs`, data);

    return {
      id: res.data.data._id,
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const updatePageConfig = async (id: string, data: any) => {
  try {
    const res = await api.put(`/page-configs/${id}`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const arrangePages = async (data: any) => {
  try {
    const res = await api.put(`/page-configs/`, data);
    console.log(res.data.message);
    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deletePageConfig = async (id: string) => {
  try {
    const res = await api.delete(`/page-configs/${id}`);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
