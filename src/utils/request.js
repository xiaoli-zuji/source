import Vue from "vue";
import axios from "axios";
import { getToken, removeToken } from "./token";
import router from '../router'

// 设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;

// 允许携带cookies
axios.defaults.withCredentials = true;

// Add a request interceptor
// 请求拦截器
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // console.log("-----------------", config);
    const token = getToken();
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
// 响应拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.data.code == 206) {
        //token过期了
        // 移出token
        removeToken();

        // 跳转到登录页面
        router.push('/login')

    }
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

Vue.prototype.$axios = axios;
