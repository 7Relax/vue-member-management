import request from '@/utils/request'

export default {

    /**
     * 检验密码是否正确
     * @param {*} userId   用户Id
     * @param {*} password 旧密码
     */
    checkPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'post',
            data: {
                userId,
                password
            }
        })
    },
    /**
     * 修改密码
     * @param {*} userId   用户Id
     * @param {*} password 新密码
     */
    updatePwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }

}