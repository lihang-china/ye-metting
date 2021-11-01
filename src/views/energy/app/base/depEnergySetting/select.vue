<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    width="50%"
  >
    <div class="top-view">
      <div class="item-view">
        <a>设备编号</a>
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入你要搜索的设备编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </div>
      <div class="item-view">
        <a>设备名称</a>
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入你要搜索的设备名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </div>
      <div class="item-view">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备编码" align="center" prop="deviceCode" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="规格型号" align="center" prop="deviceSpec" />
      <el-table-column label="设备类别" align="center" prop="categoryName" />
      <el-table-column label="安装位置" align="center" prop="areaName" />
      <el-table-column
        label="使用部门"
        align="center"
        prop="useDepartmentName"
      />
      <el-table-column
        label="管理部门"
        align="center"
        prop="manageDepartmentName"
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      style="background: none"
      @pagination="getList"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" style="color: #000000">取 消</el-button>
      <el-button type="primary" @click="submitForm" style="color: white"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
//import { listDevice } from "@/api/device/device";
import { listCard } from "@/api/equipment/card";

export default {
  name: "EnergyCostAccounting",
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceCode: undefined,
        deviceName: undefined,
        deviceSpec: undefined,
        categoryId: undefined,
        areaId: undefined,
        areaName: undefined,
        useDepartmentId: undefined,
        manageDepartmentId: undefined,
      },
      total: 0,
      dialog: false,
      form: {},
      list: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      loading: false,
    };
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    getList() {
      this.loading = true;
      // listDevice(this.queryParams).then(response => {
      //   this.list = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
      listCard(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    submitForm() {
      console.log(this.ids);
      this.cancel();
      // this.$parent.data = [];
      // this.$parent.initData();
    },
    cancel() {
      this.dialog = false;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/common.scss";

.top-view {
  width: 100%;
  padding: rem(15) rem(12);
  display: flex;
  align-items: center;
  background: rgba(1, 68, 144, 0.5);
  margin-bottom: rem(11);
  .item-view {
    display: flex;
    align-items: center;
    margin-left: rem(36);
    &:first-child {
      margin-left: 0;
    }
    a {
      font-size: rem(14);
      font-weight: 400;
      color: #cfdce6;
      margin-right: rem(24);
    }
    .input {
      width: rem(300);
    }
  }
}
.el-form-item__label {
  color: white;
}
.el-dialog__header {
  background: #01428b;
}
.el-dialog__body {
  background: #01428b;
}
.el-dialog__footer {
  background: #01428b;
}

.title {
  border-left: 2px solid #1890ff;
  padding-left: 5px;
  color: black;
}
.row {
  display: flex;
  align-items: center;
  // margin-bottom: 20px;
  min-height: 60px;
  .content-left {
    text-align: right;
  }
  .content-right {
    text-align: left;
  }
}
.image-block {
  padding-top: 30px;
  padding-left: auto;
  text-align: center;
  border-right: 1px solid #eff2f6;
  display: inline-block;
  width: 45%;
  box-sizing: border-box;
  vertical-align: top;
}
</style>
