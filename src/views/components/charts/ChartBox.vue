<template>
  <div class="chart-box">
    <div class="chart-box-index">
      <span class="chart-box-index-name">{{ title }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChartBox",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-box {
  width: 100%;
  height: auto;
  background: #ffffff;
  border-radius: 5px;
  padding: 15px;
  box-sizing: border-box;
  .chart-box-index {
    width: 100%;
    border: 1px solid #e6e6e6;
    position: relative;
    padding: 20px 15px;
    box-sizing: border-box;
    .chart-box-index-name {
      position: absolute;
      width: 100px;
      height: 30px;
      background: #ffffff;
      display: inline-block;
      text-align: center;
      line-height: 30px;
      font-size: 13px;
      color: #000000;
      left: 25px;
      top: -15px;
    }
  }
}
</style>