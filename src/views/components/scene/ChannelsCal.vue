<template>
  <el-dialog
    width="75%"
    title="位号设置"
    :visible.sync="channelsCalVisiable"
    :before-close="modalClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="queryForm"
      :model="queryParams"
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
      <el-form-item label="设备编号" prop="equCode">
        <el-input
          v-model="queryParams.equCode"
          placeholder="请输入设备编号"
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
      <el-form-item label="位号编号" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入位号编号"
          clearable
          size="small"
        />
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="select"
          v-if="!isView"
          >选择位号</el-button
        >
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          @click="submit"
          v-if="!isView"
          >确认</el-button
        >
        <el-button type="info" icon="el-icon-close" size="mini" @click="cancel"
          >关闭</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="channelsList" height="510px">
      <el-table-column label="序号" type="index" align="center" width="55" />
      <el-table-column
        label="所属设备名称"
        align="left"
        prop="equName"
        show-overflow-tooltip
      />
      <el-table-column
        label="所属设备编号"
        align="left"
        prop="equCode"
        show-overflow-tooltip
      />
      <el-table-column
        label="位号名称"
        align="left"
        prop="channelName"
        show-overflow-tooltip
      />
      <el-table-column
        label="位号编号"
        align="left"
        prop="channelCode"
        show-overflow-tooltip
      />
      <el-table-column label="位号类型" align="left">
        <template slot-scope="scope">
          {{ channelTypeFormat(scope.row.channelType) }}
        </template>
      </el-table-column>
      <el-table-column label="下至值" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.value"
            placeholder="请输入下至值"
            clearable
            size="small"
            :disabled="isView"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getChannelsList"
    />

    <ChannelsSub
      v-if="channelsSubVisiable"
      :channelsSubVisiable.sync="channelsSubVisiable"
      :equJobCalendarId="equJobCalendarId"
      :equTimeJobId="equTimeJobId"
      :equScenesCategoryId="equScenesCategoryId"
      :refreshList="getChannelsList"
    />
  </el-dialog>
</template>

<script>
import {
  addChannels,
  updateChannels,
  getChannels,
} from "@/api/calendar/timejobs";
import ChannelsSub from "./ChannelsSub";

export default {
  name: "ChannelsCal",
  components: { ChannelsSub },
  props: {
    channelsCalVisiable: {
      type: Boolean,
      default: false,
    },
    equJobCalendarId: {
      type: Number,
    },
    equTimeJobId: {
      type: Number,
    },
    equScenesCategoryId: {
      type: Number,
    },
    refreshList: {
      type: Function,
    },
    isView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //
      loading: true,
      //
      total: 0,
      //
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equTimeJobId: undefined,
        equScenesCategoryId: undefined,
        //channelType: undefined,
        channelName: undefined,
        channelCode: undefined,
        equName: undefined,
        equCode: undefined,
      },
      //
      channelsList: [],
      //
      channelsSubVisiable: false,
      // 位号类型字典
      channelTypeOptions: [
        { label: "开关量", value: "0" },
        { label: "模拟量", value: "1" },
        { label: "字符串", value: "2" },
      ],
    };
  },
  created() {
    this.queryParams.equTimeJobId = this.equTimeJobId;
    this.queryParams.equScenesCategoryId = this.equScenesCategoryId;
    this.getChannelsList();
  },
  methods: {
    // 翻译
    channelTypeFormat(value) {
      return this.channelTypeOptions.find((t) => t.value === value).label;
    },
    modalClose() {
      this.$emit("update:channelsCalVisiable", false); // 直接修改父组件的属性
    },
    getChannelsList() {
      this.loading = true;
      getChannels(this.queryParams).then((response) => {
        this.channelsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getChannelsList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    select() {
      this.channelsSubVisiable = true;
    },
    submit() {
      const data = [...this.channelsList];
      const loading = this.openLoading("正在提交,请稍后......");
      updateChannels(data).then((response) => {
        loading.close();
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.modalClose();
          this.refreshList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    cancel() {
      this.modalClose();
    },
  },
};
</script>