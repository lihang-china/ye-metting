<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="能耗部门名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入能耗部门名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入能耗部门编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父能耗部门id" prop="pid">
        <el-input
          v-model="queryParams.pid"
          placeholder="请输入父能耗部门id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门地址" prop="deptAddr">
        <el-input
          v-model="queryParams.deptAddr"
          placeholder="请输入能耗部门地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门创建时间" prop="deptBuildDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.deptBuildDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择部门创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="部门创建时间" prop="deptFaxes">
        <el-input
          v-model="queryParams.deptFaxes"
          placeholder="请输入部门创建时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述" prop="enabled">
        <el-input
          v-model="queryParams.enabled"
          placeholder="请输入描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门电话" prop="deptTell">
        <el-input
          v-model="queryParams.deptTell"
          placeholder="请输入能耗部门电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门电话" prop="recordBuildDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.recordBuildDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择能耗部门电话">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="能耗部门电话" prop="recordBuilder">
        <el-input
          v-model="queryParams.recordBuilder"
          placeholder="请输入能耗部门电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门电话" prop="compId">
        <el-input
          v-model="queryParams.compId"
          placeholder="请输入能耗部门电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门电话" prop="companyCode">
        <el-input
          v-model="queryParams.companyCode"
          placeholder="请输入能耗部门电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="左" prop="lft">
        <el-input
          v-model="queryParams.lft"
          placeholder="请输入左"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="右" prop="rgt">
        <el-input
          v-model="queryParams.rgt"
          placeholder="请输入右"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="位置id" prop="locationId">
        <el-input
          v-model="queryParams.locationId"
          placeholder="请输入位置id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门人数" prop="persons">
        <el-input
          v-model="queryParams.persons"
          placeholder="请输入能耗部门人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门面积" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入能耗部门面积"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门面积" prop="deptPostcode">
        <el-input
          v-model="queryParams.deptPostcode"
          placeholder="请输入能耗部门面积"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="能耗部门面积" prop="nhRank">
        <el-input
          v-model="queryParams.nhRank"
          placeholder="请输入能耗部门面积"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sortIdx">
        <el-input
          v-model="queryParams.sortIdx"
          placeholder="请输入排序"
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
          v-hasPermi="['energy/basic:dept:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['energy/basic:dept:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['energy/basic:dept:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['energy/basic:dept:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="deptList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="能耗部门id" align="center" prop="id" />
      <el-table-column label="能耗部门名称" align="center" prop="name" />
      <el-table-column label="能耗部门编码" align="center" prop="code" />
      <el-table-column label="父能耗部门id" align="center" prop="pid" />
      <el-table-column label="能耗部门地址" align="center" prop="deptAddr" />
      <el-table-column label="部门创建时间" align="center" prop="deptBuildDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deptBuildDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门创建时间" align="center" prop="deptFaxes" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="描述" align="center" prop="enabled" />
      <el-table-column label="能耗部门电话" align="center" prop="deptTell" />
      <el-table-column label="能耗部门电话" align="center" prop="recordBuildDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.recordBuildDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="能耗部门电话" align="center" prop="recordBuilder" />
      <el-table-column label="能耗部门电话" align="center" prop="compId" />
      <el-table-column label="能耗部门电话" align="center" prop="companyCode" />
      <el-table-column label="左" align="center" prop="lft" />
      <el-table-column label="右" align="center" prop="rgt" />
      <el-table-column label="位置id" align="center" prop="locationId" />
      <el-table-column label="能耗部门人数" align="center" prop="persons" />
      <el-table-column label="能耗部门面积" align="center" prop="area" />
      <el-table-column label="能耗部门面积" align="center" prop="deptPostcode" />
      <el-table-column label="能耗部门面积" align="center" prop="nhRank" />
      <el-table-column label="排序" align="center" prop="sortIdx" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['energy/basic:dept:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['energy/basic:dept:remove']"
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

    <!-- 添加或修改能耗部门管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="能耗部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入能耗部门名称" />
        </el-form-item>
        <el-form-item label="能耗部门编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入能耗部门编码" />
        </el-form-item>
        <el-form-item label="父能耗部门id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入父能耗部门id" />
        </el-form-item>
        <el-form-item label="能耗部门地址" prop="deptAddr">
          <el-input v-model="form.deptAddr" placeholder="请输入能耗部门地址" />
        </el-form-item>
        <el-form-item label="部门创建时间" prop="deptBuildDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.deptBuildDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择部门创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门创建时间" prop="deptFaxes">
          <el-input v-model="form.deptFaxes" placeholder="请输入部门创建时间" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="描述" prop="enabled">
          <el-input v-model="form.enabled" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="能耗部门电话" prop="deptTell">
          <el-input v-model="form.deptTell" placeholder="请输入能耗部门电话" />
        </el-form-item>
        <el-form-item label="能耗部门电话" prop="recordBuildDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.recordBuildDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择能耗部门电话">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="能耗部门电话" prop="recordBuilder">
          <el-input v-model="form.recordBuilder" placeholder="请输入能耗部门电话" />
        </el-form-item>
        <el-form-item label="能耗部门电话" prop="compId">
          <el-input v-model="form.compId" placeholder="请输入能耗部门电话" />
        </el-form-item>
        <el-form-item label="能耗部门电话" prop="companyCode">
          <el-input v-model="form.companyCode" placeholder="请输入能耗部门电话" />
        </el-form-item>
        <el-form-item label="左" prop="lft">
          <el-input v-model="form.lft" placeholder="请输入左" />
        </el-form-item>
        <el-form-item label="右" prop="rgt">
          <el-input v-model="form.rgt" placeholder="请输入右" />
        </el-form-item>
        <el-form-item label="位置id" prop="locationId">
          <el-input v-model="form.locationId" placeholder="请输入位置id" />
        </el-form-item>
        <el-form-item label="能耗部门人数" prop="persons">
          <el-input v-model="form.persons" placeholder="请输入能耗部门人数" />
        </el-form-item>
        <el-form-item label="能耗部门面积" prop="area">
          <el-input v-model="form.area" placeholder="请输入能耗部门面积" />
        </el-form-item>
        <el-form-item label="能耗部门面积" prop="deptPostcode">
          <el-input v-model="form.deptPostcode" placeholder="请输入能耗部门面积" />
        </el-form-item>
        <el-form-item label="能耗部门面积" prop="nhRank">
          <el-input v-model="form.nhRank" placeholder="请输入能耗部门面积" />
        </el-form-item>
        <el-form-item label="排序" prop="sortIdx">
          <el-input v-model="form.sortIdx" placeholder="请输入排序" />
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
import { listDept, getDept, delDept, addDept, updateDept, exportDept } from "@/api/energy/basic/dept";

export default {
  name: "Dept",
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
      // 能耗部门管理表格数据
      deptList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        code: undefined,
        pid: undefined,
        deptAddr: undefined,
        deptBuildDate: undefined,
        deptFaxes: undefined,
        description: undefined,
        enabled: undefined,
        deptTell: undefined,
        recordBuildDate: undefined,
        recordBuilder: undefined,
        compId: undefined,
        companyCode: undefined,
        lft: undefined,
        rgt: undefined,
        locationId: undefined,
        persons: undefined,
        area: undefined,
        deptPostcode: undefined,
        nhRank: undefined,
        sortIdx: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "能耗部门名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "能耗部门编码不能为空", trigger: "blur" }
        ],
        pid: [
          { required: true, message: "父能耗部门id不能为空", trigger: "blur" }
        ],
        nhRank: [
          { required: true, message: "父能耗部门id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询能耗部门管理列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = response.rows;
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
        id: undefined,
        name: undefined,
        code: undefined,
        pid: undefined,
        deptAddr: undefined,
        deptBuildDate: undefined,
        deptFaxes: undefined,
        description: undefined,
        enabled: undefined,
        deptTell: undefined,
        recordBuildDate: undefined,
        recordBuilder: undefined,
        compId: undefined,
        companyCode: undefined,
        lft: undefined,
        rgt: undefined,
        locationId: undefined,
        persons: undefined,
        area: undefined,
        deptPostcode: undefined,
        nhRank: undefined,
        sortIdx: undefined
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加能耗部门管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDept(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改能耗部门管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDept(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDept(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除能耗部门管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDept(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有能耗部门管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDept(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>