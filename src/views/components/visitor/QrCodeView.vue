<template>
  <div>
    <img class="qr_code" :src="qrCodeUrl" />
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  name: "QrCodeView",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      //
      qrCodeUrl: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const baseUrl = process.env.VUE_APP_BASE_API;
      var url = baseUrl + "/vis/visitors/" + this.id + "/qrCode";
      axios({
        method: "get",
        url: url,
        responseType: "blob",
        headers: { Authorization: "Bearer " + getToken() },
      }).then((res) => {
        // console.log(res)
        if (res && res.data && res.data.size) {
          const dataInfo = res.data;
          let reader = new window.FileReader();
          // 使用readAsArrayBuffer读取文件, result属性中将包含一个 ArrayBuffer 对象以表示所读取文件的数据
          reader.readAsArrayBuffer(dataInfo);
          reader.onload = (e) => {
            const result = e.target.result;
            const contentType = dataInfo.type;
            // 生成blob图片,需要参数(字节数组, 文件类型)
            const blob = new Blob([result], { type: contentType });
            // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
            const url = window.URL.createObjectURL(blob);
            //console.log(url); // 产生一个类似 blob:d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
            this.qrCodeUrl = url;
          };
        }
      });
    },
  },
};
</script>

<style>
.qr_code {
    width: 150px;
    height: 150px;
}
</style>