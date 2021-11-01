<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="合同编号" prop="conCode">
        <el-input
          v-model="queryParams.conCode"
          placeholder="请输入合同编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="conName">
        <el-input
          v-model="queryParams.conName"
          placeholder="请输入合同名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同甲方" prop="conFirst">
        <el-input
          v-model="queryParams.conFirst"
          placeholder="请输入合同甲方"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同乙方" prop="conSecond">
        <el-input
          v-model="queryParams.conSecond"
          placeholder="请输入合同乙方"
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
          v-hasPermi="['equipment:contract:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipment:contract:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:contract:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipment:contract:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="合同编号" align="left" prop="conCode" />
      <el-table-column label="合同名称" align="left" prop="conName" />
      <el-table-column label="合同金额(万元)" align="center" prop="conAmount" />
      <el-table-column label="签订日期" align="center" prop="conTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.conTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同甲方" align="left" prop="conFirst" show-overflow-tooltip />
      <el-table-column label="合同乙方" align="left" prop="conSecond" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:contract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:contract:remove']"
          >删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-box" @click="handleEqu(scope.row)">设备管理</el-button>
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

    <!-- 添加或修改设备合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="conCode">
              <el-input v-model="form.conCode" placeholder="请输入合同编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="conName">
              <el-input v-model="form.conName" placeholder="请输入合同名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同金额(万元)" prop="conAmount">
              <el-input v-model="form.conAmount" placeholder="请输入合同金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期" prop="conTime">
              <el-date-picker v-model="form.conTime" type="date" placeholder="请选择签订日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同甲方" prop="conFirst">
              <el-input v-model="form.conFirst" placeholder="请输入合同甲方" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="甲方联系人" prop="firstContacts">
              <el-input v-model="form.firstContacts" placeholder="请输入甲方联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲方联系方式" prop="firstPhone">
              <el-input v-model="form.firstPhone" placeholder="请输入甲方联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同乙方" prop="conSecond">
              <el-input v-model="form.conSecond" placeholder="请输入合同乙方" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="乙方联系人" prop="secondContacts">
              <el-input v-model="form.secondContacts" placeholder="请输入乙方联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乙方联系方式" prop="secondPhone">
              <el-input v-model="form.secondPhone" placeholder="请输入乙方联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  listContract,
  getContract,
  delContract,
  addContract,
  updateContract,
  exportContract,
} from "@/api/equipment/contract";

export default {
  name: "Contract",
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
      // 设备合同表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        conCode: undefined,
        conName: undefined,
        conFirst: undefined,
        conSecond: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        conCode: [
          { required: true, message: "合同编码不能为空", trigger: "blur" },
        ],
        conName: [
          { required: true, message: "合同名称不能为空", trigger: "blur" },
        ],
        conAmount: [
          { required: true, message: "合同金额不能为空", trigger: "blur" },
        ],
        conTime: [
          { required: true, message: "合同签订时间不能为空", trigger: "blur" },
        ],
        conFirst: [
          { required: true, message: "合同甲方不能为空", trigger: "blur" },
        ],
        firstContacts: [
          { required: true, message: "甲方联系人不能为空", trigger: "blur" },
        ],
        firstPhone: [
          { required: true, message: "甲方联系方式不能为空", trigger: "blur" },
        ],
        conSecond: [
          { required: true, message: "合同乙方不能为空", trigger: "blur" },
        ],
        secondContacts: [
          { required: true, message: "乙方联系人不能为空", trigger: "blur" },
        ],
        secondPhone: [
          { required: true, message: "乙方联系方式不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备合同列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then((response) => {
        this.contractList = response.rows;
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
        conId: undefined,
        conGuid: undefined,
        conCode: undefined,
        conName: undefined,
        conAmount: undefined,
        conTime: undefined,
        conFirst: undefined,
        firstContacts: undefined,
        firstPhone: undefined,
        conSecond: undefined,
        secondContacts: undefined,
        secondPhone: undefined,
        remark: undefined,
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
      this.ids = selection.map((item) => item.conId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const conId = row.conId || this.ids;
      getContract(conId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备合同";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.conId != undefined) {
            updateContract(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addContract(this.form).then((response) => {
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
      const conIds = row.conId || this.ids;
      this.$confirm(
        '是否确认删除设备合同编号为"' + conIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delContract(conIds);
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
      this.$confirm("是否确认导出所有设备合同数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportContract(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 管理设备按钮操作 */
    handleEqu(row) {
      const guid = row.conGuid;
      this.$router.push({
        name: "SelectEqu",
        params: { guid: guid, type: "contract" },
      });
    },
  },
};
</script>