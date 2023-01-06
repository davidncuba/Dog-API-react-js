import axios from "axios";
import { HOST_API } from "../config";

const axiosInstance = axios.create({
  baseURL: HOST_API,
});
axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: { response: { data: any } }) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;
