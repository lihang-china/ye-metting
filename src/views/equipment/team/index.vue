<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="班组编码" prop="teamCode">
        <el-input
          v-model="queryParams.teamCode"
          placeholder="请输入班组编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班组名称" prop="teamName">
        <el-input
          v-model="queryParams.teamName"
          placeholder="请输入班组名称"
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
        <el-button
          class="filter-item"
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:team:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="teamList"
      row-key="teamId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="班组编码" prop="teamCode" />
      <el-table-column label="班组名称" prop="teamName" />
      <el-table-column label="所属部门" prop="deptName" />
      <el-table-column label="显示顺序" prop="orderNum" />
      <el-table-column label="状态" align="center" >
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
            v-hasPermi="['equipment:team:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['equipment:team:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:team:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改班组管理 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级班组" prop="parentId">
          <treeselect v-model="form.parentId" :options="teamOptions" placeholder="请选择上级班组" />
        </el-form-item>
        <el-form-item label="班组编码" prop="teamCode">
          <el-input v-model="form.teamCode" placeholder="请输入班组编码" />
        </el-form-item>
        <el-form-item label="班组名称" prop="teamName">
          <el-input v-model="form.teamName" placeholder="请输入班组名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <treeselect v-model="form.deptId" :options="deptOptions" placeholder="请选择所属部门" />
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
import { listTeam, getTeam, delTeam, addTeam, updateTeam, exportTeam, changeTeamStatus, treeListTeam } from "@/api/equipment/team";
import { treeselect as deptTreeselect } from "@/api/system/dept"
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Team",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 班组管理 表格数据
      teamList: [],
      // 班组管理 树选项
      teamOptions: [],
      // 班组管理 部门树选项
      deptOptions: undefined,
      //状态数据字典
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        teamCode: undefined,
        teamName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级班组不能为空", trigger: "blur" }
        ],
        teamCode: [
          { required: true, message: "班组编码不能为空", trigger: "blur" }
        ],
        teamName: [
          { required: true, message: "班组名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询班组管理 列表 */
    getList() {
      this.loading = true;
      listTeam(this.queryParams).then(response => {
        this.teamList = this.handleTree(response.data, "teamId", "parentId");
        this.loading = false;
      });
    },
	  /** 上级班组下拉树结构 */
    getTreeselect() {
      treeListTeam().then(response => {
        this.teamOptions = [];
        const data = { id: 0, label: '顶级节点', children: [] };
        data.children = response.data;
        this.teamOptions.push(data);
      });
    },
    /** 部门下拉树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
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
        teamId: undefined,
        teamGuid: undefined,
        teamCode: undefined,
        teamName: undefined,
        deptId: undefined,
        parentId: undefined,
        ancestors: undefined,
        fullname: undefined,
        orderNum: undefined,
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
    /** 启用/禁用按钮操作 */
    handleStatusChange(row){
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('是否确认' + text + '班组名称为"' + row.teamName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function(){
        return changeTeamStatus(row.teamId, row.status);
      }).then(() => {
        this.getList();
        this.msgSuccess(text + "成功");
      }).catch(function() {
         row.status = row.status === "0" ? "1" : "0";
      });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      this.getDeptTreeselect();
      if (row != null) {
        this.form.parentId = row.teamId;
        this.form.deptId = row.deptId;
      } 
      this.open = true;
      this.title = "添加班组 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      this.getDeptTreeselect();
      if (row != undefined) {
        this.form.parentId = row.teamId;
        this.form.deptId = row.deptId;
      }
      getTeam(row.teamId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班组 ";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.teamId != undefined) {
            updateTeam(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTeam(this.form).then(response => {
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
      this.$confirm('是否确认删除班组名称为"' + row.teamName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeam(row.teamId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>