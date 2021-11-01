<template>
  <div class="app-container">
    <Parser :key="keyParser" v-if="formConf" :form-conf="formConf" @submit="submit" />
  </div>
</template>

<script>
import Parser from "@/components/generator/Parser";

import { getDicts } from "@/api/system/dict/data";
import { dynamic } from "@/api/workflow/form";

export default {
  props: {
    formContent: {
      type: String,
      require: true,
    },
  },
  name: "ViewFormContent",
  components: { Parser },
  data() {
    return {
      keyParser: +new Date(),
      formConf: undefined,
    };
  },
  created() {
    this.formConf = JSON.parse(this.formContent);
    let { fields } = JSON.parse(this.formContent);
    //下拉-单选-多选-级联需要特殊处理
    fields.forEach((item, index) => {
      if (
        ["el-checkbox-group", "el-radio-group", "el-select"].indexOf(
          item.__config__.tag
        ) > -1
      ) {
        if (item.__config__.dataType) {
          if (item.__config__.dataType === "dictionary") {
            //字典
            getDicts(item.__config__.dictType).then((response) => {
              this.refreshFields(
                index,
                response.data ? response.data : response.rows,
                "dictLabel",
                "dictValue"
              );
            });
          } else if (item.__config__.dataType === "dynamic") {
            //动态
            dynamic(item.props.props.url).then((response) => {
              this.refreshFields(
                index,
                response.data ? response.data : response.rows,
                item.props.props.label,
                item.props.props.value
              );
            });
          }
        }
      }

      if (["el-cascader"].indexOf(item.__config__.tag) > -1) {
        if (item.__config__.dataType === "dynamic") {
          //动态
          dynamic(item.props.props.url).then((response) => {
            let treeData = response.data;
            let { label, value, children } = item.props.props;

            let treeDataString = JSON.stringify(treeData)
              .replace(eval("/" + label + "/g"), "label")
              .replace(eval("/" + value + "/g"), "id")
              .replace(eval("/" + children + "/g"), "children");

            treeData = JSON.parse(treeDataString);

            this.$set(this.formConf.fields[index], "options", treeData);
            this.keyParser = +new Date();
          });
        }
      }
    });
    this.keyParser = +new Date();
  },
  mounted() {},
  methods: {
    refreshFields(index, data, label, value) {
      let list = [];
      data.forEach((item) => {
        list.push({
          label: item[label],
          value: item[value],
        });
      });
      this.$set(this.formConf.fields[index].__slot__, "options", list);
      this.keyParser = +new Date();
    },
    submit(data) {
      this.$emit("submit", data);
    },
  },
};
</script>