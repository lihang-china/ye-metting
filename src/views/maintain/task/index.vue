<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="保养任务编号" prop="taskCode">
        <el-input v-model="queryParams.taskCode" placeholder="请输入保养任务编号" clearable size="small" />
      </el-form-item>
      <!-- <el-form-item label="保养计划" prop="planId">
        <el-select
          v-model="queryParams.planId"
          filterable
          clearable
          placeholder="请选择保养计划"
          size="small"
        >
          <el-option
            v-for="plan in planOptions"
            :key="plan.planId"
            :label="plan.planName"
            :value="plan.planId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保养设备编码" prop="equCode">
        <el-input v-model="queryParams.equCode" placeholder="请输入保养设备编码" clearable size="small" />
      </el-form-item>
      <el-form-item label="保养设备名称" prop="equName">
        <el-input v-model="queryParams.equName" placeholder="请输入保养设备名称" clearable size="small" />
      </el-form-item> -->
      <el-form-item label="保养时间">
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

    <el-table v-loading="loading" :data="taskList" style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="保养任务编号" align="left" prop="taskCode" width="330" />
      <el-table-column label="保养计划编号" align="left" prop="planCode" width="230" />
      <el-table-column label="保养计划名称" align="left" prop="planName" width="230" />
      <el-table-column label="保养设备编码" align="left" prop="equCode" width="230" />
      <el-table-column label="保养设备名称" align="left" prop="equName" width="230" />
      <el-table-column label="保养时间" align="center" prop="maintainTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.maintainTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="保养任务类型"
        align="center"
        prop="type"
        :formatter="typeFormat"
        width="150"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="150"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="100"
      >
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

    <!-- 添加或修改保养任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-divider content-position="left">设备信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编码">
              <span>{{form.equCard.equCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称">
              <span>{{form.equCard.equName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备分类">
              <span>{{form.equCard.className}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备所在区域">
              <span>{{form.equCard.areaName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备所属部门">
              <span>{{form.equCard.deptName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备管理员">
              <span>{{form.equCard.adminName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">保养任务</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保养任务编号" prop="taskCode">
              <span>{{form.taskCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保养计划编码" prop="planCode">
              <span>{{form.planCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养计划名称" prop="planName">
              <span>{{form.planName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保养时间" prop="maintainTime">
              <span>{{ parseTime(form.maintainTime, '{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养完成时间" prop="finishTime">
              <el-date-picker
                clearable
                size="small"
                style="width: 300px"
                v-model="form.finishTime"
                type="datetime"
                placeholder="选择保养完成时间"
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
} from "@/api/maintain/task";
import { listPlan } from "@/api/maintain/plan";

export default {
  name: "Task",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 保养任务表格数据
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
        planId: undefined,
        equCode: undefined,
        equName: undefined,
        status: undefined,
      },
      //计划
      planOptions: [],
      //类型
      typeOptions: [],
      //状态
      statusOptions: [],
      // 日期范围
      dateRangeTime: [],
      // 表单参数
      form: {
        equCard: {},
      },
      // 表单校验
      rules: {
        finishTime: [
          { required: true, message: "选择保养完成时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getPlanList();
    this.getDicts("task_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("task_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询保养任务列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRanges(this.queryParams, this.dateRangeTime);
      listTask(param).then((response) => {
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
    getPlanList() {
      listPlan().then((response) => {
        this.planOptions = response.rows;
      });
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
        equId: undefined,
        maintainTime: undefined,
        finishTime: undefined,
        maintainResults: undefined,
        type: undefined,
        notes: undefined,
        status: "0",
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        equCard: {
          equCode: undefined,
          equName: undefined,
          className: undefined,
          areaName: undefined,
          deptName: undefined,
          adminName: undefined,
        },
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
        this.title = "编辑保养任务";
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
                this.msgSuccess("编辑成功");
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