<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="场景类别名称" prop="equScenesCategoryName">
        <el-input
          v-model="queryParams.equScenesCategoryName"
          placeholder="请输入场景类别名称"
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
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="categoryList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        label="场景类别名称"
        align="left"
        prop="equScenesCategoryName"
      />
      <el-table-column label="全称" align="left" prop="fullName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column
        label="状态 "
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.id != 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click="handleChannels(scope.row)"
            v-if="scope.row.status === '0'"
            >设置位号</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改场景分类对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="上级场景类别" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="categoryOptions"
            :normalizer="normalizer"
            placeholder="请选择上级场景类别"
          />
        </el-form-item>
        <el-form-item label="场景类别名称" prop="equScenesCategoryName">
          <el-input
            v-model="form.equScenesCategoryName"
            placeholder="请输入场景类别名称"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            placeholder="请输入显示顺序"
          />
        </el-form-item>
        <el-form-item label="状态 ">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <ChannelsCal
      v-if="channelsCalVisiable"
      :channelsCalVisiable.sync="channelsCalVisiable"
      :equScenesCategoryId="equScenesCategoryId"
      :refreshList="getList"
    />
  </div>
</template>

<script>
import {
  listCategory,
  getCategory,
  delCategory,
  addCategory,
  updateCategory,
} from "@/api/calendar/category";
import ChannelsCal from "@/views/components/scene/ChannelsCal";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Category",
  components: { ChannelsCal, Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 场景分类表格数据
      categoryList: [],
      // 场景分类树选项
      categoryOptions: [],
      // 状态
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        equScenesCategoryName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equScenesCategoryName: [
          { required: true, message: "场景类别名不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "父级ID不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" },
        ],
        status: [
          {
            required: true,
            message: "状态 （0正常 1停用）不能为空",
            trigger: "blur",
          },
        ],
      },
      //位号选择弹出窗
      channelsCalVisiable: false,
      //场景Id
      equScenesCategoryId: undefined,
    };
  },
  created() {
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
    this.getList();
  },
  methods: {
    statusFormat(row, column, cellValue, index) {
      return this.selectDictLabel(this.statusOptions, cellValue);
    },
    /** 查询场景分类列表 */
    getList() {
      this.loading = true;
      listCategory(this.queryParams).then((response) => {
        this.categoryList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换场景分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.equScenesCategoryName,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listCategory().then((response) => {
        this.categoryOptions = [];
        const data = { id: 0, equScenesCategoryName: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.categoryOptions.push(data);
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
        equScenesCategoryName: undefined,
        parentId: undefined,
        ancestors: undefined,
        fullName: undefined,
        orderNum: undefined,
        status: "0",
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
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
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = "添加场景分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      getCategory(row.id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改场景分类";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCategory(this.form.id, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCategory(this.form).then((response) => {
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
        '是否确认删除场景分类编号为"' + row.id + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCategory(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    // 位号设置按钮
    handleChannels(row) {
      this.equScenesCategoryId = row.id;
      this.channelsCalVisiable = true;
    },
  },
};
</script>