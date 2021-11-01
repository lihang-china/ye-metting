<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="roomName"
            placeholder="请输入库房名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="roomOptions"
            node-key="roomId"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
          <el-form-item label="备品备件名称" prop="spName">
            <el-input v-model="queryParams.spName" placeholder="请输入备品备件名称" clearable />
          </el-form-item>
          <el-form-item label="备品备件编码" prop="spCode">
            <el-input v-model="queryParams.spCode" placeholder="请输入备品备件编码" clearable />
          </el-form-item>
          <el-form-item label="备品备件分类" prop="whclassId">
            <treeselect
              v-model="queryParams.whclassId"
              :options="classOptions"
              placeholder="请选择备品备件分类"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="spList" style="width: 100%">
          <el-table-column label="序号" align="center" type="index" width="60" />
          <el-table-column label="库房" align="center" prop="roomName" width="200" />
          <el-table-column label="备品备件名称" align="center" prop="spName" width="250" />
          <el-table-column label="备品备件编码" align="center" prop="spCode" width="250" />
          <el-table-column label="当前库存" align="center" prop="quantity" width="200" />
          <el-table-column label="备品备件分类" align="center" prop="whclassName" width="250" />
          <el-table-column label="计量单位" align="center" prop="spUnit" width="150" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
              >查看记录</el-button>
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

        <el-dialog :title="title" :visible.sync="open" width="1500px" :close-on-click-modal="false">
          <el-dialog width="75%" title="查看记录" :visible.sync="openOperate" append-to-body>
            <component :is="componentName" :viewData="componentData"></component>
          </el-dialog>
          <el-table v-loading="recordLoading" :data="recordList" height="760px">
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="操作类型" align="center" :formatter="operateFormat" />
            <el-table-column label="操作编码" align="center" prop="operateCode" width="200" />
            <el-table-column label="操作日期" align="center" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.operateDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作数量" align="center" prop="amount" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleRecordView(scope.row)"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSearchListSp, getRecord, getOperate } from "@/api/warehouse/sp";
import { listRoomAll } from "@/api/warehouse/room";
import { treeListClass as listClass } from "@/api/warehouse/class";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "StockSearchBySp",
  components: {
    Treeselect,
    EntryView(resolve) {
      require(["@/views/components/warehouse/EntryView"], resolve);
    },
    ExitView(resolve) {
      require(["@/views/components/warehouse/ExitView"], resolve);
    },
    AllotView(resolve) {
      require(["@/views/components/warehouse/AllotView"], resolve);
    },
    InventoryView(resolve) {
      require(["@/views/components/warehouse/InventoryView"], resolve);
    },
    ScrapView(resolve) {
      require(["@/views/components/warehouse/ScrapView"], resolve);
    },
    ReturnView(resolve) {
      require(["@/views/components/warehouse/ReturnView"], resolve);
    },
  },
  data() {
    return {
      // 仓库名称
      roomName: undefined,
      // 仓库合集
      roomOptions: [],
      // 树型参数
      defaultProps: {
        label: "roomName",
        children: "children",
      },
      // 列表
      spList: [],
      // 总条数
      total: 0,
      // 遮罩层
      loading: true,
      // 分类
      classOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roomId: undefined,
        spCode: undefined,
        spName: undefined,
        whclassId: undefined,
      },
      // 弹窗标题
      title: undefined,
      // 弹窗
      open: false,
      // 库存记录
      recordList: [],
      // 库存记录加载
      recordLoading: false,
      // 操作
      operateOptions: [],
      //
      openOperate: false,
      componentName: undefined,
      componentData: undefined,
    };
  },
  watch: {
    // 根据名称筛选数
    roomName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getRoomList();
    this.getClassList();
    this.getList();
    this.getDicts("stock_operate_type").then((response) => {
      this.operateOptions = response.data;
    });
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.roomName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.roomId = data.roomId;
      this.getList();
    },
    // 获取仓库
    getRoomList() {
      listRoomAll().then((response) => {
        this.roomOptions = [];
        const data = { roomId: undefined, roomName: "库房", children: [] };
        data.children = response.rows;
        this.roomOptions.push(data);
      });
    },
    // 获取分类
    getClassList() {
      listClass().then((response) => {
        this.classOptions = [];
        const data = { id: 0, label: "分类", children: [] };
        data.children = response.data;
        this.classOptions.push(data);
      });
    },
    // 字典翻译
    operateFormat(row, column) {
      return this.selectDictLabel(this.operateOptions, row.operate);
    },
    // 获取table数据
    getList() {
      this.loading = true;
      getSearchListSp(this.queryParams).then((response) => {
        this.spList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 查询
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置
    resetQuery() {
      this.queryParams.roomId = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleView(row) {
      this.recordList = [];
      const params = {
        roomId: row.roomId,
        spId: row.spId,
      };
      this.title =
        row.roomName +
        "-" +
        row.spName +
        "(" +
        row.spCode +
        ")" +
        "库存记录  " +
        "当前库存：" +
        row.quantity;
      this.open = true;
      this.recordLoading = true;
      getRecord(params).then((response) => {
        this.recordList = response.rows;
        this.recordLoading = false;
      });
    },
    handleRecordView(row) {
      let { operate, operateId } = row;
      let componentName;
      let url;
      if (operate.indexOf("Allot") > -1) {
        componentName = "AllotView";
        url = "allot";
      } else {
        componentName = operate + "View";
        url = operate.toLowerCase();
      }
      getOperate(url, operateId).then((response) => {
        this.componentName = componentName;
        this.componentData = response.data;
        this.openOperate = true;
      });
    },
  },
};
</script>