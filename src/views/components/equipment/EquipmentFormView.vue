<template>
  <el-form ref="form" :model="form" v-loading="loading" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备编号:" prop="equCode">
          <span>{{ form.equCode }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备名称:" prop="equName">
          <span>{{ form.equName }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备分类:" prop="className">
          <span>{{ form.className }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在区域:" prop="areaName">
          <span>{{ form.areaName }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="合同:" prop="contractName">
          <span>{{ form.contractName }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="供应商:" prop="supplierName">
          <span>{{ form.supplierName }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="所属部门:" prop="deptName">
          <span>{{ form.deptName }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备管理员:" prop="adminName">
          <span>{{ form.adminName }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备采购时间:" prop="equTime">
          <span>{{ parseTime(form.equTime, "{y}-{m}-{d}") }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备使用年限:" prop="equYear">
          <span>{{ form.equYear }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备使用状态:" prop="equStatus">
          <span>{{ getEquStatus(form.equStatus) }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否特种设备:" prop="equAttribute">
          <span>{{ form.equYear == "Y" ? "是" : "否" }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="是否需要保养:" prop="equMaintain">
          <span>{{ form.equYear == "Y" ? "是" : "否" }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否能耗设备:" prop="equEnergy">
          <span>{{ form.equEnergy == "Y" ? "是" : "否" }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注:">
          <span>{{ form.remark }}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>


<script>
import { getCard, getCardByCode } from "@/api/equipment/card";

export default {
  name: "EquipmentFormView",
  props: {
    // 设备Id
    equId: {
      type: Number,
      default: undefined,
    },
    // 设备编号
    equCode: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      // 设备
      form: {},
      // 加载状态
      loading: true,
      // 设备使用状态
      equStatusOptions: [],
      // 设备特种、保养、能耗属性
      sysYesNoOptions: [],
    };
  },
  created() {
    this.getDicts("equ_status_type").then((response) => {
      this.equStatusOptions = response.data;
    });
    this.getDicts("sys_yes_no").then((response) => {
      this.sysYesNoOptions = response.data;
    });
    this.init();
  },
  methods: {
    // 设备使用状态
    getEquStatus(value) {
      return this.selectDictLabel(this.equStatusOptions, value);
    },
    // 特种、保养、能耗属性
    getSysYseNo(value) {
      return this.selectDictLabel(this.sysYesNoOptions, value);
    },
    // 初始化设备
    init() {
      // this.reset_equ();
      this.loading = true;

      if (this.equId) {
        getCard(this.equId).then((res) => {
          this.initData(res.data);
        });
      }

      if (this.equCode) {
        getCardByCode(this.equCode).then((res) => {
          this.initData(res.data);
        });
      }
    },
    initData(data) {
      this.form = { ...data };
      this.loading = false;
    },
    // 表单重置
    reset_equ() {
      this.form = {
        equCode: undefined,
        equName: undefined,
        className: undefined,
        areaName: undefined,
        contractName: undefined,
        supplierName: undefined,
        deptName: undefined,
        adminName: undefined,
        equTime: undefined,
        equYear: undefined,
        equStatus: undefined,
        equAttribute: undefined,
        equMaintain: undefined,
        equEnergy: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
      };
      this.resetForm("form");
    },
  },
};
</script>