<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="巡检路线编码" prop="plineCode">
        <el-input v-model="queryParams.plineCode" placeholder="请输入巡检路线编码" clearable size="small" />
      </el-form-item>
      <el-form-item label="巡检路线名称" prop="plineName">
        <el-input v-model="queryParams.plineName" placeholder="请输入巡检路线名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="巡检路线状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择巡检路线状态" clearable size="small">
          <el-option label="启用" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
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
          v-hasPermi="['patrol:line:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['patrol:line:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['patrol:line:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['patrol:line:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="handleStatus(undefined, '0')"
        >启用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-close"
          size="mini"
          :disabled="multiple"
          @click="handleStatus(undefined, '1')"
        >停用</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="lineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="60" />
      <el-table-column label="巡检路线编码" align="center" sortable prop="plineCode" width="250" />
      <el-table-column label="巡检路线名称" align="center" sortable prop="plineName" width="250" />
      <el-table-column
        label="巡检路线类型"
        align="center"
        sortable
        prop="plineType"
        :formatter="plineTypeFormat"
        width="200"
      />
      <el-table-column label="创建时间" align="center" sortable prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.status === '1'? "停用" : "启用" }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.status === '1'">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['patrol:line:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['patrol:line:remove']"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-tools"
              @click="handleSet(scope.row, 'edit')"
            >巡检配置</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-check"
              @click="handleStatus(scope.row, '0')"
            >启用</el-button>
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-tools"
              @click="handleSet(scope.row, 'view')"
            >巡检配置查看</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="handleStatus(scope.row, '1')"
            >停用</el-button>
          </div>
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

    <!-- 添加或修改巡检路线 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="巡检路线编码" prop="plineCode">
          <el-input v-model="form.plineCode" placeholder="请输入巡检路线编码" />
        </el-form-item>
        <el-form-item label="巡检路线名称" prop="plineName">
          <el-input v-model="form.plineName" placeholder="请输入巡检路线名称" />
        </el-form-item>
        <el-form-item label="巡检路线类型" prop="plineType">
          <el-select v-model="form.plineType" placeholder="请选择巡检路线类型">
            <el-option
              v-for="dict in plineTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
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
  listLine,
  getLine,
  delLine,
  addLine,
  updateLine,
  exportLine,
  changeLineStatus,
} from "@/api/patrol/line";

export default {
  name: "Pline",
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
      // 巡检项类型
      plineTypeOptions: [],
      // 巡检路线 表格数据
      lineList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        plineCode: undefined,
        plineName: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        plineCode: [
          { required: true, message: "请输入巡检路线编码", trigger: "blur" },
        ],
        plineName: [
          { required: true, message: "请输入巡检路线名称", trigger: "blur" },
        ],
        plineType: [
          { required: true, message: "请选择巡检路线类型", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("patrol_line_type").then((response) => {
      this.plineTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询巡检路线 列表 */
    getList() {
      this.loading = true;
      listLine(this.queryParams).then((response) => {
        this.lineList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    plineTypeFormat(row, column) {
      return this.selectDictLabel(this.plineTypeOptions, row.plineType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        plineId: undefined,
        plineGuid: undefined,
        plineCode: undefined,
        plineName: undefined,
        plineType: undefined,
        status: undefined,
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
      this.ids = selection.map((item) => item.plineId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加巡检路线 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const plineId = row.plineId || this.ids;
      getLine(plineId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改巡检路线 ";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.plineId != undefined) {
            updateLine(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addLine(this.form).then((response) => {
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
      const plineIds = row.plineId || this.ids;
      this.$confirm("是否确认删除选中的巡检路线?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        delLine(plineIds)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有巡检路线 数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportLine(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 巡检配置 */
    handleSet(row, operate) {
      const { plineId } = row;
      this.$router.push({
        name: "SetLine",
        params: { plineId: plineId, operate: operate },
      });
    },
    /** 启用/停用 */
    handleStatus(row, status) {
      const plineIds = row ? row.plineId : this.ids;
      let text = status === "0" ? "启用" : "停用";
      this.$confirm("是否确认" + text + "选中的巡检路线", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading(
          "正在" + text + "巡检任务,请稍候......"
        );
        changeLineStatus(plineIds, status)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess(text + "成功!");
              this.getList();
            } else {
              this.msgError(text + "失败!");
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
  },
};
</script>