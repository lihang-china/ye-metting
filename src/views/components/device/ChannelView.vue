<template>
  <el-dialog
    width="80%"
    title="位号查看"
    :visible.sync="isVisiable"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" label-width="140px" v-loading="loading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="位号编号:" prop="channelCode">
            <span>{{form.channelCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位号名称:" prop="channelName">
            <span>{{form.channelName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="位号描述:" prop="channelDecs">
            <span>{{form.channelDecs}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="位号性质:" prop="channelClass">
            <span>{{dictFormat(channelClassOptions, form.channelClass)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="读写状态:" prop="channelRw">
            <span>{{dictFormat(channelRwOptions, form.channelRw)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="位号类型:" prop="channelType">
            <span>{{dictFormat(channelTypeOptions, form.channelType)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider v-if="form.channelType === '0'">开关量</el-divider>
      <el-row v-if="form.channelType === '0'">
        <el-col :span="12">
          <el-form-item label="0 -" prop="equBoolType.zeroFlagDesc">
            <span>{{form.equBoolType.zeroFlagDesc}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="1 -" prop="equBoolType.oneFlagDesc">
            <span>{{form.equBoolType.oneFlagDesc}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider v-if="form.channelType === '1'">模拟量</el-divider>
      <el-row v-if="form.channelType === '1'">
        <el-col :span="12">
          <el-form-item label="单位:" prop="equSimulationType.parameterId">
            <span>{{form.equSimulationType.parameterId}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.channelType === '1'">
        <el-col :span="12">
          <el-form-item label="最大值:" prop="equSimulationType.maxValue">
            <span>{{form.equSimulationType.maxValue}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最小值:" prop="equSimulationType.minValue">
            <span>{{form.equSimulationType.minValue}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.channelType === '1'">
        <el-col :span="12">
          <el-form-item label="小数点位数:" prop="equSimulationType.scaleNum">
            <span>{{form.equSimulationType.scaleNum}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扩大倍数:" prop="equSimulationType.ratio">
            <span>{{form.equSimulationType.ratio}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="modalClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getChannel } from "@/api/equipment/channel";
import { listParameter } from "@/api/equipment/parameter";

export default {
  props: {
    isVisiable: {
      type: Boolean,
      default: false,
      require: true,
    },
    channelId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 表单参数
      form: {
        equBoolType: {},
        equSimulationType: {},
      },
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
    this.getParameters();
    this.loading = true;
    getChannel(this.channelId).then((response) => {
      this.form = response.data;
      this.loading = false;
    });
  },
  methods: {
    /** 获取单位(模拟量) */
    getParameters() {
      listParameter().then((response) => {
        this.parameterOptions = response.rows;
      });
    },
    // 翻译
    dictFormat(options, value) {
      return this.selectDictLabel(options, value);
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isVisiable", false); // 直接修改父组件的属性
    },
  },
};
</script>