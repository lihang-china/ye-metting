<template>
  <el-dialog
    width="70%"
    :title="title"
    :visible.sync="isShow"
    :before-close="modalClose"
    :close-on-click-modal="false"
  >
    <el-row :gutter="20">
      <el-col :span="11">
        <div class="tranTitle">巡检设备</div>
        <el-table
          v-loading="equLoading"
          :data="equList"
          width="100%"
          height="560px"
          @row-click="handle"
        >
          <el-table-column label="序号" align="center" type="index" fixed="left" width="50" />
          <el-table-column label="设备巡检设备" align="left" fixed="left" width="300">
            <template slot-scope="scope">
              <span>{{scope.row.equName}}({{scope.row.equCode}})</span>
            </template>
          </el-table-column>
          <el-table-column label="所在区域 " align="center" prop="areaName" width="200" />
          <el-table-column label="设备分类" align="center" prop="className" width="200" />
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical" class="viewDividerVertical"></el-divider>
      </el-col>
      <el-col :span="12">
        <div class="tranTitle">{{equName}}巡检项</div>
        <el-table v-loading="itemLoading" :data="itemList" width="100%" height="560px">
          <el-table-column label="序号" type="index" align="center" fixed="left" width="60" />
          <el-table-column label="巡检项" align="center" prop="pitemName" fixed="left" width="200" />
          <el-table-column
            label="巡检结果类型"
            align="center"
            prop="resultType"
            :formatter="resultTypeFormat"
            width="150"
          />
          <el-table-column
            label="结果选项"
            align="center"
            prop="resultOption"
            width="300"
            show-overflow-tooltip
          />
          <el-table-column
            label="结果标准"
            align="center"
            prop="resultStandard"
            width="200"
            show-overflow-tooltip
          />
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { listByParea as listItemByParea } from "@/api/patrol/item";
import { listByParea as listEquByParea } from "@/api/equipment/card";

export default {
  props: {
    title: {
      type: String,
      default: "巡检设备",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    pareaId: Number,
    equId: {
      type: Number,
      default: -1,
    },
    require: true,
  },
  data() {
    return {
      equLoading: false,
      equList: [],
      itemLoading: false,
      itemList: [],
      resultTypeOptions: [],
      // 总条数
      total: 0, // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pareaId: undefined,
      },
      //
      equName: undefined,
    };
  },
  created() {
    this.getDicts("item_result_type").then((response) => {
      this.resultTypeOptions = response.data;
    });
    this.getList();
  },
  mounted() {},
  methods: {
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isShow", false); // 直接修改父组件的属性
    },
    resultTypeFormat(row, column) {
      return this.selectDictLabel(this.resultTypeOptions, row.resultType);
    },
    getList() {
      this.equLoading = true;
      this.queryParams.pareaId = this.pareaId;
      listEquByParea(this.queryParams).then((response) => {
        this.equList = response.rows;
        this.total = response.total;
        this.equLoading = false;
      });
    },
    getItemList(pareaId, equId) {
      this.itemLoading = true;
      listItemByParea(pareaId, equId).then((response) => {
        this.itemList = response.data;
        this.itemLoading = false;
      });
    },
    handle(row, event, column) {
      this.equName = row.equName + "(" + row.equCode + ") - ";
      this.getItemList(this.pareaId, row.equId);
    },
  },
};
</script>

<style>
.viewDividerVertical {
  display: inline-block;
  width: 1px;
  height: 600px;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}
.tranTitle {
  margin: 10px;
  color: #303133;
}
</style>