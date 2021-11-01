<template>
  <div>
    <el-form label-width="98px" v-loading="loading">
      <el-col :span="24">
        <el-form-item label="设备名称:">
          <span>{{ alarmData.equName }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="位号名称:">
          <span>{{ alarmData.channelName }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="报警时间:">
          <span>{{ parseTime(alarmData.collectTime) }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="报警类型:">
          <span>{{ event.eventType === 0 ? "报警" : "故障" }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="数值:">
          <span>{{ alarmData.value }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="状态:">
          <span>{{ alarmData.status === 0 ? "已处理" : "未处理" }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="alarmData.status === 0">
        <el-form-item label="处理时间:">
          <span>{{ parseTime(alarmData.dealTime) }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="alarmData.status === 0">
        <el-form-item label="处理说明:">
          <span>{{ alarmData.dealNotes }}</span>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import { getEvent } from "@/api/equipment/event.js";

export default {
  name: "AlarmView",
  props: {
    alarmData: {
      type: Object,
      default: () => ({
        equName: undefined,
        channelName: undefined,
        collectTime: undefined,
        eventType: undefined,
        status: undefined,
        dealTime: undefined,
        dealNotes: undefined,
        channelEventId: undefined,
        value: undefined,
      }),
      require: true,
    },
  },
  data() {
    return {
      //
      loading: true,
      //
      event: {},
    };
  },
  created() {
    this.initEvent();
  },
  methods: {
    initEvent() {
      this.loading = true;
      getEvent(this.alarmData.channelEventId).then((response) => {
        this.event = response.data;
        this.loading = false;
      });
    },
  },
};
</script>