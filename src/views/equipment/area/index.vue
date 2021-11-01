<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="区域编码" prop="areaCode">
        <el-input
          v-model="queryParams.areaCode"
          placeholder="请输入区域编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域名称" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入区域名称"
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
          v-hasPermi="['equipment:area:add']"
          >新增</el-button
        >
        <el-button
          type="info"
          icon="el-icon-download"
          size="mini"
          @click="handleImport"
          v-hasPermi="['equipment:area:import']"
          >导入</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipment:area:export']"
          >导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="areaList"
      row-key="areaId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="区域编码" prop="areaCode" />
      <el-table-column label="区域名称" prop="areaName" />
      <el-table-column
        label="区域类别"
        prop="areaType"
        :formatter="areaTypeFormat"
      />
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
            v-hasPermi="['equipment:area:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['equipment:area:add']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:area:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改区域管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级区域" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="areaOptions"
            placeholder="请选择上级区域"
          />
        </el-form-item>
        <el-form-item label="区域编码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入区域编码" />
        </el-form-item>
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="区域类别">
          <el-select v-model="form.areaType" placeholder="请选择区域类别">
            <el-option
              v-for="dict in areaTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
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
      :successBack="getList"
    />
  </div>
</template>

<script>
import {
  listArea,
  getArea,
  delArea,
  addArea,
  updateArea,
  exportArea,
  changeAreaStatus,
  treeListArea,
} from "@/api/equipment/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ImportData from "@/views/components/upload/ImportData";

export default {
  name: "Area",
  components: { Treeselect, ImportData },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 区域表格数据
      areaList: [],
      // 区域树选项
      areaOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 区域类别字典
      areaTypeOptions: [],
      // 状态 字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        areaCode: undefined,
        areaName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级区域不能为空", trigger: "blur" },
        ],
        areaCode: [
          { required: true, message: "区域编码不能为空", trigger: "blur" },
        ],
        areaName: [
          { required: true, message: "区域名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" },
        ],
      },
      // 导入参数
      upload: {
        // 弹出层标题
        title: "区域导入",
        // 上传的地址
        url: "/equipment/area/import",
        // 模板文件地址
        templateUrl: "区域数据导入模板.xls",
      },
      // 导入组件的开关
      uploadOpen: false,
    };
  },
  created() {
    this.getList();
    this.getDicts("equ_area_type").then((response) => {
      this.areaTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询区域列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then((response) => {
        this.areaList = this.handleTree(response.data, "areaId", "parentId");
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeListArea().then((response) => {
        this.areaOptions = [];
        const data = { id: 0, label: "顶级节点", children: [] };
        data.children = response.data;
        this.areaOptions.push(data);
      });
    },
    // 区域类别字典翻译
    areaTypeFormat(row, column) {
      return this.selectDictLabel(this.areaTypeOptions, row.areaType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        areaId: undefined,
        areaGuid: undefined,
        areaCode: undefined,
        areaName: undefined,
        areaType: undefined,
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
        updateTime: undefined,
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
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        "是否确认" + text + '区域名称为"' + row.areaName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeAreaStatus(row.areaId, row.status);
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
        this.form.parentId = row.areaId;
        this.form.areaType = row.areaType;
      }
      this.open = true;
      this.title = "添加区域";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.areaId;
      }
      getArea(row.areaId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改区域";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.areaId != undefined) {
            updateArea(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addArea(this.form).then((response) => {
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
        '是否确认删除区域名称为"' + row.areaName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delArea(row.areaId);
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
      this.$confirm("是否确认导出所有区域数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportArea(queryParams);
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
  },
};
</script>