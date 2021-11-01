<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-tree
            :data="deviceOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="设备编号">
            <el-input v-model="card.equCode" :disabled="true" size="small" />
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="card.equName" :disabled="true" size="small" />
          </el-form-item>
          <el-form-item label="位号编码" prop="channelCode">
            <el-input
              v-model="queryParams.channelCode"
              placeholder="请输入位号编码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="位号名称" prop="channelName">
            <el-input
              v-model="queryParams.channelName"
              placeholder="请输入位号名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
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
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              :icon="btnIcon"
              size="mini"
              @click="handleReg"
              width="100"
              >{{ btnText }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-tickets"
              size="mini"
              :disabled="multiple"
              @click="handleData('real')"
              >实时数据</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-document"
              size="mini"
              :disabled="multiple"
              @click="handleData('his')"
              >历史数据</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-s-cooperation"
              size="mini"
              @click="handleHisAlarm()"
              >历史报警</el-button
            >
          </el-col> -->
        </el-row>

        <el-table
          v-loading="loading"
          :data="channelList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="位号编码"
            align="left"
            prop="channelCode"
            width="250"
          />
          <el-table-column
            label="位号名称"
            align="left"
            prop="channelName"
            width="250"
          />
          <el-table-column
            label="位号类型"
            align="center"
            prop="channelType"
            :formatter="channelTypeFormat"
            width="100"
          />
          <el-table-column
            label="读写状态"
            align="center"
            prop="channelRw"
            :formatter="channelRwFormat"
            width="100"
          />
          <el-table-column
            label="数值"
            align="center"
            prop="value"
            width="100"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="statusName"
            width="100"
          />
          <!-- <el-table-column label="采集时间" align="center" width="150">
            <template slot-scope="scope">
              <Timer :isStart="timerStatus" :key="timerStatus" />
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleData('real', scope.row)"
                >实时数据</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document"
                @click="handleData('his', scope.row)"
                >历史数据</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit-outline"
                @click="handleWrite(scope.row)"
                v-if="scope.row.channelRw === '1' && isReg"
                >反写数据</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-s-cooperation"
                @click="handleRealAlarm(scope.row)"
                v-if="isReg && scope.row.eventCount && scope.row.eventCount > 0"
                >实时报警
              </el-button>
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
      </el-col>
    </el-row>

    <ChannelView
      v-if="isVisiable"
      :isVisiable.sync="isVisiable"
      :channelId="channelId"
    />

    <HisDeviceData
      v-if="isHisVisiable"
      :isHisVisiable.sync="isHisVisiable"
      :channelIds="channelIds"
    />

    <RealDeviceData
      v-if="isRealVisiable"
      :isRealVisiable.sync="isRealVisiable"
      :channelIds="channelIds"
    />

    <!-- <HisEventData v-if="isHisEventData" :isHisEventData.sync="isHisEventData" /> -->

    <!-- <RealEventData
      v-if="isRealEventData"
      :isRealEventData.sync="isRealEventData"
      :channelId="realChannelId"
      :count="realCount"
    /> -->

    <el-dialog
      title="反写数据"
      :visible.sync="openItem"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form ref="item" :model="item" :rules="rules" label-width="68px">
        <el-form-item label="位号编码">{{ item.channelCode }}</el-form-item>
        <el-form-item label="位号名称">{{ item.channelName }}</el-form-item>
        <el-form-item label="位号类型">
          {{ getChannelType(item.channelType) }}
        </el-form-item>
        <el-form-item label="数值" prop="value">
          <el-input
            v-model="item.value"
            placeholder="请输入数值"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listChannel } from "@/api/equipment/channel";
import { getCard } from "@/api/equipment/card";

import ChannelView from "@/views/components/device/ChannelView";

import HisDeviceData from "@/views/components/device/HisDeviceData";
import RealDeviceData from "@/views/components/device/RealDeviceData";

// import HisEventData from "@/views/components/alarm/HisEventData";
// import RealEventData from "@/views/components/alarm/RealEventData";

import { getDevices } from "@/api/equipment/gateway";

import { operateDev, operateChannel } from "@/api/equipment/device";
import {
  initWebSocket,
  closeWebSocket,
  sendWebSocket,
} from "@/views/components/device/websocket.js";
import Timer from "@/components/Timer";

