<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
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
      <el-form-item label="巡检日期">
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
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建人"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRangeCreateTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :style="{ width: width }"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="planList" style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="巡检计划编码" align="center" prop="planCode" width="300" />
      <el-table-column label="巡检计划名称" align="center" prop="planName" width="300" />
      <el-table-column label="巡检路线" align="center" prop="lineName" width="300" />
      <el-table-column label="巡检班组" align="center" prop="teamName" width="300" />
      <el-table-column label="巡检负责人" align="center" prop="staffName" width="300" />
      <el-table-column label="巡检开始日期" align="center" prop="beginDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检结束日期" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" width="200" />
      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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
            @click="handleView(scope.row.planId)"
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

    <!-- 添加或修改巡检计划 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" :close-on-click-modal="false">
      <div style="height:660px; overflow: auto;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="巡检计划" name="first">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检计划编码" prop="planCode">
                    <span>{{ form.planCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检计划名称" prop="planName">
                    <span>{{ form.planName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检线路" prop="lineId">
                    <span>{{ form.lineName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检班组" prop="teamName">
                    <span>{{ form.teamName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检负责人" prop="staffName">
                    <span>{{ form.staffName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检人员" prop="staffsName">
                    <span>{{ form.staffsName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检开始日期" prop="beginDate">
                    <span>{{ parseTime(form.beginDate, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检结束日期" prop="endDate">
                    <span>{{ parseTime(form.endDate, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="巡检开始时间" prop="patrolBegin">
                    <span>{{ parseTime(GMTTime(form.patrolBegin), '{h}:{i}:{s}') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="巡检结束时间" prop="patrolEnd">
                    <span>{{ parseTime(GMTTime(form.patrolEnd), '{h}:{i}:{s}') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="重复间隔" prop="repeatInterval">
                    <span>{{ form.repeatInterval }}</span>
                    <span>{{ form.intervalType == "0" ? "日": (form.intervalType == "1" ? "月" : "年") }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="重复时间" prop="repeatTime">
                    <span>{{ form.repeatTime }}</span>
                    <span>{{ form.timeType == "0" ? "分钟": "小时" }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="预计消耗时间" prop="expectTime">
                    <span>{{ form.expectTime }} 分钟</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="可逾期时间" prop="overTime">
                    <span>{{ form.overTime }} 分钟</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="remark">
                    <span>{{ form.remark }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="相关巡检任务" name="second">
            <el-table
              v-loading="childrenLoading"
              :data="taskList"
              style="width: 100%"
              height="500px"
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
              <el-table-column label="巡检计划类型" align="center" prop="type" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.type == "0" ? "自动创建" : "手动创建" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" prop="status" width="100">
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
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPlan, getPlan } from "@/api/patrol/plan";
import { listLine } from "@/api/patrol/line";
import { listTask } from "@/api/patrol/task";
import { treeListTeam } from "@/api/equipment/team";
import { listStaffAll } from "@/api/equipment/staff";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "PatrolSearchByPlan",
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
      // 巡检计划 表格数据
      planList: [],
      // 巡检任务表格数据
      taskList: [],
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
        lineId: undefined,
        teamId: undefined,
        staffId: undefined,
        createBy: undefined,
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
      // 日期范围
      dateRangeTime: [],
      // 日期范围
      dateRangeCreateTime: [],
      // 表单参数
      form: {},
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
    this.getDicts("interval_type").then((response) => {
      this.intervalTypeOptions = response.data;
    });
    this.getDicts("time_interval_type").then((response) => {
      this.timeTypeOptions = response.data;
    });
  },
  watch: {
    "queryParams.teamId": "selectTeam",
  },
  methods: {
    /** 查询巡检计划 列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRanges(
        this.queryParams,
        this.dateRangeTime,
        this.dateRangeCreateTime
      );
      listPlan(param).then((response) => {
        this.planList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    addDateRanges(params, patrolTimes, createTimes) {
      var search = params;
      search.beginDate = "";
      search.endDate = "";
      search.beginTime = "";
      search.endTime = "";
      if (null != patrolTimes && "" != patrolTimes) {
        search.beginDate = patrolTimes[0];
        search.endDate = patrolTimes[1];
      }
      if (null != createTimes && "" != createTimes) {
        search.beginTime = createTimes[0];
        search.endTime = createTimes[1];
      }
      return search;
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
    intervalTypeyFormat(row, column) {
      return this.selectDictLabel(this.intervalTypeOptions, row.intervalType);
    },
    timeTypeyFormat(row, column) {
      return this.selectDictLabel(this.timeTypeOptions, row.timeType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.childrenLoading = false;
    },
    // 表单重置
    reset() {
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
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRangeTime = [];
      this.dateRangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查看 */
    handleView(planId) {
      this.reset();
      this.activeName = "first";
      getPlan(planId).then((response) => {
        this.form = response.data;

        this.paramsTask.planId = response.data.planId;
        this.getTask();

        this.title = "查看";
        this.open = true;
      });
    },
    getTask() {
      this.childrenLoading = true;
      listTask(this.paramsTask).then((response) => {
        this.taskList = response.rows;
        this.paramsTask.total = response.total;
        this.childrenLoading = false;
      });
    },
  },
};
</script>

<style scoped>
.pagination {
  box-sizing: content-box;
}
</style>