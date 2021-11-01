<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="模式名:">
        <el-input
          v-model="calendars.equJobCalendarName"
          size="small"
          disabled
        />
      </el-form-item>
      <!-- <el-form-item label="位号类别">
        <el-input v-model="calendars.channelTypeL" size="small" disabled />
      </el-form-item> -->
      <el-form-item label="重复类型:">
        <el-input v-model="calendars.repeatTimeTypeL" size="small" disabled />
      </el-form-item>
      <el-form-item label="时间计划名称" prop="equJobCalendarName">
        <el-input
          v-model="queryParams.equJobCalendarName"
          placeholder="请输入时间计划名称"
          clearable
          size="small"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:timeJob:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipment:timeJob:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:timeJob:remove']"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="timeJobList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="时间计划名称"
        align="left"
        prop="equTimeJobName"
      />
      <el-table-column label="时间点" align="left" prop="equTimeJobTime" />
      <!-- <el-table-column label="设定值" align="left" prop="equChannelValue" /> -->
      <el-table-column
        label="绑定位号数量"
        align="center"
        prop="channelCount"
      />
      <el-table-column label="类别" align="left" prop="equScenesCategoryName" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
            v-if="scope.row.channelCount"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:timeJob:edit']"
            v-show="scope.row.status === '1'"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:timeJob:remove']"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click="handleChannels(scope.row, false)"
            v-if="
              scope.row.status === '1' && scope.row.equScenesCategoryId === 1
            "
            >设置位号</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleChannels(scope.row, true)"
            v-if="scope.row.equScenesCategoryId != 1"
            >查看</el-button
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

    <!-- 添加或修改模式管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="128px">
        <el-form-item label="时间计划名称" prop="equTimeJobName">
          <el-input
            v-model="form.equTimeJobName"
            placeholder="请输入时间计划名称"
          />
        </el-form-item>
        <el-form-item label="时间点" prop="equTimeJobTime">
          <el-time-picker
            v-model="form.equTimeJobTime"
            placeholder="请选择时间点"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="场景类别" prop="equScenesCategoryId">
          <el-cascader
            v-model="form.equScenesCategoryId"
            :options="categoryOptions"
            :props="cascaderProps"
            placeholder="请选择场景类别"
            clearable
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="设定值" prop="equChannelValue">
          <el-input v-model="form.equChannelValue" placeholder="请输入设定值" />
        </el-form-item> -->
        <!-- <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="0">启用</el-radio>
          <el-radio v-model="form.status" label="1">停用</el-radio>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <ChannelsCal
      v-if="channelsCalVisiable"
      :channelsCalVisiable.sync="channelsCalVisiable"
      :equJobCalendarId="equJobCalendarId"
      :equTimeJobId="equTimeJobId"
      :equScenesCategoryId="equScenesCategoryId"
      :refreshList="getList"
      :isView="isView"
    />
  </div>
</template>

<script>
import {
  listTimeJobs,
  getTimeJobs,
  addTimeJobs,
  updateTimeJobs,
  delTimeJobs,
} from "@/api/calendar/timejobs";
import { getCalendars } from "@/api/calendar/calendars";
import { treeListCategory } from "@/api/calendar/category";
import ChannelsCal from "@/views/components/scene/ChannelsCal";

