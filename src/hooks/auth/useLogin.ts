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
