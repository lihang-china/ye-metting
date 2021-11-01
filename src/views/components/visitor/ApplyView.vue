<template>
  <el-dialog
    width="50%"
    title="访客申请查看"
    :visible.sync="applyViewVisiable"
    :before-close="modalClose"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="apply" label-width="108px">
      <el-row :gutter="12">
        <el-col :span="24">
          <el-form-item label="申请类型" prop="applyType">
            {{ apply.applyType }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访人姓名" prop="visitorName">
            {{ apply.visitorName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访人手机号" prop="visitorPhone">
            {{ apply.visitorPhone }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访人数" prop="visitorNum">
            {{ apply.visitorNum }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号" prop="carNumber">
            {{ apply.carNumber }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访开始时间" prop="startVisitDate">
            {{ parseTime(apply.startVisitDate, "{y}-{m}-{d}") }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访结束时间" prop="endVisitDate">
            {{ parseTime(apply.endVisitDate, "{y}-{m}-{d}") }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="来访事由" prop="reason">
            {{ apply.reason }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被访人手机号" prop="intervieweePhone">
            {{ apply.intervieweePhone }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访问园区" prop="parkId">
            {{ apply.parkName }}
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
export default {
  name: "ApplyView",
  props: {
    applyViewVisiable: {
      type: Boolean,
      default: false,
    },
    apply: {
      type: Object,
      required: true,
    },
  },
  methods: {
    modalClose() {
      this.$emit("update:applyViewVisiable", false); // 直接修改父组件的属性
    },
  },
};
</script>