<template >
  <div class="page-view">
    <div class="page-header">
      <div class="title-view" @click="goPage('/energy-app/dashboard')">
        <img src="@/assets/image/energy/energy-title.png" />
      </div>
      <div class="menu-view">
        <div class="menu-item" @click="goPage('/energy-app/dashboard')">
          总体概况
        </div>
        <div class="menu-item">
          <el-dropdown>
            <span>
              能耗监测<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/energy-app/monitor/area"
                  >区域用能监测</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/energy-app/monitor/dept"
                  >部门用能监测</router-link
                >
              </el-dropdown-item>
                            <el-dropdown-item>
                <router-link to="/energy-app/monitor/item"
                  >分项用能监测</router-link
                >
              </el-dropdown-item>
                          </el-dropdown-menu
            >
          </el-dropdown>
        </div>
        <div class="menu-item">
          <el-dropdown>
            <span>
              能耗分析<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/energy-app/analyse/area"
                  >区域用能趋势分析</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/energy-app/analyse/dept"
                  >部门用能趋势分析</router-link
                >
              </el-dropdown-item>
                            <el-dropdown-item>
                <router-link to="/energy-app/analyse/item"
                  >分项用能趋势分析</router-link
                >
              </el-dropdown-item>
                            <el-dropdown-item>
                <router-link to="/energy-app/analyse/dayNight"
                  >昼夜用能分析</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/energy-app/analyse/week"
                  >每周能耗分析</router-link
                >
              </el-dropdown-item>
                          </el-dropdown-menu
            >
          </el-dropdown>
        </div>
        <div class="menu-item">
          <router-link to="/energy-app/publicity">能耗公示</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/energy-app/joint">综合查询</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/energy-app/collect">采集管理</router-link>
        </div>
        <div class="menu-item">
          <el-dropdown>
            <span>
              成本核算<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/energy-app/cost/priceSetting"
                  >单价设置</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/energy-app/cost/costAccounting"
                  >成本核算</router-link
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="menu-item">
          <el-dropdown>
            <span>
              基础管理<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/energy-app/base/serviceArea"
                  >区域管理</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/energy-app/base/department"
                  >部门管理</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/energy-app/base/project"
                  >分项管理</router-link
                >
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <router-link to="/energy-app/base/area"
                  >区域能耗设置</router-link
                >
              </el-dropdown-item> -->
              <!-- <el-dropdown-item>
                <router-link to="/energy-app/base/config">修改配置</router-link>
              </el-dropdown-item> -->
              <!-- <el-dropdown-item>
                <router-link to="/energy-app/base/depEnergySetting"
                  >部门能耗设置</router-link
                >
              </el-dropdown-item> -->
              <!-- <el-dropdown-item>
                <router-link to="/energy-app/base/energyData">能耗数据提取</router-link>
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="menu-item">
          <router-link to="/energy-app/document">能耗设备档案</router-link>
        </div>
      </div>
      <div class="user-content">
        <div class="weather"></div>
        <div class="datetime-content">
          <div class="time">{{ timeStr }}</div>
          <div class="date">{{ dateStr }}</div>
        </div>
        <div class="dropdown user-menu">
          <div class="menu-item">
            <el-dropdown>
              <span>
                管理员<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><a @click="goPage('/lead')">主菜单</a></el-dropdown-item
                >
                <el-dropdown-item
                  ><a @click="logout()">注销</a></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <router-view />
    </div>
    <div class="page-footer">
      Copyright © 2020 中控 All Rights Reserved.
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { clearInterval } from "timers";
export default {
  data() {
    return {
      activeIndex: "1",
      dateStr: moment().format("YYYY年MM月DD日"),
      timeStr: moment().format("HH:mm:ss"),
      dateInterval: null,
    };
  },
  methods: {
    goPage(url) {
      this.$router.push(url);
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.href = "/lead";
        });
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  created() {
    this.dateInterval = setInterval(() => {
      (this.dateStr = moment().format("YYYY年MM月DD日")),
        (this.timeStr = moment().format("HH:mm:ss"));
    }, 1000);
  },
  destroyed() {
    clearInterval(this.dateInterval);
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common.scss";

.page-view {
  height: 100%;
  background-image: url("~@/assets/image/login-background.png");
  background-size: cover;
  position: relative;
  width: rem(1920);
  overflow-x: auto;
  overflow-y: hidden;
  .page-header {
    position: absolute;
    z-index: 99;
    top: 0;
    background: rgba(8, 17, 51, 0.4);
    height: rem(68);
    min-width: rem(960);
    width: 100%;
    display: flex;
    .title-view {
      display: flex;
      align-items: center;
      padding-left: rem(50);
      height: 100%;
      width: rem(376);
      background-image: url("~@/assets/image/energy/energy-bak.png");
      background-size: 100% 100%;
      img {
        width: rem(204);
        height: rem(23);
      }
    }
    .menu-view {
      padding-left: rem(3);
      height: 100%;
      display: flex;
      .menu-item {
        cursor: pointer;
        padding: 0 rem(12);
        height: 100%;
        display: flex;
        align-items: center;
        font-size: rem(16);
        color: #fff;
        span {
          font-size: rem(16);
          color: #fff;
        }
      }
    }
    .user-content {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      height: rem(68);
      padding-right: rem(25);
    }
    .weather {
      width: rem(76);
      height: rem(50);
      background-image: url("~@/assets/image/energy/weather.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
    .datetime-content {
      text-align: center;
      padding: 0 rem(18) 0 rem(15);
    }
    .time {
      letter-spacing: rem(4);
      font-size: rem(20);
      color: #fff;
      font-weight: 900;
      margin-bottom: rem(9);
    }
    .date {
      letter-spacing: rem(2);
      font-size: rem(14);
      color: rgba(0, 162, 255, 1);
      font-weight: 400;
    }
    .user-menu {
      padding-left: rem(18);
      border-left: 2px solid #fff;
    }
    .user-menu span {
      color: #fff;
      padding-right: rem(11);

      font-size: rem(14);
      font-family: Microsoft YaHei;
      // font-weight: bold;
      color: #ffffff;
    }
  }
  .page-content {
    position: fixed;
    top: rem(68);
    bottom: rem(41);
    left: 0;
    overflow-y: auto;
    width: 100%;
  }
  .page-footer {
    position: fixed;
    bottom: 0;
    height: rem(41);
    background: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: rem(14);
    font-weight: bold;
    color: white;
    width: rem(1920);
  }
  ::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: rgba(8, 17, 51, 0.4);
  }
  ::-webkit-scrollbar {
    //滚动条的宽度
    width: 9px;
    height: 9px;
  }
  ::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: rgb(8, 17, 51);
    background-clip: padding-box;
    min-height: 28px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(8, 17, 51, 0.4);
  }
}
</style>