<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="listenerList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" fixed />
      <el-table-column
        label="监听器名称"
        align="left"
        prop="listenerName"
        width="150"
        show-overflow-tooltip
        fixed
      />
      <el-table-column
        label="监听器事件"
        align="left"
        prop="listenerEvent"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        label="执行的类型"
        align="left"
        prop="valueType"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ optionsFormat(valueTypeOptions, scope.row.valueType) }}</template>
      </el-table-column>
      <el-table-column
        label="执行内容"
        align="left"
        prop="listenerValue"
        width="100"
        show-overflow-tooltip
      />
    </el-table>

    <el-dialog
      width="50%"
      :title="title"
      :visible.sync="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
        <el-form-item label="监听器名称">
          <el-input
            v-model="queryParams.listenerName"
            placeholder="请输入监听器名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button type="success" icon="el-icon-check" size="mini" @click="handleSubmit">确认</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loadingS"
        :data="listenerListS"
        @selection-change="handleSelectionChangeS"
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
  </div>
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
    listeners: {
      type: Array,
      default: () => [],
    },
    listenerType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      //
      valueTypeOptions: valueTypeList,
      //
      listenerList: [],
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 是否显示弹出层
      open: false,
      //
      title: undefined,
      //
      loadingS: false,
      //
      listenerListS: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        listenerName: undefined,
        listenerType: undefined,
      },
      listenersS: [],
    };
  },
  created() {
    this.listenerList = this.listeners;
  },
  methods: {
    optionsFormat(options, value) {
      return options.find((t) => t.value === value).label;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.listenerId);
      this.multiple = !selection.length;
    },
    /** 查询流程监听器列表 */
    getList() {
      this.loadingS = true;
      listListeners(this.queryParams).then((response) => {
        this.listenerListS = response.rows;
        this.total = response.total;
        this.loadingS = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSubmit() {
      this.listenerList = this.listenersS;
      this.open = false;
      this.$emit("chooseListens", this.listenerList);
    },
    handleSelectionChangeS(selection) {
      this.listenersS = selection;
    },
    handleAdd() {
      this.title =
        this.listenerType === 1 ? "选择执行监听器" : "选择任务监听器";
      this.open = true;
      this.queryParams.listenerType = this.listenerType;
      this.getList();
    },
    handleDelete() {
      let list = this.listenerList.filter(
        (t) => this.ids.indexOf(t.listenerId) < 0
      );
      this.listenerList = list;
      //console.log(list);
      //this.$emit("chooseListens", list);
    },
  },
};
</script>