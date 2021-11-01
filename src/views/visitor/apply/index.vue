<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="来访人姓名" prop="visitorName">
        <el-input
          v-model="queryParams.visitorName"
          placeholder="请输入来访人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="访问时间">
        <el-date-picker
          v-model="dateRangeVisitTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="visitorList">
      <el-table-column label="序号" type="index" align="center" width="55" />
      <el-table-column label="申请类型" align="center" width="170">
        <template slot-scope="scope">
          {{ applyTypeFormat(scope.row.applyType) }}
        </template>
      </el-table-column>
      <el-table-column label="来访人姓名" align="center" prop="visitorName" />
      <el-table-column
        label="来访人手机号"
        align="center"
        prop="visitorPhone"
        width="170"
      />
      <el-table-column
        label="来访人数"
        align="center"
        prop="visitorNum"
        width="100"
      />
      <el-table-column label="来访时间" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.startVisitDate, "{y}-{m}-{d}") }} 至
          {{ parseTime(scope.row.endVisitDate, "{y}-{m}-{d}") }}
        </template>
      </el-table-column>
      <el-table-column
        label="被访人手机号"
        align="center"
        prop="intervieweePhone"
        width="170"
      />
      <el-table-column label="访问园区" align="center" prop="parkName" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          {{
            scope.row.status === 0
              ? "待审核"
              : scope.row.status === 1
              ? "已审核"
              : "未提交"
          }}
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
            v-if="scope.row.status === -1"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="handleSubmit(scope.row)"
            v-if="scope.row.status === -1"
            >提交</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status === -1"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-if="scope.row.status != -1"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改访客对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label="申请类型" prop="applyType">
              <el-select v-model="form.applyType" placeholder="请选择申请类型">
                <el-option
                  v-for="applyType in applyTypeOptions"
                  :key="applyType.value"
                  :label="applyType.label"
                  :value="applyType.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访人姓名" prop="visitorName">
              <el-input
                v-model="form.visitorName"
                placeholder="请输入来访人姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访人手机号" prop="visitorPhone">
              <el-input
                v-model="form.visitorPhone"
                placeholder="请输入来访人手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访人数" prop="visitorNum">
              <el-input-number
                v-model="form.visitorNum"
                placeholder="请输入来访人数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="carNumber">
              <el-input v-model="form.carNumber" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访开始时间" prop="startVisitDate">
              <el-date-picker
                clearable
                size="small"
                style="width: 200px"
                v-model="form.startVisitDate"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="选择来访开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访结束时间" prop="endVisitDate">
              <el-date-picker
                clearable
                size="small"
                style="width: 200px"
                v-model="form.endVisitDate"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="选择来访结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="来访事由" prop="reason">
              <el-input
                v-model="form.reason"
                type="textarea"
                placeholder="请输入来访事由"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被访人手机号" prop="intervieweePhone">
              <el-input
                v-model="form.intervieweePhone"
                placeholder="请输入被访人手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问园区" prop="parkId">
              <el-select v-model="form.parkId" placeholder="请选择访问园区">
                <el-option
                  v-for="park in parkOptions"
                  :key="park.id"
                  :label="park.label"
                  :value="park.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <ApplyView
      v-if="applyViewVisiable"
      :applyViewVisiable.sync="applyViewVisiable"
      :apply="apply"
    />
  </div>
</template>

<script>
import {
  listVisitor,
  getVisitor,
  delVisitor,
  addVisitor,
  updateVisitor,
  submitVisitor,
} from "@/api/visitor/apply";
import { treeListPark } from "@/api/equipment/area";
import ApplyView from "@/views/components/visitor/ApplyView";

export default {
  name: "VisitorApply",
  components: { ApplyView },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 访客表格数据
      visitorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        visitorName: undefined,
        startVisitDate: undefined,
        endVisitDate: undefined,
      },
      // 日期范围
      dateRangeVisitTime: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        visitorName: [
          { required: true, message: "请输入来访人姓名", trigger: "blur" },
        ],
        visitorPhone: [
          { required: true, message: "请输入来访人手机号", trigger: "blur" },
        ],
        applyType: [
          { required: true, message: "请选择申请类型", trigger: "blur" },
        ],
        visitorNum: [
          { required: true, message: "请输入来访人数", trigger: "blur" },
        ],
        carNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
        startVisitDate: [
          { required: true, message: "请选择来访开始时间", trigger: "blur" },
        ],
        endVisitDate: [
          { required: true, message: "请选择来访结束时间", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请输入来访事由", trigger: "blur" },
        ],
        intervieweePhone: [
          { required: true, message: "请输入被访人手机号", trigger: "blur" },
        ],
        parkId: [
          { required: true, message: "请选择访问园区", trigger: "blur" },
        ],
      },
      // 申请类型
      applyTypeOptions: [
        {
          value: 0,
          label: "访客申请",
        },
        {
          value: 1,
          label: "替访客申请",
        },
      ],
      //
      parkOptions: [],
      //
      applyViewVisiable: false,
      //
      apply: [],
    };
  },
  created() {
    this.getPark();
    this.getList();
  },
  methods: {
    applyTypeFormat(value) {
      return this.applyTypeOptions.find((t) => t.value === value).label;
    },
    addDateRanges(params, visitDate) {
      var search = params;
      search.startVisitDate = "";
      search.endVisitDate = "";
      if (null != visitDate && "" != visitDate) {
        search.startVisitDate = visitDate[0];
        search.endVisitDate = visitDate[1];
      }
      return search;
    },
    getPark() {
      treeListPark().then((response) => {
        this.parkOptions = [];
        this.parkOptions = response.data;
      });
    },
    /** 查询访客列表 */
    getList() {
      this.loading = true;
      const params = this.addDateRanges(
        this.queryParams,
        this.dateRangeVisitTime
      );
      listVisitor(params).then((response) => {
        this.visitorList = response.rows;
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
        visitorName: undefined,
        visitorPhone: undefined,
        applyType: undefined,
        carNumber: undefined,
        visitorNum: undefined,
        reason: undefined,
        startVisitDate: undefined,
        endVisitDate: undefined,
        intervieweePhone: undefined,
        parkId: undefined,
        status: -1,
        workflowId: 1160,
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
      this.dateRangeVisitTime = [];
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加访客";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getVisitor(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改访客";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateVisitor(this.form.id, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addVisitor(this.getFormArray(this.form)).then((response) => {
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
      const ids = row.id;
      this.$confirm("是否确认删除该访客申请?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        delVisitor(ids).then((response) => {
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("删除成功");
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      });
    },
    /** 提交按钮 */
    handleSubmit(row) {
      const ids = row.id;
      this.$confirm("是否确认提交该访客申请?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading("正在提交,请稍后......");
        submitVisitor(ids).then((response) => {
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("提交成功");
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      });
    },
    /** 查看按钮 */
    handleView(row) {
      this.apply = { ...row, applyType: this.applyTypeFormat(row.applyType) };
      this.applyViewVisiable = true;
    },
  },
};
</script>