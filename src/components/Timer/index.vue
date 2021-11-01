<template>
  <div class="timer">
    {{ timerStr }}
  </div>
</template>

<script>
export default {
  name: "Timer",
  props: {
    isStart: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  data() {
    return {
      //时
      hour: 0,
      //分
      minute: 0,
      //秒
      second: 0,
      //毫秒
      ms: 0,
      //时间
      time: undefined,
      //文字显示
      timerStr: "00:00:00",
    };
  },
  mounted() {
    this.timeInit();
  },
  methods: {
    //初始化计时器
    timeInit() {
      if (this.isStart) {
        this.timeStart();
      } else {
        this.timeStop();
      }
    },
    //开始计时
    timeStart() {
      this.time = setInterval(this.timer, 50);
    },
    //定义计时函数
    timer() {
      this.ms = this.ms + 50; //毫秒
      if (this.ms >= 1000) {
        this.ms = 0;
        this.second = this.second + 1; //秒
      }
      if (this.second >= 60) {
        this.second = 0;
        this.minute = this.minute + 1; //分钟
      }
      if (this.minute >= 60) {
        this.minute = 0;
        this.hour = this.hour + 1; //小时
      }
      this.timerStr =
        this.toDub(this.hour) +
        ":" +
        this.toDub(this.minute) +
        ":" +
        this.toDub(this.second); /*+""+this.toDubms(this.ms)+"毫秒"*/

      // document.getElementById('mytime').innerHTML=h+"时"+m+"分"+s+"秒"+ms+"毫秒";
    },
    //补0
    toDub(n) {
      //补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },
    //计时器结束
    timeStop() {
      clearInterval(this.time);
      this.hour = 0;
      this.minute = 0;
      this.second = 0;
      this.ms = 0;
      this.timerStr = "00:00:00";
    },
  },
};
</script>

<style scoped>
</style>