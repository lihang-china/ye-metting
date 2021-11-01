<template>
  <div>
    <div class="chart-box-index-select">
      <el-radio-group v-model="timeSelect" size="medium" @change="timeChange">
        <el-radio-button label="0">近七日</el-radio-button>
        <el-radio-button label="1">本月</el-radio-button>
        <!-- <el-radio-button label="2">本年</el-radio-button> -->
      </el-radio-group>
    </div>
    <div ref="myChartWork" class="mychart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts-gl";
import moment from "moment";

export default {
  name: "ChartWork",
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
      // 今日
      const today = moment().format("yyyy-MM-DD");

      const dates = [];
      let todate = value === "0" ? 7 : moment().date();
      for (let index = 1 - todate; index < 1; index++) {
        dates.push(moment(today).add(index, "d").format("yyyy-MM-DD"));
      }
      const workTypes = [
        "访客申请",
        "报修",
        "保养",
        "巡检",
        "入库",
        "出库",
        "用户申请",
      ];
      const datas = [];
      workTypes.forEach((workType, index) => {
        dates.forEach((date, i) => {
          datas.push([index, i, parseInt(Math.random() * 100)]);
        });
      });

      //console.log("dates", dates, "workTypes", workTypes, "datas", datas);
      this.init(dates, workTypes, datas);
    },
    init(dates, workTypes, datas) {
      const option = {
        tooltip: {},
        backgroundColor: "#f5f7f9",
        visualMap: {
          max: 100,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
        },
        xAxis3D: {
          type: "category",
          name: "日期",
          data: dates,
        },
        yAxis3D: {
          type: "category",
          name: "流程",
          data: workTypes,
        },
        zAxis3D: {
          type: "value",
          name: "数量",
        },
        grid3D: {
          boxWidth: 200,
          boxDepth: 150,
          light: {
            main: {
              intensity: 1.2,
            },
            ambient: {
              intensity: 0.3,
            },
          },
        },
        series: [
          {
            type: "bar3D",
            //data: datas,
            data: datas.map(function (item) {
              return {
                value: [item[1], item[0], item[2]],
              };
            }),
            shading: "color",
            label: {
              show: false,
              textStyle: {
                fontSize: 16,
                borderWidth: 1,
              },
            },
            itemStyle: {
              opacity: 0.5,
            },
            emphasis: {
              label: {
                textStyle: {
                  fontSize: 20,
                  color: "#900",
                },
              },
              itemStyle: {
                color: "#900",
              },
            },
          },
        ],
      };
      const myChartContainer = this.$refs.myChartWork;
      const myChartWork = echarts.init(myChartContainer);
      myChartWork.setOption(option);
    },
  },
};
</script>

<style scoped>
.chart-box-index-select {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.mychart {
  width: 100%;
  height: 500px;
}
</style>