<template>
  <div class="mrbox_topmidd" style="width: 69.2%">
    <AMiddBoxtTop :title="topTitle" />
    <IndexRightMiddBott />
  </div>
</template>

<script>
import AMiddBoxtTop from "@/views/bimface/box/AMiddBoxtTop";
import IndexRightMiddBott from "./IndexRightMiddBott";

export default {
  name: "IndexRightMidd",
  components: { AMiddBoxtTop, IndexRightMiddBott },
  data() {
    return {
      topTitle: "园区展示",
    };
  },
};
</script>