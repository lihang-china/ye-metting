<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          :icon="debugIcon"
          size="mini"
          @click="handleDebug"
        >
          {{ debugText }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleClear"
        >
          清空
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="alarmList" :row-class-name="tableRowClassName">
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
      <el-table-column label="持续时间(s)" align="left" width="100">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? scope.row.continuedPeriodSecond : "-" }}
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

    <AlarmDataView
      v-if="alarmDataViewVisiable"
      :alarmDataViewVisiable.sync="alarmDataViewVisiable"
      :alarmDataTitle="alarmDataTitle"
      :alarmData="alarmData"
    />
  </div>
</template>

<script>
import { getChannels } from "@/api/alarm/config";
import {
  initWebSocket,
  closeWebSocket,
  sendWebSocket,
} from "@/views/components/device/websocket.js";
import AlarmDataView from "@/views/components/alarm/AlarmDataView";
import listenersVue from "../../workflow/flow/listeners.vue";

export default {
  name: "RealAlarm",
  components: { AlarmDataView },
  data() {
    return {
      //
      debugIcon: "el-icon-check",
      //
      debugText: "开启",
      //
      debug: false,
      //
      queryParams: {
        equName: undefined,
        channelName: undefined,
      },
      //
      alarm: [],
      //
      alarmList: [],
      //
      alarmDataViewVisiable: false,
      //
      alarmDataTitle: "实时报警查看",
      //
      alarmData: {},
    };
  },
  created() {},
  beforeDestroy() {
    this.close();
  },
  methods: {
    tableRowClassName({ row }) {
      const { status } = row;
      if (status === 0) {
        return "nomal-row";
      } else if (status === 1) {
        return "danger-row";
      } else {
        return "";
      }
    },
    open() {
      getChannels().then((res) => {
        const { msg } = res;
        this.debugIcon = "el-icon-close";
        this.debugText = "关闭";
        console.log(msg);
        this.init(msg);
      });
    },
    init(channelIds) {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
      closeWebSocket();
      //注册该设备下的全部位号数据
      const obj = {
        action: "RegDeviceData",
        data: {
          channelIds: channelIds,
        },
        msgId: 1,
      };
      // 发起websocket请求
      initWebSocket(
        "ws://114.55.137.179:8080/websocket",
        obj,
        this.wsMessage,
        this.wsError
      );
    },
    //
    getAlarmData() {
      let alarm = [];
      let length = Math.floor(Math.random() * 10);
      for (let i = 0; i < length; i++) {
        alarm.push({
          alarmRuleId: 1,
          alarmRuleName: "test",
          channelCode: "A_01F_DM_CM_001_03",
          channelName: "电压",
          collectorName: "test3",
          collectorSerialCode: "30dbe85caad81aa0db02d30dd5218be9",
          continuedPeriodSecond: 12380,
          equCode: "A_01F_DM_CM_001",
          equName: "A号楼一层门禁设备001",
          notifyType: "邮件",
          startTime: new Date(),
          status: 0,
        });
      }
      return alarm;
    },
    //
    wsMessage(res) {
      console.log(res);
      const { code, data, msg } = res;
      if (msg === "alarmData") {
        this.alarmList = [...data, ...this.alarmList];
      }
      // let alarmListTemp = [...this.getAlarmData(), ...this.alarmList];
      // if (alarmListTemp.length > 100) {
      //   alarmListTemp.splice(
      //     199 - alarmListTemp.length,
      //     alarmListTemp.length - 100
      //   );
      // }
      // this.alarmList = alarmListTemp;
    },
    //
    wsError(res) {},
    //
    close() {
      this.debugIcon = "el-icon-check";
      this.debugText = "开启";
      closeWebSocket();
    },
    // 开启/关闭
    handleDebug() {
      this.$confirm("是否确" + this.debugText + "实时报警监控?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.debug = !this.debug;
        if (this.debug) {
          this.open();
        } else {
          this.close();
        }
      });
    },
    handleClear() {
      this.alarmList = [];
    },
    /** 查看点击事件 */
    handleView(row) {
      this.alarmDataViewVisiable = true;
      this.alarmDataTitle = "实时报警查看";
      this.alarmData = { ...row };
    },
  },
};
</script>

<style scoped>
.el-table .danger-row {
  background: #f56c6c;
}

.el-table .normal-row {
  background: #409eff;
}
</style>