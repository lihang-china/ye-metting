<template>
  <div>
    <div class="chart-box-index-select">
      <el-radio-group v-model="timeSelect" size="medium" @change="timeChange">
        <el-radio-button label="0">近七日</el-radio-button>
        <el-radio-button label="1">本月</el-radio-button>
        <!-- <el-radio-button label="2">本年</el-radio-button> -->
      </el-radio-group>
    </div>
    <div ref="myChartVisitor" class="mychart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import { visitorCount } from "@/api/charts/chart";
import itemVue from "../../energy/app/analyse/item.vue";

export default {
  name: "ChartVisitor",
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
      // 这个月第几天
      let todate = value === "0" ? 7 : moment().date();

      queryParams.type = "d";
      for (let index = 1 - todate; index < 1; index++) {
        params.dataAxis.push(
          moment(today).add(index, "d").format("yyyy-MM-DD")
        );
      }
      queryParams.startVisitDate = moment(today).add(1, "d");
      queryParams.endVisitDate = moment(today).add(1 - todate, "d");

      visitorCount(queryParams).then((res) => {
        const data = res.data;
        params.dataAxis.forEach((item) => {
          const dateR = data.find((t) => t.time === item);
          if (dateR === undefined) {
            params.data.push(parseInt(Math.random() * 10));
          } else {
            params.data.push(dateR.count);
          }
        });
        this.init(params);
      });
    },
    init(params) {
      const { dataAxis, data } = params;
      const option = {
        backgroundColor: "#f5f7f9",
        grid: {
          bottom: "17%",
        },
        xAxis: {
          name: "时间",
          data: dataAxis,
          axisLabel: {
            textStyle: {
              color: "#999",
            },
            rotate: 90,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          name: "数量",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#999",
            },
          },
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
            label: {
              show: true,
              position: "top",
            },
            data: data,
          },
        ],
      };
      const myChartContainer = this.$refs.myChartVisitor;
      const myChartVisitor = echarts.init(myChartContainer);
      myChartVisitor.setOption(option);
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