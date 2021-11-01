<template>
  <el-dialog
    width="50%"
    :title="title"
    :visible.sync="isShow"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="监听器名称" prop="listenerName">
        <el-input v-model="queryParams.listenerName" placeholder="请输入监听器名称" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="el-icon-check" size="mini" @click="handleSubmit">确认</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="listenerList"
      @selection-change="handleSelectionChange"
      height="500px"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="监听器名称" align="left" prop="listenerName" width="200" />
      <el-table-column label="监听器事件" align="center" prop="listenerEvent" width="150" />
      <el-table-column label="执行的类型" align="center" prop="valueType" width="150">
        <template slot-scope="scope">{{ optionsFormat(valueTypeOptions, scope.row.valueType) }}</template>
      </el-table-column>
      <el-table-column label="执行内容" align="left" prop="listenerValue" show-overflow-tooltip />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
import { listListeners } from "@/api/workflow/listeners";

const valueTypeList = [
  {
    label: "class",
    value: 1,
  },
  {
    label: "expression",
    value: 2,
  },
];

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
      require: true,
    },
    listenerType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      title: undefined,
      //
      loading: false,
      //
      total: 0,
      //
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        listenerName: undefined,
        listenerType: undefined,
      },
      valueTypeOptions: valueTypeList,
      //
      listenerList: [],
      //
      chooseListener: [],
    };
  },
  created() {
    this.title = this.listenerType === 1 ? "选择执行监听器" : "选择任务监听器";
    this.queryParams.listenerType = this.listenerType;
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listListeners(this.queryParams).then((response) => {
        this.listenerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    optionsFormat(options, value) {
      return options.find((t) => t.value === value).label;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.chooseListener = selection;
    },
    handleSubmit() {
      if (this.chooseListener) {
        this.$emit("chooseListener", this.chooseListener);
        this.modalClose();
      }
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isShow", false); // 直接修改父组件的属性
    },
  },
};
</script>