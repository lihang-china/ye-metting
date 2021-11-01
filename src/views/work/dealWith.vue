<template>
  <div class="app-container">
    <ViewFormContent v-if="formContent" :formContent="formContent" @submit="submitForm" />
  </div>
</template>

<script>
import ViewFormContent from "@/views/components/workflow/ViewFormContent";
import { getPage, submitWork } from "@/api/work/work";

export default {
  name: "DealWith",
  components: { ViewFormContent },
  data() {
    return {
      //
      taskId: undefined,
      //
      completeTaskPage: {},
      //
      formContent: undefined,
    };
  },
  created() {
    this.taskId = this.$route.params.taskId;
    getPage(this.taskId).then((response) => {
      this.completeTaskPage = response.data;
      this.formContent = response.data.taskFormHtml;
    });
  },
  mounted() {},
  methods: {
    submitForm(data) {
      data.taskId = this.taskId;
      data.workId = this.completeTaskPage.processInstanceId;
      if (this.completeTaskPage.formMark) {
        data.formMark = this.completeTaskPage.formMark;
      }
      //console.log(data);

      const loading = this.openLoading("正在提交,请稍后......");

      submitWork(this.completeTaskPage.completeUrl, {
        json: JSON.stringify(data),
      })
        .then((response) => {
          //console.log("接口正常");
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("提交成功");
            this.closeTab(this);
          } else {
            this.msgSuccess("提交失败");
          }
        })
        .catch(() => {
          //console.log("接口异常");
          loading.close();
        });
    },
  },
};
</script>