<template>
  <div class="amiddboxtbott2 fl">
    <h2 class="tith2 pt1">{{ title }}</h2>
    <div ref="amiddboxtbott2" class="amiddboxtbott2content"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "AMiddBoxtBott2",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      legend: ["2020年", "2021年", "同比增长"],
      xAxis: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      params: [
        { name: "2020年", constant: 3, multiple: 10 },
        { name: "2021年", constant: 4, multiple: 10 },
        { name: "同比增长" },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getData(constant, multiple) {
      let data = [];
      this.xAxis.forEach(() => {
        data.push(((Math.random() + constant) * multiple).toFixed(0));
      });
      return data;
    },
    getSeries() {
      const last = this.getData(
        this.params[0].constant,
        this.params[0].multiple
      );
      const now = this.getData(
        this.params[1].constant,
        this.params[1].multiple
      );
      let increase = [];
      this.xAxis.forEach((item, index) => {
        increase.push(
          (((now[index] - last[index]) / last[index]) * 100).toFixed(2)
        );
      });

      return [
        {
          name: "2020年",
          type: "bar",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#b266ff" },
                { offset: 1, color: "#121b87" },
              ]),
            },
          },
          data: last,
        },
        {
          name: "2021年",
          type: "bar",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#00f0ff" },
                { offset: 1, color: "#032a72" },
              ]),
            },
          },
          data: now,
        },
        {
          name: "同比增长",
          type: "line",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#fffb34" },
                { offset: 1, color: "#fffb34" },
              ]),
            },
          },
          yAxisIndex: 1,
          data: increase,
        },
      ];
    },
    init() {
      const myChart = echarts.init(this.$refs.amiddboxtbott2);
      const option = {
        backgroundColor: "rgba(1,202,217,.2)",
        grid: {
          left: 60,
          right: 60,
          top: 50,
          bottom: 40,
        },
        legend: {
          top: 10,
          textStyle: {
            fontSize: 10,
            color: "rgba(255,255,255,.7)",
          },
          data: this.legend,
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.2)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
            axisLabel: {
              color: "rgba(255,255,255,.7)",
            },
            data: this.xAxis,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.3)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.01)",
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "",
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.3)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],
        series: this.getSeries(),
      };
      myChart.setOption(option);

      if (this.autoECharts) {
        setInterval(() => {
          myChart.setOption({
            series: this.getSeries(),
          });
        }, this.autoTime);
      }
    },
  },
};
</script>