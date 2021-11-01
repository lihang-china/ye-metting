<template>
  <div class="amidd_bott">
    <AMiddBoxtBott1 :title="leftTitle" />
    <AMiddBoxtBott2 :title="rightTitle" />
  </div>
</template>

<script>
import AMiddBoxtBott1 from "@/views/bimface/box/AMiddBoxtBott1";
import AMiddBoxtBott2 from "@/views/bimface/box/AMiddBoxtBott2";

export default {
  name: "IndexRightMiddBott",
  components: { AMiddBoxtBott1, AMiddBoxtBott2 },
  data() {
    return {
      leftTitle: "一周报修统计",
      rightTitle: "全年报修统计",
    };
  },
};
</script>