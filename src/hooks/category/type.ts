import api from "../axios/axios";

export const getPassTypes = async () => {
  try {
    const res = await api.get(`/categories-available?type=pass-type`);

    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getAllPassTypes = async () => {
  try {
    const res = await api.get(`/categories-available?type=pass-type`);

    const passTypes = [
      ...new Set(res.data.data.map((item: any) => item.railPassType)),
    ];

    return {
      passTypes,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getTransportTypes = async () => {
  try {
    const res = await api.get(`/categories-available?type=transport-type`);
    console.log(res.data.data);
    const types = [
      ...new Set(res.data.data.map((item: any) => item.transportType)),
    ];
    return {
      types,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getPassTypesByCategory = async (category: string) => {
  try {
    const res = await api.get(
      `/categories-available/types?category=${category}&type=pass-type`
    );

    console.log(res.data);

    const types = [
      ...new Set(res.data.data.map((item: any) => item.type.railPassType)),
    ];
    return {
      types,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addPassType = async (railPassType: string) => {
  try {
    const res = await api.post(`/categories-available`, {
      type: "pass-type",
      railPassType,
    });

    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deletePassType = async (id: string) => {
  try {
    const res = await api.post(`/categories-available/${id}?type=pass-type`);

    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
