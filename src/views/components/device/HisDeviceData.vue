<template>
  <el-dialog
    width="70%"
    title="历史数据查看"
    :visible.sync="isHisVisiable"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :inline="true" label-width="68px">
      <el-form-item label="起止时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 300px"
          value-format="timestamp"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
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

    <el-table v-loading="loading" :data="dataList" height="560px">
      <el-table-column label="序号" align="center" type="index" width="55" />
      <!-- <el-table-column label="位号编码" align="left" prop="channelCode" /> -->
      <el-table-column label="位号名称" align="left" prop="channelName" />
      <el-table-column label="值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value.toString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.collectTime) }}</span>
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

    <div slot="footer" class="dialog-footer">
      <el-button @click="modalClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { operateChannel } from "@/api/equipment/device";

export default {
  props: {
    isHisVisiable: {
      type: Boolean,
      default: false,
      require: true,
    },
    channelIds: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      //
      dateRange: [
        new Date().getTime() - 3600 * 1000 * 24,
        new Date().getTime(),
      ],
      //
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        Action: "GetHisDeviceData",
        ChannelIds: undefined,
        StartTime: undefined,
        EndTime: undefined,
      },
      //
      dataList: [],
      // 总条数
      total: 0,
      //
      loading: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.queryParams.ChannelIds = this.channelIds;
      if (null != this.dateRange && "" != this.dateRange) {
        this.queryParams.StartTime = this.dateRange[0];
        this.queryParams.EndTime = this.dateRange[1];
      }
      operateChannel(this.queryParams).then((response) => {
        this.dataList = response.rows;
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
      this.dateRange = [];
      this.handleQuery();
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isHisVisiable", false); // 直接修改父组件的属性
    },
  },
};
</script>