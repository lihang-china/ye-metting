<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="设备编号" prop="equCode">
        <el-input
          v-model="queryParams.equCode"
          placeholder="请输入设备编号"
          clearable
          size="medium"
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equName">
        <el-input
          v-model="queryParams.equName"
          placeholder="请输入设备名称"
          clearable
          size="medium"
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="设备分类" prop="classId">
        <treeselect
          v-model="queryParams.classId"
          :options="classOptions"
          placeholder="请选择设备分类"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="所在区域 " prop="areaId">
        <treeselect
          v-model="queryParams.areaId"
          :options="areaOptions"
          placeholder="请选择设备所在区域"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="合同" prop="contractId">
        <el-select
          v-model="queryParams.contractId"
          filterable
          clearable
          placeholder="请选择合同"
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="contract in contractOptions"
            :key="contract.conId"
            :label="contract.conName"
            :value="contract.conId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model="queryParams.supplierId"
          filterable
          clearable
          placeholder="请选择设备供应商"
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="supplier in supplierOptions"
            :key="supplier.supId"
            :label="supplier.supName"
            :value="supplier.supId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          placeholder="请选择所属部门"
          clearable
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="设备管理员" prop="equAdmin">
        <el-select
          v-model="queryParams.equAdmin"
          filterable
          placeholder="请选择设备管理员"
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
      <el-form-item label="采购时间">
        <el-date-picker
          v-model="dateRangeEquTime"
          size="medium"
          :style="{ width: width }"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="使用年限" prop="equYear">
        <el-input-number
          v-model="queryParams.equYear"
          placeholder="请输入设备使用年限"
          size="medium"
          :style="{ width: width }"
        />
      </el-form-item>
      <el-form-item label="是否特种设备" prop="equAttribute">
        <el-select
          v-model="queryParams.equAttribute"
          filterable
          clearable
          placeholder="请选择是否特种设备"
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="dict in sysYesNoOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要保养" prop="equMaintain">
        <el-select
          v-model="queryParams.equMaintain"
          filterable
          clearable
          placeholder="请选择是否需要保养"
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="dict in sysYesNoOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用状态" prop="equStatus">
        <el-select
          v-model="queryParams.equStatus"
          filterable
          clearable
          placeholder="请选择设备使用状态"
          size="medium"
          :style="{ width: width }"
        >
          <el-option
            v-for="dict in equStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRangeCreateTime"
          size="medium"
          :style="{ width: width }"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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

    <el-table v-loading="loading" :data="cardList" style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column
        label="设备编号"
        align="center"
        prop="equCode"
        width="250"
      />
      <el-table-column
        label="设备名称"
        align="center"
        prop="equName"
        width="250"
      />
      <el-table-column
        label="设备分类"
        align="center"
        prop="className"
        width="250"
      />
      <el-table-column
        label="所在区域"
        align="center"
        prop="areaName"
        width="250"
      />
      <el-table-column
        label="合同"
        align="center"
        prop="contractName"
        width="200"
      />
      <el-table-column
        label="供应商"
        align="center"
        prop="supplierName"
        width="300"
      />
      <el-table-column
        label="所属部门"
        align="center"
        prop="deptName"
        width="250"
      />
      <el-table-column
        label="设备管理员"
        align="center"
        prop="adminName"
        width="200"
      />
      <el-table-column
        label="采购时间"
        align="center"
        prop="equTime"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.equTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="使用年限"
        align="center"
        prop="equYear"
        width="100"
      />
      <el-table-column
        label="特种设备"
        align="center"
        prop="equAttribute"
        :formatter="sysYesNoFormat"
        width="100"
      />
      <el-table-column
        label="需要保养"
        align="center"
        prop="equMaintain"
        :formatter="sysYesNoFormat"
        width="100"
      />
      <el-table-column
        label="能耗设备"
        align="center"
        prop="equEnergy"
        :formatter="sysYesNoFormat"
        width="100"
      />
      <el-table-column
        label="设备使用状态 "
        align="center"
        prop="equStatus"
        :formatter="equStatusFormat"
        width="100"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="200"
      >
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
            @click="handleView(scope.row)"
            >查看</el-button
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

    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      :close-on-click-modal="false"
    >
      <div style="height: 560px; overflow: auto">
        <el-tabs v-model="activeName">
          <el-tab-pane label="设备信息" name="first">
            <EquipmentFormView :equId="equId" v-if="equId" />
          </el-tab-pane>
          <el-tab-pane label="合同信息" name="second">
            <ContractFormView :contractId="contractId" v-if="contractId" />
          </el-tab-pane>
          <el-tab-pane label="供应商信息" name="third">
            <SupplierFormView :supplierId="supplierId" v-if="supplierId" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCard } from "@/api/equipment/card";
