/*eslint-disable*/
import axios from 'axios';
import store from '../store/index';
import router from '../router';

// axios 配置
// axios.defaults.timeout = 5000;
// let adminUrl = 'http://gicdev.demogic.com'
// let adminUrl = process.env.NODE_ENV === 'production' ? '':'http://111.231.99.90:8880/app/mock/19'
let adminUrl = process.env.NODE_ENV === 'production' ? '' : 'http://gicdev.demogic.com';
let request;

request = axios.create({
  baseURL: adminUrl,
  withCredentials: true, //跨域凭证
  timeout: 30000,
  headers: {
    //  'Content-Type': 'application/x-www-form-urlencoded'
    sign:''
    },
});

// http request 拦截器
request.interceptors.request.use(
  config => {
    config.params = {
      requestProject: 'integral-mall',
      ...config.params
    };

    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`;
    }
    if(localStorage.getItem('sign')) {
      config.headers.sign = localStorage.getItem('sign')
    }else{
      config.headers.sign = ''
    }
    // config.headers.sign = localStorage.getItem('sign')
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
request.interceptors.response.use(
  response => {
    if (response.status == 200 && response.data.errorCode === 401) {
      window.location.href = window.location.origin + '/gic-web';
      // window.location.href = 'http://gicdev.com/gic-web'

    }

    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT);
          router.replace({
            name: 'login',
            query: { redirect: router.currentRoute.fullPath }
          });
      }
    }
    return Promise.reject(error.response.data);
  }
);

export default request;
