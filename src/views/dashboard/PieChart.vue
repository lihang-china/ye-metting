<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

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
            text: "报修分类统计",
            left: "center",
            textStyle: {
              color: "#303133",
              fontSize: "15",
            },
          },
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          bottom: "10",
          data: ["公用动力系统", "土建装饰", "智能化系统", "工艺设备", "其他"],
        },
        series: [
          {
            name: "报修分类统计",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "45%"],
            data: [
              { value: 320, name: "公用动力系统" },
              { value: 240, name: "土建装饰" },
              { value: 149, name: "智能化系统" },
              { value: 100, name: "工艺设备" },
              { value: 59, name: "其他" },
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>
