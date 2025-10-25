import api from "../axios/axios";

export const verifyEmail = async (email: string) => {
  try {
    const res = await api.post(`/users/verify-email`, { email });

    if (res.data.success === true) {
      return {
        message: res.data.message,
        code: res.data.data,
      };
    }
  } catch (error: any) {
    const message = error.response?.data?.message || "An Error Occurred";
    console.log(message);
    throw new Error(message);
  }
};
