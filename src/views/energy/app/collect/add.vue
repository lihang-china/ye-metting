<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    width="50%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="部门编码" prop="code">
            <el-input v-model="form.areaCode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.areaName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="上级部门" prop="parent">
            <el-input v-model="form.parentId" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门人数" prop="peopleNum">
            <el-input v-model="form.persons" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="部门面积" prop="area">
            <el-input v-model="form.area" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" :rows="5"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" style="color: #000000">取 消</el-button>
      <el-button type="primary" @click="submitForm" style="color: white"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { addArea } from "@/api/energy/basic/area";
export default {
  components: {},
  props: {},
  data() {
    return {
      dialog: false,
      form: {},
      rules: {
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        parent: [
          { required: true, message: "上级部门不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      addArea(this.form).then((res) => {
        this.msgSuccess("新增成功");
        this.cancel();
        this.$parent.data = [];
        this.$parent.initData();
      });
    },

    cancel() {
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item__label {
  color: white;
}
.el-dialog__header {
  background: #01428b;
}
.el-dialog__body {
  background: #01428b;
}
.el-dialog__footer {
  background: #01428b;
}

.title {
  border-left: 2px solid #1890ff;
  padding-left: 5px;
  color: black;
}
.row {
  display: flex;
  align-items: center;
  // margin-bottom: 20px;
  min-height: 60px;
  .content-left {
    text-align: right;
  }
  .content-right {
    text-align: left;
  }
}
.image-block {
  padding-top: 30px;
  padding-left: auto;
  text-align: center;
  border-right: 1px solid #eff2f6;
  display: inline-block;
  width: 45%;
  box-sizing: border-box;
  vertical-align: top;
}
</style>
