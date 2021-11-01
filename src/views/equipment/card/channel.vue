<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="设备编号">
        <el-input v-model="card.equCode" :disabled="true" size="small" />
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="card.equName" :disabled="true" size="small" />
      </el-form-item>
      <el-form-item label="位号编号" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入位号编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="位号名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入位号名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
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

    <el-row :gutter="10" class="mb8" v-if="!templet">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:channel:add']"
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
          v-hasPermi="['equipment:channel:edit']"
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
          v-hasPermi="['equipment:channel:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipment:channel:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-magic-stick" size="mini" @click="handleModel"
          >物模型</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb8" v-else>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipment:channel:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-magic-stick" size="mini" @click="handleModel"
          >物模型</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="channelList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="!templet"
      />
      <el-table-column label="位号编号" align="left" prop="channelCode" />
      <el-table-column label="位号名称" align="left" prop="channelName" />
      <!-- <el-table-column label="位号描述" align="left" prop="channelDecs" /> -->
      <el-table-column
        label="位号类型"
        align="center"
        prop="channelType"
        :formatter="channelTypeFormat"
        width="150"
      />
      <!-- <el-table-column
        label="位号性质"
        align="center"
        prop="channelClass"
        :formatter="channelClassFormat"
        width="150"
      /> -->
      <el-table-column label="是否开启报警" align="center" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isOpenEvent"
            :active-value="activeValue"
            :inactive-value="inactiveValue"
            @change="handleOpenEvent(scope.row)"
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
            v-hasPermi="['equipment:channel:edit']"
            v-if="!templet"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:channel:remove']"
            v-if="!templet"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-if="templet"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-menu"
            @click="handleAlarm(scope.row)"
            >位号事件</el-button
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

    <!-- 添加或修改设备位号对话框 -->
    <el-dialog
      v-loading="loadingChannel"
      element-loading-text="正在提交"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :title="title"
      :visible.sync="open"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="位号编号" prop="channelCode">
              <el-input
                v-model="form.channelCode"
                placeholder="请输入位号编号"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="位号名称" prop="channelName">
              <el-input
                v-model="form.channelName"
                placeholder="请输入位号名称"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="位号描述" prop="channelDecs">
              <el-input
                v-model="form.channelDecs"
                type="textarea"
                placeholder="请输入位号描述"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="位号性质" prop="channelClass">
              <el-select
                v-model="form.channelClass"
                placeholder="请选择位号性质"
                :style="{ width: width }"
                :disabled="templet"
              >
                <el-option
                  v-for="dict in channelClassOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="读写状态" prop="channelRw">
              <el-select
                v-model="form.channelRw"
                placeholder="请选择位号读写状态"
                :style="{ width: width }"
                :disabled="templet"
              >
                <el-option
                  v-for="dict in channelRwOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="位号类型" prop="channelType">
              <el-select
                v-model="form.channelType"
                placeholder="请选择位号类型"
                :style="{ width: width }"
                :disabled="templet"
              >
                <el-option
                  v-for="dict in channelTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider v-if="form.channelType === '0'">开关量</el-divider>
        <el-row v-if="form.channelType === '0'">
          <el-col :span="12">
            <el-form-item label="0 -" prop="equBoolType.zeroFlagDesc">
              <el-input
                v-model="form.equBoolType.zeroFlagDesc"
                placeholder="请输入0含义"
                :style="{ width: width }"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="1 -" prop="equBoolType.oneFlagDesc">
              <el-input
                v-model="form.equBoolType.oneFlagDesc"
                placeholder="请输入1含义"
                :style="{ width: width }"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider v-if="form.channelType === '1'">模拟量</el-divider>
        <el-row v-if="form.channelType === '1'">
          <el-col :span="12">
            <el-form-item label="单位" prop="equSimulationType.parameterId">
              <el-select
                v-model="form.equSimulationType.parameterId"
                filterable
                clearable
                placeholder="请选择单位"
                :style="{ width: width }"
                :disabled="templet"
              >
                <el-option
                  v-for="parameter in parameterOptions"
                  :key="parameter.parameterId"
                  :label="parameter.parameterName"
                  :value="parameter.parameterId"
                >
                  <span style="float: left">{{ parameter.parameterName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    parameter.parameterUnit
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.channelType === '1'">
          <el-col :span="12">
            <el-form-item label="最大值" prop="equSimulationType.maxValue">
              <el-input
                v-model="form.equSimulationType.maxValue"
                placeholder="请输入最大值"
                :style="{ width: width }"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="equSimulationType.minValue">
              <el-input
                v-model="form.equSimulationType.minValue"
                placeholder="请输入最小值"
                :style="{ width: width }"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.channelType === '1'">
          <el-col :span="12">
            <el-form-item label="小数点位数" prop="equSimulationType.scaleNum">
              <el-input-number
                v-model="form.equSimulationType.scaleNum"
                placeholder="请输入小数点位数"
                :style="{ width: width }"
                :min="0"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扩大倍数" prop="equSimulationType.ratio">
              <el-input-number
                v-model="form.equSimulationType.ratio"
                placeholder="请输入扩大倍数"
                :style="{ width: width }"
                :disabled="templet"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="位号数值">
          <el-input v-model="deviceItemValue" placeholder="请输入位号数值" style="width: 300px" />
          <el-button type="primary" size="small" @click="sendvalue">发 送</el-button>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!templet">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" @click="cancel">确 认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="物模型"
      :visible.sync="modelOpen"
      width="600px"
      :close-on-click-modal="false"
    >
      <div style="height: 560px; overflow: auto">
        <editor
          width="500px"
          v-model="modelContent"
          @init="editorInit"
          lang="json"
          theme="chrome"
          v-if="!templet"
        ></editor>
        <pre v-else>{{ modelContent }}</pre>
      </div>
      <div slot="footer" class="dialog-footer" v-if="!templet">
        <el-button type="primary" @click="modelSubmit">确 定</el-button>
        <el-button @click="modelCancel">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" @click="modelCancel">确 认</el-button>
      </div>
    </el-dialog>

    <!-- <ChannelEvent
      v-if="isVisiable"
      :title="title"
      :isVisiable.sync="isVisiable"
      :channelId="channelId"
      :channelType="channelType"
    /> -->
  </div>
</template>

<script>
import {
  listChannel,
  getChannel,
  delChannel,
  addChannel,
  updateChannel,
  openEvent,
  exportCsv,
} from "@/api/equipment/channel";
import { getCardByGuid } from "@/api/equipment/card";
import { listParameter } from "@/api/equipment/parameter";
import { getModel, saveModel } from "@/api/equipment/model";
import ChannelEvent from "@/views/components/equipment/ChannelEvent";

export default {
  name: "Channel",
  components: {
    editor: require("vue2-ace-editor"),
    ChannelEvent,
  },
  data() {
    /** 校验最大值、最小值 */
    let checkNumber = (rule, value, callback) => {
      if (!value || value === "") {
        callback();
      } else {
        let reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
        let pattern = new RegExp(reg);
        if (pattern.test(value)) {
          let { maxValue, minValue } = this.form.equSimulationType;
          if (maxValue && minValue) {
            if (maxValue < minValue) {
              callback(new Error("最大值不能小于最小值"));
            } else if (maxValue == minValue) {
              callback(new Error("最大值、最小值不能相等"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入数字"));
        }
      }
    };
    return {
      //
      widthl: "700px",
      // 统一宽度
      width: "290px",
      // 设备信息
      card: {
        //设备Id
        equId: undefined,
        //设备编号
        equCode: undefined,
        //设备名称
        equName: undefined,
      },
      //设备的模板Id （1-使用自定义）
      templet: undefined,
      // 遮罩层
      loading: true,
      // 位号数据遮罩层
      loadingChannel: false,
      // 物模型遮罩层
      loadingModel: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 设备位号表格数据
      channelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示物模型
      modelOpen: false,
      // json字符串
      modelContent: "",
      // 位号类型字典
      channelTypeOptions: [],
      // 位号性质字典
      channelClassOptions: [],
      // 位号读写状态
      channelRwOptions: [],
      // 单位
      parameterOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equId: undefined,
        channelName: undefined,
        channelCode: undefined,
      },
      // 表单参数
      form: {
        equBoolType: {},
        equSimulationType: {},
      },
      // 表单校验
      rules: {
        channelCode: [
          { required: true, message: "位号编码不能为空", trigger: "blur" },
        ],
        channelName: [
          { required: true, message: "位号名称不能为空", trigger: "blur" },
        ],
        channelType: [
          { required: true, message: "请选择位号类型", trigger: "blur" },
        ],
        channelRw: [
          { required: true, message: "请选择读写状态", trigger: "blur" },
        ],
        "equBoolType.zeroFlagDesc": [
          { required: true, message: "请输入0含义", trigger: "blur" },
        ],
        "equBoolType.oneFlagDesc": [
          { required: true, message: "请输入1含义", trigger: "blur" },
        ],
        "equSimulationType.parameterId": [
          { required: true, message: "请选择单位", trigger: "blur" },
        ],
        "equSimulationType.maxValue": [
          { validator: checkNumber, trigger: "blur" },
        ],
        "equSimulationType.minValue": [
          { validator: checkNumber, trigger: "blur" },
        ],
      },
      activeValue: 1,
      inactiveValue: 0,
      // ECWebSocket
      // ECWebSocketModel: undefined,
      // isReg: false,
      // devices: [
      //   {
      //     Name: undefined,
      //     DeviceItems: [],
      //   },
      // ],
      // deviceItemValue: undefined,
      // 位号事件
      // isVisiable: false,
      // 位号ID
      // channelId: "",
      // 位号类型
      // channelType: "",
    };
  },
  created() {
    const { equGuid } = this.$route.params;
    this.getEquCard(equGuid);
    this.getDicts("equ_channel_type").then((response) => {
      this.channelTypeOptions = response.data;
    });
    this.getDicts("equ_channel_class").then((response) => {
      this.channelClassOptions = response.data;
    });
    this.getDicts("equ_channel_rw").then((response) => {
      this.channelRwOptions = response.data;
    });
    this.getParameters();
  },
  watch: {
    "form.equSimulationType.maxValue": "setScaleNum",
    "form.equSimulationType.minValue": "setScaleNum",
  },
  methods: {
    //获取对应的设备
    getEquCard(equGuid) {
      getCardByGuid(equGuid).then((response) => {
        this.card = response.data;
        //判断设备是否采用了设备模板
        this.templet = response.data.templetId != 1;
        this.queryParams.equId = response.data.equId;
        //this.devices[0].Name = response.data.equName;
        this.getList();
      });
    },
    /** 查询设备位号列表 */
    getList() {
      this.loading = true;
      listChannel(this.queryParams).then((response) => {
        this.channelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 位号类型字典翻译
    channelTypeFormat(row, column) {
      return this.selectDictLabel(this.channelTypeOptions, row.channelType);
    },
    // 位号性质字典翻译
    channelClassFormat(row, column) {
      return this.selectDictLabel(this.channelClassOptions, row.channelClass);
    },
    /** 获取单位(模拟量) */
    getParameters() {
      listParameter().then((response) => {
        this.parameterOptions = response.rows;
      });
    },
    /** 获取小数点位数(模拟量) */
    setScaleNum() {
      let { maxValue, minValue } = this.form.equSimulationType;
      let maxScaleNum = 0,
        minScaleNum = 0;
      if (maxValue && maxValue.indexOf(".") > -1) {
        let temp = maxValue.split(".")[1];
        if (temp) {
          maxScaleNum = temp.length;
        }
      }
      if (minValue && minValue.indexOf(".") > -1) {
        let temp = minValue.split(".")[1];
        if (temp) {
          minScaleNum = temp.length;
        }
      }
      this.form.equSimulationType.scaleNum =
        maxScaleNum > minScaleNum ? maxScaleNum : minScaleNum;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        equId: undefined,
        channelId: undefined,
        channelName: undefined,
        channelCode: undefined,
        channelDecs: undefined,
        channelType: undefined,
        channelClass: undefined,
        channelRw: "0",
        equBoolType: {
          zeroFlagDesc: undefined,
          oneFlagDesc: undefined,
        },
        equSimulationType: {
          parameterId: 1,
          parameterName: undefined,
          maxValue: undefined,
          minValue: undefined,
          scaleNum: 0,
          ratio: undefined,
        },
      };
      this.resetForm("form");

      //this.deviceItemValue = undefined;
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
      this.ids = selection.map((item) => item.channelId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备位号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const channelId = row.channelId || this.ids;
      getChannel(channelId).then((response) => {
        this.form = response.data;
        this.title = "修改设备位号";
        this.open = true;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.equId = this.card.equId;
          this.loadingChannel = true;
          if (this.form.channelId != undefined) {
            updateChannel(this.form).then((response) => {
              this.loadingChannel = false;
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addChannel(this.form).then((response) => {
              this.loadingChannel = false;
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
      const channelIds = row.channelId || this.ids;
      const equId = row.channelId ? 1 : channelIds.length;
      this.$confirm(
        '是否确认删除所选择的"' + equId + '"条设备位号数据?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const loading = this.openLoading();
        delChannel(channelIds, equId)
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
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const channelId = row.channelId || this.ids;
      getChannel(channelId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "查看设备位号";
      });
    },
    /** 开启/关闭警报事件 */
    handleOpenEvent(row) {
      let text = row.isOpenEvent === 1 ? "启用" : "停用";
      this.$confirm("是否确认" + text + "该位号的报警", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.openLoading(
            "正在" + text + "该位号的报警,请稍后......"
          );
          openEvent({
            channelId: row.channelId,
            isOpenEvent: row.isOpenEvent,
          }).then((res) => {
            loading.close();
            if (res.code === 200) {
              this.getList();
              this.msgSuccess(text + "成功");
            } else {
              //row.isOpenEvent = row.isOpenEvent === 0 ? 1 : 0;
              this.msgError(res.msg);
            }
          });
          // .cath(() => {
          //   loading.close();
          //   row.isOpenEvent = row.isOpenEvent === 0 ? 1 : 0;
          // });
        })
        .catch(() => {
          row.isOpenEvent = row.isOpenEvent === 0 ? 1 : 0;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有设备位号数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCsv({queryParams});
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 物模型按钮 */
    handleModel() {
      this.modelContent = "";
      getModel(this.card.equId).then((response) => {
        //console.log(response);
        if (response.msg) {
          this.modelContent = JSON.stringify(JSON.parse(response.msg), null, 4); //将字符串转换成json对象
        }
        //this.modelContent = response.data;
        this.modelOpen = true;
      });
    },
    /** 初始化编辑器 */
    editorInit: function () {
      require("brace/ext/language_tools"); // language extension prerequsite...
      require("brace/mode/json"); // 改成json模式或者html
      require("brace/theme/chrome");
      require("brace/snippets/json"); // snippet
    },
    // 物模型提交
    modelSubmit() {
      const loading = this.openLoading("正在提交,请稍后......");
      let data = {
        equId: this.card.equId,
        modelContentText: JSON.stringify(this.modelContent),
      };
      this.loadingModel = true;
      saveModel(data)
        .then((response) => {
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("保存成功");
            this.modelOpen = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        })
        .catch(() => {
          loading.close();
        });
    },
    // 物模型取消
    modelCancel() {
      this.modelOpen = false;
      this.modelContent = "";
    },
    // 位号事件
    // handleEvent(row) {
    //   this.channelId = row.channelId.toString();
    //   this.channelType = row.channelType.toString();
    //   this.title =
    //     row.channelName + "(" + row.channelCode + ")" + " - 位号事件";
    //   this.isVisiable = true;
    // },
    // 位号报警
    handleAlarm(row) {
      this.$router.push({ name: "ChannelAlarmconfig", params: { equChannelId: row.channelId } });
    },
  },
};
</script>