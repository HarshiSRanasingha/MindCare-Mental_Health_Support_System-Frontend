import axiosInstance from "./axiosInstance";

export const fetchRequests = () => axiosInstance.get("/requests");

export const createRequest = (data) => axiosInstance.post("/requests", data);

export const updateRequest = (id, data) =>
  axiosInstance.put(`/requests/${id}`, data);

export const deleteRequest = (id) => axiosInstance.delete(`/requests/${id}`);
