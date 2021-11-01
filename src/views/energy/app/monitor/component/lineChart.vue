<template>
    <div class="line-chart" />
</template>

<script>
import echarts from "echarts";
import resize from "@/views/dashboard/mixins/resize";

export default {
  mixins: [resize],
  props: {
    cData: {
        default: null,
        type: Object
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    var _this = this
    this.$nextTick(() => {
      this.chart = echarts.init(this.$el);
      this.initChart();
      this.chart.on('click', function (param) {
        _this.$emit('tap',param.name)
      });
    });
  },
  watch:{
    cData(value,ovalue){
      this.initChart();
    }
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
    
      let option = {
        color: ['#00EEB4','#048CFF', '#AF6EFF'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        grid:{
            top:"50px",
            left:"80px",
            right:"70px",
            bottom:"20px"
        },
        xAxis: [
            {
                type: 'category',
                data: this.cData? this.cData.xAxisData :[],
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#CFE6E0'
                    }
                },
                axisLine:{ 
                  show:false
                },
            }
        ],
        yAxis: [
           {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#CFE6E0'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                      color: ['#014490'],
                      width: 1,
                      type: 'solid'
                  }
            　　},
                axisLine:{ 
                  show:false
                },
            }
        ],
        series: this.cData? this.cData.series :[]
    };

    this.chart.setOption(option);

    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";
.line-chart {
  width: rem(914);
  height: rem(300);
}
</style>
