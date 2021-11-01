<template>
  <div class="pie-chart" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize";

export default {
  mixins: [resize],
  props: {},
  data() {
    return {
      chart: null,
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(data, name, title) {
      this.chart = echarts.init(this.$el, "macarons");
      let colors = [
        "#2CDEB2",
        "#006CFF",
        "#00B4FF",
        "#C499FF",
        "#bce672",
        "#ff4777",
        "#70f3ff",
        "#4b5cc4",
        "#f47983",
        "#8d4bbb",
        "#6635EF",
        "#FFAFDA",
      ];

      // <-.<-???
      // let dataArr = data.data.map((e, i) => {
      //   return {
      //     name: e[name || "areaName"],
      //     type: "pie",
      //     radius: "75%",
      //     center: ["50%", "50%"],
      //     data: e.total,
      //     label: {
      //       normal: {
      //         show: false,
      //       },
      //     },
      //     itemStyle: {
      //       emphasis: {
      //         shadowBlur: 7,
      //         shadowOffsetX: 0,
      //         shadowColor: "rgba(255, 255, 255, 0.5)",
      //       },
      //     },
      //   };
      // });

      let dataArr = {
        name: title || "区域能耗占比",
        type: "pie",
        radius: "75%",
        center: ["50%", "50%"],
        data: data.data.map((e, i) => {
          return {
            name: e[name || "areaName"],
            value: e.total,
          };
        }),
        label: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 7,
            shadowOffsetX: 0,
            shadowColor: "rgba(255, 255, 255, 0.5)",
          },
        },
      };
      var pieOption = {
        color: colors,
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}Kwh ({d}%)",
        },
        legend: {
          orient: "vertical",
          type: "scroll",
          right: "5%",
          x: "right",
          y: "bottom",
          textStyle: {
            color: "#CFE6E0",
          },
          data: data.legend,
        },
        series: dataArr,
      };

      this.chart.setOption(pieOption);
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.pie-chart {
  width: rem(430);
  height: rem(300);
}
</style>
