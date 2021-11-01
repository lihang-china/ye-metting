<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="巡检项" prop="pitemName">
        <el-input
          v-model="queryParams.pitemName"
          placeholder="请输入巡检项"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="巡检项类型" prop="pitemType">
        <el-select v-model="queryParams.pitemType" placeholder="请选择巡检项类型" clearable size="small">
          <el-option
            v-for="dict in itemTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡检项分类" prop="pitemClass">
        <el-select v-model="queryParams.pitemClass" placeholder="请选择巡检项分类" clearable size="small">
          <el-option
            v-for="dict in itemClassOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
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
          v-hasPermi="['patrol:item:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="itemList"
      row-key="pitemId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="巡检项" align="center" prop="pitemName" />
      <el-table-column label="巡检项类型" align="center" prop="pitemType" :formatter="itemTypeFormat" />
      <el-table-column label="巡检项分类" align="center" prop="pitemClass" :formatter="itemClassFormat" />
      <el-table-column
        label="巡检结果类型"
        align="center"
        prop="resultType"
        :formatter="resultTypeFormat"
      />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
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
            v-hasPermi="['patrol:item:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['patrol:area:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['patrol:item:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改巡检项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-form-item label="上级巡检项" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="itemOptions"
            :normalizer="normalizer"
            placeholder="请选择上级巡检项"
          />
        </el-form-item>
        <el-form-item label="巡检项类型" prop="pitemType">
          <el-radio-group v-model="form.pitemType">
            <el-radio
              v-for="dict in itemTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="巡检项分类" prop="pitemClass">
          <el-select v-model="form.pitemClass" placeholder="请选择巡检项分类" clearable width="300px">
            <el-option
              v-for="dict in itemClassOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检项" prop="pitemName">
          <el-input v-model="form.pitemName" placeholder="请输入巡检项" />
        </el-form-item>
        <el-form-item label="结果类型" prop="resultType" v-if="form.pitemType == 2">
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
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
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
  exportItem,
} from "@/api/patrol/item";
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
      // 巡检项类型
      itemTypeOptions: [],
      // 巡检项分类
      itemClassOptions: [],
      // 结果类型
      resultTypeOptions: [],
      // 巡检项表格数据
      itemList: [],
      // 巡检项树选项
      itemOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pitemName: undefined,
        pitemType: undefined,
        pitemClass: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "请选择上级巡检项", trigger: "blur" },
        ],
        pitemType: [
          { required: true, message: "请选择巡检项类型", trigger: "blur" },
        ],
        pitemClass: [
          { required: true, message: "请选择巡检项分类", trigger: "blur" },
        ],
        pitemName: [
          { required: true, message: "请输入巡检项", trigger: "blur" },
        ],
        resultType: [
          { required: true, message: "请选择结果类型", trigger: "blur" },
        ],
        resultOption: [{ validator: checkResultOption, trigger: "blur" }],
        resultStandard: [{ validator: checkResultStandard, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("patrol_item_type").then((response) => {
      this.itemTypeOptions = response.data;
    });
    this.getDicts("patrol_item_class").then((response) => {
      this.itemClassOptions = response.data;
    });
    this.getDicts("item_result_type").then((response) => {
      this.resultTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询巡检项列表 */
    getList() {
      this.loading = true;
      listItem(this.queryParams).then((response) => {
        this.itemList = this.handleTree(response.data, "pitemId", "parentId");
        this.loading = false;
      });
    },
    /** 转换巡检项数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.pitemId,
        label: node.pitemName,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listItem().then((response) => {
        this.itemOptions = [];
        const data = { pitemId: 0, pitemName: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "pitemId", "parentId");
        this.itemOptions.push(data);
      });
    },
    itemTypeFormat(row, column) {
      return this.selectDictLabel(this.itemTypeOptions, row.pitemType);
    },
    itemClassFormat(row, column) {
      return this.selectDictLabel(this.itemClassOptions, row.pitemClass);
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
        pitemId: undefined,
        pitemGuid: undefined,
        pitemName: undefined,
        pitemType: undefined,
        pitemClass: undefined,
        resultType: undefined,
        resultOption: undefined,
        resultStandard: undefined,
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
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.pitemId;
        this.form.pitemClass = row.pitemClass;
      }
      this.open = true;
      this.title = "添加巡检项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.pitemId;
      }
      getItem(row.pitemId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改巡检项";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pitemType == "1") {
            this.form.resultType = '';
            this.form.resultOption = '';
            this.form.resultStandard = '';
          } else {
            if (this.form.resultType === "1") {
              this.form.resultOption = '';
              this.form.resultStandard = '';
            } else if (this.form.resultType === "2") {
            } else {
              this.form.resultOption = '';
            }
          }

          if (this.form.pitemId != undefined) {
            updateItem(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addItem(this.form).then((response) => {
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
        '是否确认删除巡检项编号为"' + row.pitemId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delItem(row.pitemId);
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