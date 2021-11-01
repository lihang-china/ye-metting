<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="维修单号" prop="repairCode">
        <el-input
          v-model="queryParams.repairCode"
          placeholder="请输入维修单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报修时间">
        <el-date-picker
          v-model="dateRangeRepairTime"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['repair:card:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['repair:card:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['repair:card:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['repair:card:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="维修单号" align="center" prop="repairCode" width="200" />
      <el-table-column label="维修分类" align="center" prop="reclassName" width="250" />
      <el-table-column
        label="紧急程度"
        align="center"
        prop="repairEmergency"
        width="150"
        :formatter="repairEmergencyFormat"
      />
      <el-table-column
        label="维修来源"
        align="center"
        prop="repairOrigin"
        width="150"
        :formatter="repairOriginFormat"
      />
      <el-table-column label="联系人" align="center" prop="repairContacts" width="150" />
      <el-table-column label="联系电话" align="center" prop="repairPhone" width="150" />
      <el-table-column label="报修时间" align="center" prop="repairTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.repairTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['repair:card:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['repair:card:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-receiving"
            @click="handleAccept(scope.row)"
          >受理分派</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleFinish(scope.row)"
          >维修结果</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-help"
            @click="handleEvaluate(scope.row)"
          >用户评价</el-button>
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

    <!-- 添加或修改维修工单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" :close-on-click-modal="false">
      <div style="height:580px; overflow: auto;">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="维修分类" prop="reclassId">
                <!-- <treeselect
                  v-model="form.reclassId"
                  :options="reclassOptions"
                  placeholder="请选择维修分类"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 0"
                />-->
                <el-cascader
                  v-model="form.reclassId"
                  :options="reclassOptions"
                  :props="cascaderProps"
                  placeholder="请选择维修分类"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 0"
                ></el-cascader>
                <span v-else>{{form.reclassName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="紧急程度" prop="repairEmergency">
                <el-select
                  v-model="form.repairEmergency"
                  filterable
                  clearable
                  disabled
                  placeholder="请选择紧急程度"
                  :style="{ width: width }"
                  v-if="level == 0"
                >
                  <el-option
                    v-for="dict in repairEmergencyOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
                <span v-else>{{ getRepairEmergency(form.repairEmergency) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修来源" prop="repairOrigin">
                <el-select
                  v-model="form.repairOrigin"
                  filterable
                  clearable
                  placeholder="请选择维修来源"
                  :style="{ width: width }"
                  v-if="level == 0"
                >
                  <el-option
                    v-for="dict in repairOriginOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
                <span v-else>{{ getRepairOrigin(form.repairOrigin) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="repairContacts">
                <el-input
                  v-model="form.repairContacts"
                  placeholder="请输入联系人"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 0"
                />
                <span v-else>{{form.repairContacts}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="repairPhone">
                <el-input
                  v-model="form.repairPhone"
                  placeholder="请输入联系电话"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 0"
                />
                <span v-else>{{form.repairPhone}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="报修时间" prop="repairTime">
                <el-date-picker
                  v-model="form.repairTime"
                  type="datetime"
                  placeholder="请选择报修时间"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 0"
                ></el-date-picker>
                <span v-else>{{parseTime(form.repairTime)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报修区域" prop="repairArea">
                <!-- <treeselect
                  v-model="form.repairArea"
                  :options="areaOptions"
                  placeholder="请选择报修区域"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 0"
                />-->
                <el-cascader
                  v-model="form.repairArea"
                  :options="areaOptions"
                  :props="cascaderProps"
                  placeholder="请选择报修区域"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 0"
                ></el-cascader>
                <span v-else>{{form.areaName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="报修部门" prop="repairDept">
                <treeselect
                  v-model="form.repairDept"
                  :options="deptOptions"
                  placeholder="请选择报修部门"
                  clearable
                  disabled
                  :style="{ width: width }"
                  v-if="level == 0"
                />
                <span v-else>{{form.deptName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报修人" prop="repairBy">
                <el-select
                  v-model="form.repairBy"
                  filterable
                  placeholder="请选择报修人"
                  clearable
                  disabled
                  :style="{ width: width }"
                  v-if="level == 0"
                >
                  <el-option
                    v-for="user in userOptions"
                    :key="user.userId"
                    :label="user.nickName"
                    :value="user.userId"
                  ></el-option>
                </el-select>
                <span v-else>{{form.repairByName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="报修内容" prop="repairDescription">
                <el-input
                  v-model="form.repairDescription"
                  type="textarea"
                  placeholder="请输入报修内容"
                  clearable
                  v-if="level == 0"
                />
                <span v-else>{{form.repairDescription}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left" v-if="level != 0">受理分派</el-divider>
          <el-row v-if="level != 0">
            <el-col :span="12">
              <el-form-item label="指派班组" prop="teamId">
                <!-- <treeselect
                  v-model="form.teamId"
                  :options="teamOptions"
                  placeholder="请指派班组"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 1"
                />-->
                <el-cascader
                  v-model="form.teamId"
                  :options="teamOptions"
                  :props="cascaderProps"
                  placeholder="请指派班组"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 1"
                ></el-cascader>
                <span v-else-if="level ==2 || level == 3">{{form.teamName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="level != 0">
            <el-col :span="12">
              <el-form-item label="维修负责人" prop="staffId">
                <el-select
                  v-model="form.staffId"
                  filterable
                  placeholder="请选择维修负责人"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 1"
                >
                  <el-option
                    v-for="staff in staffOptions"
                    :key="staff.userId"
                    :label="staff.userName"
                    :value="staff.userId"
                  ></el-option>
                </el-select>
                <span v-else-if="level == 2 || level == 3">{{form.staffName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修人员" prop="staffIds">
                <el-select
                  v-model="form.staffIds"
                  filterable
                  placeholder="请选择维修人员"
                  clearable
                  multiple
                  :style="{ width: width }"
                  v-if="level == 1"
                >
                  <el-option
                    v-for="staff in staffOptions"
                    :key="staff.staffId"
                    :label="staff.userName"
                    :value="staff.staffId"
                  ></el-option>
                </el-select>
                <span v-else-if="level ==2 || level == 3">{{form.staffsName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="level != 0">
            <el-col :span="12">
              <el-form-item label="要求完成时间" prop="requireTime">
                <el-date-picker
                  v-model="form.requireTime"
                  type="datetime"
                  placeholder="请选择要求完成时间"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 1"
                ></el-date-picker>
                <span v-else>{{parseTime(form.requireTime)}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left" v-if="level > 1">维修结果</el-divider>
          <el-row v-if="level > 1">
            <el-col :span="12">
              <el-form-item label="维修完成时间" prop="finishTime">
                <el-date-picker
                  v-model="form.finishTime"
                  type="datetime"
                  placeholder="请选择维修完成时间"
                  clearable
                  :style="{ width: width }"
                  v-if="level == 2"
                ></el-date-picker>
                <span v-else>{{parseTime(form.finishTime)}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="level > 1">
            <el-col :span="24">
              <el-form-item label="维修结果" prop="finishDescription">
                <el-input
                  v-model="form.finishDescription"
                  type="textarea"
                  placeholder="请输入维修结果"
                  clearable
                  v-if="level == 2"
                />
                <span v-else>{{form.finishDescription}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left" v-if="level > 2">用户评价</el-divider>
          <el-row v-if="level > 2">
            <el-col :span="24">
              <el-form-item label="服务态度评价" prop="serviceEvaluation">
                <el-rate v-model="form.serviceEvaluation" show-text></el-rate>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="level > 2">
            <el-col :span="24">
              <el-form-item label="维修质量评价" prop="repairEvaluation">
                <el-rate v-model="form.repairEvaluation" show-text></el-rate>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="level > 2">
            <el-col :span="24">
              <el-form-item label="意见建议" prop="repairOpinion">
                <el-input
                  v-model="form.repairOpinion"
                  type="textarea"
                  placeholder="请输入意见建议"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCard,
  getCard,
  delCard,
  addCard,
  updateCard,
  exportCard,
} from "@/api/repair/card";
import { treeListClass, getClass } from "@/api/repair/class";
import { treeListArea } from "@/api/equipment/area";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import { listUser, getUserProfile } from "@/api/system/user";
import { treeListTeam } from "@/api/equipment/team";
import { listStaffAll } from "@/api/equipment/staff";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ReCard",
  components: { Treeselect },
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
      // 维修工单表格数据
      cardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //（0：新增/修改 1：受理分派 2：维修结果 3：用户评价）
      level: 0,
      //紧急程度
      repairEmergencyOptions: [],
      //维修来源
      repairOriginOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        repairCode: undefined,
      },
      // 日期范围
      dateRangeRepairTime: [],
      //设备分类列表
      reclassOptions: [],
      //区域列表
      areaOptions: [],
      //部门列表
      deptOptions: undefined,
      // 人员列表
      userOptions: undefined,
      // 班组列表
      teamOptions: [],
      // 人员列表
      staffOptions: undefined,
      // 当前用户
      user: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reclassId: [
          { required: true, message: "请选择维修分类", trigger: "blur" },
        ],
        repairEmergency: [
          { required: true, message: "请选择紧急程度", trigger: "blur" },
        ],
        repairContacts: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        repairPhone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" },
        ],
        repairOrigin: [
          { required: true, message: "请选择维修来源", trigger: "blur" },
        ],
        repairTime: [
          { required: true, message: "请选择报修时间", trigger: "blur" },
        ],
        repairDept: [
          { required: true, message: "请选择保修部门", trigger: "blur" },
        ],
        repairBy: [
          { required: true, message: "请选择报修人", trigger: "blur" },
        ],
        repairArea: [
          { required: true, message: "请选择保修区域", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("repair_emergency_type").then((response) => {
      this.repairEmergencyOptions = response.data;
    });
    this.getDicts("repair_origin_type").then((response) => {
      this.repairOriginOptions = response.data;
    });
    this.getClassList();
    this.getAreaList();
    this.getDeptList();
    this.getUserList();
    this.getTeamList();
  },
  watch: {
    "form.reclassId": "selectReclass",
    "form.teamId": "selectTeam",
  },
  methods: {
    /** 查询维修工单列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRanges(
        this.queryParams,
        this.dateRangeRepairTime
      );
      listCard(param).then((response) => {
        this.cardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    addDateRanges(params, repairTimes) {
      var search = params;
      search.beginRepairTime = "";
      search.endRepairTime = "";
      if (null != repairTimes && "" != repairTimes) {
        search.beginRepairTime = repairTimes[0];
        search.endRepairTime = repairTimes[1];
      }
      return search;
    },
    repairEmergencyFormat(row, column) {
      return this.selectDictLabel(
        this.repairEmergencyOptions,
        row.repairEmergency
      );
    },
    repairOriginFormat(row, column) {
      return this.selectDictLabel(this.repairOriginOptions, row.repairOrigin);
    },
    getRepairEmergency(value) {
      return this.selectDictLabel(this.repairEmergencyOptions, value);
    },
    getRepairOrigin(value) {
      return this.selectDictLabel(this.repairOriginOptions, value);
    },
    //获取分类列表
    getClassList() {
      treeListClass().then((response) => {
        this.reclassOptions = [];
        this.reclassOptions = response.data;
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.reclassOptions.push(data);
      });
    },
    //获取区域列表
    getAreaList() {
      treeListArea().then((response) => {
        this.areaOptions = [];
        this.areaOptions = response.data;
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.areaOptions.push(data);
      });
    },
    //获取部门列表
    getDeptList() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    //获取用户列表
    getUserList() {
      listUser().then((response) => {
        this.userOptions = response.rows;
      });
    },
    //获取班组列表
    getTeamList() {
      treeListTeam({ teamId: this.repairTeamId }).then((response) => {
        this.teamOptions = [];
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.teamOptions.push(data);
        this.teamOptions = response.data;
      });
    },
    selectReclass(val) {
      if (val) {
        // console.log('selectReclass', val)
        getClass(val).then((response) => {
          let { emergency, teamId } = response.data;
          //console.log("emergency", emergency);
          //console.log("teamId", teamId);
          if (emergency && teamId) {
            this.form.repairEmergency = emergency;
            this.form.teamId = teamId;
          }
        });
      }
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
        repairId: undefined,
        repairGuid: undefined,
        repairCode: undefined,
        reclassId: undefined,
        repairEmergency: "",
        repairContacts: undefined,
        repairPhone: undefined,
        repairOrigin: undefined,
        repairTime: undefined,
        repairDept: undefined,
        repairBy: this.$store.state.user.name,
        repairArea: undefined,
        repairDescription: undefined,
        equIds: undefined,
        teamId: undefined,
        staffId: undefined,
        staffIds: undefined,
        requireTime: undefined,
        finishTime: undefined,
        finishDescription: undefined,
        serEvaluation: undefined,
        repEvaluation: undefined,
        serOpinion: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
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
      this.dateRangeRepairTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.repairId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUserProfile().then((response) => {
        this.user = response.data;
        this.form.repairDept = response.data.deptId;
        this.form.repairBy = response.data.userId;
        this.open = true;
        this.title = "添加维修工单";
        this.level = 0;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const repairId = row.repairId || this.ids;
      getCard(repairId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改维修工单";
        this.level = 0;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.repairId != undefined) {
            updateCard(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCard(this.form).then((response) => {
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
      const repairIds = row.repairId || this.ids;
      this.$confirm(
        '是否确认删除维修工单编号为"' + row.repairCode + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCard(repairIds);
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
      this.$confirm("是否确认导出所有维修工单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCard(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    //受理分派
    handleAccept(row) {
      this.reset();
      const repairId = row.repairId || this.ids;
      getCard(repairId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "受理分派";
        this.level = 1;
      });
    },
    //维修结果
    handleFinish(row) {
      this.reset();
      const repairId = row.repairId || this.ids;
      getCard(repairId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "维修结果";
        this.level = 2;
      });
    },
    //用户评价
    handleEvaluate(row) {
      this.reset();
      const repairId = row.repairId || this.ids;
      getCard(repairId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "用户评价";
        this.level = 3;
      });
    },
  },
};
</script>