import api from "../axios/axios";

export const getDetails = async () => {
  try {
    const res = await api.get(`/company`);
    console.log(res);
    return res.data.data[0];
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getAllAwards = async () => {
  try {
    const res = await api.get(`/company/awards`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getAwards = async (year: string, month: string) => {
  try {
    const res = await api.get(
      `/company/awards?awardYear=${year}&awardMonth=${month}`,
    );
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getCompanyId = async () => {
  try {
    const res = await api.get(`/company`);
    console.log(res.data);
    return res.data.data[0]._id;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};
