import request from '@/utils/request'

export default {
    /**
     * 获取会员列表
     */
    getList() {
        return request({
            url: '/member/list',
            method: 'get'
        })
    },
    /**
     * 分页搜索方法
     * @param {*} page 当前页码
     * @param {*} size 每页查询条数
     * @param {*} searchMap 条件查询需要提交其它数据（如：搜索框中的查询条件）
     */
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    /**
     * 新增会员
     * @param {会员对象} pojo
     */
    add(pojo) {
        return request({
            url: '/member',
            method: 'post',
            data: pojo
        })
    },
    /**
     * 查询会员信息
     * @param {会员id} id
     */
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get'
        })
    },
    /**
     * 更新会员信息
     * @param {会员对象} pojo
     */
    update(pojo) {
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    /**
     * 删除会员信息
     * @param {会员id} id 
     */
    deleteById(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete'
        })
    }
}