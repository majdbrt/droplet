import axios from "axios";
import Cookies from "universal-cookie";
import axiosRetry from 'axios-retry';

const cookies = new Cookies();

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

axiosRetry(api, { retries: 3 });

api.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (!originalConfig._retry) {
        originalConfig._retry = true;

        try {
          return axios.get("/auth/token", {
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true
          })
            .then((rs) => {
              const { accessToken } = rs.data;
              cookies.set("accessToken", accessToken);

              return api.request(originalConfig);
            });


        } catch (_error) {
          //window.location.href = "/login";
          return Promise.reject(_error);
        }// catch

      }// if
      //window.location.href = "/login";
    } // if

    return Promise.reject(err);
  }
);

export default api;
