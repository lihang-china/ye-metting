<template>
  <div class="pie-chart" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from "@/views/dashboard/mixins/resize";

export default {
 mixins: [resize],
  props: {
    cData: {
        default: null,
        type: Array
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
        this.chart = echarts.init(this.$el, 'macarons')
        let colors = ['#2CDEB2', '#006CFF', '#00B4FF', '#C499FF', '#bce672', '#ff4777', '#70f3ff', '#4b5cc4', '#f47983', '#8d4bbb', '#6635EF', '#FFAFDA'];
        
        var pieOption = {
            color: colors,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                type: 'scroll',
                right: "5%",
                x:"right",
                y:"bottom",
                textStyle: {
                    color: '#CFE6E0'
                },
                data: this.cData.map(d => d.name)
            },
            series :[
               {
                  name:"",
                  type: 'pie',
                  radius: '80%',
                  center: ['50%', '55%'],
                    label: {
                        show: false,
                        position: 'center'
                    },
                  data: this.cData,
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
            ]
        };




      this.chart.setOption(pieOption)
    }
  }
}
</script>

<style lang="scss">
    @import '~@/assets/styles/common.scss';
    .pie-chart{
        width: rem(453);
        height: rem(300);
    }
</style>
