<template>
  <el-form ref="form" :model="form" v-loading="loading" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="位号编号" prop="channelCode">
          {{ form.channelCode }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="位号名称" prop="channelName">
          {{ form.channelName }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="位号描述" prop="channelDecs">
          {{ form.channelDecs }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="位号性质" prop="channelClass">
          {{ getChannelClass(form.channelClass) }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="读写状态" prop="channelRw">
          {{ getChannelRw(form.channelRw) }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="位号类型" prop="channelType">
          {{ getChannelType(form.channelType) }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider v-if="form.channelType === '0'">开关量</el-divider>
    <el-row v-if="form.channelType === '0'">
      <el-col :span="12">
        <el-form-item label="0 -" prop="equBoolType.zeroFlagDesc">
          {{ form.equBoolType.zeroFlagDesc }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="1 -" prop="equBoolType.oneFlagDesc">
          {{ form.equBoolType.oneFlagDesc }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider v-if="form.channelType === '1'">模拟量</el-divider>
    <el-row v-if="form.channelType === '1'">
      <el-col :span="12">
        <el-form-item label="单位" prop="equSimulationType.parameterName">
          {{ form.equSimulationType.parameterName }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.channelType === '1'">
      <el-col :span="12">
        <el-form-item label="最大值" prop="equSimulationType.maxValue">
          {{ form.equSimulationType.maxValue }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="最小值" prop="equSimulationType.minValue">
          {{ form.equSimulationType.minValue }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.channelType === '1'">
      <el-col :span="12">
        <el-form-item label="小数点位数" prop="equSimulationType.scaleNum">
          {{ form.equSimulationType.scaleNum }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="扩大倍数" prop="equSimulationType.ratio">
          {{ form.equSimulationType.ratio }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getChannel, getChannelByCode } from "@/api/equipment/channel";
import { getParameter } from "@/api/equipment/parameter";

export default {
  name: "ChannelFormView",
  props: {
    channelId: {
      type: Number,
      default: undefined,
    },
    channelCode: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      // 位号
      form: {
        equBoolType: {},
        equSimulationType: {},
      },
      // 加载状态
      loading: true,
      // 位号类型字典
      channelTypeOptions: [],
      // 位号性质字典
      channelClassOptions: [],
      // 位号读写状态
      channelRwOptions: [],
      // 单位
      parameterOptions: [],
    };
  },
  created() {
    this.getDicts("equ_channel_type").then((response) => {
      this.channelTypeOptions = response.data;
    });
    this.getDicts("equ_channel_class").then((response) => {
      this.channelClassOptions = response.data;
    });
    this.getDicts("equ_channel_rw").then((response) => {
      this.channelRwOptions = response.data;
    });
    this.init();
  },
  methods: {
    // 位号类型
    getChannelType(value) {
      return this.selectDictLabel(this.channelTypeOptions, value);
    },
    // 位号性质
    getChannelClass(value) {
      return this.selectDictLabel(this.channelClassOptions, value);
    },
    // 位号读写
    getChannelRw(value) {
      return this.selectDictLabel(this.channelRwOptions, value);
    },
    init() {
      this.loading = true;

      if (this.channelId) {
        getChannel(this.channelId).then((res) => {
          this.initData(res.data);
        });
      }

      if (this.channelCode) {
        getChannelByCode(this.channelCode).then((res) => {
          this.initData(res.data);
        });
      }
    },
    initData(data) {
      this.form = { ...data };
      this.loading = false;
    },
  },
};
</script>