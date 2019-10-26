import request from "@/utils/request.js";

// 方式1：
// request.get('/db.json').then(response => {
//     console.log(response.data);
// })

// const BASE_URI = '/dev-api';
// const BASE_URI = process.env.VUE_APP_BASE_API;

// 方式2：以对象配置的方式进行指定请求
request({
    method: 'get',
    url: '/db.json',
    // responseType: 'stream'
}).then(response => {
    console.log("get2", response.data);
});

// 方式3
export default {
    getList() {
        const req = request({
            method: 'get',
            url: '/db.json'
        });
        return req;
    }
}