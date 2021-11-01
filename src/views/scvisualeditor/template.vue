<template>
  <div class="template-main">
    <iframe :src="url" frameborder="0" class="iframe"></iframe>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "ScVisualTemplate",
  data() {
    return {
      url: undefined,
    };
  },
  mounted() {
    this.getConfigKey("gis.scVisualEditor.url").then((response) => {
      this.url = response.msg + "/sctemplate/0/" + getToken();
    });
    // this.url =
    //   process.env.VUE_APP_SCVISUALEDITOR_URL +
    //   "sctemplate/" +
    //   getToken() +
    //   "/0";
    // console.log(this.url);
  },
};
</script>

<style lang="scss" scoped>
.template-main {
  padding: 12px;
  height: calc(100vh - 100px);
  .iframe {
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
  }
}
</style>