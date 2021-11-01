<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="区域人数" prop="persons">
        <el-input
          v-model="queryParams.persons"
          placeholder="请输入区域人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域面积" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入区域面积"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
      <el-form-item label="区域类型" prop="areaType">
        <el-select v-model="queryParams.areaType" placeholder="请选择区域类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="父能耗区域id" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父能耗区域id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全称" prop="fullLevelName">
        <el-input
          v-model="queryParams.fullLevelName"
          placeholder="请输入全称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者id" prop="createId">
        <el-input
          v-model="queryParams.createId"
          placeholder="请输入创建者id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者时间" prop="createDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建者时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更改者id" prop="updateId">
        <el-input
          v-model="queryParams.updateId"
          placeholder="请输入更改者id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更改者" prop="updator">
        <el-input
          v-model="queryParams.updator"
          placeholder="请输入更改者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更改者时间" prop="updateDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.updateDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择更改者时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="全称编码" prop="nhRank">
        <el-input
          v-model="queryParams.nhRank"
          placeholder="请输入全称编码"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['energy/basic:area:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="areaList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="区域人数" align="center" prop="persons" />
      <el-table-column label="区域面积" align="center" prop="area" />
      <el-table-column label="区域编码" align="center" prop="areaCode" />
      <el-table-column label="区域名称" align="center" prop="areaName" />
      <el-table-column label="区域类型" align="center" prop="areaType" />
      <el-table-column label="父能耗区域id" align="center" prop="parentId" />
      <el-table-column label="全称" align="center" prop="fullLevelName" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建者id" align="center" prop="createId" />
      <el-table-column label="创建者" align="center" prop="creator" />
      <el-table-column label="创建者时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更改者id" align="center" prop="updateId" />
      <el-table-column label="更改者" align="center" prop="updator" />
      <el-table-column label="更改者时间" align="center" prop="updateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全称编码" align="center" prop="nhRank" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['energy/basic:area:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['energy/basic:area:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改能耗地理区域对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区域人数" prop="persons">
          <el-input v-model="form.persons" placeholder="请输入区域人数" />
        </el-form-item>
        <el-form-item label="区域面积" prop="area">
          <el-input v-model="form.area" placeholder="请输入区域面积" />
        </el-form-item>
        <el-form-item label="区域编码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入区域编码" />
        </el-form-item>
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="区域类型">
          <el-select v-model="form.areaType" placeholder="请选择区域类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="父能耗区域id" prop="parentId">
          <treeselect v-model="form.parentId" :options="areaOptions" :normalizer="normalizer" placeholder="请选择父能耗区域id" />
        </el-form-item>
        <el-form-item label="全称" prop="fullLevelName">
          <el-input v-model="form.fullLevelName" placeholder="请输入全称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="创建者id" prop="createId">
          <el-input v-model="form.createId" placeholder="请输入创建者id" />
        </el-form-item>
        <el-form-item label="创建者" prop="creator">
          <el-input v-model="form.creator" placeholder="请输入创建者" />
        </el-form-item>
        <el-form-item label="创建者时间" prop="createDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.createDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建者时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更改者id" prop="updateId">
          <el-input v-model="form.updateId" placeholder="请输入更改者id" />
        </el-form-item>
        <el-form-item label="更改者" prop="updator">
          <el-input v-model="form.updator" placeholder="请输入更改者" />
        </el-form-item>
        <el-form-item label="更改者时间" prop="updateDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.updateDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更改者时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="全称编码" prop="nhRank">
          <el-input v-model="form.nhRank" placeholder="请输入全称编码" />
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
import { listArea, getArea, delArea, addArea, updateArea, exportArea } from "@/api/energy/basic/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Area",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 能耗地理区域表格数据
      areaList: [],
      // 能耗地理区域树选项
      areaOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        persons: undefined,
        area: undefined,
        areaCode: undefined,
        areaName: undefined,
        areaType: undefined,
        parentId: undefined,
        fullLevelName: undefined,
        sort: undefined,
        createId: undefined,
        creator: undefined,
        createDate: undefined,
        updateId: undefined,
        updator: undefined,
        updateDate: undefined,
        nhRank: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询能耗地理区域列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then(response => {
        this.areaList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换能耗地理区域数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.areaName,
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      listArea().then(response => {
        this.areaOptions = [];
        const data = { id: 0, areaName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.areaOptions.push(data);
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
        persons: undefined,
        area: undefined,
        areaCode: undefined,
        areaName: undefined,
        areaType: undefined,
        parentId: undefined,
        fullLevelName: undefined,
        sort: undefined,
        remark: undefined,
        createId: undefined,
        creator: undefined,
        createDate: undefined,
        updateId: undefined,
        updator: undefined,
        updateDate: undefined,
        nhRank: undefined
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
    handleAdd() {
      this.reset();
	  this.getTreeselect();
      this.open = true;
      this.title = "添加能耗地理区域";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
	  this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      getArea(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改能耗地理区域";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateArea(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addArea(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除能耗地理区域编号为"' + row.id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delArea(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>