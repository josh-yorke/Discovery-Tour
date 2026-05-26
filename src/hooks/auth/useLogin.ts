import api from "../axios/axios";

export const login = async (data: any) => {
  try {
    const res = await api.post(`/users/login`, data);

    if (res.data.success === true) {
      console.log(res.data.data);
      console.log(res.data.message);

      localStorage.setItem("user", JSON.stringify(res.data.data));
    }
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    console.log(message);
    throw new Error(message);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await api.post("/users/forgot-password", { email });

    console.log(res.data.message);

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message || "An error occurred";
    console.log(error.response);
    throw new Error(message);
  }
};

export const verifyResetToken = async (token: string) => {
  try {
    const res = await api.post("/users/verify-reset-token", { token });

    console.log(res.data.success);

    return res.data.success;
  } catch (error: any) {
    const message = error.res.data.message || "An error occurred";

    throw new Error(message);
  }
};

export const resetPassword = async (data: {
  password: string;
  token: string;
}) => {
  try {
    const res = await api.post("/users/reset-password", data);

    console.log(res.data.success);

    return res.data.success;
  } catch (error: any) {
    const message = error.res.data.message || "An error occurred";

    throw new Error(message);
  }
};
