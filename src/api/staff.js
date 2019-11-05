import request from '@/utils/request'

export default {
    /**
     * 分页查询
     * @param {*} page 当面页码
     * @param {*} size 每页显示条数
     * @param {*} searchMap 查询条件
     */
    search(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    /**
     * 新增员工
     * @param {*} pojo 员工对象
     */
    add(pojo) {
        return request({
            url: '/staff',
            method: 'post',
            data: pojo
        })
    },
    /**
     * 查询员工
     * @param {*} id 
     */
    getById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'get'
        })
    },
    /**
     * 更新员工
     * @param {*} pojo 
     */
    update(pojo) {
        return request({
            url: `/staff/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    /**
     * 删除员工
     * @param {*} id 
     */
    deleteById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'delete'
        })
    }
}