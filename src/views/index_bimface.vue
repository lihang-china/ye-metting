<template>
  <div class="wpbox">
    <Head />
    <IndexLeft />
    <IndexRight />
  </div>
</template>

<script>
import Head from "@/views/bimface/Head";
import IndexLeft from "@/views/bimface/index/IndexLeft";
import IndexRight from "@/views/bimface/index/IndexRight";

export default {
  name: "Index",
  components: { Head, IndexLeft, IndexRight },
};
</script>

<style scoped>
@import "~@/assets/styles/style.css";
@import "~@/assets/styles/index.css";

.bimface {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
}
</style>
