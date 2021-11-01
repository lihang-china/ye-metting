<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
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
      <el-form-item label="首次保养时间">
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
      <el-table-column label="保养计划编码" align="left" prop="planCode" width="300" />
      <el-table-column label="保养计划名称" align="left" prop="planName" width="300" />
      <el-table-column label="保养班组" align="left" prop="teamName" width="250" />
      <el-table-column label="保养负责人" align="left" prop="staffName" width="250" />
      <el-table-column label="首次保养时间" align="left" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.maintainTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="left" prop="createBy" width="200" />
      <el-table-column label="创建时间" align="left" width="200">
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

    <!-- 添加或修改保养计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" :close-on-click-modal="false">
      <div style="height: 660px; overflow: auto;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="保养计划" name="first">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养计划编码" prop="planCode">
                    <span>{{ form.planCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保养计划名称" prop="planName">
                    <span>{{ form.planName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养班组" prop="teamName">
                    <span>{{ form.teamName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保养负责人" prop="staffName">
                    <span>{{ form.staffName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保养人员" prop="staffsName">
                    <span>{{ form.staffsName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="首次保养时间" prop="maintainTime">
                    <span>{{ parseTime(form.maintainTime, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保养间隔" prop="maintainInterval">
                    <span>{{ form.maintainInterval }}</span>
                    <span>{{ form.intervalType == "0" ? "日": (form.intervalType == "1" ? "月" : "年") }}</span>
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
          <el-tab-pane label="保养任务" name="second">
            <el-table
              v-loading="childrenLoading.second"
              :data="taskList"
              style="width: 100%"
              height="500px"
            >
              <el-table-column label="序号" align="center" type="index" width="50" />
              <el-table-column label="保养任务编号" align="left" prop="taskCode" width="300" />
              <el-table-column label="保养设备编码" align="left" prop="equCode" width="230" />
              <el-table-column label="保养设备名称" align="left" prop="equName" width="230" />
              <el-table-column label="保养时间" align="center" prop="maintainTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.maintainTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="保养任务类型" align="center" prop="type"  width="180">
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

            <pagination class="pagination"
              v-show="paramsTask.total>0"
              :total="paramsTask.total"
              :page.sync="paramsTask.pageNum"
              :limit.sync="paramsTask.pageSize"
              @pagination="getTask"
            />
          </el-tab-pane>
          <el-tab-pane label="保养设备" name="third">
            <el-table
              v-loading="childrenLoading.third"
              :data="equipmentList"
              style="width: 100%"
              height="500px"
            >
              <el-table-column label="序号" align="center" type="index" width="50" />
              <el-table-column label="设备编码" align="left" prop="equCode" width="200" />
              <el-table-column label="设备名称" align="left" prop="equName" width="200" />
              <el-table-column label="设备分类" align="left" prop="className" width="200" />
              <el-table-column label="设备所在区域" align="left" prop="areaName" width="200" />
              <el-table-column label="设备所属部门" align="left" prop="deptName" width="150" />
              <el-table-column label="设备管理员" align="left" prop="adminName" width="150" />
            </el-table>

            <pagination class="pagination"
              v-show="paramsEquipment.total>0"
              :total="paramsEquipment.total"
              :page.sync="paramsEquipment.pageNum"
              :limit.sync="paramsEquipment.pageSize"
              @pagination="getEquipment"
            />
          </el-tab-pane>
          <el-tab-pane label="保养项" name="fourth">
            <el-table
              v-loading="childrenLoading.fourth"
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

            <pagination class="pagination"
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
import { listPlan, getPlan } from "@/api/maintain/plan";
import { listTask } from "@/api/maintain/task";
import { listByPlan as listEquipment } from "@/api/equipment/card";
import { listByPlan as listItem } from "@/api/maintain/item";
import { treeListTeam } from "@/api/equipment/team";
import { listStaffAll } from "@/api/equipment/staff";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "MaintainSearchByPlan",
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
        second: false,
        third: false,
        fourth: false,
      },
      // 总条数
      total: 0,
      // 保养计划表格数据
      planList: [],
      // 保养任务表格数据
      taskList: [],
      // 保养设备列表数据
      equipmentList: [],
      // 保养项列表数据
      itemList: [],
      // 结果类型
      resultTypeOptions: [],
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
        teamId: undefined,
        staffId: undefined,
        createBy: undefined,
      },
      // 班组列表
      teamOptions: [],
      // 人员列表
      staffOptions: undefined,
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
      //
      paramsEquipment: {
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
    this.getDicts("item_result_type").then((response) => {
      this.resultTypeOptions = response.data;
    });
  },
  watch: {
    "queryParams.teamId": "selectTeam",
  },
  methods: {
    /** 查询保养计划列表 */
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
    addDateRanges(params, maintainTimes, createTimes) {
      var search = params;
      search.beginMaintainTime = "";
      search.endMaintainTime = "";
      search.beginTime = "";
      search.endTime = "";
      if (null != maintainTimes && "" != maintainTimes) {
        search.beginMaintainTime = maintainTimes[0];
        search.endMaintainTime = maintainTimes[1];
      }
      if (null != createTimes && "" != createTimes) {
        search.beginTime = createTimes[0];
        search.endTime = createTimes[1];
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
    resultTypeFormat(row, column) {
      return this.selectDictLabel(this.resultTypeOptions, row.resultType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.childrenLoading = {
        second: false,
        third: false,
        fourth: false,
      };
    },
    // 表单重置
    reset() {
      this.form = {
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
        this.paramsEquipment.planId = response.data.planId;
        this.paramsItem.planId = response.data.planId;

        this.getTask();
        this.getEquipment();
        this.getItem();

        this.title = "查看";
        this.open = true;
      });
    },
    getTask() {
      this.childrenLoading.second = true;
      listTask(this.paramsTask).then((response) => {
        this.taskList = response.rows;
        this.paramsTask.total = response.total;
        this.childrenLoading.second = false;
      });
    },
    getEquipment() {
      this.childrenLoading.third = true;
      listEquipment(this.paramsEquipment).then((response) => {
        this.equipmentList = response.rows;
        this.paramsEquipment.total = response.total;
        this.childrenLoading.third = false;
      });
    },
    getItem() {
      this.childrenLoading.fourth = true;
      listItem(this.paramsItem).then((response) => {
        this.itemList = response.rows;
        this.paramsItem.total = response.total;
        this.childrenLoading.fourth = false;
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