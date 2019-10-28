import request from '@/utils/request'

export default {
    /**
     * 获取供应商列表
     */
    getList() {
        return request({
            url: '/supplier/list',
            method: 'get'
        })
    },
    /**
     * 分页查询
     * @param {*} page 当前页码
     * @param {*} size 每页显示条数
     * @param {*} searchMap 查询条件
     */
    search(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    /**
     * 新增供应商
     * @param {供应商对象} pojo
     */
    add(pojo) {
        return request({
            url: '/supplier',
            method: 'post',
            data: pojo
        })
    },
    /**
     * 查询供应商信息
     * @param {供应商id} id
     */
    getById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'get'
        })
    },
    /**
     * 更新供应商信息
     * @param {供应商对象} pojo
     */
    update(pojo) {
        return request({
            url: `/supplier/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    /**
     * 删除供应商信息
     * @param {供应商id} id 
     */
    deleteById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete'
        })
    }
}