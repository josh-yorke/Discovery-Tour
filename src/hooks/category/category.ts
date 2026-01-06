import api from "../axios/axios";

export const getPassCategory = async () => {
  try {
    const res = await api.get(`/categories-available?type=pass-category`);
    const categories = [
      ...new Set(res.data.data.map((item: any) => item.railPassCategory)),
    ];
    return {
      categories,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const addPassCategory = async (railPassCategory: string) => {
  try {
    const res = await api.post(`/categories-available`, {
      type: "pass-category",
      railPassCategory,
    });

    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const deletePassCategory = async (id: string) => {
  try {
    const res = await api.post(
      `/categories-available/${id}?type=pass-category`
    );

    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
