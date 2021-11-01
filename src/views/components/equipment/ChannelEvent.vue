<template>
  <el-dialog
    width="80%"
    :title="title"
    :visible.sync="isVisiable"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-row :gutter="20">
      <el-col :span="15">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="事件名称" prop="eventName">
            <el-input v-model="queryParams.eventName" placeholder="请输入事件名称" clearable size="small" />
          </el-form-item>
          <el-form-item label="事件编码" prop="eventCode">
            <el-input v-model="queryParams.eventCode" placeholder="请输入事件编码" clearable size="small" />
          </el-form-item>
          <el-form-item label="事件类型" prop="eventType">
            <el-select v-model="queryParams.eventType" placeholder="请选择事件类型" clearable size="small">
              <el-option
                v-for="option in eventTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="eventList" height="560px">
          <el-table-column label="序号" type="index" />
          <el-table-column label="事件名称" align="left" prop="eventName" />
          <el-table-column label="事件编码" align="left" prop="eventCode" />
          <el-table-column label="事件类型" align="center" :formatter="eventTypeFormat" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="9">
        <div style="margin: 10px">{{formTitle}}</div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          v-show="open"
          v-loading="loadingForm"
        >
          <el-form-item label="事件名称" prop="eventName">
            <el-input v-model="form.eventName" placeholder="请输入事件名称" />
          </el-form-item>
          <el-form-item label="事件编码" prop="eventCode">
            <el-input v-model="form.eventCode" placeholder="请输入事件编码" />
          </el-form-item>
          <el-form-item label="事件类型" prop="eventType">
            <el-select v-model="form.eventType" placeholder="请选择事件类型">
              <el-option
                v-for="option in eventTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小值" prop="minValue" v-if="channelType != '0'">
            <el-input v-model="form.minValue" placeholder="请输入最小值" />
          </el-form-item>
          <el-form-item label="最大值" prop="maxValue" v-if="channelType != '0'">
            <el-input v-model="form.maxValue" placeholder="请输入最大值" />
          </el-form-item>
          <el-form-item label="事件" prop="eventBool" v-if="channelType === '0'">
            <el-select v-model="form.eventBool" placeholder="请选择事件" @change="selectChange">
              <el-option
                v-for="option in eventOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <div style="text-align:center">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getChannel } from "@/api/equipment/channel";
import {
  listEvent,
  getEvent,
  delEvent,
  addEvent,
  updateEvent,
} from "@/api/equipment/event";

const eventTypeList = [
  {
    label: "报警",
    value: 0,
  },
  {
    label: "故障",
    value: 1,
  },
];

const eventBoolList = [
  {
    label: "0",
    value: 0,
  },
  {
    label: "1",
    value: 1,
  },
];

export default {
  props: {
    title: {
      type: String,
      default: "位号事件",
      require: true,
    },
    isVisiable: {
      type: Boolean,
      default: false,
      require: true,
    },
    channelId: {
      type: String,
      require: true,
    },
    channelType: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      // 事件类型
      eventTypeOptions: eventTypeList,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eventName: undefined,
        eventCode: undefined,
        eventType: undefined,
        channelId: undefined,
      },
      // 遮罩
      loading: false,
      // 列表
      eventList: [],
      //
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        eventName: [
          { required: true, message: "请输入事件名称", trigger: "blur" },
        ],
        eventCode: [
          { required: true, message: "请输入事件编码", trigger: "blur" },
        ],
        eventType: [
          { required: true, message: "请选择事件类型", trigger: "blur" },
        ],
        minValue: [
          { required: true, message: "请输入最小值", trigger: "blur" },
        ],
        maxValue: [
          { required: true, message: "请输入最大值", trigger: "blur" },
        ],
        eventBool: [{ required: true, message: "请选择事件", trigger: "blur" }],
      },
      // bool 事件
      eventOptions: eventBoolList,
      // form加载
      loadingForm: false,
      // form标题
      formTitle: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 位号类型字典翻译
    eventTypeFormat(value) {
      return this.eventTypeOptions.find((t) => t.value === value.eventType)
        .label;
    },
    selectChange(val) {
      this.$forceUpdate();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.open = false;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.open = false;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //查询事件
    getList() {
      this.loading = true;
      this.queryParams.channelId = this.channelId;
      listEvent(this.queryParams).then((response) => {
        this.eventList = response.data;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        channelEventId: undefined,
        eventName: undefined,
        eventCode: undefined,
        eventType: undefined,
        channelId: undefined,
        minValue: undefined,
        maxValue: undefined,
        eventBool: undefined,
        equParameterId: undefined,
      };
      this.resetForm("form");
    },
    handleAdd() {
      this.loadingForm = true;
      this.reset();
      this.formTitle = "新增事件";
      this.open = true;
      this.loadingForm = false;
    },
    handleUpdate(row) {
      this.loadingForm = true;
      this.reset();
      const channelEventId = row.channelEventId;
      getEvent(channelEventId).then((response) => {
        this.form = response.data;
        if (this.channelType === "0") {
          this.form.eventBool =
            response.data.minValue && response.data.maxValue;
        }
        this.formTitle = "编辑事件";
        this.open = true;
        this.loadingForm = false;
      });
    },
    handleDelete(row) {
      const channelEventId = row.channelEventId;
      this.$confirm('是否确认删除事件："' + row.eventName + '"?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading("正在删除,请稍后......");
        delEvent(channelEventId)
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
      });
    },
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const loading = this.openLoading("正在提交,请稍后......");
          this.form.channelId = this.channelId;
          if (this.channelType === "0") {
            this.form.minValue = this.form.eventBool;
            this.form.maxValue = this.form.eventBool;
          }

          if (this.form.channelEventId) {
            updateEvent(this.form.channelEventId, this.form)
              .then((response) => {
                loading.close();
                if (response.code === 200) {
                  this.msgSuccess("提交成功");
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
            addEvent(this.getFormArray(this.form))
              .then((response) => {
                loading.close();
                if (response.code === 200) {
                  this.msgSuccess("提交成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              })
              .catch(() => {
                loading.close();
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
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isVisiable", false); // 直接修改父组件的属性
    },
  },
};
</script>
