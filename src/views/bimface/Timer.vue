<template>
  <div class="timer">
    {{ dateFormat(dateValue) }}
  </div>
</template>

<script>
export default {
  name: "Timer",
  data() {
    return {
      dateValue: undefined,
    };
  },
  created() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.dateValue = new Date(); // 修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.dateValue) {
      clearInterval(this.dateValue); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    //   时间格式化
    dateFormat: function (time) {
      let date = new Date(time);
      let year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

      let why = "";
      if (date.getHours()) {
        let hour = date.getHours();
        if (hour < 6) {
          why = "凌晨好！";
        } else if (hour < 9) {
          why = "早上好！";
        } else if (hour < 12) {
          why = "上午好！";
        } else if (hour < 14) {
          why = "中午好！";
        } else if (hour < 17) {
          why = "下午好！";
        } else if (hour < 19) {
          why = "傍晚好！";
        } else if (hour < 22) {
          why = "晚上好！";
        } else {
          why = "夜里好！";
        }
      }

      if (isNaN(year)) {
        return "";
      } else {
        // 拼接
        return (
          // why +
          // " " +
          year +
          "年" +
          month +
          "月" +
          day +
          "日 " +
          hours +
          "时" +
          minutes +
          "分" +
          seconds +
          "秒"
        );
      }
    },
  },
};
</script>