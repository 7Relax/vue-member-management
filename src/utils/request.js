import axios from "axios";

// 自定义axios对象
const request = axios.create({
    // baseURL: '/',
    // baseURL: '/dev-api',
    baseURL: process.env.VUE_APP_BASE_API, // 基础路径
    timeout: 5000,                         // 请求超时设置为5s
});

// 别的组件中的可以这样使用1：
// request.get("/db.json").then(response => {
//     console.log(response.data);
// });

// 别的组件中的可以这样使用2：
// request({
//     url: '/db.json',
//     method: 'get'
// }).then(response => {
//     console.log(response.data);
// });

// 请求拦截器
request.interceptors.request.use(config => {
    return config;
}, error => {
    // 出现异常，es6语法抛出异常
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});

// 导出自定义创建的axios对象
export default request;