<template>
  <div class="dashboard-editor-container">
    <div class="top">
      <div style="position: absolute; width: 100%; pointer-events: none">
        <div class="top-center-bg">
          <img src="../../assets/image/header-title.png" />
        </div>
      </div>
    </div>
    <div class="main">
      <iframe
        :src="IFSrc"
        frameborder="no"
        :style="iframeStyle"
        scrolling="no"
      />
    </div>
    <div class="bottom" :style="bottomStyle">
      <div class="bottom-content">
        <div class="bottom-block">
          <template v-for="(item, index) in menus">
            <el-popover
              :disabled="!(item.children && item.children.length > 0)"
              popper-class="menu-popover"
              :key="index"
              placement="top-start"
              width="auto"
              trigger="click"
            >
              <el-cascader-panel
                :props="{
                  expandTrigger: 'hover',
                  label: 'menuName',
                  value: 'menuId'
                }"
                :options="item.children"
                class="menu-panel"
                @change="handleChange"
              >
              </el-cascader-panel>
              <div
                :class="{ 'menu-active': currentMenuIndex === index }"
                slot="reference"
                class="menu-block"
                @click="checkMenu(index)"
              >
                <!-- <i class="iconfont menu-icon">{{ item.icon }}</i> -->
                <svg-icon
                  :icon-class="item.icon"
                  class="iconfont menu-icon"
                ></svg-icon>
                <div class="menu-text">{{ item.menuName }}</div>
              </div>
            </el-popover>
          </template>
        </div>
      </div>
      <div
        class="bottom-bg"
        :style="{ width: menus.length * 72 + 80 + 'px' }"
      />
    </div>
    <div class="statis-w" style="display: none">
      <div class="statis-btn">
        <div><i class="iconfont" style="font-size: 30px">&#xe783;</i></div>
        <div style="font-size: 12px; margin-top: 5px">统计</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import router from '@/router'
import store from '@/store'
import { listMenu } from '@/api/gis/menu'
import { getToken } from '@/utils/auth'

