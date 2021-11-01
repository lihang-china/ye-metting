<template>
  <el-form ref="form" :model="form" v-loading="loading" label-width="120px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="工程">
          {{ form.collectorName }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="设备">
          {{ form.equName + "(" + form.equCode + ")" }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="位号">
          {{ form.channelName + "(" + form.channelCode + ")" }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开始时间">
          {{ parseTime(form.startTime) }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="持续时间(s)">
          {{ form.continuedPeriodSecond }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="报警规则">
          {{ form.alarmRuleName }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="数值">
          {{ form.value }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="状态">
          {{ form.status === 0 ? "恢复正常" : "报警发生" }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "AlarmFormView",
  props: {
    alarmForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 报警
      form: {},
      // 遮罩层
      loading: true,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.form = { ...this.alarmForm };
      this.loading = false;
    },
  },
};
</script>