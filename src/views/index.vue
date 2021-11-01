<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row
      :gutter="32"
      style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"
    >
      <el-col :xs="24" :sm="24" :lg="12">
        <line-chart :chart-data="lineChartData" />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="charts_title">报警</div>
        <vue-seamless-scroll :data="alertList" class="seamless-warp">
          <ul class="item">
            <li v-for="(alert, index) in alertList" :key="index">
              <span class="name" v-text="alert.name"></span>
              <span class="notes" v-text="alert.notes"></span>
              <span class="date" v-text="alert.date"></span>
            </li>
          </ul>
        </vue-seamless-scroll>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import vueSeamlessScroll from "vue-seamless-scroll";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

const alertJson = [
  {
    name: "客梯 4",
    notes: "故障",
    date: "2020-10-25 15:45:23",
  },
  {
    name: "客梯 6",
    notes: "故障",
    date: "2020-10-26 08:56:05",
  },
  {
    name: "货梯 4",
    notes: "故障",
    date: "2020-10-29 21:06:49",
  },
  {
    name: "空调 01",
    notes: "故障",
    date: "2020-11-01 10:26:59",
  },
  {
    name: "空调 04",
    notes: "故障",
    date: "2020-11-01 11:38:27",
  },
  {
    name: "空调 06",
    notes: "故障",
    date: "2020-11-02 16:38:27",
  },
  {
    name: "门禁 01",
    notes: "断线",
    date: "2020-11-03 07:09:57",
  },
  {
    name: "监控 半球 05",
    notes: "故障",
    date: "2020-11-04 16:45:03",
  },
  {
    name: "监控 枪机 05",
    notes: "断线",
    date: "2020-11-04 19:05:16",
  },
  {
    name: "烟感 21",
    notes: "烟雾",
    date: "2020-11-05 15:56:03",
  },
  {
    name: "温感 22",
    notes: "高温",
    date: "2020-11-05 15:56:04",
  },
  {
    name: "手动报警按钮 20",
    notes: "报警",
    date: "2020-11-05 15:56:06",
  },
];

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    vueSeamlessScroll,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      alertList: alertJson,
    };
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .charts_title {
    font-size: 18px;
    color: #F56C6C;
    text-align: center;
    line-height: 40px;
  }

  .seamless-warp {
    height: 348px;
    overflow: hidden;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    .item {
      margin: 0;
      padding-left: 0;
      li {
        height: 40px;
        display: flex;
        span {
          flex: 1;
          font-size: 16px;
          line-height: 40px;
          color: #000;
        }
        .notes {
          text-align: left;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
