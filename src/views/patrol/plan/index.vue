<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="巡检计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入巡检计划编码"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="巡检计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入巡检计划名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="巡检计划状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择巡检计划状态"
          clearable
          size="small"
        >
          <el-option label="启用" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
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
          v-hasPermi="['patrol:plan:add']"
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
          v-hasPermi="['patrol:plan:edit']"
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
          v-hasPermi="['patrol:plan:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['patrol:plan:export']"
          >导出</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="handleStatus(undefined, '0')"
          >启用</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-close"
          size="mini"
          :disabled="multiple"
          @click="handleStatus(undefined, '1')"
          >停用</el-button
        >
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="planList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="巡检计划编码" align="center" prop="planCode" />
      <el-table-column label="巡检计划名称" align="center" prop="planName" />
      <el-table-column label="巡检路线" align="center" prop="lineName" />
      <el-table-column label="巡检开始日期" align="center" prop="beginDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检结束日期" align="center" prop="endDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.status === "1" ? "停用" : "启用"
        }}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status === '1'">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['patrol:plan:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['patrol:plan:remove']"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-check"
              @click="handleStatus(scope.row, '0')"
              >启用</el-button
            >
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-wallet"
              @click="handleTask(scope.row)"
              >生成保养任务</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="handleStatus(scope.row, '1')"
              >停用</el-button
            >
          </div>
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

    <!-- 添加或修改巡检计划 对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检计划编码" prop="planCode">
              <el-input
                v-model="form.planCode"
                placeholder="请输入巡检计划编码"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检计划名称" prop="planName">
              <el-input
                v-model="form.planName"
                placeholder="请输入巡检计划名称"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检线路" prop="lineId">
              <el-select
                v-model="form.lineId"
                filterable
                clearable
                placeholder="请选择巡检线路"
                :style="{ width: width }"
              >
                <el-option
                  v-for="line in lineOptions"
                  :key="line.plineId"
                  :label="line.plineName"
                  :value="line.plineId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检班组" prop="teamId">
              <el-cascader
                v-model="form.teamId"
                :options="teamOptions"
                :props="cascaderProps"
                placeholder="请选择巡检班组"
                clearable
                :style="{ width: width }"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检负责人" prop="staffId">
              <el-select
                v-model="form.staffId"
                filterable
                placeholder="请选择巡检负责人"
                clearable
                :style="{ width: width }"
              >
                <el-option
                  v-for="staff in staffOptions"
                  :key="staff.userId"
                  :label="staff.userName"
                  :value="staff.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检人员" prop="staffIds">
              <el-select
                v-model="form.staffIds"
                filterable
                placeholder="请选择巡检人员"
                clearable
                multiple
                :style="{ width: width }"
              >
                <el-option
                  v-for="staff in staffOptions"
                  :key="staff.staffId"
                  :label="staff.userName"
                  :value="staff.staffId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检开始日期" prop="beginDate">
              <el-date-picker
                clearable
                style="width: 200px"
                v-model="form.beginDate"
                type="date"
                placeholder="选择巡检开始日期"
                :style="{ width: width }"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检结束日期" prop="endDate">
              <el-date-picker
                clearable
                style="width: 200px"
                v-model="form.endDate"
                type="date"
                placeholder="选择巡检结束日期"
                :style="{ width: width }"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检开始时间" prop="patrolBegin">
              <el-time-picker
                clearable
                style="width: 200px"
                v-model="form.patrolBegin"
                placeholder="选择巡检开始时间"
                :style="{ width: width }"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检结束时间" prop="patrolEnd">
              <el-time-picker
                clearable
                style="width: 200px"
                v-model="form.patrolEnd"
                placeholder="选择巡检结束时间"
                :style="{ width: width }"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重复间隔" prop="repeatInterval">
              <el-input-number
                v-model="form.repeatInterval"
                placeholder="请输入重复间隔"
                controls-position="right"
                :min="0"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重复间隔类型" prop="intervalType">
              <el-radio-group v-model="form.intervalType">
                <el-radio
                  v-for="dict in intervalTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重复时间" prop="repeatTime">
              <el-input-number
                v-model="form.repeatTime"
                placeholder="请输入重复时间"
                controls-position="right"
                :min="0"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重复时间类型" prop="timeType">
              <el-radio-group v-model="form.timeType">
                <el-radio
                  v-for="dict in timeTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计消耗时间" prop="expectTime">
              <el-input-number
                v-model="form.expectTime"
                placeholder="请输入预计消耗时间"
                controls-position="right"
                :min="0"
                style="width: 250px"
              />&nbsp;&nbsp;分钟
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可逾期时间" prop="overTime">
              <el-input-number
                v-model="form.overTime"
                placeholder="请输入可逾期时间"
                controls-position="right"
                :min="0"
                style="width: 250px"
              />&nbsp;&nbsp;分钟
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注"
              ></el-input>
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
  listPlan,
  getPlan,
  delPlan,
  addPlan,
  updatePlan,
  exportPlan,
  changePlanStatus,
  createTask,
} from "@/api/patrol/plan";
import { listLine } from "@/api/patrol/line";
import { treeListTeam } from "@/api/equipment/team";
import { listStaffAll } from "@/api/equipment/staff";

