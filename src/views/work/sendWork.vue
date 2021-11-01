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
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          v-if="queryType != 'run'"
          @click="handleDeleteHis"
          >删除</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="workList"
      :key="tableKey"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="queryType != 'run'"
      />
      <el-table-column
        label="序号"
        align="center"
        type="index"
        width="55"
        v-if="queryType === 'run'"
      />
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
        align="center"
        prop="userName"
        width="200"
        v-if="queryType != 'run'"
      />
      <el-table-column label="发起时间" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前环节"
        align="left"
        prop="currentActivityName"
        width="200"
        v-if="queryType === 'run'"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="queryType === 'run'"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteHis(scope.row)"
            v-if="queryType !== 'run'"
            >删除</el-button
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

    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="工作名称">{{ work.flowName }}</el-form-item>
        <el-form-item label="工作标题">{{ work.workTitle }}</el-form-item>
        <el-form-item label="当前环节">{{
          work.currentActivityName
        }}</el-form-item>
        <el-form-item label="开始时间">{{
          parseTime(work.startTime)
        }}</el-form-item>
        <el-form-item label="删除原因">
          <el-input
            v-model="text"
            type="textarea"
            placeholder="请输入删除原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  runWorkList,
  runWorkDel,
  hisWorkList,
  hisWorkDel,
} from "@/api/work/work";

export default {
  name: "SendWork",
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
      //
      title: undefined,
      //
      open: false,
      //
      work: {},
      //
      text: undefined,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.workList = [];
      this.loading = true;
      if (this.queryType === "run") {
        runWorkList(this.queryParams).then((response) => {
          this.workList = response.rows;
          this.tableKey = +new Date();
          this.total = response.total;
          this.loading = false;
        });
      } else {
        hisWorkList(this.queryParams).then((response) => {
          this.workList = response.rows;
          this.tableKey = +new Date();
          this.total = response.total;
          this.loading = false;
        });
      }
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
    /** 删除进行中的工作 */
    handleDelete(row) {
      this.work = {};
      this.work = row;
      this.title = "工作删除";
      this.open = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
    /** 删除进行中的工作 提交 */
    submitForm() {
      if (this.text) {
        const loading = this.openLoading("正在提交删除,请稍后......");
        runWorkDel(this.work.processInstanceId, { text: this.text })
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(() => {
            loading.close();
          });
      } else {
        this.msgError("请输入删除原因");
      }
    },
    /** 删除进行中的工作 取消 */
    cancel() {
      this.open = false;
      this.work = {};
    },
    /** 删除历史数据 */
    handleDeleteHis(row) {
      const workIds = row.id || this.ids;
      this.$confirm("是否确认删除选中的历史工作记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        hisWorkDel(workIds)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            } else {
              this.msgError("删除失败");
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