<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="监听器名称">
        <el-input v-model="queryParams.listenerName" placeholder="请输入监听器名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="监听器类型">
        <el-select v-model="queryParams.listenerType" placeholder="请选择监听器类型" clearable size="small">
          <el-option
            v-for="listenerType in listenerTypeOptions"
            :key="listenerType.value"
            :label="listenerType.label"
            :value="listenerType.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="listenerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="监听器名称" align="left" prop="listenerName" />
      <el-table-column label="监听器类型" align="center" prop="listenerType" width="150">
        <template
          slot-scope="scope"
        >{{ optionsFormat(listenerTypeOptions, scope.row.listenerType) }}</template>
      </el-table-column>
      <el-table-column label="监听器事件" align="center" prop="listenerEvent" />
      <el-table-column label="执行的类型" align="center" prop="valueType" width="150">
        <template slot-scope="scope">{{ optionsFormat(valueTypeOptions, scope.row.valueType) }}</template>
      </el-table-column>
      <el-table-column label="执行内容" align="left" prop="listenerValue" show-overflow-tooltip />
      <el-table-column label="说明" align="left" prop="listenerDesc" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改流程监听器对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-form-item label="监听器名称" prop="listenerName">
          <el-input v-model="form.listenerName" placeholder="请输入监听器名称" />
        </el-form-item>
        <el-form-item label="监听器类型" prop="listenerType">
          <el-select v-model="form.listenerType" placeholder="请选择监听器类型">
            <el-option
              v-for="listenerType in listenerTypeOptions"
              :key="listenerType.value"
              :label="listenerType.label"
              :value="listenerType.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监听器事件" prop="listenerEvent">
          <el-input v-model="form.listenerEvent" placeholder="请输入监听器事件" />
        </el-form-item>
        <el-form-item label="执行类型" prop="valueType">
          <el-select v-model="form.valueType" placeholder="请选择执行类型">
            <el-option
              v-for="valueType in valueTypeOptions"
              :key="valueType.value"
              :label="valueType.label"
              :value="valueType.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行内容" prop="listenerValue">
          <el-input v-model="form.listenerValue" type="textarea" placeholder="请输入执行内容(类名称或表达式)" />
        </el-form-item>
        <el-form-item label="字段注入" prop="fieldsJson">
          <el-input v-model="form.fieldsJson" type="textarea" :placeholder="fieldsJsonPlaceholder" />
        </el-form-item>
        <el-form-item label="说明" prop="listenerDesc">
          <el-input v-model="form.listenerDesc" type="textarea" placeholder="请输入说明" />
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
  listListeners,
  getListeners,
  delListeners,
  addListeners,
  updateListeners,
} from "@/api/workflow/listeners";

const listenerTypeList = [
  {
    label: "执行监听器",
    value: 1,
  },
  {
    label: "任务监听器",
    value: 2,
  },
];

const valueTypeList = [
  {
    label: "class",
    value: 1,
  },
  {
    label: "expression",
    value: 2,
  },
];

export default {
  name: "Listener",
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
      // 流程监听器表格数据
      listenerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        listenerName: undefined,
        listenerType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        listenerName: [
          { required: true, message: "请输入流程名称", trigger: "blur" },
        ],
        listenerType: [
          { required: true, message: "请选择监听器类型", trigger: "blur" },
        ],
        valueType: [
          { required: true, message: "请选择执行类型", trigger: "blur" },
        ],
        listenerValue: [
          { required: true, message: "请输入执行内容", trigger: "blur" },
        ],
      },
      //
      listenerTypeOptions: listenerTypeList,
      //
      valueTypeOptions: valueTypeList,
      //
      fieldsJsonPlaceholder:
        '例:[{"name":"u","stringValue":"123","expression":"${exp}"}]',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    optionsFormat(options, value) {
      return options.find((t) => t.value === value).label;
    },
    /** 查询流程监听器列表 */
    getList() {
      this.loading = true;
      listListeners(this.queryParams).then((response) => {
        this.listenerList = response.rows;
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
        listenerId: undefined,
        listenerName: undefined,
        listenerType: undefined,
        listenerEvent: undefined,
        valueType: undefined,
        listenerValue: undefined,
        fieldsJson: undefined,
        listenerDesc: undefined,
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
      this.ids = selection.map((item) => item.listenerId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流程监听器";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const listenerId = row.listenerId || this.ids;
      getListeners(listenerId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程监听器";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.listenerId != undefined) {
            updateListeners(this.form.listenerId, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addListeners(this.getFormArray(this.form)).then((response) => {
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
      const listenerIds = row.listenerId || this.ids;
      this.$confirm(
        '是否确认删除流程监听器编号为"' + listenerIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delListeners(listenerIds);
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