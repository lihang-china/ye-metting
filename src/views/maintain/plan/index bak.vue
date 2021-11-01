<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="保养计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入保养计划编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保养计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入保养计划名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保养计划状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择保养计划状态"
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
          v-hasPermi="['maintain:plan:add']"
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
          v-hasPermi="['maintain:plan:edit']"
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
          v-hasPermi="['maintain:plan:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['maintain:plan:export']"
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
      <el-table-column label="保养计划编码" align="center" prop="planCode" />
      <el-table-column label="保养计划名称" align="center" prop="planName" />
      <el-table-column label="保养班组" align="center" prop="teamName" />
      <el-table-column label="保养负责人" align="center" prop="staffName" />
      <el-table-column label="首次保养时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.maintainTime, "{y}-{m}-{d}") }}</span>
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
        width="500"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status === '1'">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['maintain:plan:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['maintain:plan:remove']"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-box"
              @click="handleSelect(scope.row, 'E')"
              >选择保养设备</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-order"
              @click="handleSelect(scope.row, 'I')"
              >选择保养项</el-button
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

    <!-- 添加或修改保养计划对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="保养计划编码" prop="planCode">
              <el-input
                v-model="form.planCode"
                placeholder="请输入保养计划编码"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养计划名称" prop="planName">
              <el-input
                v-model="form.planName"
                placeholder="请输入保养计划名称"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保养班组" prop="teamId">
              <el-cascader
                v-model="form.teamId"
                :options="teamOptions"
                :props="cascaderProps"
                placeholder="请选择保养班组"
                clearable
                :style="{ width: width }"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保养负责人" prop="staffId">
              <el-select
                v-model="form.staffId"
                filterable
                placeholder="请选择保养负责人"
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
            <el-form-item label="保养人员" prop="staffIds">
              <el-select
                v-model="form.staffIds"
                filterable
                placeholder="请选择保养人员"
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
            <el-form-item label="首次保养时间" prop="maintainTime">
              <el-date-picker
                clearable
                style="width: 200px"
                v-model="form.maintainTime"
                type="date"
                placeholder="选择首次保养时间"
                :style="{ width: width }"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保养间隔" prop="maintainInterval">
              <el-input-number
                v-model="form.maintainInterval"
                placeholder="请输入保养间隔"
                controls-position="right"
                :min="1"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养间隔类型" prop="maintainInterval">
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

    <el-dialog
      :title="select.title"
      :visible.sync="select.open"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-input
        :placeholder="select.placeholder"
        v-model="select.filter"
        style="width: 300px"
        size="small"
      ></el-input>
      <div style="height: 560px; overflow: auto; margin-top: 20px">
        <el-tree
          :key="select.key"
          :data="select.options"
          show-checkbox
          default-expand-all
          :node-key="select.nodeKey"
          :props="select.props"
          :filter-node-method="filterSelect"
          :default-checked-keys="select.defaultChecked"
          ref="selectTree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }} &nbsp;&nbsp;</span>
            <span v-if="select.type === 'E'"
              >{{ data.equCode }}&nbsp;&nbsp;{{ data.areaName }}&nbsp;&nbsp;{{
                data.calssName
              }}</span
            >
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSelect">确 定</el-button>
        <el-button @click="cancelSelect">取 消</el-button>
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
} from "@/api/maintain/plan";
import { treeListTeam } from "@/api/equipment/team";
import { listStaffAll } from "@/api/equipment/staff";
import { listCard } from "@/api/equipment/card";
import { selectItem } from "@/api/maintain/item";
import { save } from "@/api/maintain/planChildren";

