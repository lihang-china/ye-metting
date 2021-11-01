<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    width="60%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="98px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="分项编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入分项编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="分项名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入分项名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级分项" prop="parentCode">
            <treeselect
              v-model="form.parentCode"
              :options="itemOptions"
              :normalizer="normalizer"
              placeholder="请选择上级分项"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="标准编码" prop="standardCode">
            <el-input
              v-model="form.standardCode"
              placeholder="请输入标准编码"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" :rows="4"></el-input>
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
import { addItem, updateItem } from "@/api/energy/basic/item";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    Treeselect,
  },
  props: {},
  data() {
    return {
      itemOptions: [],
      dialog: false,
      form: {},
      rules: {
        code: [{ required: true, message: "请输入分项编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入分项名称", trigger: "blur" }],
        parentCode: [
          { required: true, message: "请选择上级分项", trigger: "blur" },
        ],
        standardCode: [
          { required: true, message: "请输入标准编码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 转换系统命名规约数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.code,
        label: node.name,
        children: node.children,
      };
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateItem(this.form).then((res) => {
              this.msgSuccess("编辑成功");
              this.cancel();
              //this.$parent.data = [];
              this.$parent.getList();
            });
          } else {
            addItem(this.form).then((res) => {
              this.msgSuccess("新增成功");
              this.cancel();
              //this.$parent.data = [];
              this.$parent.getList();
            });
          }
        }
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