export default {
  name: 'GisIndex',
  components: {},
  filters: {
    formatDate: function (time, format) {
      if (!time) return
      var date = new Date(time)
      return moment(date).format(format ? format : 'YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {},
  data() {
    return {
      currentTime: new Date(),
      currentMenuIndex: 0,
      currentMenu: null,
      menus: [],
      IFSrc: null,
      menuList: [],
      iframeStyle: {
        width: '100%',
        height: '100%'
      },
      bottomStyle: {}
    }
  },
  mounted() {
    var _this = this
    this.timer = setInterval(function () {
      _this.currentTime = new Date()
    }, 1000)
    this.loadMenus()
  },
  methods: {
    goPage(url) {
      // this.$router.push(url);
      this.$router.push({ name: url })
    },
    goBase() {
      localStorage.setItem('sysRouter', 'gis')
      store.dispatch('GenerateRoutes').then((accessRoutes) => {
        this.$store.dispatch('tagsView/delAllViews')
        router.addRoutes(accessRoutes) // 动态添加可访问路由表
        this.$router.push({ path: '/index' })
      })
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/lead'
        })
      })
    },
    loadMenus() {
      this.menus = []
      listMenu().then((res) => {
        if (res.data) {
          this.menus = res.data
          //this.addMenus();
          this.calleArr(this.menus)
          this.checkMenu(0)
        }
      })
    },
    // addMenus() {
    //   this.menus.push({
    //     children: null,
    //     icon: "gis-mj",
    //     menuName: "门禁",
    //     modelType: 3,
    //     menuUrl: "http://10.58.16.1:8090/",
    //   });
    //   this.menus.push({
    //     children: null,
    //     icon: "guide",
    //     menuName: "信息发布",
    //     modelType: 3,
    //     menuUrl: "http://10.58.24.1:8080/",
    //   });
    // },
    checkMenu(index) {
      this.currentMenuIndex = index
      var c = this.menus[index]
      this.currentMenu = c
      if (!c.children) {
        this.openLayer(c)
      }
    },
    handleChange(value) {
      var arr = this.menuList.filter((i) => i.menuId === value[0])
      if (arr && arr.length > 0) {
        this.openLayer(arr[0])
      }
    },
    openLayer(item) {
      console.log(item, 'asdad')
      if (item.menuType) {
        this.IFSrc =
          '/gis-app/run?type=' +
          item.menuType +
          '&icon=' +
          item.icon +
          '&menuName=' +
          item.menuName
        this.iframeStyle = {
          width: '100%',
          height: '100%'
        }
        this.bottomStyle = {}
      }
      if (item.menuClass === 'U') {
        this.IFSrc = item.url + '/' + getToken()
        this.iframeStyle = {
          width: '100%',
          height: '100%',
          paddingTop: '20px'
        }
        this.bottomStyle = {
          background: '#000000',
          bottom: '0px'
        }
      }
    },
    calleArr(array) {
      for (var i in array) {
        var data = array[i]
        this.menuList.push(data)
        if (data.children && data.children.length > 0) {
          this.calleArr(data.children)
        } else {
          data.children = null
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @font-face {
//   font-family: "iconfont"; /* project id 1999898 */
//   src: url("//at.alicdn.com/t/font_1999898_rh08r0swasa.eot");
//   src: url("//at.alicdn.com/t/font_1999898_rh08r0swasa.eot?#iefix")
//       format("embedded-opentype"),
//     url("//at.alicdn.com/t/font_1999898_rh08r0swasa.woff2") format("woff2"),
//     url("//at.alicdn.com/t/font_1999898_rh08r0swasa.woff") format("woff"),
//     url("//at.alicdn.com/t/font_1999898_rh08r0swasa.ttf") format("truetype"),
//     url("//at.alicdn.com/t/font_1999898_rh08r0swasa.svg#iconfont") format("svg");
// }

@font-face {
  font-family: 'iconfont'; /* project id 2131150 */
  src: url('//at.alicdn.com/t/font_2131150_9ckmzr29cup.eot');
  src: url('//at.alicdn.com/t/font_2131150_9ckmzr29cup.eot?#iefix')
      format('embedded-opentype'),
    url('//at.alicdn.com/t/font_2131150_9ckmzr29cup.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_2131150_9ckmzr29cup.woff') format('woff'),
    url('//at.alicdn.com/t/font_2131150_9ckmzr29cup.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_2131150_9ckmzr29cup.svg#iconfont') format('svg');
}

.iconfont {
  font-family: 'iconfont' !important;
  font-style: normal;
}

.dashboard-editor-container {
  background-color: #03071c;
  // background-image: url("../../assets/image/gis-bg.jpg");
  position: relative;
  height: 100%;
  width: 100%;
}

/** 头部 */
.top {
  background-image: url('../../assets/image/header-bg.png');
  height: 110px;
  background-repeat: repeat-x;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 10;
}

.top-center-bg {
  background-image: url('../../assets/image/header-title-bg.png');
  width: 469px;
  height: 110px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.notice-block {
  font-size: 14px;
  color: rgb(168, 200, 231);
  margin-top: -46px;
  display: flex;
  align-items: center;
}

.notice {
  background: rgba(255, 255, 255, 0.15);
  padding: 6px;
  border-radius: 50px;
  width: 30px;
  height: 30px;
  margin: 0 10px;
}

.notice-icon {
  font-size: 17px;
  color: #fff;
}

.top-right {
  display: flex;
  padding: 0 10px;
  color: #fff;
  margin-top: -46px;
  font-size: 14px;
  font-weight: bold;
  align-items: center;
}

.top-userinfo {
  padding: 14px 10px 14px 15px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.top-message {
  padding: 10px 30px 10px 15px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.top-date {
  padding: 10px 20px;
  display: flex;
  align-items: center;
}

.user-menu {
  padding-left: rem(18);
}
.user-menu span {
  padding-right: rem(11);
  font-size: rem(14);
  // font-weight: bold;
  color: #ffffff;
}

/** 主要内容*/
.main {
  padding-top: 60px;
  height: 100%;
}

/** 统计按钮 */
.statis-w {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: fixed;
  right: 5px;
  bottom: 290px;
  padding: 20px;
  background: rgba(42, 42, 73, 0.1);
}

.statis-btn {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    0deg,
    rgba(3, 55, 114, 0.85),
    rgba(5, 92, 191, 0.85)
  );
  border-radius: 50%;
  box-shadow: 0 0 0px 10px rgba(63, 81, 181, 0.14);
  color: #fff;
  padding: 15px 15px;
  text-align: center;
  cursor: pointer;
}

/**底部 */
.bottom {
  position: absolute;
  bottom: 40px;
  width: 100%;
}

.bottom-content {
  width: 100%;
  position: absolute;
  bottom: 10px;
  z-index: 20;
}

.bottom-block {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.bottom-bg {
  width: 100%;
  background-color: rgba(1, 68, 144, 0.4);
  height: 48px;
  transform: perspective(0.8em) rotateX(2deg);
  transform-origin: bottom;
  margin: 0 auto;
  z-index: 10;
}

.menu-icon {
  font-size: 32px;
  background-image: -webkit-linear-gradient(top, #005fd0, #1fb2f5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  transform-origin: 50% 100%;
}

.menu-block:hover .menu-icon {
  transform: scale(1.4);
  transition: all 0.2s;
  background-image: -webkit-linear-gradient(top, #fff, #fff);
}

.menu-text {
  text-align: center;
  font-size: 12px;
  padding: 5px;
}

.menu-block {
  text-align: center;
  color: #69b1ff;
  cursor: pointer;
  min-width: 72px;
}

.menu-block:hover {
  color: #fff;
}

.menu-active .menu-icon {
  transform: scale(1.4);
  background-image: -webkit-linear-gradient(top, #fff, #fff);
}

.menu-active {
  box-shadow: inset 0px 0px 8px 3px #0084ec;
  padding: 23px 5px 0px;
  border-radius: 6px;
  color: #fff;
}
</style>

<style scoped>
.el-scrollbar__wrap {
  overflow-x: hidden;
}

.menu-panel .el-cascader-menu {
  box-shadow: inset 0px 0px 10px 3px #0084ec;
  border-right: none;
  color: #fff;
  border-radius: 8px;
  margin-right: 4px;
  background: rgba(11, 15, 28, 0.9);
}

.menu-panel .el-cascader-menu__list {
  padding: 15px 10px;
}

.menu-panel.el-cascader-panel.is-bordered {
  border: none;
  border-radius: 8px;
}

.menu-panel .el-cascader-menu__wrap {
  height: 300px;
  margin-bottom: 0px !important;
}

.menu-panel .el-cascader-node:not(.is-disabled):hover,
.el-cascader-node:not(.is-disabled):focus {
  color: #1b7ded;
  background: transparent;
  font-weight: bold;
}

.menu-panel .el-cascader-node.in-active-path,
.el-cascader-node.is-selectable.in-checked-path,
.el-cascader-node.is-active {
  background: #1b7ded !important;
  color: #fff !important;
  border-radius: 40px;
  font-weight: bold;
}

.menu-popover.el-popover {
  background: transparent;
  border: none;
  padding: 0;
}

.menu-popover.el-popper[x-placement^='top'] .popper__arrow::after {
  border-top-color: #115184;
}

.menu-popover.el-popper[x-placement^='top'] .popper__arrow {
  border-top-color: #115184;
}
</style>
