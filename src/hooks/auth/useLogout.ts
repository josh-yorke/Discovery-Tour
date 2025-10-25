import api from "../axios/axios";

export const logout = async () => {
  try {
    const res = await api.post("/users/logout");
    localStorage.removeItem("user");

    return res.data.message;
  } catch (error: any) {
    const message = error.response.data.message;
    throw new Error(message);
  }
};