export default {
  name: "TimeJob",
  components: { ChannelsCal },
  data() {
    return {
      //
      cascaderProps: {
        emitPath: false,
        value: "id",
      },
      equJobCalendarId: undefined,
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
      //
      timeJobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 模式管理
      calendars: {
        equJobCalendarName: undefined,
        //channelType: undefined,
        //channelTypeL: undefined,
        repeatTimeType: undefined,
        repeatTimeTypeL: undefined,
      },
      // 位号类型字典
      // channelTypeOptions: [
      //   { label: "开关量", value: 0 },
      //   { label: "模拟量", value: 1 },
      //   { label: "字符串", value: 2 },
      // ],
      // 重复类型字典
      repeatTimeTypeOptions: [
        { label: "执行一次", value: 1 },
        { label: "每天", value: 2 },
        { label: "周一至周五", value: 3 },
        { label: "每周", value: 4 },
        { label: "每年", value: 5 },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equJobCalendarId: undefined,
        equTimeJobName: undefined,
      },
      //区域列表
      categoryOptions: [],
      //
      form: {},
      //
      rules: {
        equTimeJobName: [
          { required: true, message: "请输入时间计划名称", trigger: "blur" },
        ],
        equTimeJobTime: [
          { required: true, message: "请选择时间点", trigger: "blur" },
        ],
        equScenesCategoryId: [
          { required: true, message: "请选择场景类别", trigger: "blur" },
        ],
        // equChannelValue: [
        //   { required: true, message: "请输入设定值", trigger: "blur" },
        // ],
      },
      //位号选择弹出窗
      channelsCalVisiable: false,
      //时间计划Id
      equTimeJobId: undefined,
      //场景类别Id
      equScenesCategoryId: undefined,
      //
      isView: false,
    };
  },
  created() {
    this.equJobCalendarId = Number(this.$route.params.equJobCalendarId);
    this.getCalendar(this.equJobCalendarId);
    this.getList();
  },
  methods: {
    // 获取部门列表
    getCategoryList() {
      treeListCategory().then((response) => {
        this.categoryOptions = response.data;
      });
    },
    getCalendar(equJobCalendarId) {
      getCalendars(equJobCalendarId).then((response) => {
        this.calendars = {
          ...response.data,
          repeatTimeTypeL: this.optionFormat(
            response.data.repeatTimeType,
            this.repeatTimeTypeOptions
          ),
        };
      });
    },
    getList() {
      this.loading = true;
      this.queryParams.equJobCalendarId = this.equJobCalendarId;
      listTimeJobs(this.queryParams).then((response) => {
        this.timeJobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 翻译
    optionFormat(value, options) {
      return options.find((t) => t.value === value).label;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.equTimeJobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 表单重置
    reset() {
      this.form = {
        equTimeJobId: undefined,
        equTimeJobName: undefined,
        equTimeJobTime: undefined,
        isScenes: undefined,
        equScenesCategoryId: undefined,
        //equChannelValue: undefined,
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getCategoryList();
      this.open = true;
      this.title = "添加计划运行时间";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getCategoryList();
      const equTimeJobId = row.equTimeJobId || this.ids;
      getTimeJobs(equTimeJobId).then((response) => {
        this.form = response.data;
        this.form.equTimeJobTime = new Date(
          "2020-08-12 " + response.data.equTimeJobTime
        );
        this.open = true;
        this.title = "修改计划运行时间";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const equTimeJobIds = row.equTimeJobId || this.ids;
      this.$confirm(
        '是否确认删除编号为"' + equTimeJobIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTimeJobs(equTimeJobIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 启用/禁用按钮操作 */
    handleStatusChange(row) {
      let text = row.status === "1" ? "停用" : "启用";
      if (!row.channelCount) {
      }
      this.$confirm(
        "是否确认" + text + '名称为"' + row.equTimeJobName + '"的计划运行时间?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateTimeJobs(row.equTimeJobId, row);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const loading = this.openLoading("正在提交,请稍后......");
          this.form.isScenes = this.form.equScenesCategoryId === 1 ? 0 : 1;
          if (this.form.equTimeJobId != undefined) {
            updateTimeJobs(this.form.equTimeJobId, this.form).then(
              (response) => {
                loading.close();
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              }
            );
          } else {
            addTimeJobs(
              this.equJobCalendarId,
              this.getFormArray(this.form)
            ).then((response) => {
              loading.close();
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 位号设置/查看按钮
    handleChannels(row, isView) {
      this.equTimeJobId = isView ? undefined : row.equTimeJobId;
      this.equScenesCategoryId = isView ? row.equScenesCategoryId : undefined;
      this.channelsCalVisiable = true;
      this.isView = isView;
    },
  },
};
</script>