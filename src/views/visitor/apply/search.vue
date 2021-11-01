<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="申请类型" prop="applyType">
        <el-select
          v-model="queryParams.applyType"
          placeholder="请选择申请类型"
          clearable
          size="small"
        >
          <el-option
            v-for="applyType in applyTypeOptions"
            :key="applyType.value"
            :label="applyType.label"
            :value="applyType.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来访人姓名" prop="visitorName">
        <el-input
          v-model="queryParams.visitorName"
          placeholder="请输入来访人姓名"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="来访人手机号" prop="visitorPhone">
        <el-input
          v-model="queryParams.visitorPhone"
          placeholder="请输入来访人手机号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="来访人数">
        <el-input
          v-model="queryParams.visitorNumMin"
          placeholder="请输入来访人数"
          clearable
          size="small"
          style="width: 150px"
        />
        至
        <el-input
          v-model="queryParams.visitorNumMax"
          placeholder="请输入来访人数"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
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
      <el-form-item label="被访人手机号" prop="intervieweePhone">
        <el-input
          v-model="queryParams.intervieweePhone"
          placeholder="请输入被访人手机号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="访问园区" prop="parkId">
        <el-select
          v-model="queryParams.parkId"
          placeholder="请选择访问园区"
          clearable
          size="small"
        >
          <el-option
            v-for="park in parkOptions"
            :key="park.id"
            :label="park.label"
            :value="park.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择申请状态"
          clearable
          size="small"
        >
          <el-option
            v-for="status in statusOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          ></el-option>
        </el-select>
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

    <el-table v-loading="loading" :data="visitorList" style="width: 100%">
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
      <el-table-column
        label="车牌号"
        align="center"
        prop="carNumber"
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
        fixed="right"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            >查看</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-picture"
            @click="handleQrCode(scope.row)"
            v-if="scope.row.status === 1"
            >二维码</el-button
          > -->
          <el-popover placement="bottom" trigger="click">
            <QrCodeView v-if="scope.row.status === 1" :id="scope.row.id" />
            <el-button
              size="mini"
              type="text"
              icon="el-icon-picture"
              @click="handleQrCode(scope.row)"
              v-if="scope.row.status === 1"
              slot="reference"
              >二维码</el-button
            >
          </el-popover>
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

    <ApplyView
      v-if="applyViewVisiable"
      :applyViewVisiable.sync="applyViewVisiable"
      :apply="apply"
    />
  </div>
</template>

<script>
import { listSearchVisitor, getQRCode } from "@/api/visitor/apply";
import { treeListPark } from "@/api/equipment/area";
import ApplyView from "@/views/components/visitor/ApplyView";
import QrCodeView from "@/views/components/visitor/QrCodeView";

export default {
  name: "VisitorSearch",
  components: { ApplyView, QrCodeView },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 访客表格数据
      visitorList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyType: undefined,
        visitorName: undefined,
        visitorPhone: undefined,
        visitorNumMin: undefined,
        visitorNumMax: undefined,
        carNumber: undefined,
        startVisitDate: undefined,
        endVisitDate: undefined,
        intervieweePhone: undefined,
        parkId: undefined,
        status: undefined,
      },
      // 日期范围
      dateRangeVisitTime: [],
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
      // 访问园区合集
      parkOptions: [],
      // 状态合集
      statusOptions: [
        { value: 0, label: "待审核" },
        { value: 1, label: "已审核" },
      ],
      //
      applyViewVisiable: false,
      //
      apply: [],
      //
      id: undefined,
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
      listSearchVisitor(params).then((response) => {
        this.visitorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.queryParams.visitorNumMin = undefined;
      this.queryParams.visitorNumMax = undefined;
      this.handleQuery();
    },
    /** 查看按钮 */
    handleView(row) {
      this.apply = { ...row, applyType: this.applyTypeFormat(row.applyType) };
      this.applyViewVisiable = true;
    },
    handleQrCode(row) {
      //this.id = row.id;
    },
  },
};
</script>