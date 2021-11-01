<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="巡检任务编码" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入巡检任务编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="巡检时间">
        <el-date-picker
          v-model="dateRangeTime"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="taskList">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="巡检任务编码" align="center" prop="taskCode" />
      <el-table-column label="巡检计划编号" align="center" prop="planCode" />
      <el-table-column label="巡检计划名称" align="center" prop="planName" />
      <el-table-column label="开始时间" align="center" prop="beginDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计结束时间" align="center" prop="endDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最晚结束时间" align="center" prop="latestTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.latestTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="巡检计划类型"
        align="center"
        prop="type"
        :formatter="typeFormat"
        width="100"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="100"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改巡检任务 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="巡检任务编号" prop="taskCode">
              <span>{{form.taskCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检计划编码" prop="planCode">
              <span>{{form.planCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检计划名称" prop="planName">
              <span>{{form.planName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检开始时间" prop="beginDate">
              <span>{{ parseTime(form.beginDate) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检结束时间" prop="endDate">
              <span>{{ parseTime(form.endDate) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="最晚结束时间" prop="latestTime">
              <span>{{ parseTime(form.latestTime) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实际开始时间" prop="abeginTime">
              <el-date-picker
                clearable
                size="small"
                style="width: 300px"
                v-model="form.abeginTime"
                type="datetime"
                placeholder="请选择实际开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际结束时间" prop="aendTime">
              <el-date-picker
                clearable
                size="small"
                style="width: 300px"
                v-model="form.aendTime"
                type="datetime"
                placeholder="请选择实际结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="说明" prop="notes">
              <el-input v-model="form.notes" type="textarea" placeholder="请输入说明" />
            </el-form-item>
          </el-col>
        </el-row>
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
  listTask,
  getTask,
  delTask,
  addTask,
  updateTask,
  exportTask,
} from "@/api/patrol/task";

export default {
  name: "Task",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 巡检任务 表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskCode: undefined,
        status: undefined,
      },
      typeOptions: [],
      statusOptions: [],
      // 日期范围
      dateRangeTime: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        abeginTime: [
          { required: true, message: "请选择实际开始时间", trigger: "blur" },
        ],
        aendTime: [
          { required: true, message: "请选择实际结束时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("task_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("task_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询巡检任务 列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRanges(this.queryParams, this.dateRangeTime);
      listTask(this.queryParams).then((response) => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    addDateRanges(params, times) {
      var search = params;
      search.beginTime = "";
      search.endTime = "";
      if (null != times && "" != times) {
        search.beginTime = times[0];
        search.endTime = times[1];
      }
      return search;
    },
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        taskId: undefined,
        taskGuid: undefined,
        taskCode: undefined,
        planId: undefined,
        beginDate: undefined,
        endDate: undefined,
        latestTime: undefined,
        abeginTime: undefined,
        aendTime: undefined,
        patrolResults: undefined,
        type: undefined,
        notes: undefined,
        status: "0",
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRangeTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleEdit(row) {
      this.reset();
      const taskId = row.taskId;
      getTask(taskId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑巡检任务 ";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.taskId != undefined) {
            this.form.status = "0";
            updateTask(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
  },
};
</script>