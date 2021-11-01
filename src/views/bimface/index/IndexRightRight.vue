<template>
  <div class="mrbox_top_right">
    <ARightBoxTop :title="topTitle" />
    <ARightBoxBott :title="bottTitle" />
  </div>
</template>

<script>
import ARightBoxTop from "@/views/bimface/box/ARightBoxTop";
import ARightBoxBott from "@/views/bimface/box/ARightBoxBott";

export default {
  name: "IndexRightRight",
  components: { ARightBoxTop, ARightBoxBott },
  data() {
    return {
      topTitle: "电梯运行情况",
      bottTitle: "实时监控",
    };
  },
};
</script>