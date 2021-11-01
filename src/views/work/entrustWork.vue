<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="查询类型">
        <el-select
          v-model="queryType"
          placeholder="请选择"
          @change="handleQueryType"
        >
          <el-option label="进行中" value="run"></el-option>
          <el-option label="历史" value="his"></el-option>
        </el-select>
      </el-form-item>
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

    <el-table v-loading="loading" :data="workList" :key="tableKey">
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
        prop="applyUserId"
        width="200"
        v-if="queryType === 'run'"
      />
      <el-table-column
        label="发起人"
        align="left"
        prop="userName"
        width="200"
        v-if="queryType != 'run'"
      />
      <el-table-column
        label="发起时间"
        align="center"
        width="200"
        v-if="queryType === 'run'"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前环节"
        align="left"
        prop="name"
        width="200"
        v-if="queryType === 'run'"
      />
      <el-table-column
        label="当前环节"
        align="left"
        prop="taskName"
        width="200"
        v-if="queryType != 'run'"
      />
      <el-table-column
        label="被委托人"
        align="left"
        prop="assignee"
        width="200"
        v-if="queryType === 'run'"
      />
      <el-table-column
        label="委托人"
        align="left"
        prop="taskOwner"
        width="200"
        v-if="queryType != 'run'"
      />
      <el-table-column
        label="完成时间"
        align="center"
        width="200"
        v-if="queryType != 'run'"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.completeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        v-if="queryType === 'run'"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete-solid"
            @click="handleRevoke(scope.row)"
            >撤销</el-button
          >
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
import { entrustWorkList, revokeEntrust } from "@/api/work/work";

export default {
  name: "EntrustWork",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      //
      multiple: true,
      //
      workList: [],
      //
      tableKey: +new Date(),
      // 查询类型
      queryType: "run",
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
      this.workList = [];
      this.loading = true;
      entrustWorkList(this.queryType, this.queryParams).then((response) => {
        this.workList = response.rows;
        this.tableKey = +new Date();
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询类型选择 */
    handleQueryType() {
      this.resetQuery();
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
    /** 撤销委托 */
    handleRevoke(row) {
      let taskId = row.id;
      this.$confirm("是否确认撤销'" + row.workTitle + "'工作的委托?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading("正在撤销委托,请稍后......");
        revokeEntrust(taskId)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("撤销成功");
              this.getList();
            } else {
              this.msgError("撤销失败");
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
  },
};
</script>