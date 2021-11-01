<template>
  <div>
    <el-form ref="form" :model="form" v-loading="loading" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同编号:" prop="conCode">
            <span>{{ form.conCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称:" prop="conName">
            <span>{{ form.conName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同金额(万元):" prop="conAmount">
            <span>{{ form.conAmount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签订日期:" prop="conTime">
            <span>{{ parseTime(form.conTime, "{y}-{m}-{d}") }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同甲方:" prop="conFirst">
            <span>{{ form.conFirst }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="甲方联系人:" prop="firstContacts">
            <span>{{ form.firstContacts }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="甲方联系方式:" prop="firstPhone">
            <span>{{ form.firstPhone }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同乙方:" prop="conSecond">
            <span>{{ form.conSecond }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="乙方联系人:" prop="secondContacts">
            <span>{{ form.secondContacts }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乙方联系方式:" prop="secondPhone">
            <span>{{ form.secondPhone }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <span>{{ form.remark }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getContract } from "@/api/equipment/contract";

export default {
  name: "ContractFormView",
  props: {
    //合同Id
    contractId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      // 合同
      form: {},
      // 加载状态
      loading: true,
    };
  },
  created(){
    this.init();
  },
  methods: {
    // 初始化合同
    init() {
      //this.reset_contract();
      this.loading = true;
      getContract(this.contractId).then((response) => {
        this.form = response.data;
        this.loading = false;
      });
    },
    // 表单重置
    reset_contract() {
      this.form = {
        conCode: undefined,
        conName: undefined,
        conAmount: undefined,
        conTime: undefined,
        conFirst: undefined,
        firstContacts: undefined,
        firstPhone: undefined,
        conSecond: undefined,
        secondContacts: undefined,
        secondPhone: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
      };
      this.resetForm("form");
    },
  },
};
</script>