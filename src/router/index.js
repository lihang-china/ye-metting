import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '',
    redirect: 'lead',
    hidden: true
  },
  {
    path: '/lead',
    component: () => import('@/views/index_bimface'),
    name: "Lead",
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/index',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  //工作流-表单
  {
    path: '/form',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'formdesign/:formId',
        component: () => import('@/views/workflow/form/formDesign'),
        name: 'FormDesign',
        meta: { title: '表单配置' }
      },
      {
        path: 'formview/:formId',
        component: () => import('@/views/workflow/form/formView'),
        name: 'FormView',
        meta: { title: '表单预览' }
      }
    ]
  },
  //工作流-流程
  {
    path: '/flow',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'flowdesign/:workFlowId',
        component: () => import('@/views/workflow/flow/flowDesign'),
        name: 'FlowDesign',
        meta: { title: '流程设计' }
      },
      {
        path: 'flowtype',
        component: () => import('@/views/workflow/flow/flowType'),
        name: 'FlowType',
        meta: { title: '流程类型' }
      },
      {
        path: 'listeners',
        component: () => import('@/views/workflow/flow/listeners'),
        name: 'Listeners',
        meta: { title: '监听器管理' }
      },
      {
        path: 'processDefinitions/:flowId',
        component: () => import('@/views/workflow/flow/processDefinitions'),
        name: 'ProcessDefinitions',
        meta: { title: '版本监控' }
      }
    ]
  },
  //工作流-工作
  {
    path: '/works',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'dealwith/:taskId',
        component: () => import('@/views/work/dealWith'),
        name: 'DealWith',
        meta: { title: '工作办理' }
      }
    ]
  },
  //设备模板
  {
    path: '/templet',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'templetchannel/:templetId',
        component: () => import('@/views/equipment/class/channel'),
        name: 'TempletChannel',
        meta: { title: '模板位号管理' }
      }
    ]
  },
  //设备通信
  {
    path: '/device',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'historyAlarm/',
        component: () => import('@/views/alarm/history/index'),
        name: 'HistoryAlarm',
        meta: { title: '历史报警' }
      },
      {
        path: 'realAlarm/:count/:channelId',
        component: () => import('@/views/alarm/real/index'),
        name: 'RealAlarm',
        meta: { title: '实时报警' }
      }
    ]
  },
  //设备管理
  {
    path: '/card',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'channel/:equGuid',
        component: () => import('@/views/equipment/card/channel'),
        name: 'Channel',
        meta: { title: '位号管理' }
      },
      {
        path: 'selectequ/:guid/:type',
        component: () => import('@/views/equipment/card/selectEqu'),
        name: 'SelectEqu',
        meta: { title: '设备管理' }
      },
      {
        path: 'channelAlarmconfig/:equChannelId',
        component: () => import('@/views/alarm/config/index'),
        name: 'ChannelAlarmconfig',
        meta: { title: '报警配置' }
      }
    ]
  },
  //巡检管理(巡检区域选巡检设备)
  {
    path: '/area',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'setequ/:pareaId',
        component: () => import('@/views/patrol/area/setEqu'),
        name: 'SetEqu',
        meta: { title: '巡检设备' }
      }
    ]
  },
  //巡检管理(巡检路线)
  {
    path: '/line',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'setline/:plineId/:operate',
        component: () => import('@/views/patrol/line/setLine'),
        name: 'SetLine',
        meta: { title: '巡检配置' }
      }
    ]
  },
  //模式管理
  {
    path: '/calendars',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'timejob/:equJobCalendarId',
        component: () => import('@/views/calendar/calendars/timeJob'),
        name: 'TimeJob',
        meta: { title: '时间计划' }
      }
    ]
  },
  //GIS
  {
    path: '/gis-app/dashboard',
    component: (resolve) => require(['@/views/gis/index'], resolve),
    name: "GisIndex",
    hidden: false
  },
  {
    path: '/gis-app/run',
    component: (resolve) => require(['@/views/gis/run'], resolve),
    name: "GisRun",
    hidden: false
  },
  {
    path: '/gis-app/edit',
    component: (resolve) => require(['@/views/gisedit/index'], resolve),
    name: "GisEdit",
    hidden: false
  },
  {
    path: '/gis-app/coordinate',
    component: (resolve) => require(['@/views/gisedit/coordinate'], resolve),
    name: "GisCoordinate",
    hidden: false
  },
  //能源管理
  {
    path: '/energy-app',
    component: (resolve) => require(['@/views/energy/app/index'], resolve),
    children: [
      {
        path: "dashboard",
        component: (resolve) => require(['@/views/energy/app/dashboard/index'], resolve),
        name: "EnergyIndex",
      },
      {
        path: "base/department",
        component: (resolve) => require(['@/views/energy/app/base/department/department'], resolve),
      },
      {
        path: "base/serviceArea",
        component: (resolve) => require(['@/views/energy/app/base/serviceArea/serviceArea'], resolve),
      },
      {
        path: "base/depEnergySetting",
        component: (resolve) => require(['@/views/energy/app/base/depEnergySetting/depEnergySetting'], resolve),
      },
      //部门能耗设置
      {
        path: "base/depEnergySetting/add",
        component: (resolve) => require(['@/views/energy/app/base/depEnergySetting/add'], resolve),
      },
      {
        path: "base/area/add",
        component: (resolve) => require(['@/views/energy/app/base/area/add'], resolve),
      },
      {
        path: "base/project",
        component: (resolve) => require(['@/views/energy/app/base/project/project'], resolve),
      },
      {
        path: "base/energyData",
        component: (resolve) => require(['@/views/energy/app/base/energyData/energyData'], resolve),
      },
      {
        path: "base/area",
        component: (resolve) => require(['@/views/energy/app/base/area/area'], resolve),
      },
      {
        path: "base/config",
        component: (resolve) => require(['@/views/energy/app/base/config/config'], resolve),
      },
      // 区域分析
      {
        path: "analyse/area",
        component: (resolve) => require(['@/views/energy/app/analyse/area'], resolve),
      },
      // 部门分析
      {
        path: "analyse/dept",
        component: (resolve) => require(['@/views/energy/app/analyse/dept'], resolve),
      },
      // 分项分析
      {
        path: "analyse/item",
        component: (resolve) => require(['@/views/energy/app/analyse/item'], resolve),
      },
      // 昼夜分析
      {
        path: "analyse/dayNight",
        component: (resolve) => require(['@/views/energy/app/analyse/dayNight'], resolve),
      },
      // 每周分析
      {
        path: "analyse/week",
        component: (resolve) => require(['@/views/energy/app/analyse/week'], resolve),
      },
      // 区域监测
      {
        path: "monitor/area",
        component: (resolve) => require(['@/views/energy/app/monitor/area'], resolve),
      },
      // 部门监测
      {
        path: "monitor/dept",
        component: (resolve) => require(['@/views/energy/app/monitor/dept'], resolve),
      },
      // 分项监测
      {
        path: "monitor/item",
        component: (resolve) => require(['@/views/energy/app/monitor/item'], resolve),
      },
      // 能耗公示
      {
        path: "publicity",
        component: (resolve) => require(['@/views/energy/app/publicity'], resolve),
      },
      // 综合查询
      {
        path: "joint",
        component: (resolve) => require(['@/views/energy/app/joint'], resolve),
      },
      //采集管理
      {
        path: "collect",
        component: (resolve) => require(['@/views/energy/app/collect/collect'], resolve),
      },
      //单价设置
      {
        path: "cost/priceSetting",
        component: (resolve) => require(['@/views/energy/app/cost/priceSetting/priceSetting'], resolve),
      },
      //成本核算
      {
        path: "cost/costAccounting",
        component: (resolve) => require(['@/views/energy/app/cost/costAccounting/costAccounting'], resolve),
      },
      //能耗设备档案
      {
        path: "document",
        component: (resolve) => require(['@/views/energy/app/document/document'], resolve),
      },
      //区域能耗配置
      {
        name: 'AreaSet',
        path: "base/areaSet/:areaId",
        component: (resolve) => require(['@/views/energy/app/base/setting/area'], resolve),
      },
      //部门能耗配置
      {
        name: 'DeptSet',
        path: "base/deptSet/:deptId",
        component: (resolve) => require(['@/views/energy/app/base/setting/dept'], resolve),
      },
    ],
    hidden: true
  },
  //
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
