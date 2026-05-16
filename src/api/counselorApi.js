import axiosInstance from "./axiosInstance";

export const fetchCounselors = () => axiosInstance.get("/counselors");

export const fetchUsers = () => axiosInstance.get("/users");
