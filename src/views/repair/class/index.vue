<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="分类编码" prop="reclassCode">
        <el-input
          v-model="queryParams.reclassCode"
          placeholder="请输入分类编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="reclassName">
        <el-input
          v-model="queryParams.reclassName"
          placeholder="请输入分类名称"
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
          v-hasPermi="['repair:class:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="classList"
      row-key="reclassId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="分类编码" prop="reclassCode" />
      <el-table-column label="分类名称" prop="reclassName" />
      <el-table-column label="紧急程度" prop="emergency" :formatter="emergencyTypeFormat" />
      <el-table-column label="显示顺序" prop="orderNum" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['repair:class:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['repair:class:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['repair:class:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改维修分类 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级分类" prop="parentId">
          <treeselect v-model="form.parentId" :options="classOptions" placeholder="请选择上级分类" />
        </el-form-item>
        <el-form-item label="分类编码" prop="reclassCode">
          <el-input v-model="form.reclassCode" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="分类名称" prop="reclassName">
          <el-input v-model="form.reclassName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="完成时间" prop="reclassTime">
          <el-input v-model="form.reclassTime" placeholder="请输入完成时间" />
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-select v-model="form.emergency" placeholder="请选择紧急程度">
            <el-option
              v-for="dict in emergencyTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="teamId">
          <treeselect v-model="form.teamId" :options="teamOptions" placeholder="请选择班组" />
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
  listClass,
  getClass,
  delClass,
  addClass,
  updateClass,
  exportClass,
  treeListClass
} from "@/api/repair/class";
import { treeListTeam } from "@/api/equipment/team";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ReClass",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 维修分类 表格数据
      classList: [],
      // 班组选项
      classOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 班组树
      teamOptions: [],
      // 区域类别字典
      emergencyTypeOptions: [],
      // 状态 字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        reclassCode: undefined,
        reclassName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级分类不能为空", trigger: "blur" }
        ],
        reclassCode: [
          { required: true, message: "分类编码不能为空", trigger: "blur" }
        ],
        reclassName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("repair_emergency_type").then(response => {
      this.emergencyTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询维修分类 列表 */
    getList() {
      this.loading = true;
      listClass(this.queryParams).then(response => {
        this.classList = this.handleTree(
          response.data,
          "reclassId",
          "parentId"
        );
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeListClass().then(response => {
        this.classOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.classOptions.push(data);
      });
    },
    /** 班组下拉树 */
    getTeamTreeselect() {
      let params = {
        "teamId": 1
      };
      treeListTeam(params).then(response => {
        this.teamOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.teamOptions.push(data);
      });
    },
    // 紧急程度字典翻译
    emergencyTypeFormat(row, column) {
      return this.selectDictLabel(this.emergencyTypeOptions, row.emergency);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        reclassId: undefined,
        reclassGuid: undefined,
        reclassCode: undefined,
        reclassName: undefined,
        reclassTime: undefined,
        emergency: undefined,
        teamId: undefined,
        parentId: undefined,
        ancestors: undefined,
        fullName: undefined,
        orderNum: 0,
        status: "0",
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.reclassId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      this.getTeamTreeselect();
      if (row != null) {
        this.form.parentId = row.reclassId;
      }
      this.open = true;
      this.title = "添加维修分类 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      this.getTeamTreeselect();
      if (row != undefined) {
        this.form.parentId = row.reclassId;
      }
      getClass(row.reclassId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改维修分类 ";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.reclassId != undefined) {
            updateClass(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addClass(this.form).then(response => {
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
        '是否确认删除维修分类名称为"' + row.reclassName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delClass(row.reclassId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>