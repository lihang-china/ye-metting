<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="推送平台" prop="platForm">
        <el-select v-model="queryParams.platForm" placeholder="请选择推送平台" clearable size="small">
          <el-option
            v-for="option in platFormOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable size="small" />
      </el-form-item>
      <el-form-item label="推送状态" prop="pushStatus">
        <el-select v-model="queryParams.pushStatus" placeholder="请选择推送状态" clearable size="small">
          <el-option
            v-for="option in pushStatusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推送时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['monitor:pushlog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:pushlog:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:pushlog:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="推送平台" align="center" prop="platForm" width="100" />
      <el-table-column label="别名" align="left" prop="audience" width="300" show-overflow-tooltip />
      <el-table-column label="标题" align="left" prop="title" show-overflow-tooltip />
      <el-table-column
        label="推送状态"
        align="center"
        prop="pushStatus"
        width="180"
        :formatter="pushStatusFormat"
      />
      <el-table-column label="推送时间" align="center" prop="pushTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.pushTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['monitor:pushlog:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="handlePush(scope.row)"
            v-if="scope.row.pushStatus ==='1'"
          >推送</el-button>
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

    <!-- 添加或修改推送日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="推送平台" prop="platForm">
          <el-select v-model="form.platForm" placeholder="请选择推送平台" clearable>
            <el-option
              v-for="option in platFormOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="别名" prop="audience">
          <el-input v-model="form.audience" type="textarea" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="alert">
          <el-input v-model="form.alert" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="业务链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入业务链接" />
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
  listPushLog,
  delPushLog,
  addPushLog,
  exportPushLog,
  push,
} from "@/api/monitor/pushLog";

const platFormList = [
  {
    label: "Android",
    value: "Android",
  },
  {
    label: "IOS",
    value: "IOS",
  },
  {
    label: "All",
    value: "All",
  },
];

const pushStatusList = [
  {
    label: "已推送",
    value: "0",
  },
  {
    label: "未推送",
    value: "1",
  },
  {
    label: "推送失败",
    value: "2",
  },
];

export default {
  name: "Log",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 推送日志表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        platForm: undefined,
        title: undefined,
        pushStatus: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 推送平台
      platFormOptions: platFormList,
      // 推送状态
      pushStatusOptions: pushStatusList,
      // 日期范围
      dateRange: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 推送状态翻译
    pushStatusFormat(data) {
      return this.pushStatusOptions.find((t) => t.value === data.pushStatus)
        .label;
    },
    /** 查询推送日志列表 */
    getList() {
      this.loading = true;
      listPushLog(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.logList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        pushId: undefined,
        platForm: undefined,
        audience: undefined,
        title: undefined,
        alert: undefined,
        url: undefined,
        createBy: undefined,
        createTime: undefined,
        pushStatus: "1",
        pushTime: undefined,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.pushId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加推送日志";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pushId != undefined) {
          } else {
            addPushLog(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const pushIds = row.pushId || this.ids;
      this.$confirm(
        '是否确认删除推送日志编号为"' + pushIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const loading = this.openLoading();
        delPushLog(pushIds)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有推送日志数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPushLog(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    handlePush(row) {
      const pushIds = row.pushId || this.ids;
      this.$confirm(
        '是否确认推送日志编号为"' + pushIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const loading = this.openLoading("正在推送,请稍后.......");
        push(pushIds)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("推送成功");
              this.getList();
            } else {
              this.msgError(response.msg);
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