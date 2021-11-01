<template>
  <el-dialog
    width="65%"
    title="选择用户"
    :visible.sync="isVisiable"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" clearable />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          placeholder="请选择所属部门"
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
      :data="userList"
      @selection-change="handleSelectionChange"
      height="500px"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名称" align="left" prop="userName" />
      <el-table-column label="用户昵称" align="left" prop="nickName" />
      <el-table-column label="所属部门" align="left" prop="dept.deptName" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getUserList"
    />
  </el-dialog>
</template>

<script>
import { treeselect as treeListDept } from "@/api/system/dept";
import { listUserNoPermi as listUser } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {
    isVisiable: {
      type: Boolean,
      default: false,
      require: true,
    },
    selectData: {
      type: Object,
      default: () => ({}),
    },
    selectNum: {
      type: String,
      default: "multiple",
    },
  },
  components: { Treeselect },
  data() {
    return {
      //
      loading: false,
      //
      total: 0,
      //
      deptOptions: [],
      //
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        spCode: undefined,
        spName: undefined,
        whclassId: undefined,
      },
      //
      userList: [],
      //
      chooseUserList: [],
      //
      chooseUser: {
        userIds: undefined,
        userNames: undefined,
      },
    };
  },
  created() {
    this.getDeptTreeList();
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getDeptTreeList() {
      treeListDept().then((response) => {
        this.deptOptions = [];
        this.deptOptions = response.data;
      });
    },
    getUserList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getUserList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.chooseUserList = selection;
      this.chooseUser.userIds = selection
        .map((item) => item.userName)
        .toString();
      this.chooseUser.userNames = selection
        .map((item) => item.nickName)
        .toString();
    },
    submit() {
      if (this.chooseUser) {
        if (this.selectNum != "multiple" && this.chooseUserList.length > 1) {
          this.msgError("只能选择一个用户！");
        } else {
          this.$emit("chooseUser", this.chooseUser);
          this.modalClose();
        }
      }
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isVisiable", false); // 直接修改父组件的属性
    },
  },
};
</script>