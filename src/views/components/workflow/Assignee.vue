<template>
  <el-dialog
    width="80%"
    title="人员分配查看"
    :visible.sync="isVisiable"
    :before-close="modalClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="tranTitle">流程节点</div>
        <el-table v-loading="loading" :data="assigneeList" height="560px" @row-click="handleRow">
          <el-table-column label="序号" type="index" width="55" align="center" />
          <el-table-column label="节点名称" align="left" prop="name" width="250" />
        </el-table>
      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical" class="viewDividerVertical"></el-divider>
      </el-col>
      <el-col :span="6">
        <div class="tranTitle">{{nodeName}}节点属性</div>
        <el-form label-width="90px">
          <el-form-item label="分配模式:" v-show="node.model">{{node.model === 1 ? "待选模式" : "直接指派"}}</el-form-item>
          <el-form-item label="人员:" v-show="node.model === 1">{{node.userNames || "无"}}</el-form-item>
          <el-form-item label="部门:" v-show="node.model === 1">{{node.candidateGroups || "无"}}</el-form-item>
          <el-form-item label="角色:" v-show="node.model === 1">{{node.candidateRoles || "无"}}</el-form-item>
          <el-form-item label="人员:" v-show="node.model === 2">{{node.userName}}</el-form-item>
        </el-form>
      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical" class="viewDividerVertical"></el-divider>
      </el-col>
      <el-col :span="10">
        <div class="tranTitle">{{nodeName}}表单预览</div>
        <div style="width: 99%; height: 560px; overflow: auto;">
          <div style="width: 980px; height:560px;">
            <ViewForm v-if="formId" :formId="formId" :key="formId" />
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { assigneeProcessDefinitions } from "@/api/workflow/processDefinitions";
import ViewForm from "@/views/components/workflow/ViewForm";

export default {
  props: {
    isVisiable: {
      type: Boolean,
      default: false,
      require: true,
    },
    processDefinitionId: {
      type: String,
      require: true,
    },
  },
  components: { ViewForm },
  data() {
    return {
      //
      loading: false,
      //
      assigneeList: [],
      //
      nodeName: undefined,
      //
      node: {
        model: undefined,
        userNames: undefined,
        candidateGroups: undefined,
        candidateRoles: undefined,
        userName: undefined,
      },
      formId: undefined,
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    // 关闭弹出框
    modalClose() {
      this.$emit("update:isVisiable", false); // 直接修改父组件的属性
    },
    getList() {
      this.loading = true;
      assigneeProcessDefinitions(this.processDefinitionId).then((response) => {
        this.assigneeList = response.data;
        this.loading = false;
      });
    },
    handleRow(row, event, column) {
      this.nodeName = '"' + row.name + '" - ';
      this.node = row;
      this.node.model = row.assignee ? 2 : 1;
      this.node.userName = row.assignee ? row.assignee.nickName : undefined;

      this.formId = row.formKey.toString();
    },
  },
};
</script>

<style>
.viewDividerVertical {
  display: inline-block;
  width: 1px;
  height: 600px;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}
.tranTitle {
  margin: 10px;
  color: #303133;
}
</style>