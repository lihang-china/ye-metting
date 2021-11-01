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
        prop="applyUserId"
        width="200"
      />
      <el-table-column label="发起时间" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前环节" align="left" prop="name" width="200" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="250"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-mouse"
            @click="handleReceive(scope.row)"
            >签收</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleCandidates(scope.row)"
            >追加工作候选人</el-button
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

    <SelectUser
      v-if="isVisiable"
      :isVisiable.sync="isVisiable"
      @chooseUser="handleUser"
    />
  </div>
</template>

<script>
import { receiveWorkList, receiveWork, candidates } from "@/api/work/work";
import SelectUser from "@/views/components/system/SelectUser";

export default {
  name: "ReceiveWork",
  components: { SelectUser },
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
      //
      taskId: undefined,
      //
      isVisiable: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      receiveWorkList(this.queryParams).then((response) => {
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
    /** 签收任务 */
    handleReceive(row) {
      let taskId = row.id;
      this.$confirm("是否确认签收'" + row.workTitle + "'工作?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading("正在签收,请稍后......");
        receiveWork(taskId)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("签收成功");
              this.getList();
            } else {
              this.msgError("签收失败");
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    /** 追加任务候选人 */
    handleCandidates(row) {
      this.taskId = row.id;
      this.isVisiable = true;
    },
    /** 追加任务候选人 提交 */
    handleUser(value) {
      //console.log(value);
      const loading = this.openLoading("正在追加,请稍后......");
      candidates(this.taskId, { userNames: value.userIds })
        .then((response) => {
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("委托追加");
            this.getList();
          } else {
            this.msgError("委托追加");
          }
        })
        .catch(() => {
          loading.close();
        });
    },
  },
};
</script>