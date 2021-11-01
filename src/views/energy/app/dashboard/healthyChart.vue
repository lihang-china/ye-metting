<template>
  <div class="healthy-chart" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/views/dashboard/mixins/resize'

export default {
  mixins: [resize],
  props: {
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

        let option = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
        
    },
    
    series: [
        {
            name: '业务指标',
            type: 'gauge',
            detail: {formatter: '{value}%'},
            data: [{value: 50, name: ''}]
        }
    ]
};



      this.chart.setOption(option)
    }
  }
}
</script>

<style lang="scss">
    @import '~@/assets/styles/common.scss';
    .healthy-chart{
        width: rem(433);
        height: rem(300);
    }
</style>
