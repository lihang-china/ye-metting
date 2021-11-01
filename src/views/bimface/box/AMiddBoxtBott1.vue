<template>
  <div class="amiddboxtbott1 fl">
    <h2 class="tith2 pt1">{{ title }}</h2>
    <div ref="amiddboxtbott1" class="amiddboxtbott1content"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "AMiddBoxtBott1",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      xAxis: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      legend: ["水", "电", "照明", "空调"],
      params: [
        {
          name: "水",
          constant: 2,
          multiple: 10,
        },
        {
          name: "电",
          constant: 2,
          multiple: 10,
        },
        {
          name: "照明",
          constant: 2,
          multiple: 10,
        },
        {
          name: "空调",
          constant: 1,
          multiple: 10,
        },
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
      let series = [];
      this.params.forEach((param) => {
        series.push({
          name: param.name,
          type: "line",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "top",
            },
          },
          areaStyle: {},
          data: this.getData(param.constant, param.multiple),
        });
      });
      return series;
    },
    init() {
      const myChart = echarts.init(this.$refs.amiddboxtbott1);
      const option = {
        backgroundColor: "rgba(1,202,217,.2)",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          top: 10,
          textStyle: {
            fontSize: 10,
            color: "rgba(255,255,255,.7)",
          },
          data: this.legend,
        },
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.5)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
            axisLabel: {
              color: "rgba(255,255,255,.5)",
            },
            boundaryGap: false,
            data: this.xAxis,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.5)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
            axisLabel: {
              color: "rgba(255,255,255,.5)",
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