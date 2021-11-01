<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="命名规约编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入命名规约编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="命名规约名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入命名规约名称"
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
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
          >重置</el-button
        >
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['gis:rule:add']"
          >新增</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-guide"
          size="mini"
          @click="getExpends"
          >展开/折叠
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="table"
      v-loading="loading"
      :data="ruleList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="命名规约编码" align="left" prop="code" />
      <el-table-column label="命名规约名称" align="left" prop="name" />
      <el-table-column label="全称" align="left" prop="fullCode" />
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
            v-hasPermi="['gis:rule:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gis:rule:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改系统命名规约对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="118px">
        <el-form-item label="上级命名规约" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="ruleOptions"
            :normalizer="normalizer"
            placeholder="请选择上级命名规约"
          />
        </el-form-item>
        <el-form-item label="命名规约编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入命名规约编码" />
        </el-form-item>
        <el-form-item label="命名规约名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入命名规约名称" />
        </el-form-item>
        <el-form-item label="标准图标" prop="iconNormal">
          <el-input v-model="form.iconNormal" placeholder="请输入标准图标" />
        </el-form-item>
        <el-row>
          <el-col :span="9">
            <el-form-item label="开关状态">
              <el-radio-group v-model="form.haveOpenStatus">
                <el-radio
                  v-for="options in haveOptions"
                  :key="options.value"
                  :label="options.value"
                  >{{ options.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="15" v-show="form.haveOpenStatus === 1">
            <el-form-item label="开始图标" prop="iconStart">
              <el-input v-model="form.iconStart" placeholder="请输入开始图标" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="报警状态">
              <el-radio-group v-model="form.haveAlarmStatus">
                <el-radio
                  v-for="options in haveOptions"
                  :key="options.value"
                  :label="options.value"
                  >{{ options.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="15" v-show="form.haveAlarmStatus === 1">
            <el-form-item label="报警图标" prop="iconAlarm">
              <el-input v-model="form.iconAlarm" placeholder="请输入报警图标" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="故障状态">
              <el-radio-group v-model="form.haveFaultStatus">
                <el-radio
                  v-for="options in haveOptions"
                  :key="options.value"
                  :label="options.value"
                  >{{ options.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="15" v-show="form.haveFaultStatus === 1">
            <el-form-item label="故障图标" prop="iconFault">
              <el-input v-model="form.iconFault" placeholder="请输入故障图标" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
          ></el-input>
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
  listRule,
  getRule,
  delRule,
  addRule,
  updateRule,
  exportRule,
} from "@/api/gis/rule";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const haveList = [
  {
    label: "无",
    value: 0,
  },
  {
    label: "有",
    value: 1,
  },
];

export default {
  name: "Rule",
  components: { Treeselect },
  data() {
    return {
      //展开
      expand: false,
      // 遮罩层
      loading: true,
      // 系统命名规约表格数据
      ruleList: [],
      // 系统命名规约树选项
      ruleOptions: [],
      //
      haveOptions: haveList,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        code: undefined,
        name: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "命名规约编码不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "命名规约名称不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "请选择上级命名规约", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统命名规约列表 */
    getList() {
      this.loading = true;
      listRule(this.queryParams).then((response) => {
        this.ruleList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换系统命名规约数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listRule().then((response) => {
        this.ruleOptions = [];
        const data = { id: 0, name: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.ruleOptions.push(data);
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
        softCode: undefined,
        code: undefined,
        name: undefined,
        parentId: undefined,
        fullCode: undefined,
        remark: undefined,
        haveOpenStatus: 0,
        haveAlarmStatus: 0,
        haveFaultStatus: 0,
        iconNormal: undefined,
        iconStart: undefined,
        iconAlarm: undefined,
        iconFault: undefined,
        createId: undefined,
        createBy: undefined,
        createDate: undefined,
        updateId: undefined,
        updateBy: undefined,
        updateDate: undefined,
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
    /** 展开/折叠 */
    getExpends() {
      this.expand = this.expand ? false : true;
      this.ruleList.forEach((item) => {
        this.$refs.table.toggleRowExpansion(item, this.expand);
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加命名规约";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      getRule(row.id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改命名规约";
      });
    },
    // 设置图标
    setIcon() {
      if (this.form.haveOpenStatus === 0) {
        this.form.iconStart = "";
      }
      if (this.form.haveAlarmStatus === 0) {
        this.form.iconAlarm = "";
      }
      if (this.form.haveFaultStatus === 0) {
        this.form.iconFault = "";
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.setIcon();
          if (this.form.id != undefined) {
            updateRule(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRule(this.form).then((response) => {
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
        '是否确认删除命名规约编号为"' + row.id + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delRule(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>