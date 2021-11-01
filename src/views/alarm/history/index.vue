<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="设备名称" prop="equName">
        <el-input
          v-model="queryParams.equName"
          placeholder="请输入设备名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="位号名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入位号名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="报警规则" prop="alarmRuleName">
        <el-input
          v-model="queryParams.alarmRuleName"
          placeholder="请输入报警规则"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="报警时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态">
          <el-option
            v-for="status in statusOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          >
          </el-option>
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

    <el-table v-loading="loading" :data="alarmList">
      <el-table-column type="index" label="序号" align="center" width="55" />
      <el-table-column
        label="设备"
        align="left"
        width="350"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.equName + "(" + scope.row.equCode + ")" }}
        </template>
      </el-table-column>
      <el-table-column
        label="位号"
        align="left"
        width="350"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.channelName + "(" + scope.row.channelCode + ")" }}
        </template>
      </el-table-column>
      <el-table-column
        label="报警规则"
        prop="alarmRuleName"
        align="left"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column label="报警时间" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="持续时间(s)"
        align="left"
        width="100"
      >
        <template slot-scope="scope"> 
          {{ scope.row.status === 0 ? scope.row.continuedPeriodSecond : "-"}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200" prop="status">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 0 ? 'primary' : 'danger'"
            disable-transitions
          >
            {{ scope.row.status === 0 ? "恢复正常" : "报警发生" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >
            查看
          </el-button>
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

    <AlarmDataView
      v-if="alarmDataViewVisiable"
      :alarmDataViewVisiable.sync="alarmDataViewVisiable"
      :alarmDataTitle="alarmDataTitle"
      :alarmData="alarmData"
    />
  </div>
</template>

<script>
import { listAlarmHistory } from "@/api/alarm/history";
import AlarmDataView from "@/views/components/alarm/AlarmDataView";

export default {
  name: "AlarmHistory",
  components: { AlarmDataView },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equName: undefined,
        channelName: undefined,
        alarmRuleName: undefined,
        startTime: undefined,
        status: undefined,
      },
      // 时间查询
      dateRangeTime: [],
      // 时间快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      // 报警数据集合
      alarmList: [],
      //
      statusOptions: [
        { value: 0, label: "恢复正常" },
        { value: 1, label: "报警发生" },
      ],
      // 消警的数据
      // alarmData: undefined,
      //
      alarmDataViewVisiable: false,
      //
      alarmDataTitle: "历史报警查看",
      //
      alarmData: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRangeTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 获取历史报警数据
    getList() {
      this.loading = true;
      listAlarmHistory(this.queryParams).then((response) => {
        //console.log(response);
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查看点击事件 */
    handleView(row) {
      this.alarmDataViewVisiable = true;
      this.alarmDataTitle = "历史报警查看";
      this.alarmData = { ...row };
    },
  },
};
</script>