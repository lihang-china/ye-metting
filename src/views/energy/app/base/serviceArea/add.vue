<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    width="60%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="98px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="区域编码" prop="areaCode">
            <el-input v-model="form.areaCode" placeholder="请输入区域编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="form.areaName" placeholder="请输入区域名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级区域" prop="parentId">
            <treeselect
              v-model="form.parentId"
              :options="areaOptions"
              :normalizer="normalizer"
              placeholder="请选择上级区域"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="排序号" prop="sort">
            <el-input v-model="form.sort" placeholder="请输入排序号" />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="区域人数" prop="persons">
            <el-input v-model="form.persons" placeholder="请输入区域人数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域面积(m²)" prop="area">
            <el-input v-model="form.area" placeholder="请输入区域面积" />
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
import { addArea, updateArea } from "@/api/energy/basic/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    Treeselect,
  },
  props: {},
  data() {
    return {
      areaOptions: [],
      dialog: false,
      form: {
        id: undefined,
        areaCode: undefined,
        areaName: undefined,
        parentId: undefined,
        sort: undefined,
        persons: undefined,
        area: undefined,
        remark: undefined,
      },
      rules: {
        areaCode: [
          { required: true, message: "请输入区域编码", trigger: "blur" },
        ],
        areaName: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "请选择上级区域", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.areaName,
        children: node.children,
      };
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateArea(this.form).then((res) => {
              this.msgSuccess("编辑成功");
              this.cancel();
              //this.$parent.data = [];
              this.$parent.getList();
            });
          } else {
            addArea(this.form).then((res) => {
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
