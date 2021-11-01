<template>
  <el-dialog
    width="70%"
    title="实时数据查看"
    :visible.sync="isRealVisiable"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
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

    <div slot="footer" class="dialog-footer">
      <el-button @click="modalClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { operateChannel } from "@/api/equipment/device";

export default {
  props: {
    isRealVisiable: {
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
      queryParams: {
        Action: "GetRealDeviceData",
        ChannelIds: undefined,
      },
      //
      dataList: [],
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
      operateChannel(this.queryParams).then((response) => {
        this.dataList = response.data;
        this.loading = false;
      });
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isRealVisiable", false); // 直接修改父组件的属性
    },
  },
};
</script>