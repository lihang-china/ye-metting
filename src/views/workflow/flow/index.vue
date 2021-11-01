<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="flowTypeName"
            placeholder="请输入流程类型名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="flowTypeOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="88px">
          <el-form-item label="流程状态" prop="isEnable">
            <el-select v-model="queryParams.isEnable" placeholder="请选择流程状态" clearable size="small">
              <el-option
                v-for="enable in enableOptions"
                :key="enable.value"
                :label="enable.label"
                :value="enable.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流程名称" prop="flowName">
            <el-input v-model="queryParams.flowName" placeholder="请输入流程名称" clearable size="small" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-copy-document"
              size="mini"
              :disabled="single"
              @click="handleCopy"
            >复制</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="el-icon-menu" size="mini" @click="handleTypes">流程类型</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="el-icon-s-grid" size="mini" @click="handleListeners">监听器管理</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="flowList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column label="流程名称" align="left" prop="flowName" width="200" />
          <el-table-column label="流程类型" align="left" prop="flowTypeName" width="200" />
          <el-table-column label="流程状态" align="center" prop="isEnable" width="150">
            <template slot-scope="scope">{{ optionsFormat(enableOptions, scope.row.isEnable) }}</template>
          </el-table-column>
          <el-table-column label="发布状态" align="center" prop="releaseState" width="150">
            <template
              slot-scope="scope"
            >{{ optionsFormat(releaseStateOptions, scope.row.releaseState) }}</template>
          </el-table-column>
          <el-table-column label="版本数量" align="center" prop="versionNum" width="150" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit-outline"
                @click="handleDesign(scope.row)"
              >流程设计</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-position"
                v-if="scope.row.releaseState != 1"
                @click="handleDeploy(scope.row)"
              >流程发布</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document"
                v-if="scope.row.releaseState != 0"
                @click="handleProcessDefinitions(scope.row)"
              >版本监控</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改设备供应商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="复制的流程" v-if="isCopy">{{copyFlow}}</el-form-item>
        <el-form-item label="流程名称" prop="flowName">
          <el-input v-model="form.flowName" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item label="key" prop="flowId">
          <el-input v-model="form.flowId" placeholder="请输入key" />
        </el-form-item>
        <el-form-item label="流程类型" prop="flowTypeId">
          <el-cascader
            v-model="form.flowTypeId"
            :options="flowTypeOptions"
            :props="defaultProps"
            placeholder="请选择流程类型"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="流程状态">
          <el-radio-group v-model="form.isEnable">
            <el-radio
              v-for="enable in enableOptions"
              :key="enable.value"
              :label="enable.value"
            >{{enable.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="flowDesc">
          <el-input v-model="form.flowDesc" type="textarea" placeholder="请输入备注" />
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
  listFlow,
  getFlow,
  delFlow,
  addFlow,
  updateFlow,
  copyFlow,
  deployFlow,
} from "@/api/workflow/flow";
import { treeListFlowType } from "@/api/workflow/flowType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const enableList = [
  {
    label: "可用",
    value: 1,
  },
  {
    label: "禁用",
    value: 0,
  },
];

const releaseStateList = [
  {
    label: "未发布",
    value: 0,
  },
  {
    label: "已发布",
    value: 1,
  },
  {
    label: "有更新",
    value: 2,
  },
];

export default {
  name: "Flow",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 流程类型名称
      flowTypeName: undefined,
      // 树选项
      flowTypeOptions: [],
      // 数结构
      defaultProps: {
        children: "children",
        label: "label",
        value: "id",
        emitPath: false,
      },
      // 表格数据
      flowList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 流程状态
      enableOptions: enableList,
      // 发布状态
      releaseStateOptions: releaseStateList,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isEnable: undefined,
        flowTypeId: undefined,
        flowName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        flowName: [
          { required: true, message: "请输入流程名称", trigger: "blur" },
        ],
        flowId: [{ required: true, message: "请输入key", trigger: "blur" }],
        flowTypeId: [
          { required: true, message: "请选择流程类型", trigger: "blur" },
        ],
      },
      // 是否复制
      isCopy: false,
      // 复制流程的名称
      copyFlow: undefined,
      // 复制的流程逐渐
      workFlowId: undefined,
    };
  },
  watch: {
    // 根据名称筛选树
    flowTypeName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getFlowType();
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.flowTypeId = data.id;
      this.getList();
    },
    getFlowType() {
      treeListFlowType().then((response) => {
        this.flowTypeOptions = response.data;
      });
    },
    getList() {
      this.loading = true;
      listFlow(this.queryParams).then((response) => {
        this.flowList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    optionsFormat(options, value) {
      return options.find((t) => t.value === value).label;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        isEnable: 1,
        flowId: undefined,
        flowTypeId: undefined,
        flowName: undefined,
        flowDesc: undefined,
      };
      this.resetForm("form");
      this.isCopy = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.flowTypeId = undefined;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流程";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const workFlowId = row.id || this.ids;
      getFlow(workFlowId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.isCopy) {
            copyFlow(this.workFlowId, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("复制成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            if (this.form.id != undefined) {
              updateFlow(this.form.id, this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addFlow(this.getFormArray(this.form)).then((response) => {
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
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const workFlowIds = row.id || this.ids;
      this.$confirm("是否确认删除流程?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        delFlow(workFlowIds)
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
    /** 复制按钮操作 */
    handleCopy(row) {
      this.reset();
      const workFlowId = row.id || this.ids;
      getFlow(workFlowId).then((response) => {
        this.isCopy = true;
        this.copyFlow = response.data.flowName;
        this.workFlowId = response.data.id;
        this.open = true;
        this.title = "复制流程";
      });
    },
    /** 流程设计 */
    handleDesign(row) {
      const id = row.id;
      this.$router.push({ name: "FlowDesign", params: { workFlowId: id } });
    },
    /** 流程类型 */
    handleTypes() {
      this.$router.push({ name: "FlowType" });
    },
    /** 监听器管理 */
    handleListeners() {
      this.$router.push({ name: "Listeners" });
    },
    /** 流程发布 */
    handleDeploy(row) {
      const workFlowId = row.id;
      this.$confirm("是否确认发布流程?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading("正在发布流程,请稍后......");
        deployFlow(workFlowId)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("发布成功");
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
    /** 版本监控 */
    handleProcessDefinitions(row) {
      const flowId = row.flowId;
      this.$router.push({
        name: "ProcessDefinitions",
        params: { flowId: flowId },
      });
    },
  },
};
</script>