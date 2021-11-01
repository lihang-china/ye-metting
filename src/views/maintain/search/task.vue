<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="保养任务编号" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入保养任务编号"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="保养计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入保养计划编码"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="保养计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入保养计划名称"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="保养设备编码" prop="equCode">
        <el-input
          v-model="queryParams.equCode"
          placeholder="请输入保养设备编码"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="保养设备名称" prop="equName">
        <el-input
          v-model="queryParams.equName"
          placeholder="请输入保养设备名称"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="保养时间">
        <el-date-picker
          v-model="dateRangeTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :style="{ width: width }"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择任务类型"
          clearable
          :style="{ width: width }"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          :style="{ width: width }"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保养班组" prop="teamId">
        <treeselect
          v-model="queryParams.teamId"
          :options="teamOptions"
          placeholder="请选择保养班组"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="保养负责人" prop="staffId">
        <el-select
          v-model="queryParams.staffId"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="taskList" style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="保养任务编号" align="left" prop="taskCode" width="300" />
      <el-table-column label="保养计划编号" align="left" prop="planCode" width="300" />
      <el-table-column label="保养计划名称" align="left" prop="planName" width="300" />
      <el-table-column label="保养设备编码" align="left" prop="equCode" width="300" />
      <el-table-column label="保养设备名称" align="left" prop="equName" width="300" />
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
        width="200"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="200"
      />
      <el-table-column label="保养班组" align="left" prop="teamName" width="250" />
      <el-table-column label="保养负责人" align="left" prop="staffName" width="250" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row.taskId)"
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

    <!-- 添加或修改保养任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false">
      <div style="height:660px; overflow: auto;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="保养任务" name="first">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="保养任务编号" prop="taskCode">
                    <span>{{form.taskCode}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养时间" prop="maintainTime">
                    <span>{{ parseTime(form.maintainTime, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养任务类型" prop="type">
                    <span>{{ form.type == "0" ? "自动创建" : "手动创建" }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态" prop="status">
                    <span>{{ form.status == "0" ? "已完成" : "未完成" }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养完成时间" prop="finishTime">
                    <span>{{ parseTime(form.finishTime) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="说明" prop="notes">
                    <span>{{form.notes}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="保养设备" name="second">
            <el-form ref="formEquipment" :model="formEquipment" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备编码">
                    <span>{{formEquipment.equCode}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备名称">
                    <span>{{formEquipment.equName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备分类">
                    <span>{{formEquipment.className}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备所在区域">
                    <span>{{formEquipment.areaName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备所属部门">
                    <span>{{formEquipment.deptName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备管理员">
                    <span>{{formEquipment.adminName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="保养计划" name="third">
            <el-form ref="formPlan" :model="formPlan" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养计划编码" prop="planCode">
                    <span>{{ formPlan.planCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保养计划名称" prop="planName">
                    <span>{{ formPlan.planName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养班组" prop="teamName">
                    <span>{{ formPlan.teamName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养负责人" prop="staffName">
                    <span>{{ formPlan.staffName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保养人员" prop="staffsName">
                    <span>{{ formPlan.staffsName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="首次保养时间" prop="maintainTime">
                    <span>{{ parseTime(formPlan.maintainTime, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保养间隔" prop="maintainInterval">
                    <span>{{ formPlan.maintainInterval }}</span>
                    <span>{{ formPlan.intervalType == "0" ? "日": (formPlan.intervalType == "1" ? "月" :"年") }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="remark">
                    <span>{{ formPlan.remark }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="相关保养任务" name="fourth">
            <el-table
              v-loading="childrenLoading.fourth"
              :data="connectTaskList"
              style="width: 100%"
              height="500px"
              :row-class-name="tableRowClassName"
            >
              <el-table-column label="序号" align="center" type="index" width="50" />
              <el-table-column label="保养任务编号" align="center" prop="taskCode" width="300" />
              <el-table-column label="保养设备编码" align="left" prop="equCode" width="230" />
              <el-table-column label="保养设备名称" align="left" prop="equName" width="230" />
              <el-table-column label="保养时间" align="center" prop="maintainTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.maintainTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="保养任务类型" align="center" prop="type" width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.type == "0" ? "自动创建" : "手动创建" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" prop="status">
                <template slot-scope="scope">
                  <span>{{ scope.row.status == "0" ? "已完成" : "未完成" }}</span>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              class="pagination"
              v-show="paramsTask.total>0"
              :total="paramsTask.total"
              :page.sync="paramsTask.pageNum"
              :limit.sync="paramsTask.pageSize"
              @pagination="getTask"
            />
          </el-tab-pane>
          <el-tab-pane label="保养项" name="fifth">
            <el-table
              v-loading="childrenLoading.fifth"
              :data="itemList"
              style="width: 100%"
              height="500px"
            >
              <el-table-column label="序号" align="center" type="index" width="50" />
              <el-table-column label="保养项" align="left" prop="mitemName" width="300" />
              <el-table-column label="保养班组" align="left" prop="teamName" />
              <el-table-column
                label="结果类型"
                align="center"
                prop="resultType"
                :formatter="resultTypeFormat"
              />
            </el-table>

            <pagination
              class="pagination"
              v-show="paramsItem.total>0"
              :total="paramsItem.total"
              :page.sync="paramsItem.pageNum"
              :limit.sync="paramsItem.pageSize"
              @pagination="getItem"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTask, getTask } from "@/api/maintain/task";
import { getPlan } from "@/api/maintain/plan";
import { listCard } from "@/api/equipment/card";
import { listByPlan as listItem } from "@/api/maintain/item";
import { treeListTeam } from "@/api/equipment/team";
import { listStaffAll } from "@/api/equipment/staff";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "MaintainSearchByTask",
  components: { Treeselect },
  data() {
    return {
      // 统一宽度
      width: "250px",
      //默认选项卡
      activeName: "first",
      // 遮罩层
      loading: true,
      // 遮罩层
      childrenLoading: {
        fourth: false,
        fifth: false,
      },
      // 总条数
      total: 0,
      // 保养任务表格数据
      taskList: [],
      // 保养任务表格数据
      connectTaskList: [],
      // 保养项列表数据
      itemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskCode: undefined,
        planCode: undefined,
        planName: undefined,
        equCode: undefined,
        equName: undefined,
        type: undefined,
        status: undefined,
        teamId: undefined,
        staffId: undefined,
      },
      typeOptions: [],
      statusOptions: [],
      // 结果类型
      resultTypeOptions: [],
      // 班组列表
      teamOptions: [],
      // 人员列表
      staffOptions: undefined,
      // 日期范围
      dateRangeTime: [],
      // 表单参数
      form: {},
      formEquipment: {},
      formPlan: {},
      taskId: undefined,
      //
      paramsTask: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        planId: undefined,
      },
      //
      paramsItem: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        planId: undefined,
      },
    };
  },
  created() {
    this.getList();
    this.getTeamList();
    this.getDicts("task_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("task_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("item_result_type").then((response) => {
      this.resultTypeOptions = response.data;
    });
  },
  watch: {
    "queryParams.teamId": "selectTeam",
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
      if (this.queryParams.teamId) {
        //console.log("setStaff teamId", this.queryParams.teamId);
        let params = {
          teamId: this.queryParams.teamId,
        };
        listStaffAll(params).then((response) => {
          this.$set(this.queryParams, "staffId", undefined);
          this.staffOptions = response.rows;
        });
      }
    },
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    resultTypeFormat(row, column) {
      return this.selectDictLabel(this.resultTypeOptions, row.resultType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.childrenLoading = {
        fourth: false,
        fifth: false,
      };
      this.taskId = undefined;
    },
    // 表单重置
    reset() {
      this.form = {
        taskId: undefined,
        taskGuid: undefined,
        taskCode: undefined,
        planId: undefined,
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
      };
      this.resetForm("form");
    },
    // 表单重置
    resetEquipment() {
      this.formEquipment = {
        equCode: undefined,
        equName: undefined,
        className: undefined,
        areaName: undefined,
        deptName: undefined,
        adminName: undefined,
      };
      this.resetForm("formEquipment");
    },
    // 表单重置
    resetPlan() {
      this.formPlan = {
        planId: undefined,
        planGuid: undefined,
        planCode: undefined,
        planName: undefined,
        teamId: undefined,
        teamName: undefined,
        staffId: undefined,
        staffName: undefined,
        staffIds: undefined,
        staffIdsName: undefined,
        maintainTime: undefined,
        maintainInterval: 1,
        intervalType: "0",
        remark: undefined,
        status: "0",
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
      };
      this.resetForm("formPlan");
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
    handleView(taskId) {
      this.taskId = taskId;
      this.reset();
      this.resetPlan();
      this.activeName = "first";
      getTask(taskId).then((response) => {
        this.form = response.data;
        this.formEquipment = response.data.equCard;

        let { planId } = response.data;
        getPlan(planId).then((response) => {
          this.formPlan = response.data;
        });
        this.paramsTask.planId = planId;
        this.paramsTask.equId = response.data.equCard.equId;
        this.getTask();

        this.paramsItem.planId = planId;
        this.getItem();

        this.open = true;
        this.title = "查看";
      });
    },
    getTask() {
      this.childrenLoading.fourth = true;
      listTask(this.paramsTask).then((response) => {
        this.connectTaskList = response.rows;
        this.paramsTask.total = response.total;
        this.childrenLoading.fourth = false;
      });
    },
    getItem() {
      this.childrenLoading.fifth = true;
      listItem(this.paramsItem).then((response) => {
        this.itemList = response.rows;
        this.paramsItem.total = response.total;
        this.childrenLoading.fifth = false;
      });
    },
    tableRowClassName({ row }) {
      if (row.taskId === this.taskId) {
        //console.log(row.taskId);
        return "check-row";
      }
    },
  },
};
</script>

<style>
.el-table .check-row {
  background: #67c23a;
  color: white;
}
</style>

<style scoped>
.pagination {
  box-sizing: content-box;
}
</style>
