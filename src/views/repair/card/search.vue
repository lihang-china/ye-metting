<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="维修单号" prop="repairCode">
        <el-input
          v-model="queryParams.repairCode"
          placeholder="请输入维修单号"
          clearable
          :style="{ width: width }"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="维修分类" prop="reclassId">
        <treeselect
          v-model="queryParams.reclassId"
          :options="reclassOptions"
          placeholder="请选择维修分类"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="紧急程度" prop="repairEmergency">
        <el-select
          v-model="queryParams.repairEmergency"
          filterable
          clearable
          placeholder="请选择紧急程度"
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="dict in repairEmergencyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维修来源" prop="repairOrigin">
        <el-select
          v-model="queryParams.repairOrigin"
          filterable
          clearable
          placeholder="请选择维修来源"
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="dict in repairOriginOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="repairContacts">
        <el-input
          v-model="queryParams.repairContacts"
          placeholder="请输入联系人"
          clearable
          :style="{ width: width }"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="repairPhone">
        <el-input
          v-model="queryParams.repairPhone"
          placeholder="请输入联系电话"
          clearable
          :style="{ width: width }"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="报修时间">
        <el-date-picker
          v-model="dateRangeRepairTime"
          size="medium"
          :style="{ width: width }"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报修区域" prop="repairArea">
        <treeselect
          v-model="queryParams.repairArea"
          :options="areaOptions"
          placeholder="请选择报修区域"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="报修部门" prop="repairDept">
        <treeselect
          v-model="queryParams.repairDept"
          :options="deptOptions"
          placeholder="请选择报修部门"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="报修人" prop="repairBy">
        <el-select
          v-model="queryParams.repairBy"
          filterable
          placeholder="请选择报修人"
          clearable
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="user in userOptions"
            :key="user.userId"
            :label="user.nickName"
            :value="user.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="cardList" style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="维修单号" align="center" prop="repairCode" width="250" />
      <el-table-column label="维修分类" align="center" prop="reclassName" width="300" />
      <el-table-column
        label="紧急程度"
        align="center"
        prop="repairEmergency"
        width="200"
        :formatter="repairEmergencyFormat"
      />
      <el-table-column
        label="维修来源"
        align="center"
        prop="repairOrigin"
        width="200"
        :formatter="repairOriginFormat"
      />
      <el-table-column label="联系人" align="center" prop="repairContacts" width="200" />
      <el-table-column label="联系电话" align="center" prop="repairPhone" width="200" />
      <el-table-column label="报修时间" align="center" prop="repairTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.repairTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报修区域" align="center" prop="areaName" width="300" />
      <el-table-column label="报修部门" align="center" prop="deptName" width="200" />
      <el-table-column label="报修人" align="center" prop="repairByName" width="200" />
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
            @click="handleView(scope.row.repairId)"
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

    <!-- 添加或修改维修工单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" :close-on-click-modal="false">
      <div style="height:420px; overflow: auto;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="报修单" name="first">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="维修单号:" prop="repairCode">
                    <span>{{ form.repairCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="维修分类:" prop="reclassName">
                    <span>{{ form.reclassName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="紧急程度:" prop="repairEmergency">
                    <span>{{ getRepairEmergency(form.repairEmergency) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="维修来源:" prop="repairOrigin">
                    <span>{{ getRepairOrigin(form.repairOrigin) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人:" prop="repairContacts">
                    <span>{{ form.repairContacts }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话:" prop="repairPhone">
                    <span>{{ form.repairPhone }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="报修时间:" prop="repairTime">
                    <span>{{ parseTime(form.repairTime) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报修区域:" prop="areaName">
                    <span>{{ form.areaName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="报修部门:" prop="deptName">
                    <span>{{ form.deptName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报修人:" prop="repairByName">
                    <span>{{ form.repairByName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="报修内容:" prop="repairDescription">
                    <span>{{ form.repairDescription }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="受理分派" name="second">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="指派班组:" prop="teamName">
                    <span>{{ form.teamName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="维修负责人:" prop="staffName">
                    <span>{{ form.staffName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="维修人员:" prop="staffsName">
                    <span>{{ form.staffsName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预计完成时间:" prop="requireTime">
                    <span>{{ parseTime(form.requireTime) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="维修" name="third">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="完成时间:" prop="finishTime">
                    <span>{{ parseTime(form.finishTime) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="维修说明:" prop="finishDescription">
                    <span>{{ form.finishDescription }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="评价" name="fouth">
            <el-form ref="form" :model="form" label-width="120px">
              <el-col :span="24">
                <el-form-item label="服务态度评价:" prop="serviceEvaluation">
                  <el-rate v-model="form.serviceEvaluation" allow-half disabled show-text></el-rate>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="维修质量评价:" prop="repairEvaluation">
                  <el-rate v-model="form.repairEvaluation" allow-half disabled show-text></el-rate>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="意见建议:" prop="repairOpinion">
                  <span>{{ form.repairOpinion }}</span>
                </el-form-item>
              </el-col>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCard, getCard } from "@/api/repair/card";
import { treeListClass } from "@/api/repair/class";
import { treeListArea } from "@/api/equipment/area";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import { listUserAll as listUser } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ReSearch",
  components: { Treeselect },
  data() {
    return {
      //统一宽度
      width: "270px",
      //默认选项卡
      activeName: "first",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 维修工单表格数据
      cardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //紧急程度
      repairEmergencyOptions: [],
      //维修来源
      repairOriginOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        repairCode: undefined,
        reclassId: undefined,
        repairEmergency: undefined,
        repairContacts: undefined,
        repairPhone: undefined,
        repairOrigin: undefined,
        repairDept: undefined,
        repairBy: undefined,
        repairArea: undefined
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
      // 表单参数
      form: {}
    };
  },
  created() {
    this.getList();
    this.getDicts("repair_emergency_type").then(response => {
      this.repairEmergencyOptions = response.data;
    });
    this.getDicts("repair_origin_type").then(response => {
      this.repairOriginOptions = response.data;
    });
    this.getClassList();
    this.getAreaList();
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    /** 查询维修工单列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRanges(
        this.queryParams,
        this.dateRangeRepairTime
      );
      listCard(param).then(response => {
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
      treeListClass().then(response => {
        this.reclassOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.reclassOptions.push(data);
      });
    },
    //获取区域列表
    getAreaList() {
      treeListArea().then(response => {
        this.areaOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.areaOptions.push(data);
      });
    },
    //获取部门列表
    getDeptList() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    //获取用户列表
    getUserList() {
      listUser().then(response => {
        this.userOptions = response.rows;
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
        repairId: undefined,
        repairGuid: undefined,
        repairCode: undefined,
        reclassId: undefined,
        reclassName: undefined,
        repairEmergency: undefined,
        repairContacts: undefined,
        repairPhone: undefined,
        repairOrigin: undefined,
        repairTime: undefined,
        repairDept: undefined,
        deptName: undefined,
        repairBy: undefined,
        repairByName: undefined,
        repairArea: undefined,
        areaName: undefined,
        repairDescription: undefined,
        equIds: undefined,
        teamId: undefined,
        teamName: undefined,
        staffId: undefined,
        staffName: undefined,
        staffIds: undefined,
        staffsName: undefined,
        requireTime: undefined,
        finishTime: undefined,
        finishDescription: undefined,
        serviceEvaluation: undefined,
        repairEvaluation: undefined,
        repairOpinion: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
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
    /** 维修查看 */
    handleView(repairId) {
      this.reset();
      this.activeName = "first";
      getCard(repairId).then(response => {
        this.form = response.data;
        this.title = "查看";
        this.open = true;
      });
    }
  }
};
</script>