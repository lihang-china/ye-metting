<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="能耗设备id" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入能耗设备id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入能耗部门id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分摊系数" prop="ftxs">
        <el-input
          v-model="queryParams.ftxs"
          placeholder="请输入分摊系数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表号" prop="bitNo">
        <el-input
          v-model="queryParams.bitNo"
          placeholder="请输入表号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="算法规则标志 1：加 0：减" prop="ruleFlag">
        <el-input
          v-model="queryParams.ruleFlag"
          placeholder="请输入算法规则标志 1：加 0：减"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗类型" prop="nhType">
        <el-select v-model="queryParams.nhType" placeholder="请选择能耗类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input
          v-model="queryParams.memo"
          placeholder="请输入备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1：是，默认为1;0：否 该部门值是否通过下级部门汇总生成" prop="isSum">
        <el-input
          v-model="queryParams.isSum"
          placeholder="请输入1：是，默认为1;0：否 该部门值是否通过下级部门汇总生成"
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
          v-hasPermi="['energy/basic:deptConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['energy/basic:deptConfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['energy/basic:deptConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['energy/basic:deptConfig:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="deptConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="能耗设备id" align="center" prop="deviceId" />
      <el-table-column label="能耗部门id" align="center" prop="deptId" />
      <el-table-column label="分摊系数" align="center" prop="ftxs" />
      <el-table-column label="表号" align="center" prop="bitNo" />
      <el-table-column label="算法规则标志 1：加 0：减" align="center" prop="ruleFlag" />
      <el-table-column label="能耗类型" align="center" prop="nhType" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="备注" align="center" prop="memo" />
      <el-table-column label="1：是，默认为1;0：否 该部门值是否通过下级部门汇总生成" align="center" prop="isSum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['energy/basic:deptConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['energy/basic:deptConfig:remove']"
          >删除</el-button>
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

    <!-- 添加或修改能耗部门配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="能耗设备id" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入能耗设备id" />
        </el-form-item>
        <el-form-item label="能耗部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入能耗部门id" />
        </el-form-item>
        <el-form-item label="分摊系数" prop="ftxs">
          <el-input v-model="form.ftxs" placeholder="请输入分摊系数" />
        </el-form-item>
        <el-form-item label="表号" prop="bitNo">
          <el-input v-model="form.bitNo" placeholder="请输入表号" />
        </el-form-item>
        <el-form-item label="算法规则标志 1：加 0：减" prop="ruleFlag">
          <el-input v-model="form.ruleFlag" placeholder="请输入算法规则标志 1：加 0：减" />
        </el-form-item>
        <el-form-item label="能耗类型">
          <el-select v-model="form.nhType" placeholder="请选择能耗类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="1：是，默认为1;0：否 该部门值是否通过下级部门汇总生成" prop="isSum">
          <el-input v-model="form.isSum" placeholder="请输入1：是，默认为1;0：否 该部门值是否通过下级部门汇总生成" />
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
import { listDeptConfig, getDeptConfig, delDeptConfig, addDeptConfig, updateDeptConfig, exportDeptConfig } from "@/api/energy/basic/deptConfig";

export default {
  name: "DeptConfig",
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
      // 能耗部门配置表格数据
      deptConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: undefined,
        deptId: undefined,
        ftxs: undefined,
        bitNo: undefined,
        ruleFlag: undefined,
        nhType: undefined,
        description: undefined,
        memo: undefined,
        isSum: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "能耗部门id不能为空", trigger: "blur" }
        ],
        nhType: [
          { required: true, message: "能耗类型不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询能耗部门配置列表 */
    getList() {
      this.loading = true;
      listDeptConfig(this.queryParams).then(response => {
        this.deptConfigList = response.rows;
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
        id: undefined,
        deviceId: undefined,
        deptId: undefined,
        ftxs: undefined,
        bitNo: undefined,
        ruleFlag: undefined,
        nhType: undefined,
        description: undefined,
        memo: undefined,
        isSum: undefined
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加能耗部门配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDeptConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改能耗部门配置";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDeptConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDeptConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除能耗部门配置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDeptConfig(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有能耗部门配置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDeptConfig(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>