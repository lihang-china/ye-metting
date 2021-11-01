/*
 * @Author: your name
 * @Date: 2021-09-14 16:13:37
 * @LastEditTime: 2021-09-16 19:49:36
 * @LastEditors: Your Name
 * @Description: In User Settings Edit
 * @FilePath: \yc_maa_ui\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import calendar from '../views/pc/main/index.vue'
Vue.use(VueRouter)

const routesP = [{
        path: '/',
        name: 'calendar',
        component: calendar
    },
    {
        path: '/login',
        name: 'login',
        component: (resolve) => require(['@/views/pc/login/index.vue'], resolve)
    },
    {
        path: '/admin',
        name: 'admin',
        component: (resolve) => require(['@/admin/index.vue'], resolve)
    }
]
const routesM = [
    // 会议室预约
    {
      path: '/yc_maa',
      name: 'YcMaa',
      component: () => import('@/views/mobile/yc_maa'),
      meta: {
        title: '会议室登记'
      }
    },
    {
      path: '/historyquery',
      name: 'Historyquery',
      component: () => import('@/views/mobile/yc_maa/historyquery.vue'),
      meta: {
        title: '会议室登记查询'
      }
    }
]
var routes = []
  // 区分系统
 if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    routes = routesM
 } else {
  routes = routesP
 }
const router = new VueRouter({
    mode: 'history',
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        window.localStorage.setItem('login', false)
        next()
    } else if (
        to.path === '/admin'
    ) {
        if (window.localStorage.getItem('login') === 'true') {
            next()
        } else {
            next('/login')
        }
    } else if (to.path === '/login') {
        next()
    } else if (to.path === '/yc_maa') {
      next()
    } else if (to.path === '/historyquery') {
      next()
    } else {
      next('/')
    }
})
export default router