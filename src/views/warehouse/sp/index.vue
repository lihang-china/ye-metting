<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="className"
            placeholder="请输入分类名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="classOptions"
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
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
          <el-form-item label="备品备件编码" prop="spCode">
            <el-input
              v-model="queryParams.spCode"
              placeholder="请输入备品备件编码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="备品备件名称" prop="spName">
            <el-input
              v-model="queryParams.spName"
              placeholder="请输入备品备件名称"
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
              v-hasPermi="['warehouse:sp:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['warehouse:sp:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['warehouse:sp:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['warehouse:sp:export']"
            >导出</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="spList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="备品备件编码" align="center" prop="spCode" />
          <el-table-column label="备品备件名称" align="center" prop="spName" />
          <el-table-column label="备品备件分类" align="center" prop="whclassName" />
          <el-table-column label="计量单位" align="center" prop="spUnit" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['warehouse:sp:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['warehouse:sp:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改备品备件 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="备品备件编码" prop="spCode">
              <el-input v-model="form.spCode" placeholder="请输入备品备件编码" :style="{ width: width }" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备品备件名称" prop="spName">
              <el-input v-model="form.spName" placeholder="请输入备品备件名称" :style="{ width: width }" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备品备件分类" prop="whclassId">
              <el-cascader
                v-model="form.whclassId"
                :options="classOptions"
                :props="cascaderProps"
                placeholder="请选择备品备件分类"
                clearable
                :style="{ width: width }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位" prop="spUnit">
              <el-input v-model="form.spUnit" placeholder="请输入计量单位" :style="{ width: width }" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备品备件规格" prop="spSpec">
              <el-input v-model="form.spSpec" type="textarea" placeholder="请输入备品备件规格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备品备件型号" prop="spType">
              <el-input v-model="form.spType" type="textarea" placeholder="请输入备品备件型号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备品备件描述" prop="spNotes">
              <el-input v-model="form.spNotes" type="textarea" placeholder="请输入备品备件描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">库存</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最低库存" prop="spQuantityl">
              <el-input v-model="form.spQuantityl" placeholder="请输入最低库存" :style="{ width: width }" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高库存" prop="spQuantityh">
              <el-input v-model="form.spQuantityh" placeholder="请输入最高库存" :style="{ width: width }" />
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
  listSp,
  getSp,
  delSp,
  addSp,
  updateSp,
  exportSp,
} from "@/api/warehouse/sp";
import { treeListClass } from "@/api/warehouse/class";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "WhSp",
  data() {
    return {
      cascaderProps: { emitPath: false, value: "id" },
      // 统一宽度
      width: "300px",
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
      // 分类名称
      className: undefined,
      // 分类树
      classOptions: undefined,
      // 备品备件 表格数据
      spList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        spCode: undefined,
        spName: undefined,
        whclassId: undefined,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 表单校验
      rules: {
        spCode: [
          { required: true, message: "请输入备品备件编码", trigger: "blur" },
        ],
        spName: [
          { required: true, message: "请输入备品备件编码", trigger: "blur" },
        ],
        whclassId: [
          { required: true, message: "请选择备品备件分类", trigger: "blur" },
        ],
        spUnit: [
          { required: true, message: "请输入计量单位", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选班组树
    className(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getClassTreeselect();
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.whclassId = data.id;
      this.getList();
    },
    /** 查询备品备件 列表 */
    getList() {
      this.loading = true;
      listSp(this.queryParams).then((response) => {
        this.spList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 分类下拉树 */
    getClassTreeselect() {
      treeListClass().then((response) => {
        this.classOptions = [];
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.teamOptions.push(data);
        this.classOptions = response.data;
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
        spId: undefined,
        spCode: undefined,
        spName: undefined,
        whclassId: undefined,
        spSpec: undefined,
        spType: undefined,
        spUnit: undefined,
        spQuantityl: undefined,
        spQuantityh: undefined,
        spNotes: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.whclassId = undefined;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.spId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加备品备件 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const spId = row.spId || this.ids;
      getSp(spId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改备品备件 ";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.spId != undefined) {
            updateSp(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSp(this.form).then((response) => {
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
      const spIds = row.spId || this.ids;
      this.$confirm(
        '是否确认删除备品备件 编号为"' + spIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSp(spIds);
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
      this.$confirm("是否确认导出所有备品备件 数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSp(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>