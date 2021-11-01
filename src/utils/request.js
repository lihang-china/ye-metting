/*
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-29 10:41:44
 * @LastEditors: Your Name
 * @LastEditTime: 2021-09-29 12:39:39
 */
import { tansParams } from '@/utils/ruoyi'
import axios from 'axios'
// 通用下载方法
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    // 超时
    timeout: 10000
})
export function download(url, params, filename) {
    return service.post(url, params, {
        transformRequest: [(params) => {
            return tansParams(params)
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'blob'
    }).then((data) => {
        const content = data.data
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            elink.download = filename
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, filename)
        }
    }).catch((r) => {
        console.error(r)
    })
}
export default service