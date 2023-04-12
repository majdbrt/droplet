import axios from "axios";
import Cookies from "universal-cookie";
import axiosRetry from 'axios-retry';

const cookies = new Cookies();

const authApi = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

axiosRetry(authApi, { retries: 3 });

authApi.interceptors.request.use(
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

authApi.interceptors.response.use(
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
          return axios.get("/auth/token",{
            baseURL: "http://localhost:3001",
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true})
            .then((rs) => {
              const { accessToken } = rs.data;
              cookies.set("accessToken", accessToken);

              return authApi.request(originalConfig);
            }).catch((e)=>{
              window.location.href = "/login";
            })
            ;


        } catch (_error) {
          cookies.remove("accessToken");
          window.location.href = "/login";
          //window.location.href = "/login";
          return Promise.reject(_error);
        }// catch

      }// if
      cookies.remove("accessToken");
      window.location.href = "/login";
      //window.location.href = "/login";
    } // if
    window.location.href = "/login";
    return Promise.reject(err);
  }
);

export default authApi;