import axiosInstance from "./axiosInstance";

export const loginUser = (data) => axiosInstance.post("/auth/login", data);

export const registerUser = (data) =>
  axiosInstance.post("/auth/register-user", data);

export const registerCounselor = (data) =>
  axiosInstance.post("/auth/register-counselor", data);
