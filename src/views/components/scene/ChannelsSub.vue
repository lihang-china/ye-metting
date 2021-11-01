<template>
  <el-dialog
    width="70%"
    title="位号选择"
    :visible.sync="channelsSubVisiable"
    :before-close="modalClose"
    append-to-body
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
          type="success"
          icon="el-icon-check"
          size="mini"
          @click="submit"
          >确认</el-button
        >
        <el-button type="info" icon="el-icon-close" size="mini" @click="cancel"
          >关闭</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="channelsList"
      @select-all="selectAll"
      @select="selectChange"
      ref="channelsTable"
      height="510px"
    >
      <el-table-column type="selection" width="55" align="center" />
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
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getChannelsList"
    />
  </el-dialog>
</template>

<script>
import {
  addChannels,
  addChannelsCategory,
  getChannelsWithSelectedTag,
} from "@/api/calendar/timejobs";

export default {
  name: "ChannelsSub",
  props: {
    channelsSubVisiable: {
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
      selectDataArrL: [],
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
      this.$emit("update:channelsSubVisiable", false); // 直接修改父组件的属性
    },
    getChannelsList() {
      this.loading = true;
      getChannelsWithSelectedTag(this.queryParams).then((response) => {
        this.channelsList = response.rows;
        this.total = response.total;

        // this.channelsList = response.rows;
        // this.total = response.total;
        // this.channelsList.forEach((item) => {
        //   if (item.isSelected === 1) {
        //     if (this.selectDataArrL.length > 0) {
        //       let channel = this.selectDataArrL.find(
        //         (t) => t.channelId == item.channelId
        //       );
        //       if (!channel) {
        //         this.selectDataArrL.push(item);
        //       }
        //     } else {
        //       this.selectDataArrL.push(item);
        //     }
        //   }
        // });

        // this.$nextTick(() => {
        //   this.selectDataArrL.forEach((item) => {
        //     let channel = this.channelsList.find(
        //       (t) => t.channelId == item.channelId
        //     );
        //     if (channel) {
        //       this.$refs.channelsTable.toggleRowSelection(channel, true);
        //     }
        //   });
        // });
        this.loading = false;
      });
    },
    // 单独选择
    selectChange(arr, row) {
      // 判断存数据数组是否为空,进而进行删除和添加的判断
      if (this.selectDataArrL.length > 0) {
        let channel = this.selectDataArrL.find(
          (t) => t.channelId == row.channelId
        );
        if (channel) {
          let index = this.selectDataArrL.findIndex(
            (t) => t.channelId == row.channelId
          );
          this.selectDataArrL.splice(index, 1);
        } else {
          this.selectDataArrL.push(row);
        }
      } else {
        this.selectDataArrL.push(row);
      }
    },
    // 全选
    selectAll(arr) {
      // 判断全选选中数据是否为空
      if (arr.length > 0) {
        this.selectDataArrL = this.selectDataArrL.concat(arr);
      } else {
        this.selectDataArrL.forEach((item, index) => {
          this.channelsList.forEach((ms) => {
            if (item.channelId == ms.channelId) {
              this.selectDataArrL = this.selectDataArrL.filter(
                (item) => item.channelId != ms.channelId
              );
            }
          });
        });
      }
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getChannelsList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    submit() {
      let channelIds = [];
      this.selectDataArrL.forEach((item) => {
        if (channelIds.indexOf(item.channelId) < 0) {
          channelIds.push({ equChannelId: item.channelId });
        }
      });
      const loading = this.openLoading("正在提交,请稍后......");

      if (this.equTimeJobId) {
        addChannels(this.equJobCalendarId, this.equTimeJobId, channelIds).then(
          (response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("提交成功");
              this.modalClose();
              this.refreshList();
            } else {
              this.msgError(response.msg);
            }
          }
        );
      }

      if (this.equScenesCategoryId) {
        let equChannelSelecteds = channelIds.map((item) => {
          return {
            equChannelId: item.equChannelId,
            equScenesCategoryId: Number(this.equScenesCategoryId),
          };
        });
        console.log(equChannelSelecteds);
        addChannelsCategory(equChannelSelecteds).then((response) => {
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("提交成功");
            this.modalClose();
            this.refreshList();
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    cancel() {
      this.modalClose();
    },
  },
};
</script>