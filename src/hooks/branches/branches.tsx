import api from "../axios/axios";

export const getBranch = async (id: string) => {
  try {
    const res = await api.get(`company?branchOnly=true&branchId=${id}`);

    return res.data.data;
  } catch (error: any) {
    const message = error.res.data.data.message;
    throw new Error(message);
  }
};

export const getAllBranches = async () => {
  try {
    const res = await api.get(`company?branchOnly=true`);

    return res.data.data;
  } catch (error: any) {
    const message = error.res.data.data.message;
    throw new Error(message);
  }
};
