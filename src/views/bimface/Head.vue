<template>
  <div class="bnt">
    <div class="topbnt_left fl">
      <!-- <div class="logo"><img src="@/assets/img/logo2.png"></div> -->
      <Weather />
    </div>
    <h1 class="tith1 fl">综合运维平台</h1>
    <div class="topbnt_right fr">
      <Timer />
      <ul>
        <li class="active">
          <a @click="goPage('GisIndex')">设备监控</a>
          <!-- href="/gis-app/dashboard" -->
        </li>
        <li>
          <a @click="goPage('EnergyIndex')">能源计量</a>
          <!-- href="/energy-app/dashboard" -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Weather from "./Weather";
import Timer from "./Timer";

export default {
  name: "Head",
  components: { Weather, Timer },
  methods: {
    goPage(page) {
      this.$router.push({ name: page });
    },
  },
};
</script>