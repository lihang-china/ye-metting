<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="工作名称" prop="flowName">
        <el-input
          v-model="queryParams.flowName"
          placeholder="请输入工作名称"
          clearable
          style="width: 270px"
        />
      </el-form-item>
      <el-form-item label="工作标题" prop="workTitle">
        <el-input
          v-model="queryParams.workTitle"
          placeholder="请输入工作标题"
          clearable
          style="width: 270px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="workList">
      <el-table-column label="序号" align="center" type="index" width="55" />
      <el-table-column
        label="工作名称"
        align="left"
        prop="flowName"
        width="200"
      />
      <el-table-column
        label="工作标题"
        align="left"
        prop="workTitle"
        show-overflow-tooltip
      />
      <el-table-column
        label="发起人"
        align="left"
        prop="userName"
        width="200"
      />
      <el-table-column
        label="完成环节"
        align="center"
        prop="taskName"
        width="200"
      />
      <el-table-column label="完成时间" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.completeTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { didWorkList } from "@/api/work/work";

export default {
  name: "DidWork",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      //
      workList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        flowName: undefined,
        workTitle: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      didWorkList(this.queryParams).then((response) => {
        this.workList = response.rows;
        this.total = response.total;
        this.loading = false;
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
  },
};
</script>