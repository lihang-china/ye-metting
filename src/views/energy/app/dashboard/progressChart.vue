<template>
  <div class="progress-chart" />
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
    initChart(data) {
      this.chart = echarts.init(this.$el, "macarons");

      let option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "业务指标",
            type: "gauge",
            detail: { formatter: "{value}%", fontSize:16 },
            data: [{ value: data, name: "" }],
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";
.progress-chart {
  width: rem(433);
  height: rem(300);
}
</style>
