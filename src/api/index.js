/*
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-27 08:58:29
 * @LastEditors: Your Name
 * @LastEditTime: 2021-09-27 08:58:29
 */
import axios from 'axios'
// 1. 查询列表
export const selmeet = params => {
        return axios.get('/api/meeting', {
            params
        })
    }
    // 2. 新增预约
export const addmeet = data => {
        return axios.post(`/api/meeting`,
            data
        )
    }
    // 3. 删除预约
export const delmeet = data => {
        return axios.delete(`/api/meeting`, {
            data
        })
    }
    // 4. 分页查询列表
export const pagemeet = params => {
    return axios.get('/api/meeting/page', {
        params
    })
}