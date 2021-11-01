<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="设备模板名称" prop="templetName">
        <el-input v-model="queryParams.templetName" placeholder="请输入设备模板名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="设备模板编码" prop="templetCode">
        <el-input v-model="queryParams.templetCode" placeholder="请输入设备模板编码" clearable size="small" />
      </el-form-item>

      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button class="filter-item" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:templet:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="templetList"
      row-key="templetId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="设备模板名称" align="center" prop="templetName" />
      <el-table-column label="设备模板编码" align="center" prop="templetCode" />
      <el-table-column label="全称" align="left" prop="fullName" />
      <el-table-column label="排序号" align="center" prop="orderNum" />
      <el-table-column label="绑定设备数" align="center" prop="equCount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:templet:edit']"
            v-if="scope.row.equCount == 0"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['equipment:templet:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:templet:remove']"
            v-if="scope.row.equCount == 0"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click="handleChannels(scope.row)"
          >位号管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改设备模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="上级模板" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="templetOptions"
            :normalizer="normalizer"
            placeholder="上级模板"
          />
        </el-form-item>
        <el-form-item label="设备模板名称" prop="templetName">
          <el-input v-model="form.templetName" placeholder="请输入设备模板名称" />
        </el-form-item>
        <el-form-item label="设备模板编码" prop="templetCode">
          <el-input v-model="form.templetCode" placeholder="请输入设备模板编码" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTemplet,
  getTemplet,
  delTemplet,
  addTemplet,
  updateTemplet,
  exportTemplet,
} from "@/api/equipment/templet";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Templet",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 设备模板表格数据
      templetList: [],
      // 设备模板树选项
      templetOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        templetName: undefined,
        templetCode: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级模板不能为空", trigger: "blur" },
        ],
        templetName: [
          { required: true, message: "模板名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备模板列表 */
    getList() {
      this.loading = true;
      listTemplet(this.queryParams).then((response) => {
        this.templetList = this.handleTree(
          response.data,
          "templetId",
          "parentId"
        );
        this.loading = false;
      });
    },
    /** 转换设备模板数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.templetId,
        label: node.templetName,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listTemplet().then((response) => {
        this.templetOptions = [];
        const data = { templetId: 0, templetName: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "templetId", "parentId");
        this.templetOptions.push(data);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        templetId: undefined,
        templetName: undefined,
        templetCode: undefined,
        parentId: undefined,
        ancestors: undefined,
        fullName: undefined,
        orderNum: undefined,
        status: "0",
        remarks: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.templetId;
      }
      this.open = true;
      this.title = "添加设备模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.templetId;
      }
      getTemplet(row.templetId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备模板";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.templetId != undefined) {
            updateTemplet(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTemplet(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除设备模板编号为"' + row.templetId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTemplet(row.templetId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 位号管理 */
    handleChannels(row) {
      const { templetId } = row;
      this.$router.push({
        name: "TempletChannel",
        params: { templetId: templetId },
      });
    },
  },
};
</script>