import request from '@/utils/request'

export default {
     /**
     * 分页条件查询
     * @param {*} page 当前页码
     * @param {*} size 每页显示条数
     * @param {*} searchMap 查询条件
     */
    search(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    /**
     * 新增商品
     * @param {*} pojo 商品对象
     */
    add(pojo) {
        return request({
            url: '/goods',
            method: 'post',
            data: pojo
        })
    },
    /**
     * 查询商品
     * @param {*} id 
     */
    getById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'get'
        })
    },
    /**
     * 更新商品
     * @param {*} pojo 
     */
    update(pojo) {
        return request({
            url: `/goods/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    /**
     * 删除商品
     * @param {*}} id 
     */
    deleteById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'delete'
        })
    }
}