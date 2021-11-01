<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="processDefinitionsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="流程名称" align="center" prop="name" width="250" />
      <el-table-column label="版本号" align="center" prop="version" width="250" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleAssignee(scope.row)"
          >人员分配</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-picture-outline"
            @click="handleFlowView(scope.row)"
          >流程图</el-button>
          <el-button size="mini" type="text" icon="el-icon-tickets">工作记录</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <Assignee
      v-if="isVisiable"
      :isVisiable.sync="isVisiable"
      :processDefinitionId="processDefinitionId"
    />

    <!-- <FlowView v-if="isShow" :isShow.sync="isShow" :flowId="flowId" /> -->
  </div>
</template>

<script>
import {
  listProcessDefinitions,
  delProcessDefinitions,
} from "@/api/workflow/processDefinitions";
import Assignee from "@/views/components/workflow/Assignee";

export default {
  name: "ProcessDefinitions",
  components: { Assignee },
  data() {
    return {
      //
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 流程监听器表格数据
      processDefinitionsList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        processDefinitionKey: undefined,
      },
      //
      isVisiable: false,
      //
      processDefinitionId: undefined,
      //
      isShow: false,
      //
      flowId: undefined,
    };
  },
  created() {
    this.queryParams.processDefinitionKey = this.$route.params.flowId;
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listProcessDefinitions(this.queryParams).then((response) => {
        this.processDefinitionsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deploymentId);
      this.multiple = !selection.length;
    },
    handleAssignee(row) {
      this.isVisiable = true;
      this.processDefinitionId = row.id;
    },
    handleFlowView(row) {
      this.isShow = true;
    },
    handleDelete(row) {
      const deploymentIds = row.deploymentId || this.ids;
      this.$confirm("是否确认删除版本监控?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        delProcessDefinitions(deploymentIds)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
  },
};
</script>