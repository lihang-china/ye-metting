<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    :before-close="modalClose"
    :close-on-click-modal="false"
  >
    <el-table v-loading="loading" :data="itemList" height="460px">
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column label="巡检项" align="center" prop="pitemName" />
      <el-table-column
        label="巡检结果类型"
        align="center"
        prop="resultType"
        :formatter="resultTypeFormat"
      />
      <el-table-column label="结果选项" align="center" prop="resultOption" show-overflow-tooltip />
      <el-table-column label="结果标准" align="center" prop="resultStandard" show-overflow-tooltip />
    </el-table>
  </el-dialog>
</template>

<script>
import { listByParea } from "@/api/patrol/item";

export default {
  props: {
    title: {
      type: String,
      default: "环境巡检项",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    pareaId: Number,
    equId: {
      type: Number,
      default: -1,
    },
    require: true,
  },
  data() {
    return {
      loading: false,
      itemList: [],
      resultTypeOptions: [],
    };
  },
  created() {
    this.getDicts("item_result_type").then((response) => {
      this.resultTypeOptions = response.data;
    });
    this.getList();
  },
  mounted() {},
  methods: {
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isShow", false); // 直接修改父组件的属性
    },
    resultTypeFormat(row, column) {
      return this.selectDictLabel(this.resultTypeOptions, row.resultType);
    },
    getList() {
      this.loading = true;
      listByParea(this.pareaId, this.equId).then((response) => {
        this.itemList = response.data;
        this.loading = false;
      });
    },
  },
};
</script>