<template>
  <div class="aleftboxtmidd">
    <h2 class="tith2">{{ title }}</h2>
    <div ref="aleftboxtmidd" class="aleftboxtmiddcont"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "ALeftBoxtMidd",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      params: [
        { name: "用电", constant: 1.5, multiple: 1000 },
        { name: "用水", constant: 9, multiple: 100 },
        { name: "用气", constant: 7.4, multiple: 100 },
        { name: "热量", constant: 4.5, multiple: 100 },
        { name: "冷量", constant: 4.5, multiple: 100 },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    randData() {
      let data = [];
      this.params.forEach((param, index) => {
        data.push({
          name: param.name,
          value: ((Math.random() + param.constant) * param.multiple).toFixed(2),
        });
      });
      return data;
    },
    getSeries(){
      return [
          {
            name: "面积模式",
            type: "pie",
            radius: [5, 60],
            center: ["50%", "55%"],
            roseType: "area",
            label: {
              formatter: "{b}:{c}\n({d}%)",
            },
            data: this.randData(),
          },
        ]
    },
    init() {
      const myChart = echarts.init(this.$refs.aleftboxtmidd);
      const option = {
        color: ["#76c4bf", "#e5ffc7", "#508097", "#4d72d9", "#d48265"],
        backgroundColor: "rgba(1,202,217,.2)",
        grid: {
          left: 10,
          right: 40,
          top: 20,
          bottom: 0,
          containLabel: true,
        },
        calculable: true,
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