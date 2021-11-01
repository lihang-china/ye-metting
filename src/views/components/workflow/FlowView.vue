<template>
  <el-dialog
    width="80%"
    title="流程图"
    :visible.sync="isShow"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <div ref="canvas" style="width: 100%; height: 500px;"></div>
  </el-dialog>
</template>

<script>
import BpmnViewer from "bpmn-js/lib/Viewer";
import { getFlow } from "@/api/workflow/flow";

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
      require: true,
    },
    flowId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getFlow(this.flowId).then((response) => {
        // 得到xml
        const { flowXml } = response.data;
        // 获取到属性ref为“canvas”的dom节点
        const canvas = this.$refs.canvas;
        // 创建bpmn建模器
        this.bpmnModeler = new BpmnViewer({
          container: canvas,
        });

        try {
          const result = this.bpmnModeler.importXML(flowXml);
          const { warnings } = result;
          if (warnings) {
            console.log(warnings);
          } else {
            const canvas = this.bpmnModeler.get("canvas");
            canvas.zoom("fit-viewport");
          }
        } catch (err) {
          this.msgError(err);
        }
      });
    },
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isShow", false); // 直接修改父组件的属性
    },
  },
};
</script>