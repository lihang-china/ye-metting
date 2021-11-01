<template>
  <div class="line-chart" />
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

      var lineXAxisData = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ];
      //console.log(data);

      var lineOption = {
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} 总耗电量 : {c}Kwh",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: lineXAxisData,
          // 去除x轴上的刻度线
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "rgba(208, 237, 254, 0.2)",
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "rgba(208, 237, 254, 1)", //x轴data 的颜色
            },
          },
        },
        yAxis: {
          type: "value",
          // 控制网格线是否显示
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(208, 237, 254, 0.2)",
            },
          },
          // 去除y轴上的刻度线
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "rgba(208, 237, 254, 1)", //y轴data 的颜色
            },
          },
        },
        series: [
          {
            data: data.map((item) => {
              return item.total;
            }),
            name: "每小时段耗电总量",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {
                //设置线下面部分颜色渐变
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "RGBA(0, 164, 255, 1)" },
                  { offset: 0.5, color: "RGBA(0, 164, 255, 0.7)" },
                  { offset: 1, color: "RGBA(0, 164, 255, 0)" },
                ]),
              },
            },
            showSymbol: true,
            smooth: true,
            symbol: "circle", //设定为实心点
            // symbolSize: 20,   //设定实心点的大小
            itemStyle: {
              normal: {
                color: "#00CCFF", //折点颜色
                lineStyle: {
                  color: "RGBA(0, 164, 255, 1)", //折线颜色
                },
              },
            },
          },
        ],
      };

      this.chart.setOption(lineOption);
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";
.line-chart {
  width: rem(914);
  height: rem(300);
}
</style>