export default {
  name: "DeviceChannel",
  components: {
    ChannelView,
    HisDeviceData,
    RealDeviceData,
    Timer,
    // HisEventData,
    // RealEventData,
  },
  data() {
    return {
      // 按钮图片
      btnIcon: "el-icon-star-on",
      // 按钮文字
      btnText: "开启调试",
      // 是否开启调试
      isReg: false,
      // 注册的位号Id
      channelIdList: undefined,
      // 计时器状态
      timerStatus: false,
      // 统一宽度
      width: "290px",
      // 设备信息
      card: {
        //设备Id
        equId: undefined,
        //设备编号
        equCode: undefined,
        //设备名称
        equName: undefined,
      },
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 设备位号表格数据
      channelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 位号类型字典
      channelTypeOptions: [],
      // 位号读写字典
      channelRwOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equId: undefined,
        channelName: undefined,
        channelCode: undefined,
      },
      // 位号查看显示/隐藏
      isVisiable: false,
      // 位号查看选中的位号
      channelId: "",
      // 历史数据显示/隐藏
      isHisVisiable: false,
      // 实时数据显示/隐藏
      isRealVisiable: false,
      // 数据查看显示/隐藏
      channelIds: "",
      // 反写数据位号信息展示
      item: {},
      // 反写数据显示/隐藏
      openItem: false,
      // 表单校验
      rules: {
        value: [{ required: true, message: "请输入数值", trigger: "blur" }],
      },
      // 设备列表
      deviceOptions: [],
      // 树型结构
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
      },
      //
      // isHisEventData: false,
      //
      // isRealEventData: false,
      //
      realChannelId: undefined,
      //
      realCount: undefined,
      //
      statusOptions: [
        { value: 0, label: "未使用" },
        { value: 1, label: "离线" },
        { value: 2, label: "正常运行" },
        { value: 3, label: "故障" },
        { value: 4, label: "报警" },
      ],
    };
  },
  created() {
    this.getDicts("equ_channel_type").then((response) => {
      this.channelTypeOptions = response.data;
    });
    this.getDicts("equ_channel_rw").then((response) => {
      this.channelRwOptions = response.data;
    });
    this.getDeviceList();
  },
  beforeDestroy() {
    closeWebSocket();
  },
  watch: {
    isReg(newVal, oldVal) {
      //console.log("isReg");
      this.btnText = newVal ? "关闭调试" : "开启调式";
      this.btnIcon = newVal ? "el-icon-star-off" : "el-icon-star-on";
      if (newVal) {
        // 打开了调试
        // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
        closeWebSocket();
        //注册该设备下的全部位号数据
        const obj = {
          action: "RegDeviceData",
          data: {
            channelIds: this.channelIdList.join(","),
          },
          msgId: 1,
        };
        console.log(obj);
        // 发起ws请求
        initWebSocket(
          "ws://114.55.137.179:8080/websocket",
          obj,
          this.wsMessage,
          this.wsError
        );
      } else {
        //关闭了调试
        closeWebSocket();
      }
      this.timerStatus = newVal;
    },
  },
  methods: {
    // 获取全部的可通信设备
    getDeviceList() {
      getDevices().then((response) => {
        //console.log(response);
        this.deviceOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.level === "D") {
        this.getEquCard(data.id);
      }
    },
    // 获取对应的设备
    getEquCard(equId) {
      getCard(equId).then((response) => {
        this.card = response.data;
        this.queryParams.equId = response.data.equId;
        this.getList();
      });
    },
    // 查询位号
    getList() {
      this.loading = true;
      listChannel(this.queryParams).then((response) => {
        this.channelList = response.rows;
        this.channelIdList = this.channelList.map((t) => {
          return t.channelId;
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 位号类型字典翻译
    channelTypeFormat(row, column) {
      return this.selectDictLabel(this.channelTypeOptions, row.channelType);
    },
    // 位号类型字典翻译
    getChannelType(channelType) {
      return this.selectDictLabel(this.channelTypeOptions, channelType);
    },
    // 位号读写状态字典翻译
    channelRwFormat(row, column) {
      return this.selectDictLabel(this.channelRwOptions, row.channelRw);
    },
    /** 搜索 按钮 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置 按钮 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.channelId);
      this.multiple = !selection.length;
    },
    /** 查看 按钮 */
    handleView(row) {
      this.channelId = row.channelId;
      this.isVisiable = true;
    },
    /** 设备调试/注销 按钮  */
    handleReg() {
      let params = {
        EquIds: this.card.equId.toString(),
        Action: this.isReg ? "UnregDeviceData" : "RegDeviceData",
      };
      let text = this.isReg ? "结束" : "开启";
      this.$confirm(
        "是否" + text + '名称为"' + this.card.equName + '"的设备的调试',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const loading = this.openLoading("正在" + text + "调式,请稍后......");
        operateDev(params)
          .then((response) => {
            if (response.code === 200) {
              this.isReg = !this.isReg;
              this.msgSuccess(text + "调试成功");
            } else {
              this.msgError(response.msg);
            }
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    /** 实时/历史数据读取 按钮 */
    handleData(type, row) {
      this.channelIds = row ? row.channelId.toString() : this.ids.join(",");
      if (type === "his") {
        //历史数据
        this.isHisVisiable = true;
      } else {
        //实时数据
        this.isRealVisiable = true;
      }
    },
    // 重置item
    resetItem() {
      this.item = {
        channelId: undefined,
        channelName: undefined,
        channelCode: undefined,
        channelType: undefined,
        value: "",
      };
    },
    /** 反写数据 按钮 */
    handleWrite(row) {
      this.resetItem();
      this.item.channelId = row.channelId;
      this.item.channelName = row.channelName;
      this.item.channelCode = row.channelCode;
      this.item.channelType = row.channelType;
      this.openItem = true;
    },
    /** 取消 按钮 */
    cancel() {
      this.resetItem();
      this.openItem = false;
    },
    // 获取 value
    getValue(item) {
      let value = item.value.toString().toLowerCase();
      if (item.channelType === "0") {
        if (value === "true" || value === "0") {
          value = true;
        } else if (value === "false" || value === "1") {
          value = false;
        } else {
          value = false;
        }
      }
      return {
        action: "SetDeviceData",
        data: {
          values: [
            {
              channelId: item.channelId,
              value: value,
            },
          ],
        },
        msgId: item.channelId,
      };
    },
    /** 提交 按钮 */
    submit() {
      this.$refs["item"].validate((valid) => {
        if (valid) {
          if (this.isReg) {
            //设备已注册->使用websocket
            const obj = this.getValue(this.item);
            console.log(obj);
            sendWebSocket(obj);
            this.msgSuccess("提交成功");
            this.openItem = false;
          } else {
            //未注册设备->使用http接口
            let params = {
              Action: "SetDeviceData",
              Items: this.getFormArray(this.item),
            };
            operateChannel(params).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("提交成功");
                this.openItem = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
    wsMessage(response) {
      console.log("websocket", response);
      const { code, data, msg } = response;

      if (msg === "realData") {
        data.forEach((item) => {
          let index = this.channelList.findIndex(
            (t) => t.channelId == item.channelId
          );
          if (index > -1) {
            const channel = this.channelList[index];
            channel.value = item.value.toString();
            this.$set(this.channelList, index, channel);
          }
        });
      }

      if (msg === "statusData") {
        data.forEach((each) => {
          if (each.equChannelStatusList) {
            each.equChannelStatusList.forEach((item) => {
              let index = this.channelList.findIndex(
                (t) => t.channelId == item.equChannelId
              );
              if (index > -1) {
                const channel = this.channelList[index];
                channel.statusName = this.statusOptions.find(
                  (t) => t.value === item.equChannelStatus
                ).label;
                this.$set(this.channelList, index, channel);
              }
            });
          }
        });
      }
    },
    // ws连接失败，组件要执行的代码
    wsError() {
      // 比如取消页面的loading
    },
    // /** 实时报警 */
    // handleRealAlarm(row) {
    //   this.realChannelId = row.channelId;
    //   this.realCount = row.eventCount;
    //   this.isRealEventData = true;
    // },
    /** 历史报警 */
    // handleHisAlarm() {
    //   this.isHisEventData = true;
    // },
  },
};
</script>