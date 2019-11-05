import axios from "axios";
import { Loading, Message } from 'element-ui';

const loading = {
    loadingInstance: null, // loading实例
    // 打开加载
    open: function() {
        // 如果实例为空则创建
        if (this.loadingInstance === null) {
            // 创建实例，只有创建了一次Loading.service({})这个动作，才会出现页面上的加载效果，所以每加载一次就创建一个实例，那么实例是什么时候销毁的呢？大量实例被创建会导致内存溢出吗？
            this.loadingInstance = Loading.service({
                target: '.main',
                text: '拼命加载中...',
                background: 'rgba(0, 0, 0, 0.5)'
            });
        }
    },
    // 关闭加载
    close: function() {
        // 不为空时才可调用close():
        if (this.loadingInstance !== null) {
            this.loadingInstance.close();
            this.loadingInstance = null;
        }
    }
}

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
    // 打开加载
    loading.open();
    return config;
}, error => {
    // 关闭加载
    loading.close();
    // 出现异常，es6语法抛出异常
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(response => {
    // 关闭加载
    loading.close();
    // 后台正常响应的状态，如果不是2000，说明后台有异常
    const resp = response.data;
    if (resp.code !== 2000) {
        Message({
            message: resp.message,
            type: 'warning',
            duration: 5 * 1000
        })
    }
    return response;
}, error => {
    // 关闭加载
    loading.close();
    // 控制台打印一下
    console.error("response error : ", error.response.status);
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error);
});

// 导出自定义创建的axios对象
export default request;