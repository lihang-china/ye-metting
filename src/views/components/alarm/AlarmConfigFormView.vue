<template>
  <el-form ref="form" :model="form" v-loading="loading" label-width="120px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="报警规则">
          {{ form.alarmRuleName }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="规则描述">
          {{
            form.indicatorName +
            " " +
            getLabel(periodSizeOptions, form.periodSize) +
            " " +
            getLabel(periodContinueCountOptions, form.periodContinueCount) +
            " " +
            getLabel(statisticsTypeOptions, form.statisticsType) +
            " " +
            form.thresholdType +
            " " +
            form.value
          }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="报警等级">
          {{ getLabel(alarmLevelOptions, form.alarmLevel) }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="通知对象">
          {{ form.notifyUserNames }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getConfig } from "@/api/alarm/config";

export default {
  name: "AlarmConfigFormView",
  props: {
    alarmRuleId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      // 报警规则
      form: {},
      // 遮罩层
      loading: true,
      //
      periodSizeOptions: [{ value: 1, label: "1分钟周期" }],
      //
      periodContinueCountOptions: [
        { value: 1, label: "持续1个周期" },
        { value: 3, label: "持续3个周期" },
        { value: 5, label: "持续5个周期" },
      ],
      //
      statisticsTypeOptions: [
        { value: 0, label: "最大值" },
        { value: 1, label: "最小值" },
        { value: 2, label: "平均值" },
      ],
      //
      thresholdTypeOptions: [">=", ">", "<", "<=", "!=", "between"],
      //
      alarmLevelOptions: [
        { value: 0, label: "info" },
        { value: 1, label: "Warning" },
        { value: 2, label: "Critical" },
      ],
      //
      statusOptions: [
        { value: "0", label: "正常" },
        { value: "1", label: "停用" },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    getLabel(options, value) {
      if (value != null && value != undefined && value != "") {
        return options.find((t) => t.value === value).label;
      } else {
        return "";
      }
    },
    init() {
      this.loading = true;
      if (this.alarmRuleId) {
        getConfig(this.alarmRuleId).then((res) => {
          this.initData(res.data);
        });
      }
    },
    initData(data) {
      this.form = { ...data };
      if (this.form.thresholdType === "between") {
        this.form.value = this.form.minValue + " " + this.form.maxValue;
      } else {
        this.form.value = this.form.singleValue;
      }
      this.loading = false;
    },
  },
};
</script>