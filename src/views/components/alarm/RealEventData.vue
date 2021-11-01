<template>
  <el-dialog
    width="80%"
    title="实时报警查看"
    :visible.sync="isRealEventData"
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
      <el-form-item label="设备名称">
        <el-input v-model="equName" disabled size="small" />
      </el-form-item>
      <el-form-item label="位号名称">
        <el-input v-model="channelName" disabled size="small" />
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
          <el-table-column label="数值" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.value.toString() }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="initEventList"
        />
      </el-col>
      <el-col :span="8">
        <AlarmView :alarmData="alarmData" v-if="open" />
        <div class="dialog-footer" v-if="open">
          <el-button type="primary" @click="submit">消 警</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRealAlarm, dealAlarm } from "@/api/equipment/alarm";
import { getChannel } from "@/api/equipment/channel";
import AlarmView from "@/views/components/alarm/AlarmView";

export default {
  name: "RealEventData",
  components: { AlarmView },
  props: {
    isRealEventData: {
      type: Boolean,
      default: false,
      require: true,
    },
    channelId: {
      type: Number,
      require: true,
    },
    count: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      //设备名称
      equName: "",
      //位号名称
      channelName: "",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        count: undefined,
        channelId: undefined,
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
    this.queryParams.count = this.count;
    this.queryParams.channelId = this.channelId;

    this.initChannel();
    this.initEventList();
  },
  methods: {
    initChannel() {
      getChannel(this.channelId).then((response) => {
        this.equName = response.data.equName;
        this.channelName = response.data.channelName;
      });
    },
    initEventList() {
      this.loading = true;
      getRealAlarm(this.queryParams).then((response) => {
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
    // 消警按钮
    submit() {
      dealAlarm(this.channelId).then(response=>{
        if (response.code === 200){
          this.msgSuccess("消警成功！");
          this.open = true;
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isRealEventData", false); // 直接修改父组件的属性
    },
  },
};
</script>

