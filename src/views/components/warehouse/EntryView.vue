<template>
  <div>
    <el-form ref="form" label-width="98px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="入库编号：">{{viewData.entryCode}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="入库来源：">{{ sourceFormat(viewData.entrySource) }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="入库仓库：">{{viewData.roomName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库时间：">{{ parseTime(viewData.entryDate) }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="采购人：">{{viewData.purchaseName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验收人：">{{viewData.checkName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商：">{{viewData.supName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票号：">{{viewData.entryInvoice}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">{{viewData.remark}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">入库明细</el-divider>
    <el-table :data="viewData.details" height="320px" ref="detailsTable">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="备品备件名称" align="left" width="170" prop="spName" />
      <el-table-column label="备品备件编码" align="left" width="170" prop="spCode" />
      <el-table-column label="规格" align="left" width="150" prop="spSpec" />
      <el-table-column label="型号" align="left" width="150" prop="spType" />
      <el-table-column label="单位" align="left" width="70" prop="spUnit" />
      <el-table-column label="数量" align="center" width="150" prop="amount" />
      <el-table-column label="单价(元)" align="center" width="150" prop="sprice" />
      <el-table-column label="总价(元)" align="center" width="150" prop="price" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    viewData: Object,
    require: true,
  },
  data() {
    return {
      sourceOptions: [],
    };
  },
  created() {
    this.getDicts("entry_source_type").then((response) => {
      this.sourceOptions = response.data;
    });
  },
  methods: {
    // 字典翻译
    sourceFormat(value) {
      return this.selectDictLabel(this.sourceOptions, value);
    },
  },
};
</script>