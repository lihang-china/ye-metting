<template>
  <div class="aleftboxtbott">
    <h2 class="tith2">{{ title }}</h2>
    <div ref="aleftboxtbott" class="aleftboxtbott_cont"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "ALeftBoxtBott",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      yAxis: ["用电", "用水", "用气", "热量", "冷量"],
      params: [
        {
          constant: 2,
          multiple: 10000,
        },
        {
          constant: 2,
          multiple: 10000,
        },
        {
          constant: 1,
          multiple: 10000,
        },
        {
          constant: 9,
          multiple: 1000,
        },
        {
          constant: 6,
          multiple: 1000,
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getData() {
      let data = [];
      this.params.forEach((param, index) => {
        data.push(
          ((Math.random() + param.constant) * param.multiple).toFixed(2)
        );
      });
      return data;
    },
    getSeries(){
      return [
          {
            type: "bar",
            barWidth: 30,
            label: {
              show: true,
              textBorderColor: "#333",
              textBorderWidth: 2,
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                  { offset: 0, color: "rgba(230,253,139,.7)" },
                  { offset: 1, color: "rgba(41,220,205,.7)" },
                ]),
              },
            },
            data: this.getData(),
          },
        ]
    },
    init() {
      const myChart = echarts.init(this.$refs.aleftboxtbott);
      const option = {
        color: ["#7ecef4"],
        backgroundColor: "rgba(1,202,217,.2)",
        grid: {
          left: 20,
          right: 20,
          top: 13,
          bottom: 6,
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.2)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0)",
            },
          },
          axisLabel: {
            color: "rgba(255,255,255,0)",
          },
          boundaryGap: [0, 0.01],
        },
        yAxis: {
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
          data: this.yAxis,
        },
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