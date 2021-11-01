<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="关联位号名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入关联位号名称"
          clearable
          size="small"
          style="width: 300px"
          :disabled="channel"
        />
      </el-form-item>
      <el-form-item label="关联位号编码" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入关联位号编码"
          clearable
          size="small"
          style="width: 300px"
          :disabled="channel"
        />
      </el-form-item>
      <el-form-item label="报警规则名称" prop="alarmRuleName">
        <el-input
          v-model="queryParams.alarmRuleName"
          placeholder="请输入报警规则名称"
          clearable
          size="small"
          style="width: 300px"
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
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="关联位号" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.channelName + "(" + scope.row.channelCode + ")" }}
        </template>
      </el-table-column>
      <el-table-column
        label="报警规则名称"
        align="left"
        prop="alarmRuleName"
        show-overflow-tooltip
      />
      <el-table-column
        label="报警等级"
        align="left"
        prop="alarmLevel"
        :formatter="alarmLevelFormat"
        width="200"
      />
      <el-table-column
        label="规则状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="200"
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:config:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
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

    <!-- 添加或修改报警配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label="关联位号" prop="equChannelId">
              <el-select
                v-model="form.equChannelId"
                filterable
                remote
                reserve-keyword
                :placeholder="'请输入关联位号编码或名称以查询选择'"
                :remote-method="remoteMethod"
                :loading="selectLoading"
                style="width: 500px"
                :disabled="channel"
              >
                <el-option
                  v-for="channel in channelOptions"
                  :key="channel.channelId"
                  :label="channel.channelName"
                  :value="channel.channelId"
                >
                  <span style="float: left">{{ channel.channelName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{
                      channel.channelCode +
                      "(" +
                      (channel.status === 2 ? "在线" : "离线") +
                      ")" +
                      (channel.isOpenEvent === 1 ? "报警已开启" : "报警未开启")
                    }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label="报警规则" prop="alarmRuleName">
              <el-input
                v-model="form.alarmRuleName"
                placeholder="请输入报警规则"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="规则描述" prop="indicatorName">
              <el-input
                v-model="form.indicatorName"
                placeholder="指标名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-select v-model="form.periodSize" placeholder="周期" clearable>
              <el-option
                v-for="periodSize in periodSizeOptions"
                :key="periodSize.value"
                :label="periodSize.label"
                :value="periodSize.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="form.periodContinueCount"
              placeholder="持续周期"
              clearable
            >
              <el-option
                v-for="periodContinueCount in periodContinueCountOptions"
                :key="periodContinueCount.value"
                :label="periodContinueCount.label"
                :value="periodContinueCount.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="form.statisticsType"
              placeholder="统计类型"
              clearable
            >
              <el-option
                v-for="statisticsType in statisticsTypeOptions"
                :key="statisticsType.value"
                :label="statisticsType.label"
                :value="statisticsType.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="form.thresholdType"
              placeholder="类型"
              clearable
            >
              <el-option
                v-for="thresholdType in thresholdTypeOptions"
                :key="thresholdType"
                :label="thresholdType"
                :value="thresholdType"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-if="form.thresholdType === 'between'">
            <el-input v-model="form.minValue" placeholder="最小值" clearable />
          </el-col>
          <el-col :span="3" v-if="form.thresholdType === 'between'">
            <el-input v-model="form.maxValue" placeholder="最大值" clearable />
          </el-col>
          <el-col :span="3" v-if="form.thresholdType != 'between'">
            <el-input v-model="form.singleValue" placeholder="阈值" clearable />
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="报警等级" prop="alarmLevel">
              <el-radio-group v-model="form.alarmLevel">
                <el-radio
                  v-for="alarmLevel in alarmLevelOptions"
                  :label="alarmLevel.value"
                  :key="alarmLevel.value"
                  >{{ alarmLevel.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知对象" prop="notifyUserIds">
              <el-select
                v-model="form.notifyUserIds"
                placeholder="请选择通知对象"
                clearable
                multiple
                collapse-tags
                style="width: 300px"
              >
                <el-option
                  v-for="user in userOptions"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label="报警回调地址" prop="alarmCallback">
              <el-input
                v-model="form.alarmCallback"
                placeholder="请输入报警回调地址"
                clearable
              />
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
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
  exportConfig,
} from "@/api/alarm/config";
import { getChannel, listSelectChannel } from "@/api/equipment/channel";
import { listUserAll as listUser } from "@/api/system/user";

export default {
  name: "Config",
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
      // 报警配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equChannelId: undefined,
        channelName: undefined,
        channelCode: undefined,
        alarmRuleName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equChannelId: [
          { required: true, message: "请选择关联位号", trigger: "blur" },
        ],
        alarmRuleName: [
          { required: true, message: "请输入报警规则", trigger: "blur" },
        ],
        indicatorName: [
          { required: true, message: "请输入指标名称", trigger: "blur" },
        ],
      },
      //
      periodSizeOptions: [{ value: 1, label: "1分钟周期" }],
      //
      periodContinueCountOptions: [
        { value: 1, label: "持续1个周期" },
        { value: 3, label: "持续3个周期" },
        { value: 5, label: "持续5个周期" },
      ],
      //
      statisticsTypeOptions: [
        { value: 0, label: "最大值" },
        { value: 1, label: "最小值" },
        { value: 2, label: "平均值" },
      ],
      //
      thresholdTypeOptions: [">=", ">", "<", "<=", "!=", "between"],
      //
      alarmLevelOptions: [
        { value: 0, label: "info" },
        { value: 1, label: "Warning" },
        { value: 2, label: "Critical" },
      ],
      //
      statusOptions: [
        { value: "0", label: "正常" },
        { value: "1", label: "停用" },
      ],
      // 位号合集
      channelOptions: [],
      // 下拉选择加载层
      selectLoading: true,
      // 人员集合
      userOptions: [],
      //
      equChannelId: undefined,
      //
      channel: false,
    };
  },
  created() {
    const { equChannelId } = this.$route.params;
    if (equChannelId) {
      this.equChannelId = equChannelId;
      this.channel = true;
      getChannel(equChannelId).then((res) => {
        this.queryParams.equChannelId = equChannelId;
        this.queryParams.channelName = res.data.channelName;
        this.queryParams.channelCode = res.data.channelCode;
        this.init();
      });
    } else {
      this.channel = false;
      this.init();
    }
  },
  methods: {
    init() {
      this.getUserList();
      this.getList();
    },
    /** 报警等级格式化 */
    alarmLevelFormat(row) {
      return this.alarmLevelOptions.find((t) => t.value === row.alarmLevel)
        .label;
    },
    /** 状态格式化 */
    statusFormat(row) {
      return this.statusOptions.find((t) => t.value === row.status).label;
    },
    /** 位号下拉筛选 */
    remoteMethod(query, equChannelId, resolve) {
      if (query || equChannelId) {
        this.selectLoading = true;
        listSelectChannel({
          channelName: query,
          channelId: equChannelId,
        }).then((response) => {
          this.channelOptions = response.data;
          this.selectLoading = false;
          if (resolve) {
            resolve("success");
          }
        });
      } else {
        this.channelOptions = [];
      }
    },
    /** 用户列表*/
    getUserList() {
      listUser().then((response) => {
        this.userOptions = response.rows;
      });
    },
    /** 查询报警配置列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then((response) => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        alarmRuleName: undefined,
        indicatorName: undefined,
        periodSize: 1,
        periodContinueCount: undefined,
        statisticsType: undefined,
        thresholdType: undefined,
        minValue: undefined,
        maxValue: undefined,
        singleValue: undefined,
        alarmLevel: undefined,
        notifyUserIds: undefined,
        alarmCallback: undefined,
        status: "0",
        equChannelId: undefined,
      };
      this.resetForm("form");
      this.channelOptions = [];
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      //this.resetForm("queryForm");
      if (!this.channel) {
        this.queryParams.channelName = undefined;
        this.queryParams.channelCode = undefined;
      }
      this.queryParams.alarmRuleName = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      if (this.channel) {
        new Promise((resolve) => {
          this.remoteMethod("", this.equChannelId, resolve);
        }).then(() => {
          this.form.equChannelId = Number(this.equChannelId);
          this.open = true;
          this.title = "添加报警配置";
        });
      } else {
        this.open = true;
        this.title = "添加报警配置";
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      new Promise((resolve) => {
        this.remoteMethod("", row.equChannelId, resolve);
      }).then(() => {
        //console.log("难呐!");
        const notifyUserIds = row.notifyUserIds;
        this.form = {
          ...row,
          notifyUserIds: notifyUserIds
            ? notifyUserIds.split(",").map(Number)
            : [],
        };
        this.open = true;
        this.title = "修改报警配置";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            notifyUserIds: this.form.notifyUserIds.join(","),
          };
          if (data.id != undefined) {
            updateConfig(data.id, data).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addConfig(this.getFormArray(data)).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除报警配置编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>