export default {
  name: "maintainPlan",
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
      // 保养计划表格数据
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
      // 班组列表
      teamOptions: [],
      // 人员列表
      staffOptions: undefined,
      // 保养间隔
      intervalTypeOptions: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planCode: [
          { required: true, message: "请输入保养计划编码", trigger: "blur" },
        ],
        planName: [
          { required: true, message: "请输入保养计划名称", trigger: "blur" },
        ],
        teamId: [
          { required: true, message: "请选择保养班组", trigger: "blur" },
        ],
        staffId: [
          { required: true, message: "请选择保养负责人", trigger: "blur" },
        ],
        maintainTime: [
          { required: true, message: "请选择首次保养时间", trigger: "blur" },
        ],
        intervalType: [
          { required: true, message: "请输入保养间隔", trigger: "blur" },
        ],
      },
      //
      select: {},
    };
  },
  created() {
    this.getList();
    this.getTeamList();
    this.getDicts("interval_type").then((response) => {
      this.intervalTypeOptions = response.data;
    });
  },
  watch: {
    "form.teamId": "selectTeam",
    "select.filter": function (val, oldVal) {
      if (this.$refs.selectTree) {
        this.$refs.selectTree.filter(val);
      }
    },
  },
  methods: {
    /** 查询保养计划列表 */
    getList() {
      this.loading = true;
      listPlan(this.queryParams).then((response) => {
        this.planList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //获取班组列表
    getTeamList() {
      treeListTeam({ teamId: this.maintainTeamId }).then((response) => {
        this.teamOptions = [];
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.teamOptions.push(data);
        this.teamOptions = response.data;
      });
    },
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
        teamId: undefined,
        staffId: undefined,
        staffIds: undefined,
        maintainTime: undefined,
        maintainInterval: 1,
        intervalType: "0",
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
      this.title = "添加保养计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const planId = row.planId || this.ids;
      getPlan(planId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改保养计划";
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
      this.$confirm(
        '是否确认删除保养计划编号为"' + planIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPlan(planIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有保养计划数据项?", "警告", {
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
    resetSelect() {
      this.select = {
        key: false,
        planId: undefined,
        title: undefined,
        open: false,
        placeholder: undefined,
        type: undefined,
        filter: undefined,
        options: [],
        nodeKey: undefined,
        props: undefined,
        defaultChecked: [],
      };
    },
    handleSelect(row, type) {
      getPlan(row.planId).then((response) => {
        //console.log(response.data);
        let plan = response.data;

        this.resetSelect();
        this.select.planId = plan.planId;
        this.select.type = type;
        if (type === "E") {
          listCard({
            equMaintain: "Y",
          }).then((response) => {
            let data = {
              equId: 0,
              equName: "保养设备",
              equCode: "",
              children: [],
            };
            data.children = response.rows;
            // this.select.options = response.rows;
            this.select = {
              key: true,
              planId: plan.planId,
              title: "选取保养设备",
              open: true,
              placeholder: "请输入设备编码或名称",
              type: type,
              options: [],
              nodeKey: "equId",
              props: {
                label: "equName",
              },
              defaultChecked: plan.equIds,
            };
            this.select.options.push(data);
          });
        } else {
          selectItem({ teamId: plan.teamId }).then((response) => {
            let data = { mitemId: 0, mitemName: "巡检项", children: [] };
            data.children = response.rows;
            // this.select.options = response.rows;
            this.select = {
              key: true,
              planId: plan.planId,
              title: "选取保养项",
              open: true,
              placeholder: "请输入保养项名称",
              type: type,
              options: [],
              nodeKey: "mitemId",
              props: {
                label: "mitemName",
              },
              defaultChecked: plan.itemIds,
            };
            this.select.options.push(data);
          });
        }
      });
    },
    filterSelect(value, data, node) {
      if (!value) return true;
      if (this.select.type === "E") {
        return (
          data.equName.indexOf(value) !== -1 ||
          data.equCode.indexOf(value) !== -1
        );
      } else {
        return data.mitemName.indexOf(value) !== -1;
      }
    },
    submitSelect() {
      let selectChecked = this.$refs.selectTree.getCheckedKeys();
      //console.log(selectChecked);
      let data = {
        planId: this.select.planId,
        type: this.select.type,
        equIds: this.select.type === "E" ? selectChecked.join(",") : "",
        itemIds: this.select.type === "I" ? selectChecked.join(",") : "",
      };
      save(data).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("保存成功");
          this.select.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    cancelSelect() {
      this.select.open = false;
      this.select.options = [];
    },
    /** 启用/停用 */
    handleStatus(row, status) {
      const planIds = row.planId;
      let text = status === "0" ? "启用" : "停用";
      this.$confirm("是否确认" + text + "选中的保养计划", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading(
          "正在" + text + "保养任务,请稍候......"
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
    /** 生成保养任务 */
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
        const loading = this.openLoading("正在生成保养任务,请稍候......");
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
          });
      });
    },
  },
};
</script>