<template>
  <div ref="content" class="containers">
    <div ref="canvas" class="canvas"></div>
    <PropertiesPanel v-if="bpmnModeler" :modeler="bpmnModeler" :workFlow="workFlow"></PropertiesPanel>
    <el-row :gutter="10" class="buttons">
      <el-col :span="1.5">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" @click="handleXml">查看xml</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" @click="handleClose">关闭</el-button>
      </el-col>
    </el-row>

    <el-dialog title="xml查看" :visible.sync="open" width="50%" :close-on-click-modal="false">
      <div style="height:670px; width:99%; overflow: auto;">
        <pre>{{ xmlStr }}</pre>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//默认的xml
import { xmlStr } from "@/views/components/bpmn/xmlStr";
// 引入相关的依赖
import BpmnModeler from "bpmn-js/lib/Modeler";
import customModule from "@/views/components/bpmn/custom";
// 自定义的 properties-panel内容
import PropertiesPanel from "@/views/components/bpmn/custom-properties-panel/PropertiesPanel";
import activitiModdleDescriptor from "@/views/components/bpmn/custom-properties-panel/activiti.json";
//翻译包
import customTranslate from "@/views/components/bpmn/custom-translate/customTranslate";

import { getFlow, updateFlow } from "@/api/workflow/flow";

export default {
  name: "",
  components: { PropertiesPanel },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      // 默认xml
      defaultXmlStr: xmlStr,
      // 初始化的xml
      initXmlStr: undefined,
      // 当前xml
      xmlStr: undefined,
      // 当前svg
      svgStr: undefined,
      // 流程Id
      workFlowId: undefined,
      // 流程
      workFlow: undefined,
      // xml弹窗
      open: false,
    };
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.workFlowId = this.$route.params.workFlowId;
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content;
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas;
      // 翻译模块
      const customTranslateModule = {
        translate: ["value", customTranslate],
      };
      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        //添加控制板
        propertiesPanel: {
          parent: "#panel",
        },
        additionalModules: [customModule, customTranslateModule],
        moddleExtensions: { activiti: activitiModdleDescriptor },
      });
      this.createNewDiagram();
    },
    createNewDiagram() {
      const loading = this.openLoading("正在加载流程图,请稍后......");
      getFlow(this.workFlowId)
        .then((response) => {
          loading.close();
          this.workFlow = response.data;
          const { flowXml } = response.data;
          this.xmlStr = this.initXmlStr =
            flowXml ||
            this.defaultXmlStr
              .replace(new RegExp("#v1#", "gm"), this.workFlow.flowId)
              .replace(new RegExp("#v2#", "gm"), this.workFlow.flowName);
          try {
            const result = this.bpmnModeler.importXML(this.initXmlStr);
            const { warnings } = result;
            if (warnings) {
              console.log(warnings);
            } else {
              //console.log("初始化成功！");
              this.success();
            }
          } catch (err) {
            this.msgError(err);
          }
          // this.bpmnModeler.importXML(this.initXmlStr, function (err) {
          //   if (err) {
          //     console.error(err);
          //   }
          // });
        })
        .catch(() => {
          loading.close();
        });
    },
    success() {
      //const elementRegistry = this.bpmnModeler.get("elementRegistry");
      //console.log(elementRegistry);
      //const shape = elementRegistry.get(this.workFlow.flowId);
      //console.log(shape);
      this.addBpmnListener();
    },
    addBpmnListener() {
      this.bpmnModeler.on("commandStack.changed", async () => {
        //xml
        try {
          const result = await this.bpmnModeler.saveXML({ format: true });
          let { xml } = result;
          this.xmlStr = xml;
          //console.log(xml);
        } catch (err) {
          console.log(err);
        }
      });
    },
    handleSave() {
      const loading = this.openLoading("正在保存流程图,请稍后......");
      const data = {
        id: this.workFlowId,
        flowXml: this.xmlStr,
      };
      updateFlow(this.workFlowId, data)
        .then((response) => {
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("保存成功!");
          } else {
            this.msgError(response.msg);
          }
        })
        .catch(() => {
          loading.close();
        });
    },
    handleXml() {
      this.open = true;
    },
    cancel() {
      this.open = false;
    },
    handleClose() {
      this.closeTab(this);
    },
  },
};
</script>

<style scoped>
.containers {
  position: absolute;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
</style>