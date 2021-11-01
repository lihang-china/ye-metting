<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="设备分类编码" prop="classCode">
        <el-input
          v-model="queryParams.classCode"
          placeholder="请输入设备分类编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备分类名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入设备分类名称"
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
          v-hasPermi="['equipment:class:add']"
          >新增</el-button
        >
        <el-button
          type="info"
          icon="el-icon-download"
          size="mini"
          @click="handleImport"
          v-hasPermi="['equipment:class:import']"
          >导入</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipment:class:export']"
          >导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="classList"
      row-key="classId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="设备分类编码" prop="classCode" />
      <el-table-column label="设备分类名称" prop="className" />
      <!-- <el-table-column label="显示顺序" prop="orderNum" /> -->
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
            v-hasPermi="['equipment:class:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['equipment:class:add']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:class:remove']"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click="handleChannels(scope.row)"
            >位号管理</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改设备分类对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="45%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础数据" name="first">
            <el-form-item label="上级分类" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="classOptions"
                placeholder="请选择上级分类"
              />
            </el-form-item>
            <el-form-item label="设备分类编码" prop="classCode">
              <el-input
                v-model="form.classCode"
                placeholder="请输入设备分类编码"
              />
            </el-form-item>
            <el-form-item label="设备分类名称" prop="className">
              <el-input
                v-model="form.className"
                placeholder="请输入设备分类名称"
              />
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
            <el-col :span="12">
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
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="地图数据" name="second">
            <el-form-item label="标准图标" prop="iconNormal">
              <el-input
                v-model="form.iconNormal"
                placeholder="请输入标准图标"
              />
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
                  <el-input
                    v-model="form.iconStart"
                    placeholder="请输入开始图标"
                  />
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
                  <el-input
                    v-model="form.iconAlarm"
                    placeholder="请输入报警图标"
                  />
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
                  <el-input
                    v-model="form.iconFault"
                    placeholder="请输入故障图标"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <ImportData
      v-if="uploadOpen"
      :title="upload.title"
      :uploadOpen.sync="uploadOpen"
      :url="upload.url"
      :templateUrl="upload.templateUrl"
      :showUpdateSupport="upload.showUpdateSupport"
      :successBack="getList"
    />
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
  changeClassStatus,
  treeListClass,
} from "@/api/equipment/class";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ImportData from "@/views/components/upload/ImportData";

export default {
  name: "Class",
  components: { Treeselect, ImportData },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 设备分类表格数据
      classList: [],
      // 设备分类树选项
      classOptions: [],
      // 状态
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        classCode: undefined,
        className: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级分类不能为空", trigger: "blur" },
        ],
        classCode: [
          { required: true, message: "分类编码不能为空", trigger: "blur" },
        ],
        className: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" },
        ],
      },
      // 导入参数
      upload: {
        // 弹出层标题
        title: "设备分类导入",
        // 上传的地址
        url: "/equipment/class/import",
        // 模板文件地址
        templateUrl: "设备分类数据导入模板.xls",
        // 是否显示更新数据选择框
        showUpdateSupport: false,
      },
      // 导入组件的开关
      uploadOpen: false,
      //
      activeName: "first",
      //
      //
      haveOptions: [
        {
          label: "无",
          value: 0,
        },
        {
          label: "有",
          value: 1,
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询设备分类列表 */
    getList() {
      this.loading = true;
      listClass(this.queryParams).then((response) => {
        this.classList = this.handleTree(response.data, "classId", "parentId");
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeListClass().then((response) => {
        this.classOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.classOptions.push(data);
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
        classId: undefined,
        classGuid: undefined,
        parentId: undefined,
        ancestors: undefined,
        fullName: undefined,
        classCode: undefined,
        className: undefined,
        orderNum: undefined,
        status: "0",
        remark: undefined,
        haveOpenStatus: 0,
        haveAlarmStatus: 0,
        haveFaultStatus: 0,
        iconNormal: undefined,
        iconStart: undefined,
        iconAlarm: undefined,
        iconFault: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
      };
      this.resetForm("form");
      this.activeName = "first";
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
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        "是否确认" + text + '分类名称为"' + row.className + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeClassStatus(row.classId, row.status);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.classId;
      }
      this.open = true;
      this.title = "添加设备分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.classId;
      }
      getClass(row.classId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备分类";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.classId != undefined) {
            updateClass(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addClass(this.form).then((response) => {
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
        '是否确认删除分类名称为"' + row.className + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delClass(row.classId);
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
      this.$confirm("是否确认导出所有设备分类数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportClass(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.uploadOpen = true;
    },
    /** 位号管理 */
    handleChannels(row) {
      const templetId = row.classId;
      this.$router.push({
        name: "TempletChannel",
        params: { templetId: templetId },
      });
    },
  },
};
</script>