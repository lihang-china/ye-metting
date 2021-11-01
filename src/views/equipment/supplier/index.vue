<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="130px"
    >
      <el-form-item label="统一社会信用代码" prop="supCode">
        <el-input
          v-model="queryParams.supCode"
          placeholder="请输入统一社会信用代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业名称" prop="supName">
        <el-input
          v-model="queryParams.supName"
          placeholder="请输入企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="supContact">
        <el-input
          v-model="queryParams.supContact"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:supplier:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipment:supplier:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:supplier:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipment:supplier:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="supplierList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="统一社会信用代码" align="left" prop="supCode" />
      <el-table-column label="企业名称" align="left" prop="supName" />
      <el-table-column label="法定代表人" align="left" prop="supLeg" />
      <el-table-column
        label="住所"
        align="left"
        prop="supAdder"
        show-overflow-tooltip
      />
      <el-table-column label="联系人" align="center" prop="supContact" />
      <el-table-column label="联系方式" align="center" prop="supPhone" />
      <el-table-column
        label="状态 "
        align="center"
        prop="status"
        width="100"
        :formatter="statusFormat"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:supplier:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:supplier:remove']"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-box"
            @click="handleEqu(scope.row)"
            >设备管理</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备供应商对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="统一社会信用代码" prop="supCode">
          <el-input
            v-model="form.supCode"
            placeholder="请输入统一社会信用代码"
          />
        </el-form-item>
        <el-form-item label="企业名称" prop="supName">
          <el-input v-model="form.supName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="supLeg">
          <el-input v-model="form.supLeg" placeholder="请输入法定代表人" />
        </el-form-item>
        <el-form-item label="住所" prop="supAdder">
          <el-input v-model="form.supAdder" placeholder="请输入住所" />
        </el-form-item>
        <el-form-item label="联系人" prop="supContact">
          <el-input v-model="form.supContact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="supPhone">
          <el-input v-model="form.supPhone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="supPhone">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
          />
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
  listSupplier,
  getSupplier,
  delSupplier,
  addSupplier,
  updateSupplier,
  exportSupplier,
} from "@/api/equipment/supplier";

export default {
  name: "Supplier",
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
      // 设备供应商表格数据
      supplierList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态 字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supCode: undefined,
        supName: undefined,
        supContact: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        supCode: [
          {
            required: true,
            message: "统一社会信用代码不能为空",
            trigger: "blur",
          },
        ],
        supName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        supContact: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        supPhone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("supplier_status_type").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询设备供应商列表 */
    getList() {
      this.loading = true;
      listSupplier(this.queryParams).then((response) => {
        this.supplierList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态 字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        supId: undefined,
        supGuid: undefined,
        supCode: undefined,
        supName: undefined,
        supLeg: undefined,
        supAdder: undefined,
        supContact: undefined,
        supPhone: undefined,
        remark: undefined,
        status: "0",
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
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
      this.ids = selection.map((item) => item.supId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备供应商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const supId = row.supId || this.ids;
      getSupplier(supId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备供应商";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.supId != undefined) {
            updateSupplier(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSupplier(this.form).then((response) => {
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
      const supIds = row.supId || this.ids;
      this.$confirm(
        '是否确认删除设备供应商编号为"' + supIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSupplier(supIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有设备供应商数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSupplier(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 管理设备按钮操作 */
    handleEqu(row) {
      const guid = row.supGuid;
      this.$router.push({
        name: "SelectEqu",
        params: { guid: guid, type: "supplier" },
      });
    },
  },
};
</script>