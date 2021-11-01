<template>
  <div class="wrap">
    <div class="container">
      <el-row>
        <el-col :span="3">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @select="handleOpen"
          >
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">会议主页</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-document"></i>
              <span slot="title">会议列表</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21">
          <transition name="el-fade-in-linear">
            <div class="translate" v-show="isShow">
              <Calendar v-if="menuIndex == '1'" />
              <Table v-if="menuIndex == '2'" />
            </div>
          </transition>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Calendar from '../views/pc/calendar/index.vue'
import Table from '../views/pc/calendar/calentable/index.vue'
export default {
  name: 'YcMaaUiIndex',
  components: {
    Calendar,
    Table
  },
  data() {
    return {
      isLogin: true,
      isShow: true,
      menuIndex: '1'
    }
  },
  mounted() {},
  methods: {
    handleOpen(key) {
      if (this.menuIndex !== key) {
        this.isShow = !this.isShow
        setTimeout(() => {
          this.menuIndex = key
          this.isShow = !this.isShow
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  min-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    box-shadow: 2px 1px 10px 10px rgba(224, 224, 224, 0.7);
    background: -webkit-gradient(
      linear,
      0 0,
      0 100%,
      from(rgb(248, 243, 255)),
      to(rgb(249, 247, 255))
    );

    overflow: hidden;
    border-radius: 30px;
    width: 97%;
    height: 94%;
    padding: 0;
    .el-row {
      height: 100%;
      .el-col {
        h2 {
          height: 50px;
          padding: 20px 30px;
          font-weight: normal;
        }
        height: 100%;
        &:nth-child(2) {
          display: flex;
          justify-content: center;
          align-items: center;
          .translate {
            box-shadow: 2px 1px 15px 10px rgba(230, 230, 230, 0.7);
            width: 90%;
            height: 87%;
            min-width: 1200px;
            padding: 40px;
            background: -webkit-gradient(
              linear,
              1 0,
              0 100%,
              from(rgba(249, 250, 255, 0.7)),
              to(rgb(251, 249, 255))
            );
            border-radius: 20px;
            overflow: hidden;
          }
        }
        .el-menu-vertical-demo {
          padding-top: 30%;
          border: 1px solid red;
          background-color: rgba(0, 0, 0, 0);
          border-right: 1px solid rgb(226, 226, 226);
          margin-left: -1px;
          margin-top: -1px;
          height: 100%;
          .el-menu-item {
            font-size: 16px;
            text-align: center;
            padding-left: -20px;
          }
        }
      }
    }
  }
}
</style>
