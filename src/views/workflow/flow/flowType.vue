<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="流程类型名称" prop="flowTypeName">
        <el-input
          v-model="queryParams.flowTypeName"
          placeholder="请输入流程类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="flowTypeList"
      row-key="flowTypeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="流程类型名称" prop="flowTypeName" width="300" />
      <el-table-column label="流程类型描述" prop="flowTypeDesc" show-overflow-tooltip />
      <el-table-column label="显示顺序" align="center" prop="orderNum" width="150" />
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改设备分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="530px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="上级类型" prop="parentId">
          <treeselect v-model="form.parentId" :options="flowTypeOptions" placeholder="请选择上级类型" />
        </el-form-item>
        <el-form-item label="流程类型名称" prop="flowTypeName">
          <el-input v-model="form.flowTypeName" placeholder="请输入流程类型名称" />
        </el-form-item>
        <el-form-item label="流程类型描述" prop="flowTypeDesc">
          <el-input v-model="form.flowTypeDesc" type="textarea" placeholder="请输入流程类型描述" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
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
  listFlowType,
  getFlowType,
  treeListFlowType,
  addFlowType,
  updateFlowType,
  delFlowType,
  changeFlowTypeStatus,
} from "@/api/workflow/flowType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "FlowType",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      flowTypeList: [],
      // 树选项
      flowTypeOptions: [],
      // 状态
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        flowTypeName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "请选择上级类型", trigger: "blur" },
        ],
        flowTypeName: [
          { required: true, message: "请输入流程类型名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    getList() {
      this.loading = true;
      listFlowType(this.queryParams).then((response) => {
        this.flowTypeList = this.handleTree(
          response.data,
          "flowTypeId",
          "parentId"
        );
        this.loading = false;
      });
    },
    getTreeselect() {
      treeListFlowType().then((response) => {
        this.flowTypeOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.flowTypeOptions.push(data);
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
        flowTypeId: undefined,
        parentId: undefined,
        flowTypeName: undefined,
        flowTypeDesc: undefined,
        orderNum: 0,
        status: "0",
        remark: undefined,
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
    /** 启用/禁用按钮操作 */
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        "是否确认" + text + '类型名称为"' + row.flowTypeName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeFlowTypeStatus(row);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.flowTypeId;
      }
      this.open = true;
      this.title = "添加流程类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.flowTypeId;
      }
      getFlowType(row.flowTypeId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程类型";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.flowTypeId != undefined) {
            updateFlowType(this.form.flowTypeId, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFlowType(this.getFormArray(this.form)).then((response) => {
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
        '是否确认删除类型名称为"' + row.flowTypeName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const loading = this.openLoading();
        delFlowType(row.flowTypeId)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
  },
};
</script>