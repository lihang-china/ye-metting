<template>
  <div class="app-container">
    <Parser :key="keyParser" v-if="formConf" :form-conf="formConf" @submit="sumbitForm1" />
    <!-- <el-form label-width="100px">
      <el-form-item style="text-align: center; margin-left: -100px; margin-top: 10px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>-->
  </div>
</template>

<script>
// import Parser from "form-gen-parser";

import Parser from "@/components/generator/Parser";

import { getDicts } from "@/api/system/dict/data";
import { getForm, getFormContent, submit, dynamic } from "@/api/workflow/form";

export default {
  name: "FormView",
  components: {
    Parser,
  },
  data() {
    return {
      keyParser: +new Date(),
      formId: undefined,
      formModel: undefined,
      formContent: undefined,
      formConf: undefined,
    };
  },
  mounted() {
    this.formId = this.$route.params.formId;
    getForm(this.formId).then((response) => {
      this.formModel = response.data;
      if (this.formModel.formContentId) {
        getFormContent(this.formModel.formContentId).then((response) => {
          this.formContent = response.data;
          this.formConf = JSON.parse(this.formContent.formContentText);
          let { fields } = JSON.parse(this.formContent.formContentText);
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
        });
      }
    });
  },
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
    sumbitForm1(data) {
      submit(this.formModel.completeUrl, data).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("保存成功");
        } else {
          this.msgError(response.msg);
        }
      });
    },
  },
};
</script>