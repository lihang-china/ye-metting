<template>
  <div>
    <el-divider content-position="left">退库单</el-divider>
    <el-form ref="form" label-width="98px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="退库编号：">{{viewData.returnCode}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="退库人：">{{viewData.returnName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="退库仓库：">{{viewData.roomName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退库时间：">{{parseTime(viewData.returnDate)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">{{viewData.remark}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">退库明细</el-divider>
    <el-table :data="viewData.details" height="320px" ref="detailsTable">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="备品备件名称" align="left" width="200" prop="spName" />
      <el-table-column label="备品备件编码" align="left" width="200" prop="spCode" />
      <el-table-column label="规格" align="left" width="170" prop="spSpec" />
      <el-table-column label="型号" align="left" width="170" prop="spType" />
      <el-table-column label="单位" align="left" width="70" prop="spUnit" />
      <el-table-column label="数量" align="center" width="150" prop="amount" />
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
    return {};
  },
  created() {},
  methods: {},
};
</script>