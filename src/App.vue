<!--
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-14 16:13:37
 * @LastEditors: Your Name
 * @LastEditTime: 2021-10-14 09:14:02
-->

<template>
  <div id="app">
    <router-link to="/"></router-link>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    // 里的防止放大可能会影响到PC端的尺寸（只是可能）
    document.documentElement.addEventListener(
      'touchstart',
      function (event) {
        if (event.touches.length > 1) {
          event.preventDefault()
        }
      },
      { passive: false }
    )
    // 禁止双击放大
    let lastTouchEnd = 0
    document.documentElement.addEventListener(
      'touchend',
      function (event) {
        var now = Date.now()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      },
      { passive: false }
    )
  }
}
</script>
<style >
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.van-dropdown-menu__bar {
  box-shadow: none !important;
}
.van-field__word-limit {
  margin-top: -30px !important;
  color: #646566;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
}
.van-icon-arrow:before {
  display: none !important;
}
</style>
