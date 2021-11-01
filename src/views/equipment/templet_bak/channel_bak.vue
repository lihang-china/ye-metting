<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="模板名称">
        <el-input v-model="templet.templetName" :disabled="true" size="small" />
      </el-form-item>
      <el-form-item label="模板编码">
        <el-input v-model="templet.templetCode" :disabled="true" size="small" />
      </el-form-item>
      <el-form-item label="位号编码" prop="channelCode">
        <el-input v-model="queryParams.channelCode" placeholder="请输入位号编码" clearable size="small" />
      </el-form-item>
      <el-form-item label="位号名称" prop="channelName">
        <el-input v-model="queryParams.channelName" placeholder="请输入位号名称" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" v-if="canEdit">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="channelList">
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column label="位号编号" align="left" prop="channelCode" />
      <el-table-column label="位号名称" align="left" prop="channelName" />
      <el-table-column label="位号描述" align="left" prop="channelDecs" />
      <el-table-column
        label="位号类型"
        align="center"
        prop="channelType"
        :formatter="channelTypeFormat"
      />
      <el-table-column
        label="位号性质"
        align="center"
        prop="channelClass"
        :formatter="channelClassFormat"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="canEdit"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="canEdit"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-if="!canEdit"
          >查看</el-button>
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
          <el-col :span="12">
            <el-form-item label="位号编号" prop="channelCode">
              <el-input
                v-model="form.channelCode"
                placeholder="请输入位号编号"
                :style="{ width: width }"
                :disabled="!canEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位号名称" prop="channelName">
              <el-input
                v-model="form.channelName"
                placeholder="请输入位号名称"
                :style="{ width: width }"
                :disabled="!canEdit"
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
                :disabled="!canEdit"
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
                :disabled="!canEdit"
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
                :disabled="!canEdit"
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
                :disabled="!canEdit"
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
                :disabled="!canEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="1 -" prop="equBoolType.oneFlagDesc">
              <el-input
                v-model="form.equBoolType.oneFlagDesc"
                placeholder="请输入1含义"
                :style="{ width: width }"
                :disabled="!canEdit"
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
                :disabled="!canEdit"
              >
                <el-option
                  v-for="parameter in parameterOptions"
                  :key="parameter.parameterId"
                  :label="parameter.parameterName"
                  :value="parameter.parameterId"
                >
                  <span style="float: left">{{ parameter.parameterName }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px"
                  >{{ parameter.parameterUnit }}</span>
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
                :disabled="!canEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="equSimulationType.minValue">
              <el-input
                v-model="form.equSimulationType.minValue"
                placeholder="请输入最小值"
                :style="{ width: width }"
                :disabled="!canEdit"
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
                :disabled="!canEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扩大倍数" prop="equSimulationType.ratio">
              <el-input-number
                v-model="form.equSimulationType.ratio"
                placeholder="请输入扩大倍数"
                :style="{ width: width }"
                :disabled="!canEdit"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="canEdit">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" @click="cancel">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTempletChannel,
  getChannel,
  delTempletChannel,
  addTempletChannel,
  updateTempletChannel,
  exportTempletChannel,
} from "@/api/equipment/channel";
import { getTemplet } from "@/api/equipment/templet";
import { listParameter } from "@/api/equipment/parameter";

export default {
  name: "TempletChannel",
  data() {
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
      width: "290px",
      //
      loading: false,
      //
      total: 0,
      //
      channelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //
      loadingChannel: false,
      // 位号类型字典
      channelTypeOptions: [],
      // 位号性质字典
      channelClassOptions: [],
      // 位号读写状态
      channelRwOptions: [],
      // 单位
      parameterOptions: [],
      //
      templet: {
        templetId: undefined,
        templetName: undefined,
        templetCode: undefined,
        equCount: undefined,
      },
      // 模板是否可以修改
      canEdit: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templetId: undefined,
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
    };
  },
  created() {
    const { templetId } = this.$route.params;
    getTemplet(templetId).then((response) => {
      this.templet = response.data;
      this.queryParams.templetId = response.data.templetId;
      console.log(response.data.equCount);
      this.canEdit = response.data.equCount === 0;
      this.getList();
    });
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
    /** 查询设备位号列表 */
    getList() {
      this.loading = true;
      listTempletChannel(this.queryParams).then((response) => {
        this.channelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getParameters() {
      listParameter().then((response) => {
        this.parameterOptions = response.rows;
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
    // 表单重置
    reset() {
      this.form = {
        equId: 0,
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
          maxValue: undefined,
          minValue: undefined,
          scaleNum: 0,
          ratio: undefined,
        },
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加位号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const channelId = row.channelId;
      getChannel(channelId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改位号";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有位号数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportTempletChannel(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const channelIds = row.channelId;
      const templetId = this.templet.templetId;
      this.$confirm(
        '是否确认删除设备位号编号为"' + channelIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTempletChannel(channelIds, templetId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    handleView(row) {
      this.reset();
      const channelId = row.channelId;
      getChannel(channelId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "查看位号";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.templetId = this.templet.templetId;
          this.loadingChannel = true;
          if (this.form.channelId != undefined) {
            updateTempletChannel(this.form).then((response) => {
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
            addTempletChannel(this.form).then((response) => {
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
  },
};
</script>