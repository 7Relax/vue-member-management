import request from "@/utils/request.js";

export function login(username, password) {
    return request({
        method: 'post',
        url: '/user/login',
        data: {
            username, // 等价于 username: username
            password
        }
    })
}

export function getUserInfo(token) {
    return request({
        method: 'get',
        url: `/user/info/${token}`,
    })
}

export function logout(token) {
    return request({
        method: 'post',
        url: `/user/logout/`,
        data: {
            token // token: token
        }
    })
}