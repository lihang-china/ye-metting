<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="巡检任务编码" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入巡检任务编码"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="巡检计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入巡检计划编码"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="巡检计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入巡检计划名称"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="巡检线路" prop="lineId">
        <el-select
          v-model="queryParams.lineId"
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
      <el-form-item label="巡检时间">
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
      <el-form-item label="巡检班组" prop="teamId">
        <treeselect
          v-model="queryParams.teamId"
          :options="teamOptions"
          placeholder="请选择巡检班组"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="巡检负责人" prop="staffId">
        <el-select
          v-model="queryParams.staffId"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="taskList" style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="巡检任务编码" align="center" prop="taskCode" width="300" />
      <el-table-column label="巡检计划编号" align="center" prop="planCode" width="300" />
      <el-table-column label="巡检计划名称" align="center" prop="planName" width="300" />
      <el-table-column label="巡检路线" align="center" prop="lineName" width="300" />
      <el-table-column label="开始时间" align="center" prop="beginDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计结束时间" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最晚结束时间" align="center" prop="latestTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.latestTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="巡检计划类型"
        align="center"
        prop="type"
        :formatter="typeFormat"
        width="100"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="100"
      />
      <el-table-column label="巡检班组" align="center" prop="teamName" width="250" />
      <el-table-column label="巡检负责人" align="center" prop="staffName" width="250" />
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

    <!-- 添加或修改巡检任务 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false">
      <div style="height:660px; overflow: auto;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="巡检任务" name="first">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="巡检任务编号" prop="taskCode">
                    <span>{{form.taskCode}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检开始时间" prop="beginDate">
                    <span>{{ parseTime(form.beginDate) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检结束时间" prop="endDate">
                    <span>{{ parseTime(form.endDate) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="最晚结束时间" prop="latestTime">
                    <span>{{ parseTime(form.latestTime) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="实际开始时间" prop="abeginTime">
                    <span>{{ parseTime(form.abeginTime) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="实际结束时间" prop="aendTime">
                    <span>{{ parseTime(form.aendTime) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="说明" prop="notes">
                    <span>{{ form.notes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="巡检计划" name="second">
            <el-form ref="formPlan" :model="formPlan" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检计划编码" prop="planCode">
                    <span>{{ formPlan.planCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检计划名称" prop="planName">
                    <span>{{ formPlan.planName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检线路" prop="lineId">
                    <span>{{ formPlan.lineName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检班组" prop="teamName">
                    <span>{{ formPlan.teamName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检负责人" prop="staffName">
                    <span>{{ formPlan.staffName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检人员" prop="staffsName">
                    <span>{{ formPlan.staffsName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检开始日期" prop="beginDate">
                    <span>{{ parseTime(formPlan.beginDate, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检结束日期" prop="endDate">
                    <span>{{ parseTime(formPlan.endDate, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检开始时间" prop="patrolBegin">
                    <span>{{ parseTime(GMTTime(formPlan.patrolBegin), '{h}:{i}:{s}') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检结束时间" prop="patrolEnd">
                    <span>{{ parseTime(GMTTime(formPlan.patrolEnd), '{h}:{i}:{s}') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="重复间隔" prop="repeatInterval">
                    <span>{{ formPlan.repeatInterval }}</span>
                    <span>{{ formPlan.intervalType == "0" ? "日": (formPlan.intervalType == "1" ? "月" : "年") }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="重复时间" prop="repeatTime">
                    <span>{{ formPlan.repeatTime }}</span>
                    <span>{{ formPlan.timeType == "0" ? "分钟": "小时" }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="预计消耗时间" prop="expectTime">
                    <span>{{ formPlan.expectTime }} 分钟</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="可逾期时间" prop="overTime">
                    <span>{{ formPlan.overTime }} 分钟</span>
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
          <el-tab-pane label="相关巡检任务" name="third">
            <el-table
              v-loading="childrenLoading"
              :data="connectTaskList"
              :row-class-name="tableRowClassName"
              height="500px"
              style="width: 100%"
            >
              <el-table-column label="序号" align="center" type="index" width="50" fixed="left" />
              <el-table-column
                label="巡检任务编码"
                align="center"
                prop="taskCode"
                width="300"
                fixed="left"
              />
              <el-table-column label="开始时间" align="center" prop="beginDate" width="160">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.beginDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="预计结束时间" align="center" prop="endDate" width="160">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.endDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="最晚结束时间" align="center" prop="latestTime" width="160">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.latestTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="巡检计划类型"
                align="center"
                prop="type"
                :formatter="typeFormat"
                width="100"
              />
              <el-table-column
                label="状态"
                align="center"
                prop="status"
                :formatter="statusFormat"
                width="100"
              />
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
        </el-tabs>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTask, getTask } from "@/api/patrol/task";
import { getPlan } from "@/api/patrol/plan";
import { listLine } from "@/api/patrol/line";
import { treeListTeam } from "@/api/equipment/team";
import { listStaffAll } from "@/api/equipment/staff";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "PatrolByTask",
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
      childrenLoading: false,
      // 总条数
      total: 0,
      // 巡检任务 表格数据
      taskList: [],
      // 巡检任务表格数据
      connectTaskList: [],
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
        lineId: undefined,
        type: undefined,
        status: undefined,
        teamId: undefined,
        staffId: undefined,
      },
      // 巡检线路
      lineOptions: [],
      typeOptions: [],
      statusOptions: [],
      // 班组列表
      teamOptions: [],
      // 人员列表
      staffOptions: undefined,
      // 日期范围
      dateRangeTime: [],
      // 表单参数
      form: {},
      formPlan: {},
      taskId: undefined,
      //
      paramsTask: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        planId: undefined,
      },
    };
  },
  created() {
    this.getList();
    this.getLineList();
    this.getTeamList();
    this.getDicts("task_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("task_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  watch: {
    "queryParams.teamId": "selectTeam",
  },
  methods: {
    /** 查询巡检任务 列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRanges(this.queryParams, this.dateRangeTime);
      listTask(param).then((response) => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 巡检线路
    getLineList() {
      listLine().then((response) => {
        this.lineOptions = response.rows;
      });
    },
    //获取班组列表
    getTeamList() {
      treeListTeam({ teamId: this.patrolTeamId }).then((response) => {
        this.teamOptions = [];
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.teamOptions.push(data);
        this.teamOptions = response.data;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.childrenLoading = false;
      this.taskId = undefined;
    },
    // 表单重置
    reset() {
      this.form = {
        taskId: undefined,
        taskGuid: undefined,
        taskCode: undefined,
        planId: undefined,
        beginDate: undefined,
        endDate: undefined,
        latestTime: undefined,
        abeginTime: undefined,
        aendTime: undefined,
        patrolResults: undefined,
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
    resetPlan() {
      this.form = {
        planId: undefined,
        planGuid: undefined,
        planCode: undefined,
        planName: undefined,
        lineId: undefined,
        lineName: undefined,
        teamId: undefined,
        teamName: undefined,
        staffId: undefined,
        staffName: undefined,
        staffIds: undefined,
        staffsName: undefined,
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
        let { planId } = response.data;
        getPlan(planId).then((response) => {
          this.formPlan = response.data;
        });

        this.paramsTask.planId = response.data.planId;
        this.getTask();

        this.open = true;
        this.title = "查看";
      });
    },
    getTask() {
      this.childrenLoading = true;
      listTask(this.paramsTask).then((response) => {
        this.connectTaskList = response.rows;
        this.paramsTask.total = response.total;
        this.childrenLoading = false;
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