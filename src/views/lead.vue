<template>
  <div class="page-view">
    <div class="page-top">
      <img src="../assets/image/page-title.png" />
    </div>
    <div class="page-content">
      <div class="row-view">
        <div class="card-item" @click="goModule('work')">
          <i class="iconfont work-icon"></i>
          <a class="title">日常工作</a>
          <a class="subtitle">Work</a>
        </div>
        <div class="card-item" @click="goModule('device')">
          <i class="iconfont shebei-icon"></i>
          <a class="title">设备管理</a>
          <a class="subtitle">Equipment management</a>
        </div>
        <div class="card-item" @click="goModule('eoms')">
          <i class="iconfont yunwei-icon"></i>
          <a class="title">后勤运维</a>
          <a class="subtitle">Operation & maintenance</a>
        </div>
        <div class="card-item" @click="goModule('chart')">
          <i class="iconfont tongji-icon"></i>
          <a class="title">统计分析</a>
          <a class="subtitle">statistical analysis</a>
        </div>
      </div>
      <div class="row-view">
        <div class="card-item" @click="goModule('calendar')">
          <i class="iconfont changjing-icon"></i>
          <a class="title">场景管理</a>
          <a class="subtitle">Scene management</a>
        </div>
        <div class="card-item" @click="goModule('alarm')">
          <i class="iconfont map-icon"></i>
          <a class="title">报警管理</a>
          <a class="subtitle">Alarm management</a>
        </div>
        <div class="card-item" @click="goModule('', 'energy')">
          <i class="iconfont nenghao-icon"></i>
          <a class="title">能耗管理</a>
          <a class="subtitle">Energy management</a>
        </div>
        <div class="card-item" @click="goModule('system')">
          <i class="iconfont xitong-icon"></i>
          <a class="title">系统管理</a>
          <a class="subtitle">System management</a>
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="page-footer">
      <span>Copyright © 2020 中控 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import router from "@/router";
import store from "@/store";

export default {
  name: "Lead",
  data() {
    return {};
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  beforeCreate() {
    const isLogin = Cookies.get("isLogin");
    if (isLogin === "true") {
      Cookies.set("isLogin", false, {
        expires: 30,
      });
      location.reload();
      this.$router.go(0);
    }
  },
  created() {},
  methods: {
    goModule(sysRouter, key) {
      switch (key) {
        case "energy":
          location.href = "/energy-app/dashboard";
          break;
        case "gis":
          location.href = "/gis-app/dashboard";
          break;
        default:
          localStorage.setItem("sysRouter", sysRouter);
          store.dispatch("GenerateRoutes").then((accessRoutes) => {
            this.$store.dispatch("tagsView/delAllViews");
            router.addRoutes(accessRoutes); // 动态添加可访问路由表
            this.$router.push({ path: "/index" });
          });
          break;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$vm_design: 1080;

@function rem($px) {
  @return (100vh / $vm_design) * $px;
}

.page-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.png");
  background-size: cover;
}

.page-top {
  display: flex;
  margin-bottom: rem(60);
  img {
    width: rem(419);
    height: rem(73);
  }
}
.page-content {
  display: flex;
  flex-direction: column;
  border-radius: rem(10);
  padding: rem(44) rem(35);
  // border:1) solid rgba(255,255,255,.25);
  background: rgba(2, 23, 57, 0.5);
  // opacity:0.25;
  border-radius: rem(4);
  padding: rem(60) rem(120);
  .row-view {
    display: flex;
    justify-content: space-between;
    &:first-child {
      margin-bottom: rem(60);
    }
    .card-item {
      cursor: pointer;
      color: #92c2ff;
      width: rem(190);
      height: rem(220);
      background: linear-gradient(
        -18deg,
        rgba(16, 49, 86, 0.5),
        rgba(29, 90, 159, 0.5)
      );
      border: 1px solid rgba(26, 78, 140, 0.5);
      border-radius: rem(10);
      margin-right: rem(38);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      i {
        font-size: rem(80);
        margin-bottom: rem(25);
      }
      .work-icon {
        &::before {
          content: "\e663";
        }
      }
      .shebei-icon {
        &::before {
          content: "\e662";
        }
      }
      .yunwei-icon {
        &::before {
          content: "\e66c";
        }
      }
      .tongji-icon {
        &::before {
          content: "\e668";
        }
      }
      .changjing-icon {
        &::before {
          content: "\e666";
        }
      }
      .map-icon {
        &::before {
          content: "\e665";
        }
      }
      .nenghao-icon {
        &::before {
          content: "\e682";
        }
      }
      .xitong-icon {
        &::before {
          content: "\e67d";
        }
      }
      .title {
        text-align: center;
        font-size: rem(20);
        margin-bottom: rem(6);
      }
      .subtitle {
        font-family: ArialMT;
        font-size: rem(10);
        opacity: 0.3;
      }
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color: white;
        background: linear-gradient(
          -18deg,
          rgba(4, 56, 116, 0.8),
          rgba(6, 110, 228, 0.8)
        );
      }
    }
  }
}

.page-footer {
  height: rem(40);
  line-height: rem(40);
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #c8cad2;
  font-family: Arial;
  font-size: rem(12);
  letter-spacing: rem(1);
}
</style>
