<template>
  <div>
    <el-form ref="form" :model="form" v-loading="loading" label-width="140px">
      <el-form-item label="统一社会信用代码:" prop="supCode">
        <span>{{ form.supCode }}</span>
      </el-form-item>
      <el-form-item label="企业名称:" prop="supName">
        <span>{{ form.supName }}</span>
      </el-form-item>
      <el-form-item label="法定代表人:" prop="supLeg">
        <span>{{ form.supLeg }}</span>
      </el-form-item>
      <el-form-item label="住所:" prop="supAdder">
        <span>{{ form.supAdder }}</span>
      </el-form-item>
      <el-form-item label="联系人:" prop="supContact">
        <span>{{ form.supContact }}</span>
      </el-form-item>
      <el-form-item label="联系方式:" prop="supPhone">
        <span>{{ form.supPhone }}</span>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <span>{{ getStatus(form.status) }}</span>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <span>{{ form.remark }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSupplier } from "@/api/equipment/supplier";

export default {
  name: "SupplierFormView",
  props: {
    //供应商Id
    supplierId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      // 供应商
      form: {},
      // 加载状态
      loading: true,
      // 供应商状态
      statusOptions: [],
    };
  },
  created() {
    this.getDicts("supplier_status_type").then((response) => {
      this.statusOptions = response.data;
    });
    this.init();
  },
  methods: {
    // 供应商状态
    getStatus(value) {
      return this.selectDictLabel(this.statusOptions, value);
    },
    // 初始化供应商
    init() {
      //this.reset_supplier();
      this.loading = true;
      getSupplier(this.supplierId).then((response) => {
        this.form = response.data;
        this.loading = false;
      });
    },
    // 表单重置
    reset_supplier() {
      this.form = {
        supCode: undefined,
        supName: undefined,
        supLeg: undefined,
        supAdder: undefined,
        supContact: undefined,
        supPhone: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
      };
      this.resetForm("form");
    },
  },
};
</script>