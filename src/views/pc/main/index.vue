<!--
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-16 19:37:53
 * @LastEditors: Your Name
 * @LastEditTime: 2021-09-27 15:24:39
-->
<template>
  <div class="wrap">
    <div class="container">
      <div class="calendarpage">
        <Calendar style="margin-top: 20px" />
      </div>
    </div>
  </div>
</template>
<script>
import Calendar from '@/views/pc/calendar/index.vue'
export default {
  name: 'YcMaaUiIndex',
  components: {
    Calendar
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    box-shadow: 2px 1px 10px 10px rgba(224, 224, 224, 0.7);
    background: -webkit-gradient(
      linear,
      0 0,
      0 100%,
      from(rgb(248, 243, 255)),
      to(rgb(249, 247, 255))
    );

    overflow: hidden;
    border-radius: 30px;
    width: 97%;
    height: 94%;
    padding: 0;

    .calendarpage {
      margin: 0 auto;
      width: 98%;
      height: 95%;
      h2 {
        text-align: center;
      }
    }
  }
}
</style>
