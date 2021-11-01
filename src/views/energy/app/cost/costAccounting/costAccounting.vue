<template>
  <div class="costAccounting-view">
    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>时间</a>
          <el-date-picker
            v-model="value2"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          >
          </el-date-picker>
        </div>
        <div class="item-view">
          <a>部门</a>
          <treeselect
            style="width: 200px"
            v-model="queryParams.deptId"
            :options="data"
            :normalizer="normalizer"
            placeholder="请选择部门"
          />
        </div>
        <div class="item-view">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >查询</el-button
          >
        </div>
      </div>

      <div class="bottom-view">
        <el-table
          ref="multipleTable"
          border
          row-key="deptId"
          :data="tableData"
          tooltip-effect="dark"
          default-expand-all
          style="width: 100%; background: none; color: white"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <!-- <el-table-column type="index" label="序号" align="center" width="120" /> -->
          <el-table-column prop="deptName" label="科室/部门" />
          <el-table-column prop="electric" label="电(kwh)" />
          <el-table-column prop="electricCost" label="电费(元)" />
          <el-table-column prop="water" label="水(t)" />
          <el-table-column prop="waterCost" label="水费(元)" />
          <el-table-column prop="gas" label="蒸汽(t)" />
          <el-table-column prop="gasCost" label="蒸汽费(元)" />
        </el-table>

        <!-- <pagination
          style="background: none"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </div>
    </div>
  </div>
</template>
<script>
import { listDept } from "@/api/energy/basic/dept";
import { costAccountingList } from "@/api/energy/app/cost";
import { handleTree } from "@/utils/ruoyi";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import moment from "moment";

export default {
  name: "EnergyCostAccounting",
  components: { Treeselect },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        start: moment().startOf("month").format("YYYY-MM-DD"),
        end: moment().endOf("month").format("YYYY-MM-DD"),
      },
      total: 0,
      data: [],
      defaultProps: {
        children: "children",
        label: "areaName",
      },
      allData: [],
      tableData: [],
      multipleSelection: [],
      value2: [
        moment().startOf("month").toDate(),
        moment().endOf("month").toDate(),
      ],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    /** 转换系统命名规约数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (this.queryParams.categoryId === data.id) {
        // 若已选择再点击则取消
        this.queryParams.categoryId = "";
        // 取消勾选
        this.$refs.tree.setCurrentKey();
      } else {
        this.queryParams.categoryId = data.id;
      }
      this.getList();
    },
    dateChange(e) {
      console.log(e, this.value2);
      this.queryParams.start = moment(e[0]).format("YYYY_MM_DD");
      this.queryParams.end = moment(e[1]).format("YYYY_MM_DD");
    },
    handleQuery() {
      this.resetList();
    },
    parentName(id) {
      let res = this.allData.find((e) => e.id == id);
      if (res) {
        return res.areaName || "";
      }
      return "";
    },
    show(item) {
      const _this = this.$refs.forma;
      _this.form = item;
      _this.dialog = true;
    },
    initData() {
      listDept().then((res) => {
        //console.log(res.data);
        this.allData = res.data;
        if (this.data.length == 0) {
          this.data = handleTree(res.data, "id", "pid");
        }
        this.getList();
      });
    },
    resetList() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      costAccountingList(this.queryParams).then((res) => {
        this.tableData = this.handleTree(res.data, "deptId", "ppId"); //res.data;
        console.log("costAccountingList", res);
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";
.el-table::before {
  height: 0 !important;
}
.costAccounting-view {
  display: flex;
  height: 100%;
  .menu-view {
    width: rem(74);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: rem(13);
    background: #051413;
    .item-view {
      width: rem(40);
      margin-bottom: rem(12);
      height: rem(120);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: rem(29);
      color: white;
      font-size: bold;
      cursor: pointer;
      border-radius: 2px;
      background: linear-gradient(0deg, #3e77c4, #8eb3e8);
      img {
        width: rem(20);
        height: rem(36);
        margin-bottom: rem(16);
      }
    }
    .active {
      background: linear-gradient(0deg, #0066ff, #00c6ff);
    }
  }
  .left-view {
    width: rem(360);
    height: 100%;
    background: #051413;
    .top-view {
      height: rem(30);
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: rem(51);
      background: #031d4f;
      img {
        width: rem(14);
        height: rem(16);
        margin-right: rem(8);
      }
      a {
        font-size: rem(14);
        font-weight: 400;
        color: #cfdce6;
      }
    }
    .content-view {
      padding-left: rem(41);
      color: white;
      background: none;
      .el-tree-node__content:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: rgba(255, 255, 255, 0.2) !important;
      }
    }
  }
  .right-view {
    display: flex;
    flex-direction: column;
    margin: rem(15) rem(29) rem(0) rem(18);
    width: 100%;
    .top-view {
      width: 100%;
      padding: rem(15) rem(12);
      display: flex;
      align-items: center;
      background: rgba(1, 68, 144, 0.5);
      margin-bottom: rem(11);
      .item-view {
        display: flex;
        align-items: center;
        margin-left: rem(36);
        &:first-child {
          margin-left: 0;
        }
        a {
          font-size: rem(14);
          font-weight: 400;
          color: #cfdce6;
          margin-right: rem(24);
        }
        .input {
          width: rem(300);
        }
      }
    }
    .bottom-view {
      width: 100%;
      height: 100%;
      padding: rem(20) rem(14);
      display: flex;
      flex-direction: column;
      background: rgba(1, 68, 144, 0.5);
      .el-table--border {
        border: none;
        border-top: 1px solid #2a5e96;
        &::after {
          width: 0;
        }
      }
      .el-table {
        margin-top: rem(10);

        tr {
          background: none;
          &:hover td {
            background: rgba(255, 255, 255, 0.3);
          }
          td {
            &:first-child {
              border-left: 1px solid #2a5e96;
            }
          }
        }
        td {
          // border: none;
          border-color: #2a5e96;
        }
        th {
          background: rgba(2, 96, 204, 0.6);
          color: white;
          border-color: #2a5e96;
          &:first-child {
            border-left: 1px solid #2a5e96;
          }
        }
      }
    }
  }
}
</style>
