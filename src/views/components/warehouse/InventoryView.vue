<template>
  <div>

    <el-form ref="form" label-width="98px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="盘点编号：">{{viewData.inventoryCode}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="盘点人：">{{viewData.inventoryName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="盘点仓库：">{{viewData.roomName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盘点时间：">{{parseTime(viewData.inventoryDate)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">{{viewData.remark}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">盘点明细</el-divider>
    <el-table :data="viewData.details" height="320px" ref="detailsTable">
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="备品备件名称" align="left" width="170" prop="spName" />
      <el-table-column label="备品备件编码" align="left" width="170" prop="spCode" />
      <el-table-column label="规格" align="left" width="150" prop="spSpec" />
      <el-table-column label="型号" align="left" width="150" prop="spType" />
      <el-table-column label="单位" align="left" width="70" prop="spUnit" />
      <el-table-column label="原数量" align="center" width="150" prop="quantity" />
      <el-table-column label="盘点数量" align="center" width="150" prop="amount" />
      <el-table-column label="盈亏数量" align="center" width="100" prop="difference" />
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
  created() {},
  methods: {},
};
</script>