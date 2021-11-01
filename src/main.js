import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, GMTTime, resetForm, addDateRange, selectDictLabel, download, downloadTemplate, handleTree, getFormArray, closeTab, openLoading } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";

// 富文本
import Tinymce from '@/components/tinymce/index.vue'

//bpmn.js 流程图工具
import "bpmn-js/dist/assets/diagram-js.css";// 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";// 右边工具栏样式

//bimface
import common from './utils/common.js'
Vue.prototype.autoECharts = common.autoECharts;
Vue.prototype.autoTime = common.autoTime;

//全局变量
Vue.prototype.repairTeamId = 1;
Vue.prototype.maintainTeamId = 2;
Vue.prototype.patrolTeamId = 3;

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.GMTTime = GMTTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.downloadTemplate = downloadTemplate
Vue.prototype.handleTree = handleTree

Vue.prototype.getFormArray = getFormArray
Vue.prototype.closeTab = closeTab
Vue.prototype.openLoading = openLoading

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.component('tinymce', Tinymce)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
