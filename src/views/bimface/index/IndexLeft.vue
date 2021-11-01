<template>
  <div class="left1">
    <ALeftBoxtTop :title="topTitle" />
    <ALeftBoxtMidd :title="middTitle" />
    <ALeftBoxtBott :title="bottTitle" />
  </div>
</template>

<script>
import ALeftBoxtTop from "@/views/bimface/box/ALeftBoxtTop";
import ALeftBoxtMidd from "@/views/bimface/box/ALeftBoxtMidd";
import ALeftBoxtBott from "@/views/bimface/box/ALeftBoxtBott";

export default {
  name: "IndexLeft",
  components: { ALeftBoxtTop, ALeftBoxtMidd, ALeftBoxtBott },
  data() {
    return {
      topTitle: "设备运维",
      middTitle: "今日能耗统计",
      bottTitle: "本月能耗统计",
    };
  },
};
</script>