<template>
  <div class="chart-index">
    <!-- <div class="chart-index-head">
      <div class="chart-index-head-title">图表展示</div>
      <div class="chart-index-head-content">
        <el-row :gutter="12">
          <el-col :span="12">
            <div class="chart-index-head-content-left">
              <img :src="avatar" class="avatar" />
              <div class="text">
                <p>{{ nickname }},您好!</p>
                <p>
                  <iframe
                    scrolling="no"
                    src="https://tianqiapi.com/api.php?style=tb&skin=baidu&city=杭州"
                    frameborder="0"
                    width="350"
                    height="24"
                    allowtransparency="true"
                  ></iframe>
                </p>
              </div>
            </div>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
      </div>
    </div> -->
    <div class="chart-index-content">
      <el-row :gutter="20">
        <el-col :span="12">
          <ChartBox :title="visitorTitle">
            <ChartVisitor />
          </ChartBox>
        </el-col>
        <el-col :span="12">
          <ChartBox :title="alarmTitle">
            <ChartAlarm />
          </ChartBox>
        </el-col>
        <el-col :span="12">
          <ChartBox :title="workTitle">
            <ChartWork />
          </ChartBox>
        </el-col>
        <el-col :span="12">
          <ChartBox :title="mapTitle">
            <ChartChina />
          </ChartBox>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ChartBox from "@/views/components/charts/ChartBox";
import ChartVisitor from "@/views/components/charts/ChartVisitor";
import ChartAlarm from "@/views/components/charts/ChartAlarm";
import ChartWork from "@/views/components/charts/ChartWork";
import ChartChina from "@/views/components/charts/ChartChina";

export default {
  name: "ChartIndex",
  components: { ChartBox, ChartVisitor, ChartAlarm, ChartWork, ChartChina },
  computed: {
    ...mapGetters(["nickname", "avatar"]),
  },
  data() {
    return {
      //
      visitorTitle: "访客统计",
      //
      alarmTitle: "报警统计",
      //
      workTitle: "流程统计(例)",
      //
      mapTitle: "地图统计(例)",
    };
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0px;
  padding: 0px;
}

.chart-index {
  width: 100%;
  height: 100%;
  .chart-index-head {
    width: 100%;
    padding: 16px 32px 0 32px;
    background: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid #dcdfe6;
    .chart-index-head-title {
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      color: #292929;
      margin-bottom: 16px;
    }
    .chart-index-head-content {
      .chart-index-head-content-left {
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .avatar {
          height: 56px;
          width: 56px;
          line-height: 56px;
          margin-right: 10px;
          border-radius: 5px;
        }
        .text {
          width: 100%;
          height: 56px;
          p:first-child {
            margin-bottom: 7px;
            font-size: 20px;
            color: #292929;
            letter-spacing: 0.1em;
          }
          p:nth-child(2) {
            font-size: 12px;
            color: #999;
            letter-spacing: 0.1em;
          }
        }
      }
    }
  }
  .chart-index-content {
    background: #f5f7f9;
    padding: 16px 32px 16px 32px;
    .el-col {
      margin-bottom: 20px;
    }
  }
}
</style>
