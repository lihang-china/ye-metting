<template>
  <el-dialog
    width="60%"
    title="选择备品备件"
    :visible.sync="isShow"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="备品备件名称" prop="spName">
        <el-input v-model="queryParams.spName" placeholder="请输入备品备件名称" clearable />
      </el-form-item>
      <el-form-item label="备品备件编码" prop="spCode">
        <el-input v-model="queryParams.spCode" placeholder="请输入备品备件编码" clearable />
      </el-form-item>
      <el-form-item label="备品备件分类" prop="whclassId">
        <treeselect
          v-model="queryParams.whclassId"
          :options="classOptions"
          placeholder="请选择备品备件分类"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="el-icon-check" size="mini" @click="submit">确认</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="spList"
      highlight-current-row
      @current-change="handleCurrentChange"
      height="360px"
    >
      <el-table-column label="备品备件名称" align="center" prop="spName" />
      <el-table-column label="备品备件编码" align="center" prop="spCode" />
      <el-table-column label="备品备件分类" align="center" prop="whclassName" width="300" />
      <el-table-column label="单位" align="center" prop="spUnit" />
      <el-table-column
        v-if="selectData.type != 'sp'"
        :label="selectData.type==='room'? '当前库存' : '当前所有量'"
        align="center"
        prop="quantity"
      />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getSpList"
    />
  </el-dialog>
</template>

<script>
import { treeListClass } from "@/api/warehouse/class";
import { getListSp, getListSpRoom, getListSpUse } from "@/api/warehouse/sp";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    selectData: Object,
    require: true,
  },
  components: { Treeselect },
  data() {
    return {
      //
      loading: false,
      //
      total: 0,
      //
      classOptions: [],
      //
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        spCode: undefined,
        spName: undefined,
        whclassId: undefined,
      },
      //
      spList: [],
      //
      currentRow: undefined,
    };
  },
  created() {
    this.getTreeselect();
  },
  mounted() {
    this.getSpList();
  },
  methods: {
    getTreeselect() {
      treeListClass().then((response) => {
        this.classOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.classOptions.push(data);
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getSpList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleCurrentChange(row) {
      this.currentRow = row;
    },
    getSpList() {
      this.loading = true;
      if (this.selectData) {
        if (this.selectData.type === "use") {
          this.queryParams.useBy = this.selectData.useBy;
          this.queryParams.roomId = this.selectData.roomId;
          getListSpUse(this.queryParams).then((response) => {
            this.doLoadingList(response);
          });
        } else if (this.selectData.type === "room") {
          this.queryParams.roomId = this.selectData.roomId;
          getListSpRoom(this.queryParams).then((response) => {
            this.doLoadingList(response);
          });
        } else if (this.selectData.type === "sp") {
          getListSp(this.queryParams).then((response) => {
            this.doLoadingList(response);
          });
        }
      }
    },
    doLoadingList(response) {
      this.spList = response.rows;
      this.total = response.total;
      this.loading = false;
    },
    submit() {
      if (this.currentRow) {
        this.$emit("currentRow", this.currentRow);
        this.modalClose();
      }
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isShow", false); // 直接修改父组件的属性
    },
  },
};
</script>