<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="teamName"
            placeholder="请输入班组名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="teamOptions"
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
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="保养项" prop="mitemName">
            <el-input
              v-model="queryParams.mitemName"
              placeholder="请输入保养项"
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
              v-hasPermi="['maintain:item:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['maintain:item:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['maintain:item:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['maintain:item:export']"
            >导出</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="保养项" align="center" prop="mitemName" />
          <el-table-column label="保养班组" align="center" prop="teamName" />
          <el-table-column
            label="结果类型"
            align="center"
            prop="resultType"
            :formatter="resultTypeFormat"
          />
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['maintain:item:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['maintain:item:remove']"
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

    <!-- 添加或修改保养项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="保养项" prop="mitemName">
          <el-input v-model="form.mitemName" placeholder="请输入保养项" clearable />
        </el-form-item>
        <el-form-item label="保养班组" prop="teamId">
          <treeselect v-model="form.teamId" :options="teamOptions" placeholder="请选择保养班组" />
        </el-form-item>
        <el-form-item label="结果类型" prop="resultType">
          <el-select v-model="form.resultType" placeholder="请选择结果类型" clearable width="300px">
            <el-option
              v-for="dict in resultTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结果选项" prop="resultOption" v-if="form.resultType == 2">
          <el-input v-model="form.resultOption" placeholder="请输入结果选项，并以-分割" clearable />
        </el-form-item>
        <el-form-item label="结果标准" prop="resultStandard" v-if="form.resultType == 2 ">
          <el-input v-model="form.resultStandard" placeholder="请输入结果选项之一" clearable />
        </el-form-item>
        <el-form-item label="结果标准" prop="resultStandard" v-if="form.resultType == 3 ">
          <el-input v-model="form.resultStandard" placeholder="请输入最小值和最大值，并以-分割" clearable />
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
  listItem,
  getItem,
  delItem,
  addItem,
  updateItem,
  exportItem
} from "@/api/maintain/item";
import { treeListTeam } from "@/api/equipment/team";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Item",
  components: { Treeselect },
  data() {
    let checkResultOption = (rule, value, callback) => {
      //console.log("value", value);
      if (value == undefined || value === "") {
        callback(new Error("请输入结果选项"));
      } else {
        if (value.indexOf("-") < 0) {
          callback(new Error("请输入结果选项,并以-分割"));
        } else {
          callback();
        }
      }
    };
    let checkResultStandard = (rule, value, callback) => {
      if (value == undefined || value === "") {
        callback(new Error("请输入结果标准"));
      } else {
        if (this.form.resultType === "2") {
          let resultOption = this.form.resultOption;
          if (resultOption.indexOf("-") > -1) {
            let resultOptions = resultOption.split("-");
            if (resultOptions.indexOf(value) < 0) {
              callback(new Error("请输入结果选项之一"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else if (this.form.resultType === "3") {
          if (value.indexOf("-") < 0) {
            callback(new Error("请输入最小值和最大值,并以-分割"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
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
      // 班组名称
      teamName: undefined,
      // 班组树
      teamOptions: [],
      // 结果类型
      resultTypeOptions: [],
      // 保养项表格数据
      itemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teamId: undefined,
        mitemName: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        mitemName: [
          { required: true, message: "请输入保养项", trigger: "blur" }
        ],
        teamId: [
          { required: true, message: "请选择保养班组班组", trigger: "blur" }
        ],
        resultType: [
          { required: true, message: "请选择结果类型", trigger: "blur" }
        ],
        resultOption: [{ validator: checkResultOption, trigger: "blur" }],
        resultStandard: [{ validator: checkResultStandard, trigger: "blur" }]
      }
    };
  },
  watch: {
    // 根据名称筛选班组树
    teamName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTeamTreeselect();
    this.getDicts("item_result_type").then(response => {
      this.resultTypeOptions = response.data;
    });
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.teamId = data.id;
      this.getList();
    },
    /** 查询保养项列表 */
    getList() {
      this.loading = true;
      listItem(this.queryParams).then(response => {
        this.itemList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 班组下拉树 */
    getTeamTreeselect() {
      treeListTeam({ teamId: this.maintainTeamId }).then(response => {
        this.teamOptions = [];
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.teamOptions.push(data);
        this.teamOptions = response.data;
      });
    },
    resultTypeFormat(row, column) {
      return this.selectDictLabel(this.resultTypeOptions, row.resultType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        mitemId: undefined,
        mitemGuid: undefined,
        mitemName: undefined,
        teamId: undefined,
        resultType: undefined,
        resultOption: undefined,
        resultStandard: undefined,
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
      this.ids = selection.map(item => item.mitemId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加保养项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const mitemId = row.mitemId || this.ids;
      getItem(mitemId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改保养项";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {          
          if (this.form.resultType === "1") {
            this.form.resultOption = null;
            this.form.resultStandard = null;
          } else if (this.form.resultType === "2") {
          } else {
            this.form.resultOption = null;
          }

          if (this.form.mitemId != undefined) {
            updateItem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addItem(this.form).then(response => {
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
      const mitemIds = row.mitemId || this.ids;
      this.$confirm(
        '是否确认删除保养项编号为"' + mitemIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delItem(mitemIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有保养项数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportItem(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>