import { treeListClass } from "@/api/equipment/class";
import { treeListArea } from "@/api/equipment/area";
import { listContractAll } from "@/api/equipment/contract";
import { listSupplierAll } from "@/api/equipment/supplier";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import { listUserAll as listUser } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import importTableVue from "../../tool/gen/importTable.vue";

import EquipmentFormView from "@/views/components/equipment/EquipmentFormView";
import ContractFormView from "@/views/components/equipment/ContractFormView";
import SupplierFormView from "@/views/components/equipment/SupplierFormView";

export default {
  name: "Search",
  components: {
    Treeselect,
    EquipmentFormView,
    ContractFormView,
    SupplierFormView,
  },
  data() {
    return {
      // 统一宽度
      width: "270px",
      //默认选项卡
      activeName: "first",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 设备档案表格数据
      cardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设备使用状态 字典
      equStatusOptions: [],
      // 特种属性\保养属性\能耗属性 字典
      sysYesNoOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equCode: undefined,
        equName: undefined,
        classId: undefined,
        areaId: undefined,
        contractId: undefined,
        supplierId: undefined,
        deptId: undefined,
        equAdmin: undefined,
        equYear: undefined,
        equStatus: undefined,
        equAttribute: undefined,
        equMaintain: undefined,
      },
      // 日期范围
      dateRangeEquTime: [],
      // 日期范围
      dateRangeCreateTime: [],
      //设备分类列表
      classOptions: [],
      //区域列表
      areaOptions: [],
      //合同
      contractOptions: [],
      //供应商
      supplierOptions: [],
      //部门列表
      deptOptions: [],
      // 人员列表
      userOptions: [],
      // 表单参数
      form_equ: {},
      // 设备Id
      equId: undefined,
      // 合同Id
      contractId: undefined,
      // 供应商Id
      supplierId: undefined,
    };
  },
  created() {
    this.getList();
    this.getDicts("equ_status_type").then((response) => {
      this.equStatusOptions = response.data;
    });
    this.getDicts("sys_yes_no").then((response) => {
      this.sysYesNoOptions = response.data;
    });
    this.getClassList();
    this.getAreaList();
    this.getContractList();
    this.getSupplierList();
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    /** 查询设备档案列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRanges(
        this.queryParams,
        this.dateRangeEquTime,
        this.dateRangeCreateTime
      );
      listCard(param).then((response) => {
        this.cardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    addDateRanges(params, equTimes, createTimes) {
      var search = params;
      search.beginEquTime = "";
      search.endEquTime = "";
      search.beginTime = "";
      search.endTime = "";
      if (null != equTimes && "" != equTimes) {
        search.beginEquTime = equTimes[0];
        search.endEquTime = equTimes[1];
      }
      if (null != createTimes && "" != createTimes) {
        search.beginTime = createTimes[0];
        search.endTime = createTimes[1];
      }
      return search;
    },
    // 设备使用状态 字典翻译
    equStatusFormat(row, column) {
      return this.selectDictLabel(this.equStatusOptions, row.equStatus);
    },
    sysYesNoFormat(row, column, cellValue, index) {
      return this.selectDictLabel(this.sysYesNoOptions, cellValue);
    },
    //获取设备分类列表
    getClassList() {
      treeListClass().then((response) => {
        this.classOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.classOptions.push(data);
      });
    },
    //获取区域列表
    getAreaList() {
      treeListArea().then((response) => {
        this.areaOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.areaOptions.push(data);
      });
    },
    //合同
    getContractList() {
      listContractAll().then((response) => {
        this.contractOptions = response.rows;
      });
    },
    //供应商
    getSupplierList() {
      listSupplierAll().then((response) => {
        this.supplierOptions = response.rows;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.equId = undefined;
      this.supplierId = undefined;
      this.contractId = undefined;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRangeEquTime = [];
      this.dateRangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 设备查看 */
    handleView(row) {
      this.equId = undefined;
      this.supplierId = undefined;
      this.contractId = undefined;

      this.activeName = "first";
      this.open = true;

      this.equId = row.equId;
      this.supplierId = row.supplierId;
      this.contractId = row.contractId;
    },
  },
};
</script>