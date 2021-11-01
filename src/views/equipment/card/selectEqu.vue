<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="130px">
      <el-form-item :label="labelCode">
        <el-input
          v-model="inputCode"
          :disabled="true"
          size="small"
        />
      </el-form-item>
      <el-form-item :label="labelName">
        <el-input
          v-model="inputName"
          :disabled="true"
          size="small"
        />
      </el-form-item>
      <el-form-item label="设备编号" prop="equCode">
        <el-input
          v-model="queryParams.equCode"
          placeholder="请输入设备编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equName">
        <el-input
          v-model="queryParams.equName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>  
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleRemove"
        >批量移除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备编号" align="center" prop="equCode" />
      <el-table-column label="设备名称" align="center" prop="equName" />
      <el-table-column label="设备分类" align="center" prop="className" />
      <el-table-column label="所在区域 " align="center" prop="areaName" />
      <el-table-column label="设备使用状态 " align="center" prop="equStatus" :formatter="equStatusFormat" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRemove(scope.row)"
          >移除</el-button>
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

    <el-dialog :title="title" :visible.sync="open" width="1200px" :close-on-click-modal="false">
      <div class="app-container">
        <el-form :model="nqueryParams" ref="nqueryForm" :inline="true" label-width="68px">
        <el-form-item label="设备编号" prop="nequCode">
          <el-input
            v-model="nqueryParams.equCode"
            placeholder="请输入设备编号"
            clearable
            size="small"
            @keyup.enter.native="nhandleQuery"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="nequName">
          <el-input
            v-model="nqueryParams.equName"
            placeholder="请输入设备名称"
            clearable
            size="small"
            @keyup.enter.native="nhandleQuery"
          />
        </el-form-item>  
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="nhandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="nresetQuery">重置</el-button>
        </el-form-item>
        </el-form>
        
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-check"
              size="mini"
              :disabled="nmultiple"
              @click="handleSubmit"
            >确认</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="nloading" :data="ncardList" @selection-change="nhandleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="设备编号" align="center" prop="equCode" />
          <el-table-column label="设备名称" align="center" prop="equName" />
          <el-table-column label="设备分类" align="center" prop="className" />
          <el-table-column label="所在区域 " align="center" prop="areaName" />
          <el-table-column label="设备使用状态 " align="center" prop="equStatus" :formatter="equStatusFormat" />
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="ntotal>0"
          :total="ntotal"
          :page.sync="nqueryParams.pageNum"
          :limit.sync="nqueryParams.pageSize"
          @pagination="ngetList"
        />

      </div>
    </el-dialog>
  
  </div>
</template>

<script>
import { listCard, listCardNo, removeEqu, addEqu } from "@/api/equipment/card";
import { getContractByGuid } from "@/api/equipment/contract"
import { getSupplierByGuid } from "@/api/equipment/supplier"

export default {
  name: "SelectEqu",
  data() {
    return {
      //
      labelCode: undefined,
      labelName: undefined,
      inputCode: undefined,
      inputName: undefined,
      id: undefined,
      type: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设备使用状态 字典
      equStatusOptions: [],
      // 遮罩层
      loading: true,
      // 弹出层 遮罩层
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 设备档案表格数据
      cardList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: undefined,
        supplierId: undefined,
        equCode: undefined,
        equName: undefined,
      },
      // 弹出层 遮罩层
      nloading: true,
      // 弹出层 遮罩层
      nids: [],
      // 弹出层 非多个禁用
      nmultiple: true,
      // 弹出层 总条数
      ntotal: 0,
      // 弹出层 设备档案表格数据
      ncardList: [],
      // 弹出层 查询参数
      nqueryParams: {
        pageNum: 1,
        pageSize: 10,
        equCode: undefined,
        equName: undefined,
      },
    };   
  },
  created() {
    this.getDicts("equ_status_type").then(response => {
      this.equStatusOptions = response.data;
    });
    const { guid, type } = this.$route.params;
    this.type = type;
    this.getInitList(guid, type);    
  },
  methods: {
    //初始化设备列表
    getInitList(guid, type) {
      if(type == "contract") {
          this.labelCode = "合同编号";
          this.labelName = "合同名称";
          getContractByGuid(guid).then(response => {
            this.inputCode = response.data.conCode;
            this.inputName = response.data.conName;
             this.id = this.queryParams.contractId = this.nqueryParams.contractId = response.data.conId;
            this.getList();
          });
      } else if (type == "supplier") {
          this.labelCode = "统一社会信用代码";
          this.labelName = "供应商名称";
          getSupplierByGuid(guid).then(response => {
            this.inputCode = response.data.supCode;
            this.inputName = response.data.supName;
            this.id = this.queryParams.supplierId = this.nqueryParams.supplierId = response.data.supId;
            this.getList();
          });  
      }
    },
    //查询设备列表
    getList() {
      this.loading = true;
      listCard(this.queryParams).then(response => {
        this.cardList = response.rows;
        this.total = response.total;
        this.loading = false;
      })   
    },
    // 设备使用状态 字典翻译
    equStatusFormat(row, column) {
      return this.selectDictLabel(this.equStatusOptions, row.equStatus);
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.equId)
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "选择设备";
      this.ngetList();
    },
    /** 删除按钮操作 */
    handleRemove(row) {
      const equIds = row.equId || this.ids;
      const type = this.type;
      this.$confirm('是否确定移除所选择的设备?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return removeEqu(equIds, type);
      }).then(() => {
        this.msgSuccess("移除成功");
        this.getList();
      }).catch(function(){});
    },
    //查询设备列表
    ngetList() {
      this.nloading = true;
      listCardNo(this.nqueryParams).then(response => {
        this.ncardList = response.rows;
        this.ntotal = response.total;
        this.nloading = false;
      })   
    },
    /** 搜索按钮操作 */
    nhandleQuery() {
      this.nqueryParams.pageNum = 1;
    },
    /** 重置按钮操作 */
    nresetQuery() {
      this.resetForm("nqueryForm");
      this.nhandleQuery();
    },
    // 多选框选中数据
    nhandleSelectionChange(selection) {
      this.nids = selection.map(item => item.equId)
      this.nmultiple = !selection.length
    },
    handleSubmit() {
      addEqu(this.nids, this.id, this.type).then(response => {
        if (response.code === 200) {
          this.msgSuccess("添加成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      })
    }
  }
};
</script>