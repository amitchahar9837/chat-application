import axios from "axios";
// const baseURL= import.meta.env.VITE_BASE_URL;
export const axiosInstance = axios.create({
  baseURL:`http://localhost:3001/api`,
  withCredentials: true
});

