<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="工作名称" prop="flowName">
        <el-input
          v-model="queryParams.flowName"
          placeholder="请输入工作名称"
          clearable
          style="width:270px"
        />
      </el-form-item>
      <el-form-item label="工作分类" prop="flowTypeId">
        <treeselect
          v-model="queryParams.flowTypeId"
          :options="flowTypeOptions"
          placeholder="请选择工作分类"
          clearable
          style="width:270px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="24" v-loading="loading">
      <el-col
        :span="4"
        v-for="(workFlow, index) in workFlowList"
        :key="index"
        style="margin-top:24px"
      >
        <el-card shadow="hover">
          <div style="padding: 14px; ">
            <div class="title">
              <font class="fonttext">工作名称：</font>
              {{workFlow.flowName}}
            </div>
            <div class="subtitle">
              <font class="fonttext">分类：</font>
              {{workFlow.flowTypeName}}
            </div>
            <div class="bottom clearfix">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-picture-outline"
                class="button"
                @click="handleFlowView(workFlow)"
              >流程图</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleAdd(workFlow)"
                class="button"
              >新 建</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工作标题" prop="workTitle">
          <el-input v-model="form.workTitle" placeholder="请输入工作标题" />
        </el-form-item>
        <el-form-item label="工作名称" v-if="workFlow">{{workFlow.flowName}}</el-form-item>
        <el-form-item label="工作分类" v-if="workFlow">{{workFlow.flowTypeName}}</el-form-item>
        <el-form-item label="工作备注" v-if="workFlow">{{workFlow.flowDesc}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <FlowView v-if="isShow" :isShow.sync="isShow" :flowId="flowId" />
  </div>
</template>

<script>
import { addWork } from "@/api/work/work";
import { listFlow, getFlow } from "@/api/workflow/flow";
import { treeListFlowType } from "@/api/workflow/flowType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import FlowView from "@/views/components/workflow/FlowView";

export default {
  name: "AddWork",
  components: { Treeselect, FlowView },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 工作分类数据
      flowTypeOptions: [],
      // 工作列表数据
      workFlowList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        flowName: undefined,
        flowTypeId: undefined,
        isEnable: 1,
      },
      //
      workFlow: undefined,
      //
      title: undefined,
      //
      open: false,
      //
      form: {},
      //
      rules: {
        workTitle: [
          { required: true, message: "请输入工作标题", trigger: "blur" },
        ],
      },
      //
      isShow: false,
      //
      flowId: undefined,
    };
  },
  created() {
    this.getFlowType();
    this.getList();
  },
  methods: {
    getFlowType() {
      treeListFlowType().then((response) => {
        this.flowTypeOptions = response.data;
      });
    },
    getList() {
      this.loading = true;
      listFlow(this.queryParams).then((response) => {
        this.workFlowList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.form = {
        workTitle: undefined,
        workflowId: undefined,
      };
      this.resetForm("form");
    },
    /** 新建工作 */
    handleAdd(workFlow) {
      this.reset();
      this.workFlow = workFlow;
      this.form.workflowId = workFlow.id;
      this.title = "新建工作";
      this.open = true;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const loading = this.openLoading("正在提交,请稍后......");
          addWork(this.getFormArray(this.form))
            .then((response) => {
              loading.close();
              if (response.code === 200) {
                this.msgSuccess("新建成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            })
            .catch(() => {
              loading.close();
            });
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    handleFlowView(workFlow) {
      this.isShow = true;
      this.flowId = workFlow.id;
    },
  },
};
</script>

<style scoped>
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}
.title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 15px;
  height: 36px;
}
.subtitle {
  font-size: 13px;
  color: #909399;
  margin-top: 10px;
}
.fonttext {
  font-weight: bold;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  padding: 0;
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>