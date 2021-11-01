<template>
  <div>
    <div class="chart-box-index-select">
      <el-radio-group v-model="timeSelect" size="medium" @change="timeChange">
        <el-radio-button label="0">近七日</el-radio-button>
        <el-radio-button label="1">本月</el-radio-button>
        <el-radio-button label="2">本年</el-radio-button>
      </el-radio-group>
    </div>
    <div ref="myChartAlarm" class="mychart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";

export default {
  name: "ChartAlarm",
  data() {
    return {
      // 默认展示近七日
      timeSelect: "0",
    };
  },
  mounted() {
    this.timeChange(this.timeSelect);
  },
  methods: {
    timeChange(value) {
      // 查询参数
      const queryParams = {};
      // echart参数
      const params = { dataAxis: [], data: [] };
      // 今日
      const today = moment().format("yyyy-MM-DD");

      if (value === "2") {
        for (let index = 1; index <= 12; index++) {
          params.dataAxis.push(index + "月");
          params.data.push(parseInt(Math.random() * 100) * 30);
        }
      } else {
        let todate = value === "0" ? 7 : moment().date();
        for (let index = 1 - todate; index < 1; index++) {
          params.dataAxis.push(
            moment(today).add(index, "d").format("yyyy-MM-DD")
          );
          params.data.push(parseInt(Math.random() * 100));
        }
      }
      this.init(params);
    },
    init(params) {
      const { dataAxis, data } = params;
      const option = {
        color: ["#F56C6C"],
        backgroundColor: "#f5f7f9",
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#999",
            },
          },
          data: dataAxis,
        },
        yAxis: {
          name: "报警数",
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#999",
            },
          },
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            type: "line",
            label: {
              show: true,
              color: "#000000",
            },
            data: data,
          },
        ],
      };

      const myChartContainer = this.$refs.myChartAlarm;
      const myChartAlarm = echarts.init(myChartContainer);
      myChartAlarm.setOption(option);
    },
  },
};
</script>

<style scoped>
.chart-box-index-select {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.mychart {
  width: 100%;
  height: 500px;
}
</style>