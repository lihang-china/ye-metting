<template>
  <div class="app-container">
    <ViewForm v-if="formId" :formId="formId" />
  </div>
</template>


<script>
import ViewForm from "@/views/components/workflow/ViewForm";

export default {
  name: "FormView",
  components: { ViewForm },
  data() {
    return {
      //
      formId: undefined,
    };
  },
  created() {
    this.formId = this.$route.params.formId.toString();
  },
  mounted() {},
  methods: {
  },
};
</script>