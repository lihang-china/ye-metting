<template>
  <el-dialog
    width="80%"
    title="历史报警查看"
    :visible.sync="isHisEventData"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="88px"
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
      <el-form-item label="时间">
        <el-date-picker
          v-model="dateRangeTime"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
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

    <el-row :gutter="20">
      <el-col :span="16">
        <el-table
          v-loading="loading"
          :data="alarmList"
          highlight-current-row
          @current-change="handleCurrentChange"
          height="560px"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="55"
          />
          <el-table-column
            label="设备名称"
            align="left"
            width="300"
            prop="equName"
            show-overflow-tooltip
          />
          <el-table-column
            label="位号名称"
            align="left"
            width="300"
            prop="channelName"
            show-overflow-tooltip
          />
          <el-table-column
            label="报警时间"
            align="center"
            prop="collectTime"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.collectTime) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="报警类型"
            align="center"
            width="200"
            prop="eventType"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.eventType === 0 ? "报警" : "故障" }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="数值" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.value.toString() }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="100"
            prop="status"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 0 ? 'primary' : 'danger'"
                disable-transitions
              >
                {{ scope.row.status === 0 ? "已处理" : "未处理" }}
              </el-tag>
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
      </el-col>
      <el-col :span="8">
        <AlarmView :alarmData="alarmData" v-if="open" />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getHistoryAlarm } from "@/api/equipment/alarm";
import AlarmView from "@/views/components/alarm/AlarmView";

export default {
  name: "HisEventData",
  components: { AlarmView },
  props: {
    isHisEventData: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
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
        collectorSerialCode: undefined,
        channelEventId: undefined,
      },
      // 时间查询
      dateRangeTime: [],
      // 时间快捷选项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // 报警数据集合
      alarmList: [],
      // 弹窗开启/关闭
      open: false,
      // 消警的数据
      alarmData: undefined,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 添加日期范围
    addDateRangeAlarm(params, dateRange) {
      var search = params;
      search.startTime = "";
      search.endTime = "";
      if (null != dateRange && "" != dateRange) {
        search.startTime = dateRange[0];
        search.endTime = dateRange[1];
      }
      return search;
    },
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
      const param = this.addDateRangeAlarm(
        this.queryParams,
        this.dateRangeTime
      );
      getHistoryAlarm(param).then((response) => {
        //console.log(response);
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查看点击事件 */
    handleCurrentChange(row) {
      this.alarmData = { ...row };
      //console.log(this.alarmData);
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isHisEventData", false); // 直接修改父组件的属性
    },
  },
};
</script>