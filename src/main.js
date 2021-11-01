/*
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-14 16:13:37
 * @LastEditors: Your Name
 * @LastEditTime: 2021-09-15 13:17:33
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Meta from 'vue-meta'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vant, { Toast } from 'vant'
import moment from 'moment'
import 'vant/lib/index.css'
Vue.prototype.moment = moment
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })
Vue.use(Toast)
Vue.use(Meta)
Vue.use(Vant)
new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')