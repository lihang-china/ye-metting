<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

const animationDuration = 6000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "330px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        title: [
          {
            text: "报修来源统计",
            left: "center",
            textStyle: {
              color: "#303133",
              fontSize: "15",
            },
          },
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 40,
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "网络报修",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [19, 12, 20, 14, 13, 10, 12],
            animationDuration,
          },
          {
            name: "报警",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [12, 10, 13, 14, 20, 12, 19],
            animationDuration,
          },
          {
            name: "保养",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [19, 12, 20, 14, 13, 10, 12],
            animationDuration,
          },
          {
            name: "巡检",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [12, 10, 13, 14, 20, 12, 19],
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>
