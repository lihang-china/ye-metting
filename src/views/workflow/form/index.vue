<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="表单名称" prop="formName">
        <el-input
          v-model="queryParams.formName"
          placeholder="请输入表单名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单标识" prop="formKey">
        <el-input
          v-model="queryParams.formKey"
          placeholder="请输入表单标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['workflow:form:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['workflow:form:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['workflow:form:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="formList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单名称" align="left" prop="formName" />
      <el-table-column label="表单标识" align="left" prop="formKey" />
      <el-table-column label="表单类型" align="center" prop="formType" :formatter="formTypeFormat" />
      <el-table-column label="提交url" align="left" prop="completeUrl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:form:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:form:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click="handleFormSet(scope.row)"
          >表单配置</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleFormView(scope.row)"
          >表单预览</el-button>
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

    <!-- 添加或修改表单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="表单标识" prop="formKey">
          <el-input v-model="form.formKey" placeholder="请输入表单标识" />
        </el-form-item>
        <el-form-item label="表单类型" prop="formType">
          <el-select v-model="form.formType" placeholder="请选择表单类型">
            <el-option
              v-for="formType in formTypeOptions"
              :key="formType.dictValue"
              :value="formType.dictValue"
              :label="formType.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提交url" prop="completeUrl">
          <el-input v-model="form.completeUrl" placeholder="请输入提交url" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
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
  listForm,
  getForm,
  delForm,
  addForm,
  updateForm,
  getFormContent,
} from "@/api/workflow/form";

export default {
  name: "Form",
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
      // 表单表格数据
      formList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        formName: undefined,
        formKey: undefined,
      },
      formTypeOptions: [{ dictValue: 0, dictLabel: "工作表单" }],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        formName: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
        ],
        formKey: [
          { required: true, message: "请输入表单标识", trigger: "blur" },
        ],
        formType: [
          { required: true, message: "请选择表单类型", trigger: "blur" },
        ],
        completeUrl: [
          { required: true, message: "请输入提交url", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    formTypeFormat(row, column) {
      return this.selectDictLabel(this.formTypeOptions, row.formType);
    },
    /** 查询表单列表 */
    getList() {
      this.loading = true;
      listForm(this.queryParams).then((response) => {
        this.formList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        formId: undefined,
        formName: undefined,
        formKey: undefined,
        formType: 0,
        completeUrl: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.formId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加表单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const formId = row.formId || this.ids;
      getForm(formId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改表单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.formId != undefined) {
            updateForm(this.form.formId, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addForm(this.getFormArray(this.form)).then((response) => {
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
      const formIds = row.formId || this.ids;
      this.$confirm(
        '是否确认删除表单编号为"' + formIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delForm(formIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    handleFormSet(row) {
      const formId = row.formId;
      this.$router.push({ name: "FormDesign", params: { formId: formId } });
    },
    handleFormView(row) {
      const formId = row.formId;
      this.$router.push({
        name: "FormView",
        params: { formId: formId },
      });
    },
  },
};
</script>