export default {
  name: "Plan",
  data() {
    return {
      cascaderProps: { emitPath: false, value: "id" },
      // 统一宽度
      width: "300px",
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
      // 巡检计划 表格数据
      planList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planCode: undefined,
        planName: undefined,
        status: undefined,
      },
      // 巡检线路
      lineOptions: [],
      // 班组列表
      teamOptions: [],
      // 人员列表
      staffOptions: undefined,
      // 保养间隔
      intervalTypeOptions: undefined,
      // 时间间隔
      timeTypeOptions: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planCode: [
          { required: true, message: "请输入巡检计划编码", trigger: "blur" },
        ],
        planName: [
          { required: true, message: "请输入巡检计划名称", trigger: "blur" },
        ],
        lineId: [
          { required: true, message: "请选择巡检线路", trigger: "blur" },
        ],
        teamId: [
          { required: true, message: "请选择保养班组", trigger: "blur" },
        ],
        staffId: [
          { required: true, message: "请选择巡检负责人", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getLineList();
    this.getTeamList();
    this.getDicts("interval_type").then((response) => {
      this.intervalTypeOptions = response.data;
    });
    this.getDicts("time_interval_type").then((response) => {
      this.timeTypeOptions = response.data;
    });
  },
  watch: {
    "form.teamId": "selectTeam",
  },
  methods: {
    /** 查询巡检计划 列表 */
    getList() {
      this.loading = true;
      listPlan(this.queryParams).then((response) => {
        this.planList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 巡检线路
    getLineList() {
      listLine({ status: "0" }).then((response) => {
        this.lineOptions = response.rows;
      });
    },
    // 获取班组列表
    getTeamList() {
      treeListTeam({ teamId: this.patrolTeamId }).then((response) => {
        this.teamOptions = [];
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.teamOptions.push(data);
        this.teamOptions = response.data;
      });
    },
    // 班组选择
    selectTeam() {
      this.staffOptions = undefined;
      if (this.form.teamId) {
        //console.log("setStaff teamId", this.form.teamId);
        let params = {
          teamId: this.form.teamId,
        };
        listStaffAll(params).then((response) => {
          this.$set(this.form, "staffId", undefined);
          this.$set(this.form, "staffIds", undefined);
          this.staffOptions = response.rows;
        });
      }
    },
    // 保养间隔
    intervalTypeyFormat(row, column) {
      return this.selectDictLabel(this.intervalTypeOptions, row.intervalType);
    },
    // 时间间隔
    timeTypeyFormat(row, column) {
      return this.selectDictLabel(this.timeTypeOptions, row.timeType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        planId: undefined,
        planGuid: undefined,
        planCode: undefined,
        planName: undefined,
        lineId: undefined,
        teamId: undefined,
        staffId: undefined,
        staffIds: undefined,
        beginDate: undefined,
        endDate: undefined,
        patrolBegin: undefined,
        patrolEnd: undefined,
        repeatInterval: undefined,
        intervalType: "0",
        repeatTime: undefined,
        timeType: "0",
        expectTime: undefined,
        overTime: undefined,
        nextTime: undefined,
        remark: undefined,
        status: undefined,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.planId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加巡检计划 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const planId = row.planId || this.ids;
      getPlan(planId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改巡检计划 ";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.planId != undefined) {
            updatePlan(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPlan(this.form).then((response) => {
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
      const planIds = row.planId || this.ids;
      this.$confirm("是否确认删除选中的巡检计划", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        delPlan(planIds)
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
      this.$confirm("是否确认导出所有巡检计划 数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPlan(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 启用/停用 */
    handleStatus(row, status) {
      const planIds = row.planId;
      let text = status === "0" ? "启用" : "停用";
      this.$confirm("是否确认" + text + "选中的巡检计划", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading(
          "正在" + text + "巡检任务,请稍候......"
        );
        changePlanStatus(planIds, status)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess(text + "成功!");
              this.getList();
            } else {
              this.msgError(text + "失败!");
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    /** 生成巡检任务 */
    handleTask(row) {
      const planId = row.planId;
      this.$confirm(
        '是否确认生成编码为"' + row.planCode + '"的保养计划的保养任务?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const loading = this.openLoading("正在生成巡检任务,请稍候......");
        createTask(planId)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("生成保养任务成功");
              this.getList();
            } else {
              this.msgError("生成保养任务失败");
            }
          })
          .catch(() => {
            loading.close();
            this.msgError("生成保养任务失败");
          });
      });
    },
  },
};
</script>