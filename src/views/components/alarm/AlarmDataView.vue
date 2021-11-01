<template>
  <el-dialog
    width="50%"
    :title="alarmDataTitle"
    :visible.sync="alarmDataViewVisiable"
    :before-close="modalClose"
    :close-on-click-modal="false"
  >
    <el-tabs tab-position="left" style="height: 450px">
      <el-tab-pane label="报警信息">
        <AlarmFormView :v-if="alarmForm" :alarmForm="alarmForm" />
      </el-tab-pane>
      <el-tab-pane label="报警规则">
        <AlarmConfigFormView :v-if="alarmRuleId" :alarmRuleId="alarmRuleId" />
      </el-tab-pane>
      <el-tab-pane label="设备信息">
        <EquipmentFormView :v-if="equCode" :equCode="equCode" />
      </el-tab-pane>
      <el-tab-pane label="位号信息">
        <ChannelFormView :v-if="channelCode" :channelCode="channelCode" />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modalClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AlarmFormView from "@/views/components/alarm/AlarmFormView";
import AlarmConfigFormView from "@/views/components/alarm/AlarmConfigFormView";
import EquipmentFormView from "@/views/components/equipment/EquipmentFormView";
import ChannelFormView from "@/views/components/equipment/ChannelFormView";

export default {
  name: "AlarmDataView",
  components: {
    AlarmFormView,
    AlarmConfigFormView,
    EquipmentFormView,
    ChannelFormView,
  },
  props: {
    alarmData: {
      type: Object,
      required: true,
    },
    alarmDataTitle: {
      type: String,
      default: "报警查看",
    },
    alarmDataViewVisiable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      alarmForm: {},
      //
      alarmRuleId: undefined,
      //
      equCode: undefined,
      //
      channelCode: undefined,
    };
  },
  mounted() {
    this.alarmForm = { ...this.alarmData };
    this.alarmRuleId = this.alarmData.alarmRuleId;
    this.equCode = this.alarmData.equCode;
    this.channelCode = this.alarmData.channelCode;
  },
  methods: {
    modalClose() {
      this.$emit("update:alarmDataViewVisiable", false); // 直接修改父组件的属性
    },
  },
};
</script>