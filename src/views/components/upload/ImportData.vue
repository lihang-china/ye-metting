<template>
  <el-dialog
    :title="title"
    :visible.sync="uploadOpen"
    width="400px"
    :before-close="modalClose"
    :close-on-click-modal="false"
  >
    <div style="height: 300px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="headers"
        :action="urlBase + url + '?updateSupport=' + updateSupport"
        :disabled="isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip" v-show="showUpdateSupport">
          <el-checkbox v-model="updateSupport" /> 是否更新已经存在的设备数据
          <el-link type="info" style="font-size: 12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">确 定</el-button>
      <el-button @click="modalClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "ImportData",
  props: {
    //组件的开启/关闭
    uploadOpen: {
      type: Boolean,
      default: false,
    },
    //标题
    title: {
      type: String,
      default: "文件上传",
    },
    // 请求
    url: {
      type: String,
      require: true,
    },
    //模板文件
    templateUrl: {
      type: String,
      require: true,
    },
    // 是否显示更新选择框
    showUpdateSupport:{
      type: Boolean,
      default: true,
    },
    // 提交成功后的回调
    successBack: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      // 设置上传的请求头部
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      // 上传的地址
      urlBase: process.env.VUE_APP_BASE_API,
      // 是否禁用上传
      isUploading: false,
      // 是否更新已经存在的用户数据
      updateSupport: 0,
      // 上传等待
      uploadLoading: undefined,
    };
  },
  mounted() {
    console.log(this);
  },
  methods: {
    // 关闭弹出框
    modalClose() {
      this.$emit("update:uploadOpen", false); // 直接修改父组件的属性
    },
    /** 下载模板操作 */
    importTemplate() {
      this.downloadTemplate(this.templateUrl);
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.isUploading = true;
      this.uploadLoading = this.openLoading("正在导入数据,请稍后......");
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.isUploading = false;
      this.$refs.upload.clearFiles();
      this.uploadLoading.close();
      this.$alert(
        "<div style='height: 100px; overflow: auto;'>" +
          response.msg +
          "</div>",
        "导入结果",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          callback: (action) => {
            this.modalClose();
            this.successBack();
          },
        }
      );
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>